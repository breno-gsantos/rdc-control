import { auth } from "@/auth"
import { Sidebar } from "@/components/dashboard/sidebar";
import { notFound } from "next/navigation";

interface ProtectedLayoutProps {
    children: React.ReactNode
}

export default async function ProtectedLayout({ children }: ProtectedLayoutProps) {
    const session = await auth();

    if (!session || !session.user) {
        notFound()
    }

    return (
        <Sidebar session={session}>
            {children}
        </Sidebar>
    )
}