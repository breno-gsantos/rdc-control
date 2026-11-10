import { Badge } from "@/components/ui/badge";
import { accounts } from "@/db/schema"
import { Building2, KeyRound, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { AccountDetailsDialog } from "./account-details-dialog";
import { auth } from "@/auth";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { DeleteAccountDialog } from "./delete-account-dialog";
import { AccountManagementMenu } from "./account-management-menu";

type Account = {
    account: typeof accounts.$inferSelect;
    bank: string | null;
    system: string | null;
    category: string | null;
    credentialsCount: number;
};

interface AccountCardProps {
    account: Account
}

const statusConfig = {
    active: {
        label: "Ativa",
        className: "bg-green-50 text-green-700 border-green-200",
    },
    inactive: {
        label: "Inativa",
        className: "bg-yellow-50 text-yellow-700 border-yellow-200",
    },
    archived: {
        label: "Arquivada",
        className: "bg-slate-100 text-slate-600 border-slate-200",
    },
};

export async function AccountCard({ account: { account, bank, category, system, credentialsCount } }: AccountCardProps) {
    const status = statusConfig[account.status];

    const session = await auth();

    const canManageAccount = session?.user.role === 'admin' || session?.user.role === 'director'

    return (
        <article className="relative isolate z-10 overflow-hidden group rounded-2xl shadow-md border border-border bg-card p-5 transition-all ease-out duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/20">
            <div className="pointer-events-none absolute -left-12 -top-16 size-40 rounded-full bg-primary/1 blur-3xl" />
            <div className="pointer-events-none absolute inset-0 bg-linear-to-br from bg-primary/2 via-transparent to-transparent" />
            <div className="flex items-start justify-between gap-3">
                <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Building2 className="size-5" />
                </div>

                <div className="flex flex-wrap items-center justify-end gap-2">
                    {canManageAccount && (
                        <Badge variant='outline' className="gap-1.5 border-primary/20 bg-primary/5 text-primary">
                            <KeyRound className="size-3" />
                            {credentialsCount} {credentialsCount === 1 ? 'credencial' : 'credenciais'}
                        </Badge>
                    )}

                    <Badge variant='outline' className={status.className}>
                        {status.label}
                    </Badge>

                    {canManageAccount && (
                        <AccountManagementMenu accountId={account.id} accountName={account.name} bank={account.bankId} />
                    )}
                </div>
            </div>

            <h3 className="mt-4 line-clamp-2 min-h-10 font-bold text-foreground">
                {account.name}
            </h3>

            <div className="mt-4 flex flex-col gap-2 border-t border-border pt-4 text-xs text-muted-foreground">
                <div className="flex justify-between gap-3">
                    <span>Banco</span>
                    <span className="font-medium text-foreground">
                        {bank}
                    </span>
                </div>

                <div className="flex justify-between gap-3">
                    <span>Categoria</span>
                    <span className="font-medium text-foreground">
                        {category}
                    </span>
                </div>

                <div className="flex justify-between gap-3">
                    <span>Localização</span>
                    <span className="font-medium text-foreground">
                        {account.city} - {account.state}
                    </span>
                </div>

                <div className="flex justify-between gap-3">
                    <span>Sistema</span>
                    <span className="font-medium text-foreground">
                        {system}
                    </span>
                </div>

                {canManageAccount && (
                    <div className="flex items-center justify-between gap-3">
                        <span>Credenciais</span>
                        <span className="font-medium text-foreground">
                            {credentialsCount} {credentialsCount === 1 ? 'credencial' : 'credenciais'}
                        </span>
                    </div>
                )}
            </div>

            <AccountDetailsDialog
                accountId={account.id}
                bank={bank}
                name={account.name}
                system={system}
                category={category}
                city={account.city}
                state={account.state}
                websiteUrl={account.websiteUrl}
                credentialsCount={credentialsCount}
            />
        </article>
    )
}