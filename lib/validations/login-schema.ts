import { z } from 'zod';

export const loginFormSchema = z.object({
    email: z.email('Digite um email válido'),
    password: z.string().min(1, 'Senha incorreta').max(20, 'Senha incorreta')
})

export type LoginFormData = z.infer<typeof loginFormSchema>;

