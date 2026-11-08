import { db } from "@/db";
import { accountCredentials, accounts, activities } from "@/db/schema";
import { encryptPassword } from "@/lib/crypto";
import { AccountData } from "@/lib/validations/accounts/accounts-schema";

export async function createAccountService(data: AccountData, userId: string) {
    return await db.transaction(async (tx) => {
        const [account] = await tx.insert(accounts).values({
            name: data.name,
            websiteUrl: data.websiteUrl,
            city: data.city,
            state: data.state,
            dueDate: data.dueDate,
            notes: data.notes,
            bankId: data.bankId,
            systemId: data.systemId,
            categoryId: data.categoryId,
            responsibleId: userId,
            status: data.status
        }).returning({
            id: accounts.id,
            name: accounts.name
        });

        await tx.insert(accountCredentials).values(
            data.credentials.map((credential) => ({
                accountId: account.id,
                username: credential.username,
                passwordEncrypted: encryptPassword(credential.password)
            }))
        )

        await tx.insert(activities).values({
            userId,
            accountId: account.id,
            action: 'Cadastrou uma nova conta',
            description: `${account.name}`
        });
        return {
            id: account.id
        }
    })
}