import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import authConfig from "./auth.config";
import { PrismaClient } from "@prisma/client";

var prisma = new PrismaClient();


export const { auth, handlers, signIn, signOut } = NextAuth({
    callbacks:{
        async jwt({user,token}) {
             console.log("user:",user);
            if(user){
                console.log("user:",user);
                token.profileComplete = user.name ? true : false;;

            }

                  // On subsequent calls, `user` is undefined — fetch from DB using token.sub
                if (token.sub) {
                    try {

                    const dbUser = await prisma.user.findUnique({
                        where: { id: String(token.sub) },
                        select: { id: true, name: true, email: true , profileComplete: true},
                    });
                    if (dbUser) {
                        token.profileComplete = Boolean(dbUser.profileComplete);
                    }
                    } catch (err) {
                    console.error("jwt callback DB lookup error:", err);
                    }
                }
            return token;
        },
        async session({session,token}){
            if(token.sub && session.user){
                session.user.id = token.sub//fetch user data from database
                session.user.profileComplete = token.profileComplete as boolean;
            }
            return session;
        }
    },
    adapter: PrismaAdapter(prisma) as any, // TypeScript sometimes requires `as any`
    session: { strategy: "jwt" },
    ...authConfig,
});


