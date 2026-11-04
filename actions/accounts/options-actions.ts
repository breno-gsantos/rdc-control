'use server'

import { isUniqueViolation } from "@/errors/is-unique-violation";
import { requireRole } from "@/lib/require-admin"
import { optionFormSchema } from "@/lib/validations/accounts/options-schema"
import { createBankService, createCategoryService, createSystemService } from "@/services/account/options-service";
import { revalidatePath } from "next/cache";

export async function createBankAction(values: unknown) {
    await requireRole('admin', 'director')

    const parsed = optionFormSchema.safeParse(values);

    if (!parsed.success) {
        return { success: false, error: parsed.error.issues[0]?.message ?? 'Dados inválidos' }
    }

    try {
        await createBankService(parsed.data);

        revalidatePath('/dashboard/accounts')

        return { success: true, message: 'Banco criado com sucesso' }
    } catch (error) {
        console.error('[CREATE_BANK_ERROR]', error)

        if (isUniqueViolation(error)) {
            return { success: false, error: 'Este banco já está cadastrado' }
        }

        return { success: false, error: 'Erro interno do servidor' }
    }

}

export async function createSystemAction(values: unknown) {
    await requireRole('admin', 'director')

    const parsed = optionFormSchema.safeParse(values);

    if (!parsed.success) {
        return { success: false, error: parsed.error.issues[0]?.message ?? 'Dados inválidos' }
    }

    try {
        await createSystemService(parsed.data);

        revalidatePath('/dashboard/accounts')

        return { success: true, message: 'Sistema criado com sucesso' }
    } catch (error) {
        console.error('[CREATE_SYSTEM_ERROR]', error)

        if (isUniqueViolation(error)) {
            return { success: false, error: 'Este banco já está cadastrado' }
        }

        return { success: false, error: 'Erro interno do servidor' }
    }

}

export async function createCategoryAction(values: unknown) {
    await requireRole('admin', 'director')

    const parsed = optionFormSchema.safeParse(values);

    if (!parsed.success) {
        return { success: false, error: parsed.error.issues[0]?.message ?? 'Dados inválidos' }
    }

    try {
        await createCategoryService(parsed.data);

        revalidatePath('/dashboard/accounts')

        return { success: true, message: 'Categoria criada com sucesso' }
    } catch (error) {
        console.error('[CREATE_CATEGORY_ERROR]', error)

        if (isUniqueViolation(error)) {
            return { success: false, error: 'Este banco já está cadastrado' }
        }

        return { success: false, error: 'Erro interno do servidor' }
    }

}