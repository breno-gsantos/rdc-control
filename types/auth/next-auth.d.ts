import { userRoleEnum } from "@/db/schema";
import NextAuth, { type DefaultSession } from "next-auth"
import { JWT } from "next-auth/jwt"

type UserRole = (typeof userRoleEnum.enumValues)[number];

declare module 'next-auth' {
    interface Session {
        user: {
            id: string;
            email: string;
            role: UserRole
        } & DefaultSession['user']
    }
    interface User {
        id: string;
        email: string;
        role: UserRole;
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        id: string;
        email: string;
        role: UserRole;
    }
}