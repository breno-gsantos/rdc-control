import { accountStatusEnum } from '@/db/schema';
import { z } from 'zod';

export const accountStatus = z.enum(accountStatusEnum.enumValues);

export const accountFormSchema = z.object({
    name: z.string().trim().min(2, 'Nome muito curto').max(200, 'Nome muito longo'),
    system: z.string().trim().min(1, 'Informe o sistema').max(150, 'Nome do sistema muito longo'),
    username: z.string().trim().min(1, 'Informe o usuário').max(255, 'Usuário muito longo'),
    password: z.string().min(1, 'Informe a senha'),
    bank: z.string().trim().min(1, 'Informe o banco').max(100, 'Nome do banco muito longo'),
    city: z.string().trim().min(1, 'Informe a cidade').max(120, 'Nome da cidade muito longa'),
    state: z.string().trim().length(2, 'Informe uma UF válida').transform((data) => data.toUpperCase()),
    category: z.string().trim().min(1, 'Informe a categoria').max(100, 'Categoria muito longa'),
    responsibleId: z.uuid().nullable().default(null),
    dueDate: z.iso.date().nullable().default(null),
    status: accountStatus.default('active'),
    notes: z.string().default("")
})

export type AccountData = z.infer<typeof accountFormSchema>;