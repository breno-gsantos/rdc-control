import { accountStatusEnum } from '@/db/schema';
import { z } from 'zod';

export const accountStatus = z.enum(accountStatusEnum.enumValues);

export const accountFormSchema = z.object({
    name: z.string().trim().min(2, 'Nome muito curto').max(200, 'Nome muito longo'),
    systemId: z.uuid(),
    username: z.string().trim().min(1, 'Informe o usuário').max(255, 'Usuário muito longo'),
    password: z.string().min(1, 'Informe a senha'),
    bankId: z.uuid(),
    city: z.string().trim().min(1, 'Informe a cidade').max(120, 'Nome da cidade muito longa'),
    state: z.string().trim().length(2, 'Informe uma UF válida').transform((data) => data.toUpperCase()),
    categoryId: z.uuid(),
    responsibleId: z.uuid().nullable(),
    dueDate: z.iso.date().nullable(),
    status: accountStatus,
    notes: z.string()
})

export type AccountData = z.infer<typeof accountFormSchema>;