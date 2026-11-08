import { db } from "@/db";
import { accounts, activities, banks, users } from "@/db/schema";
import { count, desc, eq } from "drizzle-orm";

export async function getAccountsCount() {
    const response = await db.select({ total: count() }).from(accounts)

    return response[0].total
}

export async function getBankDistribution() {
    const response = await db.select({
        bankName: banks.name, total: count(accounts.id)
    }).from(accounts).innerJoin(banks, eq(accounts.bankId, banks.id)).groupBy(banks.id, banks.name).orderBy(desc(count(accounts.id)))

    const totalAccounts = response.reduce((sum, bank) => sum + bank.total, 0);

    return response.slice(0, 5).map((bank) => ({
        name: bank.bankName,
        total: bank.total,
        percent: totalAccounts > 0 ? Math.round((bank.total / totalAccounts) * 100) : 0
    }))
}

export async function getRecentActivities() {
    const response = await db.select({
        id: activities.id,
        action: activities.action,
        description: activities.description,
        createdAt: activities.createdAt,
        userName: users.name
    }).from(activities).leftJoin(users, eq(activities.userId, users.id)).orderBy(desc(activities.createdAt)).limit(3);

    return response.map((activity) => {
        const userName = activity.userName ?? 'Usuário removido'

        const initials = userName.split(" ").map((name) => name[0]).slice(0, 2).join("").toUpperCase()

        return {
            ...activity,
            userName,
            initials
        }
    })
}