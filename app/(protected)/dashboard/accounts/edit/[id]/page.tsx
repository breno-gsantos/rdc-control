import { EditAccountForm } from "@/components/dashboard/accounts/edit-account-form";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { db } from "@/db";
import { accountCredentials, accounts, banks, categories, systems, users } from "@/db/schema";
import { requireRole } from "@/lib/require-admin";
import { asc, eq } from "drizzle-orm";
import { notFound } from "next/navigation";

interface EditAccountPageProps {
    params: Promise<{
        id: string;
    }>
}

export default async function EditAccountPage({ params }: EditAccountPageProps) {
    const user = await requireRole('admin', 'director')

    if (!user) {
        notFound();
    }

    const { id } = await params;

    const [account] = await db.select().from(accounts).where(eq(accounts.id, id));

    if (!account) {
        notFound()
    }

    const credentials = await db.select({
        id: accountCredentials.id,
        username: accountCredentials.username
    }).from(accountCredentials).where(eq(accountCredentials.accountId, account.id))

    if (!credentials) {
        notFound()
    }

    const [banksData, systemsData, categoriesData, responsiblesData] = await Promise.all([
        db.select().from(banks).orderBy(asc(banks.name)),
        db.select().from(systems).orderBy(asc(systems.name)),
        db.select().from(categories).orderBy(asc(categories.name)),
        db.select({
            id: users.id,
            name: users.name
        }).from(users).where(eq(users.isActive, true)).orderBy(asc(users.name))
    ])

    return (
        <DashboardHeader title={`Editar conta: ${account.name}`} description="Atualize as informações e credenciais desta conta.">
            <EditAccountForm
                account={account}
                credentials={credentials}
                banks={banksData}
                systems={systemsData}
                categories={categoriesData}
            />
        </DashboardHeader>
    )
}