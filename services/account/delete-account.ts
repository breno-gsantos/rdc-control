import { db } from "@/db";
import { accounts, activities } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function deleteAccountService(accountId: string, userId: string) {
    return await db.transaction(async (tx) => {
        const [deletedAccount] = await tx.delete(accounts).where(eq(accounts.id, accountId)).returning({ id: accounts.id, name: accounts.name });

        if (!deletedAccount) return null;

        await tx.insert(activities).values({
            userId,
            accountId: null,
            action: 'Excluiu uma conta',
            description: deletedAccount.name
        });

        return deletedAccount;
    })
}