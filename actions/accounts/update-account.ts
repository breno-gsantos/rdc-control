'use server'

import { requireRole } from "@/lib/require-admin";
import { editAccountFormSchema } from "@/lib/validations/accounts/accounts-schema";
import { updateAccountService } from "@/services/account/update-account";
import { AccountActionResult } from "@/types/accounts/account-types";
import { revalidatePath } from "next/cache";

export async function updateAccountAction(accountId: string, values: unknown): Promise<AccountActionResult> {
    const user = await requireRole('admin');

    if (!accountId) {
        return { success: false, error: 'Conta inválida' }
    }

    const parsed = editAccountFormSchema.safeParse(values);

    if (!parsed.success) {
        return { success: false, error: parsed.error.flatten().fieldErrors }
    };

    try {
        await updateAccountService(parsed.data, accountId, user.id);

        revalidatePath('/dashboard/accounts');
        revalidatePath(`/dashboard/accounts/edit/${accountId}`)

        return { success: true, message: 'Conta atualizada com sucesso', accountId }
    } catch (error) {
        console.error('[UPDATE_ACCOUNT_ERROR]', error);

        return {
            success: false,
            error: 'Erro interno do servidor'
        }
    }
}