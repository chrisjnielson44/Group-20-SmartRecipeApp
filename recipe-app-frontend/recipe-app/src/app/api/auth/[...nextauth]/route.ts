import NextAuth from "next-auth/next"
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from 'bcrypt';
import prisma from "@/app/lib/prisma";

const handler = NextAuth({
    session: {
        strategy: 'jwt',
        maxAge: 30 * 24 * 60 * 60,
    },
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: '/',
        signOut: '/'
    },
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!
        }),
        CredentialsProvider({
            credentials: {
                email: {},
                password: {}
            },
            async authorize(credentials, req) {


                const user = await prisma.user.findUnique({
                    where: {
                        email: credentials?.email
                    },
                })

                if (!user) {
                    throw new Error("No user found");
                }

                const passwordCorrect = await compare(credentials?.password || "", user.password);

                if (passwordCorrect) {
                    return {
                        id: user.id + '',
                        email: user.email,
                        name: user.firstName + ' ' + user.lastName,
                    };
                }
                return null;

            }
        })
    ],
    callbacks: {
        async session({ session, token }) {
            session.user.id = token.sub;
            return session;
        },
        async jwt({ token, account, user }) {
            if (account) {
                token.accessToken = account.access_token;
                token.id = user.id;
                // console.log({ user });
            }
            return token;
        },
    },
})
export { handler as GET, handler as POST };

