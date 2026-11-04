import { auth } from "@/auth"
import { notFound } from "next/navigation";

interface NewAccountLayoutProps {
    children: React.ReactNode
}

export default async function NewAccountLayout({ children }: NewAccountLayoutProps) {
    const session = await auth();

    if (!session || session.user.role !== 'admin') {
        notFound()
    }

    return (
        <div>
            {children}
        </div>
    )
}