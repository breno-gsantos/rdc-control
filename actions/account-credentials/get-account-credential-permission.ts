'use server'

import { auth } from "@/auth"
import { db } from "@/db";
import { accountCredentialPermissions, accounts, users } from "@/db/schema";
import { and, eq, ne } from "drizzle-orm";

export async function getAccountCredentialPermission(accountId: string) {
    const session = await auth();

    if (!session?.user) {
        return { success: false as const, error: 'Usuário não autenticado' }
    }

    if (!['admin', 'director'].includes(session.user.role)) {
        return { success: false as const, error: 'Você não tem permissão para administrar estes acessos' }
    }

    const [account] = await db.select({
        id: accounts.id
    }).from(accounts).where(eq(accounts.id, accountId)).limit(1);

    if (!account) {
        return { success: false as const, error: 'Conta não encontrada' }
    }

    const result = await db.select({
        userId: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        isActive: users.isActive,
        canViewCredentials: accountCredentialPermissions.canViewCredentials,
        canRevealPassword: accountCredentialPermissions.canRevealPassword
    }).from(users)
        .leftJoin(
            accountCredentialPermissions,
            and(
                eq(accountCredentialPermissions.userId, users.id),
                eq(accountCredentialPermissions.accountId, accountId)
            )
        ).where(ne(users.role, 'admin')).orderBy(users.name);

    const permissions = result.map((user) => ({
        userId: user.userId,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        canViewCredentials: user.canViewCredentials ?? false,
        canRevealPassword: user.canRevealPassword ?? false
    }));

    return { success: true as const, permissions }
}