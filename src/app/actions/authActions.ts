'use server';

import { prisma } from '../../lib/prisma';
import { combinedRegisterSchema, ProfileSchema, registerSchema, RegisterSchema } from '../../lib/schemas/RegisterSchema';
import { ActionResult } from '../../types';
import bcrypt from "bcryptjs";

import { LoginSchema } from '../../lib/schemas/LoginSchemas';
import { auth, signIn ,signOut} from '@/auth';
import jwt from 'jsonwebtoken';
import { BaseResponseDto } from '../types/BaseResponseDto';
import { LoginResponseDto, RegisterResponseDto } from '../types/(auth)/LoginsResponseDto';
import { generateToken, getTokenByToekn } from '@/lib/token';
import { TokenType } from '@prisma/client';
import { sendPasswordResetEmail, sendVerificationEmail } from '@/lib/mail';


export async function signInUser(data: LoginSchema): Promise<ActionResult<LoginResponseDto>> {
    try {

        const existingUser = await getUserByEmail(data.email);

        if(!existingUser || !existingUser.email) return { status: 'error', error: 'Invalid credentials' };

        if(!existingUser.emailVerified){
            const {token,email} = await generateToken(existingUser.email,TokenType.VERIFY_EMAIL);

            //Send verification token
             await sendVerificationEmail(email,token);
            return { status: 'error', error: 'Please verify your email before logging in.' };
        }

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
        const validated = combinedRegisterSchema.safeParse(data);


        if (!validated.success) {
            return { status: "error", error: validated.error.errors }
        }

        const { name, email, password,gender,description,city,country,dateOfBirth } = validated.data;

        const hashPassword = await bcrypt.hash(password, 10);

        const existingUser = await prisma.user.findUnique({
            where: { email,is_active:true }
        });

        if (existingUser) return { status: 'error', error: "User already exists" };

        const user = await prisma.user.create({
            data: { 
                name, 
                email, 
                passwordHash: hashPassword },
        });
        const member = await prisma.member.create({
            data:{
                userId:user.id,
                country,
                city,
                dateOfBirth:new Date(dateOfBirth),
                description,
                gender,
                name : user.name
            }
        });

        const verification = await generateToken(email, TokenType.VERIFY_EMAIL);
        await sendVerificationEmail(verification.email,verification.token);
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


export async function verifyEmail(token:string):Promise<ActionResult<string>>{
    const existingtoken = await getTokenByToekn(token);
    if(!existingtoken){
        return {status:'error' , error:'Invalid token'}
    }

    const hasExpired = new Date() >existingtoken.expires;
    if(hasExpired){
        return {status:'error',error:'Token has expired'}
    }


    const existingUser=  await getUserByEmail(existingtoken.email);
    if(!existingUser){
        return {status:'error',error:'User not found'}
    }

    await prisma.user.update({
        where:{id:existingUser.id},
        data:{emailVerified:new Date()}
    });

    await prisma.token.delete({where:{id:existingtoken.id}});

    return {status:'success', data:'Success'};
}

export async function generateResetPasswordEmail(email:string):Promise<ActionResult<string>>{
    try{
        const existingUser = await getUserByEmail(email);
        if(!existingUser){
            return {status:'error', error:'Email not found'};
        }

        const token = await generateToken(email,TokenType.RESET_PASSWORD);

        await sendPasswordResetEmail(email,token.token);

        return {status:'success', data:'Password reset email sent'};
    }catch(error){
        console.log(error);
        return {status:'error', error:'Something went wrong'};
    }
}


export async function resetPassword(newPassword:string,token:string | null):Promise<ActionResult<string>>{
    if (!token) return { status: 'error', error: 'Token is required' };

    const existingToken = await getTokenByToekn(token);
    if(!existingToken){
        return {status:'error', error:'Invalid token'};
    }

    const hasExpired = new Date() > existingToken.expires;
    if(hasExpired){
        return {status:'error', error:'Token has expired'};
    }

    const existingUser = await getUserByEmail(existingToken.email);
    if(!existingUser){
        return {status:'error', error:'User not found'};
    }

    const hashPassword = await bcrypt.hash(newPassword,10);

    await prisma.user.update({
        where:{id:existingUser.id},
        data:{passwordHash:hashPassword}
    });

    await prisma.token.delete({where:{id:existingToken.id}});

    return {status:'success', data:'Password has been reset successfully'};
}


export async function completeSocialLoginProfile(data:ProfileSchema):Promise<ActionResult<string>>{
    const session = await auth();
    if(!session?.user) return {status:'error', error:'User not found'};

    const user = await prisma.user.update({
        where:{id:session.user.id},
        data:{
            profileComplete:true,
            member:{
                create:{
                    name:session.user.name as string,
                    image:session.user.image,
                    gender:data.gender,
                    description:data.description,
                    city:data.city,
                    country:data.country,
                    dateOfBirth:new Date(data.dateOfBirth)
                }
            }
        },
        select:{
            accounts:{
                select:{
                    provider:true
                }
            }
        }
    });
    return {status:'success', data:user.accounts[0].provider}
}
