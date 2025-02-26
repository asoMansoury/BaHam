'use server';

import { prisma } from '../../lib/prisma';
import { registerSchema, RegisterSchema } from '../../lib/schemas/RegisterSchema';
import { ActionResult } from '../../types';
import bcrypt from "bcryptjs";

import { LoginSchema } from '../../lib/schemas/LoginSchemas';
import { signIn } from '@/auth';
import { User } from '@prisma/client';



export async function signInUser(data: LoginSchema): Promise<ActionResult<string>> {
    try {
        const result = await signIn('credentials', {
            email: data.email,
            password: data.password,
            redirect: false
        });
        
        if (result?.error) {
            return { status: 'error', error: result.error };
        }

        return { status: 'success', data: 'Logged in successfully' };
    } catch (error) {
        console.error(error);
        return { status: 'error', error: 'Invalid credentials' };
    }
}

export async function registerUser(data: RegisterSchema): Promise<ActionResult<User>> {
    try {
        const validated = registerSchema.safeParse(data);

        if (!validated.success) {
            return { status: "error", error: validated.error.errors }
        }

        const { name, email, password } = validated.data;

        const hashPassword = await bcrypt.hash(password, 10);

        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) return { status: 'error', error: "User already exists" };

        const user = await prisma.user.create({
            data: { name, email, passwordHash: hashPassword },
        });

        return { status: 'success', data: user }
    } catch (error) {
        console.log(error);
        return { status: 'error', error: "Something went wrong" };
    }
}

export async function getUserByEmail(email: string) {
    return prisma.user.findUnique({ where: { email: email } });
}
