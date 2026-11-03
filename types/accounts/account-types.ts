import { AccountData } from "@/lib/validations/accounts/accounts-schema";

export type AccountActionResult =
    | {
        success: true;
        message: string;
        accountId: string;
    } | {
        success: false;
        error: string | Partial<Record<keyof AccountData, string[] | undefined>>
    };