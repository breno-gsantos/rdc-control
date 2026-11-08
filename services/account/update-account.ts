import { db } from "@/db";
import { accountCredentials, accounts, activities } from "@/db/schema";
import { encryptPassword } from "@/lib/crypto";
import { EditAccountData } from "@/lib/validations/accounts/accounts-schema";
import { and, eq } from "drizzle-orm";

export async function updateAccountService(data: EditAccountData, accountId: string, userId: string) {
    return await db.transaction(async (tx) => {
        const [account] = await tx.update(accounts).set({
            name: data.name,
            websiteUrl: data.websiteUrl,
            city: data.city,
            state: data.state,
            dueDate: data.dueDate,
            notes: data.notes,
            bankId: data.bankId,
            systemId: data.systemId,
            categoryId: data.categoryId,
            status: data.status,
            updatedAt: new Date()
        }).where(eq(accounts.id, accountId)).returning({
            id: accounts.id,
            name: accounts.name
        });

        if (!account) {
            throw new Error('ACCOUNT_NOT_FOUND')
        }

        const currentCredentials = await tx.select({ id: accountCredentials.id }).from(accountCredentials).where(eq(accountCredentials.accountId, accountId));

        const currentCredentialsIds = new Set(
            currentCredentials.map((credential) => credential.id)
        );

        const submittedIds = data.credentials.map((credential) => credential.id).filter((id): id is string => Boolean(id));

        if (new Set(submittedIds).size !== submittedIds.length) {
            throw new Error('INVALID_CREDENTIALS')
        }

        for (const credentialId of submittedIds) {
            if (!currentCredentialsIds.has(credentialId)) {
                throw new Error('INVALID_CREDENTIALS')
            }
        }

        for (const credential of data.credentials) {
            if (credential.id) {
                const updateValues: {
                    username: string;
                    passwordEncrypted?: string;
                    updatedAt: Date;
                } = {
                    username: credential.username,
                    updatedAt: new Date()
                };

                if (credential.password.length > 0) {
                    updateValues.passwordEncrypted = encryptPassword(credential.password)
                }

                await tx.update(accountCredentials).set(updateValues).where(and(eq(accountCredentials.id, credential.id), eq(accountCredentials.accountId, accountId)))
            } else {
                await tx.insert(accountCredentials).values({
                    accountId,
                    username: credential.username,
                    passwordEncrypted: encryptPassword(credential.password)
                })
            }
        }

        const submittedIdSet = new Set(submittedIds);

        const removedCredentials = currentCredentials.filter((crendetial) => !submittedIdSet.has(crendetial.id));

        for (const credential of removedCredentials) {
            await tx.delete(accountCredentials).where(and(eq(accountCredentials.id, credential.id), eq(accountCredentials.accountId, accountId)))
        }

        await tx.insert(activities).values({
            userId,
            accountId,
            action: 'Atualizou uma conta',
            description: account.name
        })
    })
}