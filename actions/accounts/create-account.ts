'use server'

import { requireRole } from "@/lib/require-admin";
import { accountFormSchema } from "@/lib/validations/accounts/accounts-schema";
import { createAccountService } from "@/services/account/create-account";
import { AccountActionResult } from "@/types/accounts/account-types";
import { revalidatePath } from "next/cache";

export async function createAccountAction(values: unknown): Promise<AccountActionResult> {
    await requireRole('admin');

    const parsed = accountFormSchema.safeParse(values);

    if (!parsed.success) {
        return { success: false, error: parsed.error.flatten().fieldErrors }
    }

    try {
        const account = await createAccountService(parsed.data);

        revalidatePath('/dashboard/accounts')

        return {
            success: true, message: 'Conta cadastrada com sucesso', accountId: account.id
        }
    } catch (error) {
        console.error("[CREATE_ACCOUNT_ERROR]", error);

        return {
            success: false,
            error: 'Erro interno do servidor'
        }
    }
}