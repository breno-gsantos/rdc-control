
import { accountStatusEnum } from "@/db/schema";
import { z } from "zod";

export const accountStatus = z.enum(accountStatusEnum.enumValues);

const accountFields = {
    name: z
        .string()
        .trim()
        .min(2, "Nome muito curto")
        .max(200, "Nome muito longo"),

    systemId: z.uuid("Selecione um sistema"),

    bankId: z.uuid(),

    city: z
        .string()
        .trim()
        .min(1, "Informe a cidade")
        .max(120, "Nome da cidade muito longa"),

    state: z
        .string()
        .trim()
        .length(2, "Informe uma UF válida")
        .transform((data) => data.toUpperCase()),

    categoryId: z.uuid(),

    dueDate: z.iso.date().nullable(),

    status: accountStatus,

    websiteUrl: z
        .string()
        .trim()
        .pipe(
            z.url({
                protocol: /^https?$/,
                message: "Informe uma URL válida",
            })
        ),

    notes: z.string(),
};

const credentialSchema = z.object({
    username: z
        .string()
        .trim()
        .min(1, "Informe o usuário")
        .max(255, "Usuário muito longo"),

    password: z
        .string()
        .min(1, "Informe a senha"),
});

export const accountFormSchema = z.object({
    ...accountFields,

    credentials: z
        .array(credentialSchema)
        .min(1, "Adicione pelo menos uma credencial"),
});

const editCredentialSchema = z.object({
    id: z.uuid().optional(),

    username: z
        .string()
        .trim()
        .min(1, "Informe o usuário")
        .max(255, "Usuário muito longo"),

    password: z.string(),
});

export const editAccountFormSchema = z
    .object({
        ...accountFields,

        credentials: z
            .array(editCredentialSchema)
            .min(1, "Adicione pelo menos uma credencial"),
    })
    .superRefine((data, ctx) => {
        data.credentials.forEach((credential, index) => {
            if (!credential.id && credential.password.length === 0) {
                ctx.addIssue({
                    code: "custom",
                    path: ["credentials", index, "password"],
                    message: "Informe a senha",
                });
            }
        });
    });

export type AccountData = z.infer<typeof accountFormSchema>;

export type EditAccountData = z.infer<typeof editAccountFormSchema>;
