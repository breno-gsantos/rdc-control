import { AccountForm } from "@/components/dashboard/accounts/account-form";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { db } from "@/db";
import { banks, categories, systems } from "@/db/schema";
import { asc } from "drizzle-orm";

export default async function NewAccountPage() {
    const [banksData, systemsData, categoriesData] = await Promise.all([
        db.select().from(banks).orderBy(asc(banks.name)),
        db.select().from(systems).orderBy(asc(systems.name)),
        db.select().from(categories).orderBy(asc(categories.id))
    ])

    return (
        <DashboardHeader title="Nova conta" description="Cadastre uma nova conta de acesso aos sistemas de convênios.">
            <AccountForm banks={banksData} categories={categoriesData} systems={systemsData} />
        </DashboardHeader>
    )
}