import NextAuth from "next-auth"
import Credentials from 'next-auth/providers/credentials';
import { loginFormSchema } from "./lib/validations/login-schema";
import { getUserByEmail } from "./lib/user";
import { comparePassword } from "./lib/password";

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Credentials({
            async authorize(credentials) {
                const parsed = loginFormSchema.safeParse(credentials);

                if (!parsed.success) return null;

                const { email, password } = parsed.data;

                const user = await getUserByEmail(email);

                if (!user || !user.passwordHash) return null;

                const passwordMatches = await comparePassword(password, user.passwordHash);

                if (!passwordMatches) return null;

                return {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                }
            }
        })
    ],
    session: { strategy: 'jwt' },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.email = user.email;
                token.role = user.role
            }
            return token;
        },
        async session({ token, session }) {
            if (session.user) {
                session.user.id = token.id;
                session.user.email = token.email;
                session.user.role = token.role;
            }
            return session;
        }
    },
    secret: process.env.AUTH_SECRET
})