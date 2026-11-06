import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { IndicatorCards } from "@/components/dashboard/dashboard/indicator-cards";
import { db } from "@/db";
import { users } from "@/db/schema";

export default async function DashboardPage() {
    const [user] = await db.select().from(users).limit(1);

    return (
        <>
            <div className="mb-5 text-sm font-medium tracking-wider text-foreground">
                Boa tarde, {user.name}
            </div>
            <DashboardHeader title="Visão geral da operação" description="Acompanhe o desempenho da sua operação em tempo real.">
                <IndicatorCards />
                {/* Distribuição e atividades */}
                {/* Contas que merecem atenção */}
            </DashboardHeader>
        </>
    )
}