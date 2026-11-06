import { MetricCard } from "@/components/dashboard/dashboard/metric-card";

export function IndicatorCards() {
    return (
        <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
            <MetricCard />
        </div>
    )
}