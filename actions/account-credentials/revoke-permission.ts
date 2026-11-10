'use server'

import { auth } from "@/auth"
import { db } from "@/db";
import { accountCredentialPermissions } from "@/db/schema";
import { and, eq } from "drizzle-orm";

export async function revokeAccountCredentialPermission(accountId: string, userId: string) {
    const session = await auth();

    if (!session?.user) {
        return { success: false as const, error: 'Usuário não autenticado' }
    }

    if (!['admin', 'director'].includes(session.user.role)) {
        return { success: false as const, error: 'Você não tem permissão para administrar acessos' }
    }

    try {
        await db.delete(accountCredentialPermissions)
            .where(
                and(
                    eq(accountCredentialPermissions.accountId, accountId),
                    eq(accountCredentialPermissions.userId, userId)
                )
            );

        return { success: true as const }
    } catch (error) {
        return { success: false as const, error: 'Não foi possível revogar a permissão' }
    }
}