'use server'

import { EmailAlreadyExistsError } from "@/errors/auth-error";
import { requireAdmin } from "@/lib/require-admin";
import { registerFormSchema } from "@/lib/validations/register-schema"
import { registerService } from "@/services/auth/register-service";
import { RegisterActionResult } from "@/types/auth/register-types";

export async function registerAction(values: unknown): Promise<RegisterActionResult> {
    await requireAdmin();

    const parsed = registerFormSchema.safeParse(values);

    if (!parsed.success) {
        return { success: false, error: parsed.error.flatten().fieldErrors }
    }

    try {
        await registerService(parsed.data);

        return { success: true, message: 'Conta criada com sucesso' }
    } catch (error) {
        if (error instanceof EmailAlreadyExistsError) {
            return {
                success: false,
                fieldError: {
                    email: [error.message]
                }
            }
        }

        return { success: false, error: 'Erro interno do servidor' }
    }
}