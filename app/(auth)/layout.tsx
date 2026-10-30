import { auth } from "@/auth"
import { redirect } from "next/navigation";

interface AuthLayoutProps {
    children: React.ReactNode
}

export default async function AuthLayout({ children }: AuthLayoutProps) {
    const session = await auth();

    if (session) {
        redirect('/dashboard')
    }

    return (
        <div className="min-h-screen flex items-center justify-center">
            {children}
        </div>
    )
}