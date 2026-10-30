import { db } from "@/db";
import { accounts } from "@/db/schema";
import { count } from "drizzle-orm";

export async function getAccountsCount() {
    const response = await db.select({ total: count() }).from(accounts)

    return response[0].total
}