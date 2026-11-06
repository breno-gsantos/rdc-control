'use server'

import { auth } from "@/auth"
import { db } from "@/db";
import { accounts } from "@/db/schema";
import { decryptPassword } from "@/lib/crypto";
import { eq } from "drizzle-orm";

export async function getAccountPassword(accountId: string) {
    const session = await auth();

    if (!session || !session.user) {
        return { success: false, error: 'Usuário não autenticado' }
    }

    const [account] = await db.select({
        id: accounts.id,
        passwordEncrypted: accounts.passwordEncrypted
    }).from(accounts).where(eq(accounts.id, accountId)).limit(1);

    if (!account) {
        return { success: false, error: 'Conta não encontrada' }
    }

    try {

        const decryptedPassword = decryptPassword(account.passwordEncrypted);

        return { success: true, decryptedPassword }
    } catch (error) {
        return { success: false, error: 'Erro ao recuperar a senha' }
    }
}