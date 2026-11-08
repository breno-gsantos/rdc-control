import { Button } from "@/components/ui/button";
import Link from "next/link";

export function ExperingAccounts() {
    return (
        <section className="rounded-2xl border border-slate-200 bg-white p-6">
            <div className="mb-5 flex items-center justify-between">
                <div>
                    <h3 className="font-bold text-slate-900">
                        Contas que precisam de atenção
                    </h3>
                    <p className="mt-1 text-xs text-slate-400">
                        Vencimentos nos próximos 30 dias
                    </p>
                </div>
                <Button variant='ghost' asChild>
                    <Link href='/dashboard/accounts'>
                        Ver contas
                    </Link>
                </Button>
            </div>
            <div className="grid sm:grid-cols-3 gap-3">

            </div>
        </section>
    )
}