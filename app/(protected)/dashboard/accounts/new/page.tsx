import { AccountForm } from "@/components/dashboard/accounts/account-form";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";

export default function NewAccountPage() {
    return (
        <DashboardHeader title="Nova conta" description="Cadastre uma nova conta de acesso aos sistemas de convênios.">
            <AccountForm />
        </DashboardHeader>
    )
}