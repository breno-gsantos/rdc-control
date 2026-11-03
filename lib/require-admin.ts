import { auth } from "@/auth";
import { UserRole } from "@/types/auth/next-auth";
import { notFound } from "next/navigation";

export async function requireRole(...allowedRoles: UserRole[]) {
    const session = await auth();

    if (!session?.user || !allowedRoles.includes(session.user.role)) {
        notFound();
    }

    return session.user
}