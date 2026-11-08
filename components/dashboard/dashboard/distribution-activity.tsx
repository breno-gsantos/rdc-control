import { Button } from "@/components/ui/button";
import { activities } from "@/constants/dashbord/data";
import { getBankDistribution, getRecentActivities } from "@/lib/queries/accounts";
import { cn } from "cn";
import { ClipboardList } from "lucide-react";

const barColors = [
    "bg-[#2563eb]",
    "bg-[#60a5fa]",
    "bg-[#93c5fd]",
    "bg-[#bfdbfe]",
    "bg-slate-300",
];

export async function DistributionActivity() {
    const [bankDistribution, recentActivities] = await Promise.all([
        getBankDistribution(),
        getRecentActivities()
    ])

    return (
        <div className="grid xl:grid-cols-[1.35fr_1fr] gap-6">
            <section className="rounded-2xl border border-slate-200 bg-white p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="font-bold text-slate-900">
                            Distribuição por banco
                        </h3>
                        <p className="mt-1 text-xs text-slate-400">
                            Contas conectadas por instituição
                        </p>
                    </div>
                    <Button variant='ghost'>
                        Ver todas
                    </Button>
                </div>

                <div className="flex flex-col gap-5 mt-8">
                    {bankDistribution.map((bank, index) => (
                        <div key={bank.name} className="grid grid-cols-[120px_1fr_42px] items-center gap-3 text-sm">
                            <span className="truncate text-slate-600">{bank.name}</span>
                            <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                                <div className={cn('h-full rounded-full transition-all', barColors[index % barColors.length])} style={{ width: `${bank.percent}%` }} />
                            </div>
                            <span className="text-right text-xs font-semibold text-slate-500">
                                {bank.total}
                            </span>
                        </div>
                    ))}

                    {bankDistribution.length === 0 && (
                        <p className="text-sm text-muted-foreground">
                            Nenhuma conta cadastrada
                        </p>
                    )}
                </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-6">
                <div className="mb-5 flex items-center justify-between">
                    <div>
                        <h3 className="font-bold text-slate-900">
                            Atividade recente
                        </h3>

                        <p className="mt-1 text-xs text-slate-400">
                            Últimas atualizações na plataforma
                        </p>
                    </div>

                    <ClipboardList className="size-5 text-slate-300" />
                </div>

                <div className="flex flex-col gap-5">
                    {recentActivities.map((activity) => (
                        <div key={activity.id} className="flex gap-3">
                            <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-[10px] font-bold text-slate-600">
                                {activity.initials}
                            </div>

                            <div className="min-w-0 flex-1">
                                <p className="text-sm text-slate-700">
                                    <span className="font-semibold">
                                        {activity.userName}
                                    </span>{" "}
                                    {activity.action.toLowerCase()}
                                </p>

                                <p className="truncate text-xs text-slate-400">
                                    {activity.description}
                                </p>
                            </div>

                            <span className="whitespace-nowrap text-[11px] text-slate-400">
                                {activity.createdAt.toLocaleString("pt-BR", {
                                    day: "2-digit",
                                    month: "2-digit",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                })}
                            </span>
                        </div>
                    ))}

                    {recentActivities.length === 0 && (
                        <p className="text-sm text-muted-foreground">
                            Nenhuma atividade registrada.
                        </p>
                    )}
                </div>
            </section>
        </div>
    )
}