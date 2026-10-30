import { z } from 'zod';

export const accountFormSchema = z.object({
    name: z.string().min(1, 'Digite o nome do convênio').max(200, 'Nome de convênio muito longo'),
    system: z.string().min(1, 'Digite o tipo de sistema').max(150, 'Nome de sistema muito longo')
})