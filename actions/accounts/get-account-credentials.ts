'use server'

import { auth } from "@/auth"
import { db } from "@/db";
import { accountCredentials } from "@/db/schema";
import { canAccessAccountCredentials } from "@/lib/permissions/account-credentials";
import { eq } from "drizzle-orm";

export async function getAccountCredentials(accountId: string) {
    const session = await auth();

    if (!session || !session.user) {
        return { success: false as const, error: 'Usuário não autenticado' }
    }

    const hasPermission = await canAccessAccountCredentials(accountId, 'view');

    if (!hasPermission) {
        return { success: false as const, error: 'Você não tem permissão para visualizar estas credenciais' }
    }

    const credentials = await db.select({
        id: accountCredentials.id,
        username: accountCredentials.username
    }).from(accountCredentials).where(eq(accountCredentials.accountId, accountId))

    return { success: true as const, credentials }
}