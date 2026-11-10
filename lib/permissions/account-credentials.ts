import { auth } from "@/auth";
import { db } from "@/db";
import { accountCredentialPermissions } from "@/db/schema";
import { and, eq } from "drizzle-orm";

type CredentialPermission = 'view' | 'reveal'

export async function canAccessAccountCredentials(accountId: string, permission: CredentialPermission) {
    const session = await auth();

    if (!session?.user) {
        return false;
    }

    if (session.user.role === 'admin') {
        return true;
    }

    const [access] = await db.select({
        canViewCredentials: accountCredentialPermissions.canViewCredentials,
        canRevealPassword: accountCredentialPermissions.canRevealPassword
    }).from(accountCredentialPermissions).where(
        and(
            eq(accountCredentialPermissions.accountId, accountId),
            eq(accountCredentialPermissions.userId, session.user.id)
        )
    ).limit(1);

    if (!access || !access.canViewCredentials) {
        return false;
    }

    if (permission === 'view') {
        return true;
    }

    return access.canRevealPassword
}