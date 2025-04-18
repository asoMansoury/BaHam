'use server';

import { prisma } from '../../lib/prisma';
import { registerSchema, RegisterSchema } from '../../lib/schemas/RegisterSchema';
import { ActionResult } from '../../types';
import bcrypt from "bcryptjs";

import { LoginSchema } from '../../lib/schemas/LoginSchemas';
import { auth, signIn ,signOut} from '@/auth';
import { User } from '@prisma/client';
import jwt from 'jsonwebtoken';
import { BaseResponseDto } from '../types/BaseResponseDto';
import { LoginResponseDto, RegisterResponseDto } from '../types/(auth)/LoginsResponseDto';


export async function signInUser(data: LoginSchema): Promise<ActionResult<LoginResponseDto>> {
    try {
        const result = await signIn('credentials', {
            email: data.email,
            password: data.password,
            redirect: false
        });
        
        if (result?.error) {
            return { status: 'error', error: result.error };
        }

        const token = jwt.sign({ email: data.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

        var bodyResponse = {
            token:token
        } as LoginResponseDto;

        return { status: 'success', data: bodyResponse }
    } catch (error) {
        console.error(error);
        return { status: 'error', error: 'Invalid credentials' };
    }
}

export async function registerUser(data: RegisterSchema): Promise<ActionResult<RegisterResponseDto>> {
    try {
        const validated = registerSchema.safeParse(data);


        if (!validated.success) {
            return { status: "error", error: validated.error.errors }
        }

        const { name, email, password } = validated.data;

        const hashPassword = await bcrypt.hash(password, 10);

        const existingUser = await prisma.user.findUnique({
            where: { email,is_active:true }
        });

        if (existingUser) return { status: 'error', error: "User already exists" };

        const user = await prisma.user.create({
            data: { name, email, passwordHash: hashPassword },
        });

        var bodyResponse = {
            email:user.email,
            name:user.name,
            id:user.id
        } as RegisterResponseDto;

        return { status: 'success', data: bodyResponse }
    } catch (error) {
        console.log(error);
        return { status: 'error', error: "Something went wrong" };
    }
}

export async function signOutUser() {
    await signOut({ redirectTo: '/' });
}



export async function getUserByEmail(email: string) {
    return prisma.user.findUnique({ where: { email: email,is_active:true } });
}

export async function getAuthUserId(){
    const session = await auth();
    const userId= session?.user?.id;
    
    if(!userId) throw new Error("Unauthorised");

    return userId;
}