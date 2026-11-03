import { db } from "@/db";
import { accounts } from "@/db/schema";
import { encryptPassword } from "@/lib/crypto";
import { AccountData } from "@/lib/validations/accounts/accounts-schema";

export async function createAccountService(data: AccountData) {
    const passwordEncrypted = encryptPassword(data.password);

    const [account] = await db.insert(accounts).values({
        name: data.name,
        system: data.system,
        username: data.username,
        passwordEncrypted,
        bank: data.bank,
        city: data.city,
        state: data.state,
        category: data.category,
        responsibleId: data.responsibleId,
        dueDate: data.dueDate,
        status: data.status,
        notes: data.notes
    }).returning({
        id: accounts.id
    });

    return account;
}