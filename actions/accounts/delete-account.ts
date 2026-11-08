'use server'

import { requireRole } from "@/lib/require-admin";
import { deleteAccountService } from "@/services/account/delete-account";
import { revalidatePath } from "next/cache";
import z from "zod"

const deleteAccountSchema = z.uuid();

export async function deleteAccountAction(accountId: unknown) {
    const user = await requireRole('admin', 'director');

    const parsed = deleteAccountSchema.safeParse(accountId);

    if (!parsed.success) {
        return { success: false, error: 'Identificador de conta inválido' }
    }

    try {
        const deletedAccount = await deleteAccountService(parsed.data, user.id);

        if (!deletedAccount) {
            return { success: false, error: 'Conta não encontrada' }
        }

        revalidatePath('/dashboard/accounts');

        return { success: true, message: 'Conta excluída com sucesso' }
    } catch (error) {
        console.error('[DELETE_ACCOUNT_ERROR]', error);

        return { success: false, error: 'Erro interno ao excluir a conta' }
    }
}