import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { accounts } from "@/db/schema"
import { ArrowUpRight, Building2 } from "lucide-react";
import Link from "next/link";
import { AccountDetailsDialog } from "./account-details-dialog";

type Account = {
    account: typeof accounts.$inferSelect;
    bank: string | null;
    system: string | null;
    category: string | null;
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

export function AccountCard({ account: { account, bank, category, system } }: AccountCardProps) {
    const status = statusConfig[account.status];

    return (
        <article className="relative isolate z-10 overflow-hidden group rounded-2xl shadow-md border border-border bg-card p-5 transition-all ease-out duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/20">
            <div className="pointer-events-none absolute -left-12 -top-16 size-40 rounded-full bg-primary/1 blur-3xl" />
            <div className="pointer-events-none absolute inset-0 bg-linear-to-br from bg-primary/2 via-transparent to-transparent" />
            <div className="flex items-start justify-between gap-3">
                <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Building2 className="size-5" />
                </div>

                <Badge variant="outline" className={status.className}>
                    {status.label}
                </Badge>
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
            </div>

            <AccountDetailsDialog
                accountId={account.id}
                bank={bank}
                username={account.username}
                name={account.name}
                system={system}
                category={category}
                city={account.city}
                state={account.state}
            />
        </article>
    )
}