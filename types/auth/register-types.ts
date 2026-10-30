import { userRoleEnum } from "@/db/schema";
import { RegisterInput } from "@/lib/validations/register-schema";

export type RegisterActionResult =
    | {
        success: true;
        message: string;
    }
    | {
        success: false;
        fieldError: Partial<Record<keyof RegisterInput, string[]>>
    }
    | {
        success: false;
        error: Partial<Record<keyof RegisterInput, string[]>> | string;
    }

export const roleLabels: Record<(typeof userRoleEnum.enumValues)[number], string> = {
    admin: 'Administrador',
    director: 'Diretor',
    manager: 'Gerente',
    supervisor: 'Supervisor',
    promoter: 'Promoter',
}