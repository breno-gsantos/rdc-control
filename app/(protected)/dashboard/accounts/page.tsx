import { AccountActions } from "@/components/dashboard/accounts/account-actions";
import { AccountCard } from "@/components/dashboard/accounts/account-card";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { db } from "@/db";
import { accountCredentials, accounts, banks, categories, systems } from "@/db/schema";
import { asc, count, eq, sql } from "drizzle-orm";

export default async function AccountsPage() {
    const credentialsCountQuery = db
        .select({
            accountId: accountCredentials.accountId,
            total: count().as("total")
        })
        .from(accountCredentials)
        .groupBy(accountCredentials.accountId)
        .as("credentials_count");

    const accountsData = await db
        .select({
            account: accounts,
            bank: banks.name,
            system: systems.name,
            category: categories.name,
            credentialsCount: sql<number>`coalesce(${credentialsCountQuery.total}, 0)::int`
        })
        .from(accounts)
        .leftJoin(banks, eq(accounts.bankId, banks.id))
        .leftJoin(systems, eq(accounts.systemId, systems.id))
        .leftJoin(categories, eq(accounts.categoryId, categories.id))
        .leftJoin(
            credentialsCountQuery,
            eq(accounts.id, credentialsCountQuery.accountId)
        )
        .orderBy(asc(accounts.name));

    return (
        <DashboardHeader
            title="Contas de Convênios"
            description="Consulte e organize as contas cadastradas."
            button={{ href: '/dashboard/accounts/new', label: 'Nova Conta', icon: 'Plus' }}
            actions={<AccountActions />}
        >
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-3">
                {accountsData.map((account) => (
                    <AccountCard
                        key={account.account.id}
                        account={account}
                    />
                ))}
            </div>

            {accountsData.length === 0 && (
                <div>
                    Nenhuma conta encontrada
                </div>
            )}
        </DashboardHeader>
    )
}