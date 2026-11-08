import { cn } from "cn";
import { Building2 } from "lucide-react";

interface MetricCardProps {
    label: string;
    value: string;
    detail: string;
    icon: typeof Building2;
    accent: string;
}

export function MetricCard({ accent, detail, icon: Icon, label, value }: MetricCardProps) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm text-slate-500">{label}</p>
                    <p className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
                        {value}
                    </p>
                </div>
                <div className={cn('rounded-xl p-2.5', accent === 'blue' ? 'bg-blue-50 text-blue-600' : accent === 'green' ? 'bg-emerald-50 text-emerald-600' : accent === 'amber' ? 'bg-amber-50 text-amber-600' : 'bg-violet-50 text-violet-600')}>
                    <Icon className="size-5" />
                </div>
            </div>
            <p className="mt-3 text-xs text-slate-400">{detail}</p>
        </div>
    )
}