import { z } from 'zod';

export const optionFormSchema = z.object({
    name: z.string().min(2, 'Nome muito curto').max(150, 'Nome muito longo')
})

export type OptionData = z.infer<typeof optionFormSchema>;