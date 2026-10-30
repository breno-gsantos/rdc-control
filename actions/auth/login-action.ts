'use server'

import { signIn } from "@/auth";
import { loginFormSchema } from "@/lib/validations/login-schema";
import { LoginActionResult } from "@/types/auth/login-types";

export async function loginAction(values: unknown): Promise<LoginActionResult> {
    const parsed = loginFormSchema.safeParse(values);

    if (!parsed.success) {
        return { success: false, error: 'Não foi possível concluir o login. Verifique os dados informados' }
    }

    const { email, password } = parsed.data;

    try {
        await signIn('credentials', {
            email,
            password,
            redirect: false
        })

        return { success: true, message: 'Bem-vindo' }
    } catch (error) {
        return { success: false, error: 'Email ou senha incorretos' }
    }
}