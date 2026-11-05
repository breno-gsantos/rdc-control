import { db } from "@/db";
import { accounts } from "@/db/schema";
import { encryptPassword } from "@/lib/crypto";
import { AccountData } from "@/lib/validations/accounts/accounts-schema";

export async function createAccountService(data: AccountData) {
    const passwordEncrypted = encryptPassword(data.password);

    const [account] = await db.insert(accounts).values({
        name: data.name,
        username: data.username,
        passwordEncrypted,
        city: data.city,
        state: data.state,
        dueDate: data.dueDate,
        notes: data.notes,
        bankId: data.bankId,
        systemId: data.systemId,
        categoryId: data.categoryId,
        responsibleId: data.responsibleId,
        status: data.status
    }).returning({
        id: accounts.id
    })

    return account;
}