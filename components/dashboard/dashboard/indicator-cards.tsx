import { MetricCard } from "@/components/dashboard/dashboard/metric-card";
import { db } from "@/db";
import { accountCredentials, accounts, users } from "@/db/schema";
import { and, count, eq, gte, lte } from "drizzle-orm";
import { FileClock, KeyRound, ShieldCheck, Users } from "lucide-react";

export async function IndicatorCards() {
    const today = new Date();

    const next30Days = new Date();
    next30Days.setDate(today.getDate() + 30);

    const [totalCredentials, activeAccounts, upcomingAccounts, activeUsers] = await Promise.all([
        db.select({ total: count() }).from(accountCredentials),

        db.select({ total: count() }).from(accounts).where(eq(accounts.status, 'active')),

        db.select({ total: count() }).from(accounts).where(
            and(
                gte(accounts.dueDate, today.toISOString().slice(0, 10)),
                lte(accounts.dueDate, next30Days.toISOString().slice(0, 10)),
                eq(accounts.status, 'active')
            )
        ),

        db.select({ total: count() }).from(users).where(eq(users.isActive, true))
    ]);



    return (
        <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
            <MetricCard
                label="Credenciais cadastradas"
                value={totalCredentials[0].total.toString()}
                detail="Acessos registrados nos convênios"
                icon={KeyRound}
                accent="blue"
            />
            <MetricCard
                label="Contas ativas"
                value={activeAccounts[0].total.toString()}
                detail="Em operação"
                icon={ShieldCheck}
                accent="green"
            />

            <MetricCard
                label="Próximas do vencimento"
                value={upcomingAccounts[0].total.toString()}
                detail="Nos próximos 30 dias"
                icon={FileClock}
                accent="amber"
            />

            <MetricCard
                label="Usuários ativos"
                value={activeUsers[0].total.toString()}
                detail="Usuários habilitados"
                icon={Users}
                accent="purple"
            />
        </div>
    )
}