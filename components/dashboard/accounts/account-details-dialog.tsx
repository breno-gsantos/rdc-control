'use client'

import { getAccountPassword } from "@/actions/accounts/get-account-password";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";
import { ArrowUpRight, Building2, Check, Copy, Eye, EyeOff } from "lucide-react";
import { useState } from "react"
import { toast } from "sonner";

interface AccountDetailsDialogProps {
    accountId: string;
    bank: string | null;
    username: string;
    name: string;
    system: string | null;
    category: string | null;
    city: string;
    state: string;
}

export function AccountDetailsDialog({ accountId, bank, username, name, system, category, city, state }: AccountDetailsDialogProps) {
    const [open, setOpen] = useState<boolean>(false);
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [password, setPassword] = useState<string | null>(null);
    const [loadingPassword, setLoadingPassword] = useState<boolean>(false);
    const [copiedUsername, setCopiedUsername] = useState<boolean>(false);
    const [copiedPassword, setCopiedPassword] = useState<boolean>(false);

    async function copy(value: string, type: 'username' | 'password') {
        try {
            await navigator.clipboard.writeText(value);

            if (type === 'username') {
                setCopiedUsername(true);
                setTimeout(() => setCopiedUsername(false), 2000);
            } else {
                setCopiedPassword(true);
                setTimeout(() => setCopiedPassword(false), 2000);
            }

            toast.success('Copiado para a área de transferência!');
        } catch (error) {
            toast.error('Erro ao copiar para a área de transferência');
        }
    }

    async function handleTogglePassword() {
        if (loadingPassword) return;

        if (showPassword) {
            setShowPassword(false);
            setPassword(null);
            return;
        }

        setLoadingPassword(true);

        try {
            const response = await getAccountPassword(accountId);

            if (!response.success) {
                toast.error(response.error ?? 'Erro ao buscar a senha');
                setLoadingPassword(false);
                return;
            }

            setShowPassword(true);
            setPassword(response.decryptedPassword ?? null);
        } catch (error) {
            toast.error('Erro ao buscar a senha');
        } finally {
            setLoadingPassword(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={(value) => { setOpen(value); if (!value) setShowPassword(false); setPassword(null); }}>
            <DialogTrigger asChild>
                <Button className="mt-5 w-full gap-2 text-primary hover:bg-primary/5" variant="outline">
                    Ver Detalhes
                    <ArrowUpRight className="size-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-semibold flex items-center gap-2">
                        <Building2 />
                        {name}
                    </DialogTitle>
                    <DialogDescription>Informações e credenciais da conta.</DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-4  py-3 text-sm">
                    <div>
                        <p className="text-muted-foreground">Banco</p>
                        <p className="font-medium">{bank ?? 'Não informado'}</p>
                    </div>
                    <div>
                        <p className="text-muted-foreground">Sistema</p>
                        <p className="font-medium">{system ?? 'Não informado'}</p>
                    </div>
                    <div>
                        <p className="text-muted-foreground">Categoria</p>
                        <p className="font-medium">{category ?? 'Não informado'}</p>
                    </div>
                    <div>
                        <p className="text-muted-foreground">Localização</p>
                        <p className="font-medium">{city} - {state}</p>
                    </div>
                </div>
                <div className="space-y-4 pt-4 border-t">
                    <h4 className="font-semibold">Credenciais de acesso</h4>
                    <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">Usuário</p>
                        <div className="flex items-center justify-between rounded-md border py-1 px-3">
                            <span className="text-sm">{username}</span>
                            <Button type="button" size='icon' variant='ghost' onClick={() => copy(username, 'username')}>
                                {copiedUsername ? (
                                    <Check className="size-4 text-green-600" />
                                ) : (
                                    <Copy className="size-4" />
                                )}
                            </Button>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <p className="text-muted-foreground text-sm">Senha</p>
                        <div className="flex items-center justify-between rounded-md border py-1 px-3">
                            <span className="text-sm break-all">
                                {loadingPassword ? <Spinner /> : showPassword ? password : '********'}
                            </span>
                            <div>
                                <Button type="button" size='icon' variant='ghost' onClick={handleTogglePassword} disabled={loadingPassword}>
                                    {showPassword ? (
                                        <EyeOff className="size-4" />
                                    ) : (
                                        <Eye className="size-4" />
                                    )}
                                </Button>
                                <Button type="button" size='icon' variant='ghost' onClick={() => copy(password ?? '', 'password')} disabled={!showPassword || loadingPassword}>
                                    {copiedPassword ? (
                                        <Check className="size-4 text-green-600" />
                                    ) : (
                                        <Copy className="size-4" />
                                    )}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}