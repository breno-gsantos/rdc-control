
'use client'

import { useEffect, useState } from "react";

import { getAccountCredentials } from "@/actions/accounts/get-account-credentials";
import { getAccountPassword } from "@/actions/accounts/get-account-password";

import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious
} from "@/components/ui/carousel";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";

import { Spinner } from "@/components/ui/spinner";

import {
    ArrowUpRight,
    Building2,
    Check,
    Copy,
    ExternalLink,
    Eye,
    EyeOff,
    KeyRound
} from "lucide-react";

import Link from "next/link";
import { toast } from "sonner";

interface AccountDetailsDialogProps {
    accountId: string;
    bank: string | null;
    name: string;
    system: string | null;
    category: string | null;
    city: string;
    state: string;
    websiteUrl: string;
    credentialsCount: number;
}

interface Credential {
    id: string;
    username: string;
}

export function AccountDetailsDialog({
    accountId,
    bank,
    name,
    system,
    category,
    city,
    state,
    websiteUrl,
    credentialsCount
}: AccountDetailsDialogProps) {
    const [open, setOpen] = useState(false);

    const [credentials, setCredentials] = useState<Credential[]>([]);
    const [loadingCredentials, setLoadingCredentials] = useState(false);

    const [currentCredential, setCurrentCredential] = useState(0);

    const [showPassword, setShowPassword] = useState(false);
    const [password, setPassword] = useState<string | null>(null);
    const [loadingPassword, setLoadingPassword] = useState(false);

    const [copiedUsername, setCopiedUsername] = useState(false);
    const [copiedPassword, setCopiedPassword] = useState(false);

    useEffect(() => {
        if (!open) return;

        async function loadCredentials() {
            setLoadingCredentials(true);

            try {
                const response = await getAccountCredentials(accountId);

                if (!response.success) {
                    toast.error(response.error);
                    return;
                }

                setCredentials(response.credentials);
                setCurrentCredential(0);
            } catch {
                toast.error('Erro ao buscar as credenciais');
            } finally {
                setLoadingCredentials(false);
            }
        }

        loadCredentials();
    }, [open, accountId]);

    function resetPassword() {
        setShowPassword(false);
        setPassword(null);
        setCopiedPassword(false);
    }

    function handleCredentialChange(index: number) {
        setCurrentCredential(index);
        resetPassword();
        setCopiedUsername(false);
    }

    async function copy(value: string, type: 'username' | 'password') {
        try {
            await navigator.clipboard.writeText(value);

            if (type === 'username') {
                setCopiedUsername(true);
            } else {
                setCopiedPassword(true);
            }

            toast.success('Copiado para a área de transferência!');

            setTimeout(() => {
                if (type === 'username') {
                    setCopiedUsername(false);
                } else {
                    setCopiedPassword(false);
                }
            }, 2000);
        } catch {
            toast.error('Erro ao copiar para a área de transferência');
        }
    }

    async function handleTogglePassword() {
        const credential = credentials[currentCredential];

        if (!credential || loadingPassword) return;

        if (showPassword) {
            resetPassword();
            return;
        }

        setLoadingPassword(true);

        try {
            const response = await getAccountPassword(credential.id);

            if (!response.success) {
                toast.error(response.error);
                return;
            }

            setPassword(response.decryptedPassword ?? null);
            setShowPassword(true);
        } catch {
            toast.error('Erro ao buscar a senha');
        } finally {
            setLoadingPassword(false);
        }
    }

    const credential = credentials[currentCredential];

    return (
        <Dialog
            open={open}
            onOpenChange={(value) => {
                setOpen(value);

                if (!value) {
                    resetPassword();
                    setCredentials([]);
                    setCurrentCredential(0);
                }
            }}
        >
            <DialogTrigger asChild>
                <Button
                    className="mt-5 w-full gap-2 text-primary hover:bg-primary/5"
                    variant="outline"
                >
                    Ver Detalhes
                    <ArrowUpRight className="size-4" />
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-2xl font-semibold">
                        <Building2 />
                        {name}
                    </DialogTitle>

                    <DialogDescription>
                        Informações e credenciais da conta.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid grid-cols-2 gap-4 py-3 text-sm">
                    <div>
                        <p className="text-muted-foreground">Banco</p>
                        <p className="font-medium">
                            {bank ?? 'Não informado'}
                        </p>
                    </div>

                    <div>
                        <p className="text-muted-foreground">Sistema</p>
                        <p className="font-medium">
                            {system ?? 'Não informado'}
                        </p>
                    </div>

                    <div>
                        <p className="text-muted-foreground">Categoria</p>
                        <p className="font-medium">
                            {category ?? 'Não informado'}
                        </p>
                    </div>

                    <div>
                        <p className="text-muted-foreground">Localização</p>
                        <p className="font-medium">
                            {city} - {state}
                        </p>
                    </div>

                    <div className="col-span-2">
                        <p className="text-muted-foreground">
                            Site do averbador
                        </p>

                        {websiteUrl ? (
                            <Link
                                href={websiteUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 transition-all duration-200 ease-out hover:underline"
                            >
                                <span className="font-medium">
                                    {websiteUrl}
                                </span>

                                <ExternalLink className="size-3.5 shrink-0" />
                            </Link>
                        ) : (
                            <p className="font-medium">Não informado</p>
                        )}
                    </div>
                </div>

                <div className="space-y-4 border-t pt-4">
                    <div className="flex items-center justify-between gap-3">
                        <h4 className="font-semibold">
                            Credenciais de acesso
                        </h4>

                        <span className="text-xs text-muted-foreground">
                            {credentialsCount}{" "}
                            {credentialsCount === 1 ? 'credencial' : 'credenciais'}
                        </span>
                    </div>

                    {loadingCredentials ? (
                        <div className="flex justify-center py-8">
                            <Spinner />
                        </div>
                    ) : credentials.length === 0 ? (
                        <p className="py-6 text-center text-sm text-muted-foreground">
                            Nenhuma credencial encontrada.
                        </p>
                    ) : (
                        <Carousel
                            opts={{
                                align: "start",
                                loop: false
                            }}
                            setApi={(api) => {
                                if (!api) return;

                                api.on("select", () => {
                                    handleCredentialChange(api.selectedScrollSnap());
                                });
                            }}
                            className="w-full"
                        >
                            <CarouselContent>
                                {credentials.map((item, index) => (
                                    <CarouselItem key={item.id}>
                                        <div className="space-y-4 rounded-xl border p-4">
                                            <div className="flex items-center justify-between">
                                                <h5 className="font-semibold">
                                                    Credencial {index + 1}
                                                </h5>

                                                <span className="text-xs text-muted-foreground">
                                                    {index + 1} / {credentials.length}
                                                </span>
                                            </div>

                                            <div className="space-y-2">
                                                <p className="text-sm text-muted-foreground">
                                                    Usuário
                                                </p>

                                                <div className="flex items-center justify-between gap-2 rounded-md border px-3 py-1">
                                                    <span className="break-all text-sm">
                                                        {item.username}
                                                    </span>

                                                    <Button
                                                        type="button"
                                                        size="icon"
                                                        variant="ghost"
                                                        onClick={() => copy(item.username, 'username')}
                                                    >
                                                        {currentCredential === index && copiedUsername ? (
                                                            <Check className="size-4 text-green-600" />
                                                        ) : (
                                                            <Copy className="size-4" />
                                                        )}
                                                    </Button>
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <p className="text-sm text-muted-foreground">
                                                    Senha
                                                </p>

                                                <div className="flex items-center justify-between gap-2 rounded-md border px-3 py-1">
                                                    <span className="break-all text-sm">
                                                        {currentCredential === index && loadingPassword ? (
                                                            <Spinner />
                                                        ) : currentCredential === index && showPassword ? (
                                                            password
                                                        ) : (
                                                            '********'
                                                        )}
                                                    </span>

                                                    <div className="flex shrink-0 items-center">
                                                        <Button
                                                            type="button"
                                                            size="icon"
                                                            variant="ghost"
                                                            onClick={handleTogglePassword}
                                                            disabled={currentCredential !== index || loadingPassword}
                                                        >
                                                            {showPassword && currentCredential === index ? (
                                                                <EyeOff className="size-4" />
                                                            ) : (
                                                                <Eye className="size-4" />
                                                            )}
                                                        </Button>

                                                        <Button
                                                            type="button"
                                                            size="icon"
                                                            variant="ghost"
                                                            onClick={() => copy(password ?? '', 'password')}
                                                            disabled={
                                                                !showPassword ||
                                                                currentCredential !== index ||
                                                                loadingPassword
                                                            }
                                                        >
                                                            {currentCredential === index && copiedPassword ? (
                                                                <Check className="size-4 text-green-600" />
                                                            ) : (
                                                                <Copy className="size-4" />
                                                            )}
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </CarouselItem>
                                ))}
                            </CarouselContent>

                            {credentials.length > 1 && (
                                <>
                                    <CarouselPrevious className="-left-3" />
                                    <CarouselNext className="-right-3" />
                                </>
                            )}
                        </Carousel>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
