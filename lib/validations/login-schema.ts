import { z } from 'zod';

export const loginFormSchema = z.object({
    email: z.string().min(1, 'Preencha o email').pipe(z.email('Digite um email válido')),
    password: z.string().min(1, 'Digite uma senha').max(20, 'Senha incorreta')
})

export type LoginFormData = z.infer<typeof loginFormSchema>;

