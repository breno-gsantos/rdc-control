import { userRoleEnum } from '@/db/schema';
import { z } from 'zod';

export const userRole = z.enum(userRoleEnum.enumValues);

export const registerDomainSchema = z.object({
    name: z.string().min(2, 'Nome muito curto').max(150, 'Nome muito longo'),
    email: z.email('Digite um email válido').trim().transform((data) => data.toLowerCase()),
    password: z.string().min(8, 'Senha deve conter ao menos 8 caracteres').max(20, 'Senha muito longa')
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).+$/,
            'A senha deve conter letra maiúscula, minúscula, número e caractere especial'
        ),
    role: userRole.default('promoter'),
    isActive: z.boolean().default(true),
})

export const registerFormSchema = registerDomainSchema.extend({
    confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    error: 'As senhas não coincidem'
})

export type RegisterInput = z.input<typeof registerFormSchema>;
export type RegisterOutput = z.output<typeof registerDomainSchema>;