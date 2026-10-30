import { auth } from "@/auth"
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { Suspense } from "react";

interface ProtectedLayoutProps {
    children: React.ReactNode
}

async function ProtectedContent({ children }: ProtectedLayoutProps) {
    await connection();

    const session = await auth();

    if (!session?.user) {
        notFound();
    }

    return (
        <>
            {children}
        </>
    )
}

export default async function ProtectedLayout({ children }: ProtectedLayoutProps) {
    return (
        <Suspense fallback={<div>Carregando...</div>}>
            <ProtectedContent>
                {children}
            </ProtectedContent>
        </Suspense>
    )
}