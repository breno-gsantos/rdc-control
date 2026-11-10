'use client'

import { getAccountCredentialPermission } from "@/actions/account-credentials/get-account-credential-permission";
import { revokeAccountCredentialPermission } from "@/actions/account-credentials/revoke-permission";
import { updatePermission } from "@/actions/account-credentials/update-permission";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import { Switch } from "@/components/ui/switch";
import { Eye, EyeOff, KeyRound, RefreshCw, Save, Search, ShieldCheck, Users } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

interface ManageAccountCredentialPermissionsDialogProps {
    accountId: string;
    accountName: string;
    bank?: string | null;
    children: React.ReactNode
}

interface UserPermission {
    userId: string;
    name: string;
    email: string;
    role: string;
    isActive: boolean;
    canViewCredentials: boolean;
    canRevealPassword: boolean;
}

const roleLabels: Record<string, string> = {
    director: 'Diretor',
    manager: 'Gerente',
    supervisor: 'Supervisor',
    promotor: 'Promotor'
};

export function ManageAccountCredentialPermissionsDialog({ accountId, accountName, children, bank }: ManageAccountCredentialPermissionsDialogProps) {
    const [open, setOpen] = useState<boolean>(false);

    const [permissions, setPermissions] = useState<UserPermission[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [saving, setSaving] = useState<boolean>(false);

    const [search, setSearch] = useState<string>('');

    async function loadPermissions() {
        setLoading(true);

        try {
            const response = await getAccountCredentialPermission(accountId);

            if (!response.success) {
                toast.error(response.error)
                return;
            }

            setPermissions(response.permissions);
        } catch (error) {
            toast.error('Erro ao carregar permissões')
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (!open) return;

        loadPermissions()
    }, [open, accountId])

    const filteredPermissions = useMemo(() => {
        const normalizedSearch = search.toLowerCase().trim();

        if (!normalizedSearch) return permissions;

        return permissions.filter((user) =>
            user.name.toLowerCase().includes(normalizedSearch) || user.email.toLowerCase().includes(normalizedSearch)
        );
    }, [permissions, search]);

    const authorizedCount = permissions.filter((user) => user.canViewCredentials).length;

    function handlePermissionChange(userId: string, permission: 'canViewCredentials' | 'canRevealPassword', value: boolean) {
        setPermissions((current) => current.map((user) => {
            if (user.userId !== userId) return user;

            if (permission === 'canViewCredentials') {
                return {
                    ...user,
                    canViewCredentials: value,
                    canRevealPassword: value ? user.canRevealPassword : false
                };
            }

            return {
                ...user,
                canRevealPassword: value
            }
        }))
    };

    async function handleSave() {
        setSaving(true);

        try {
            for (const user of permissions) {
                let response;

                if (!user.canViewCredentials && !user.canRevealPassword) {
                    response = await revokeAccountCredentialPermission(accountId, user.userId)
                } else {
                    response = await updatePermission({
                        accountId,
                        userId: user.userId,
                        canViewCredentials: user.canViewCredentials,
                        canRevealPassword: user.canRevealPassword
                    });
                }

                if (!response.success) {
                    throw new Error(response.error)
                }
            }

            toast.success('Permissões atualizadas com sucesso!');
            setOpen(false);
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Erro ao atualizar permissões');
        } finally {
            setSaving(false);
        }
    }

    function handleOpenChange(value: boolean) {
        if (saving) return;

        setOpen(value);

        if (!value) {
            setSearch('')
        }
    }

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="flex h-[85vh] w-full flex-col gap-0 overflow-hidden p-0 sm:max-w-xl">
                <DialogHeader className="shrink-0 p-6 pb-4">
                    <div className="mb-2 flex size-10 items-center justify-center rounded-lg bg-primary/10">
                        <ShieldCheck className="size-5 text-primary" />
                    </div>

                    <DialogTitle className="text-xl">Gerenciar acessos</DialogTitle>
                    <DialogDescription>
                        Controle quem pode visualizar as credenciais desta conta e revelar suas senhas
                    </DialogDescription>

                    <div className="flex items-center gap-2 pt-2 text-sm">
                        <KeyRound className="size-4 text-muted-foreground" />

                        <span className="font-medium">{accountName}</span>

                        {bank && (
                            <>
                                <span className="text-muted-foreground">·</span>
                                <span className="text-muted-foreground">{bank}</span>
                            </>
                        )}
                    </div>
                </DialogHeader>

                <Separator />

                <div className="space-y-3 px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm font-medium">
                            <Users className="size-4 text-muted-foreground" />
                            Usuários
                        </div>

                        {!loading && (
                            <Badge variant='secondary'>
                                {authorizedCount} com acesso
                            </Badge>
                        )}
                    </div>

                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                        <Input placeholder="Buscar por nome ou email..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" disabled={loading} />
                    </div>
                </div>

                <ScrollArea className="min-h-0 flex-1 px-6">
                    {loading ? (
                        <div className="flex min-h-48 items-center justify-center">
                            <Spinner />
                        </div>
                    ) : filteredPermissions.length === 0 ? (
                        <div className="flex min-h-48 flex-col items-center justify-center gap-2 text-center">
                            <Users className="size-8 text-muted-foreground/50" />

                            <p className="font-medium">
                                {search ? 'Nenhum usuário encontrado' : 'Nenhum usuário disponível'}
                            </p>

                            <p className="text-sm text-muted-foreground">
                                {search ? 'Tente pesquisar por outro nome ou email' : 'Não existem usuários para gerenciar.'}
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-3 pb-4">
                            {filteredPermissions.map((user) => (
                                <div key={user.userId} className="space-y-4 rounded-xl border p-4">
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="min-w-0 space-y-1">
                                            <p className="truncate text-sm font-semibold">
                                                {user.name}
                                            </p>

                                            <p className="truncate text-xs text-muted-foreground">
                                                {user.email}
                                            </p>

                                            <div className="flex flex-wrap items-center gap-2 pt-1">
                                                <Badge variant='outline'>
                                                    {roleLabels[user.role] ?? user.role}
                                                </Badge>

                                                {!user.isActive && (
                                                    <Badge variant='secondary'>
                                                        Inativo
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>

                                        {user.canViewCredentials && (
                                            <Badge>
                                                <ShieldCheck className="mr-1 size-3" />
                                                Acesso liberado
                                            </Badge>
                                        )}
                                    </div>

                                    <Separator />

                                    <div className="flex items-center justify-between gap-4">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2 text-sm font-medium">
                                                <Eye className="size-4 text-muted-foreground" />
                                                Visualizar credenciais
                                            </div>

                                            <p className="text-xs text-muted-foreground">
                                                Permite visualizar os nomes do usuário.
                                            </p>
                                        </div>

                                        <Switch checked={user.canViewCredentials} onCheckedChange={(checked) => handlePermissionChange(user.userId, 'canViewCredentials', checked)} disabled={saving || (!user.isActive && !user.canViewCredentials)} />
                                    </div>

                                    <div className="flex items-center justify-between gap-4">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2 text-sm font-medium">
                                                {user.canRevealPassword ? (
                                                    <Eye className="size-4 text-muted-foreground" />
                                                ) : (
                                                    <EyeOff className="size-4 text-muted-foreground" />
                                                )}

                                                Revelar Senhas
                                            </div>

                                            <p className="text-xs text-muted-foreground">
                                                Permite visualizar as senhas descriptografadas.
                                            </p>
                                        </div>

                                        <Switch checked={user.canRevealPassword} onCheckedChange={(checked) => handlePermissionChange(user.userId, 'canRevealPassword', checked)} disabled={saving || !user.canViewCredentials || (!user.isActive && !user.canRevealPassword)} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </ScrollArea>

                <Separator />

                <div className="flex items-center justify-between gap-3 p-6">
                    <Button type="button" variant='outline' onClick={loadPermissions} disabled={loading || saving}>
                        <RefreshCw className="mr-2 size-4" />
                        Atualizar
                    </Button>
                    <div className="flex items-center gap-2">
                        <Button type="button" variant='ghost' onClick={() => setOpen(false)} disabled={saving}>
                            Cancelar
                        </Button>
                        <Button type="button" onClick={handleSave} disabled={loading || saving}>
                            {saving ? (
                                <Spinner />
                            ) : (
                                <Save className='mr-2 size-4' />
                            )}

                            Salvar alterações
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}