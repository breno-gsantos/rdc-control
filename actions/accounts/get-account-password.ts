'use server'

import { auth } from "@/auth"
import { db } from "@/db";
import { accountCredentials, accounts } from "@/db/schema";
import { decryptPassword } from "@/lib/crypto";
import { canAccessAccountCredentials } from "@/lib/permissions/account-credentials";
import { eq } from "drizzle-orm";

export async function getAccountPassword(credentialId: string) {
    const session = await auth();

    if (!session || !session.user) {
        return { success: false, error: 'Usuário não autenticado' }
    }

    const [credential] = await db.select({
        accountId: accountCredentials.accountId,
        passwordEncrypted: accountCredentials.passwordEncrypted
    }).from(accountCredentials).where(eq(accountCredentials.id, credentialId)).limit(1)

    if (!credential) {
        return { success: false, error: 'Credencial não encontrada' }
    }

    const hasPermission = await canAccessAccountCredentials(credential.accountId, 'reveal');

    if (!hasPermission) {
        return { success: false, error: 'Você não tem permissão para visualizar esta senha' }
    }

    try {
        const decryptedPassword = decryptPassword(credential.passwordEncrypted);

        return { success: true, decryptedPassword }
    } catch (error) {
        return { success: false, error: 'Erro ao recuperar a senha' }
    }
}