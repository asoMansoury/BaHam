import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import authConfig from "./auth.config";
import { PrismaClient } from "@prisma/client";

var prisma = new PrismaClient();


export const { auth, handlers, signIn, signOut } = NextAuth({
    callbacks:{
        async jwt({token}) {
            return token;
        },
        async session({session,token}){
            if(token.sub && session.user){
                session.user.id = token.sub//fetch user data from database
            }
            return session;
        }
    },
    adapter: PrismaAdapter(prisma) as any, // TypeScript sometimes requires `as any`
    session: { strategy: "jwt" },
    ...authConfig,
});


