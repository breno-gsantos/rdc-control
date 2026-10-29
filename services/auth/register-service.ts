import { db } from "@/db";
import { users } from "@/db/schema";
import { EmailAlreadyExistsError } from "@/errors/auth-error";
import { hashPassword } from "@/lib/password";
import { RegisterOutput } from "@/lib/validations/register-schema";

export async function registerService(data: RegisterOutput) {
    const hashedPassword = await hashPassword(data.password);

    try {
        await db.insert(users).values({
            name: data.name,
            email: data.email,
            passwordHash: hashedPassword,
            isActive: data.isActive,
            role: data.role
        }).returning()
    } catch (error: any) {
        if (error.code === '23505' || error.cause?.code === '23505') {
            throw new EmailAlreadyExistsError()
        }
        throw error
    }
}