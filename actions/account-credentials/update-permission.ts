'use server'

import { auth } from "@/auth";
import { db } from "@/db";
import { accountCredentialPermissions } from "@/db/schema";

interface UpdateAccountCredentialPermissionInput {
    accountId: string;
    userId: string;
    canViewCredentials: boolean;
    canRevealPassword: boolean;
}

export async function updatePermission(input: UpdateAccountCredentialPermissionInput) {
    const session = await auth();

    if (!session?.user) {
        return { success: false as const, error: 'Usuário não autenticado' }
    }

    if (!['admin', 'director'].includes(session.user.role)) {
        return { success: false as const, error: 'Você não tem permissão para administrar acessos' }
    }

    if (!input.canViewCredentials && input.canRevealPassword) {
        return { success: false as const, error: 'Não é possível liberar a senha sem permitir visualizar as credenciais' }
    };

    try {
        await db.insert(accountCredentialPermissions).values({
            accountId: input.accountId,
            userId: input.userId,
            canRevealPassword: input.canRevealPassword,
            canViewCredentials: input.canViewCredentials,
            grantedBy: session.user.id
        }).onConflictDoUpdate({
            target: [
                accountCredentialPermissions.accountId,
                accountCredentialPermissions.userId
            ],
            set: {
                canViewCredentials: input.canViewCredentials,
                canRevealPassword: input.canRevealPassword,
                grantedBy: session.user.id
            }
        });

        return { success: true as const }
    } catch (error) {
        return { success: false, error: 'Não foi possível concluir as permissões' }
    }
}