import { db } from "@/db";
import { banks, categories, systems } from "@/db/schema";
import { OptionData } from "@/lib/validations/accounts/options-schema";

export async function createBankService(data: OptionData) {
    await db.insert(banks).values({
        name: data.name
    })
}

export async function createSystemService(data: OptionData) {
    await db.insert(systems).values({
        name: data.name
    })
}

export async function createCategoryService(data: OptionData) {
    await db.insert(categories).values({
        name: data.name
    })
}