import { AccountActions } from "@/components/dashboard/accounts/account-actions";
import { AccountCard } from "@/components/dashboard/accounts/account-card";
import { AccountFilters } from "@/components/dashboard/accounts/account-filters";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { db } from "@/db";
import { accountCredentials, accounts, banks, categories, systems } from "@/db/schema";
import { and, asc, count, desc, eq, ilike, or, sql } from "drizzle-orm";

interface AccountsPageProps {
    searchParams: Promise<{
        search?: string;
        bank?: string;
        state?: string;
        order?: string;
    }>
}

export default async function AccountsPage({ searchParams }: AccountsPageProps) {
    const params = await searchParams;

    const search = params.search?.trim() ?? "";
    const bank = params.bank ?? 'all';
    const state = params.state ?? 'all';
    const order = params.order ?? 'name';



    const credentialsCountQuery = db
        .select({
            accountId: accountCredentials.accountId,
            total: count().as("total")
        })
        .from(accountCredentials)
        .groupBy(accountCredentials.accountId)
        .as("credentials_count");

    const conditions = [];

    if (search) {
        conditions.push(
            or(
                ilike(accounts.name, `%${search}%`),
                ilike(accounts.city, `%${search}%`)
            )
        )
    }

    if (bank !== 'all') {
        conditions.push(eq(accounts.bankId, bank))
    }

    if (state !== 'all') {
        conditions.push(eq(accounts.state, state))
    }

    const orderBy = (() => {
        switch (order) {
            case "name_desc":
                return desc(accounts.name);

            case "recent":
                return desc(accounts.createdAt);
            case "oldest":
                return asc(accounts.createdAt);
            default:
                return asc(accounts.name);
        }
    })

    const where = and(
        search ? or(
            ilike(accounts.name, `%${search}%`),
            ilike(accounts.city, `%${search}%`)
        )
            : undefined,
        bank !== 'all' ? eq(accounts.bankId, bank) : undefined,
        state !== 'all' ? eq(accounts.state, state) : undefined
    )

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
        ).where(where)
        .orderBy(asc(accounts.name));

    const [banksData, statesData] = await Promise.all([
        db.select({
            id: banks.id,
            name: banks.name
        }).from(banks).orderBy(asc(banks.name)),

        db.selectDistinct({
            state: accounts.state
        }).from(accounts).orderBy(asc(accounts.state))
    ])

    const availableStates = statesData.map((item) => item.state).filter((state): state is string => Boolean(state))

    return (
        <DashboardHeader
            title="Contas de Convênios"
            description="Consulte e organize as contas cadastradas."
            button={{ href: '/dashboard/accounts/new', label: 'Nova Conta', icon: 'Plus' }}
            actions={<AccountActions />}
        >
            <div className='flex flex-col gap-6'>
                <AccountFilters
                    banks={banksData}
                    states={availableStates}
                    total={accountsData.length}
                />
                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-3">
                    {accountsData.map((account) => (
                        <AccountCard
                            key={account.account.id}
                            account={account}
                        />
                    ))}
                </div>
                {accountsData.length === 0 && (
                    <div className="rounded-2xl border border-dashed border-border bg-card p-12 text-center">
                        <p className="font-semibold">
                            Nenhuma conta encontrada
                        </p>
                        <p className="mt-2 text-sm text-muted-foreground">
                            Tente ajustar os filtros ou a pesquisa
                        </p>
                    </div>
                )}
            </div>
        </DashboardHeader>
    )
}