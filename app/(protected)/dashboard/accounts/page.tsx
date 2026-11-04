import { AccountActions } from "@/components/dashboard/accounts/account-actions";
import { AccountCard } from "@/components/dashboard/accounts/account-card";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { db } from "@/db";
import { accounts } from "@/db/schema";

export default async function AccountsPage() {
    const account = await db.select().from(accounts).limit(10).execute();

    return (
        <DashboardHeader
            title="Contas de Convênios"
            description="Consulte e organize as contas cadastradas."
            button={{ href: '/dashboard/accounts/new', label: 'Nova Conta', icon: 'Plus' }}
            actions={<AccountActions />}
        >
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-3">
                {account.map((account) => (
                    <AccountCard key={account.id} account={account} />
                ))}
            </div>

            {account.length === 0 && (
                <div>
                    Nenhuma conta encontrada
                </div>
            )}
        </DashboardHeader>
    )
}