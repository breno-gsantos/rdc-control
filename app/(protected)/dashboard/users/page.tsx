import { RegisterForm } from "@/components/auth/register-form";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { requireRole } from "@/lib/require-admin";

export default async function CreateUsersPage() {
    await requireRole('admin');

    return (
        <DashboardHeader title="Criar Usuário" description="Preencha os dados abaixo para criar um novo usuário.">
            <RegisterForm />
        </DashboardHeader>
    )
}