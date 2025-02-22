import { PrismaClient } from '@prisma/client';
import NextAuth from 'next-auth';
import authConfig from './auth.config';
import { PrismaAdapter } from '@auth/prisma-adapter';

const prisma = new PrismaClient();
export const {auth,handlers,signIn,signOut} = NextAuth({
    adapter:PrismaAdapter(prisma),
    session:{strategy:'jwt'},
    ...authConfig
})
