import { getAuthUserId } from '@/app/actions/authActions';
import { getMemberByUserId } from '@/app/actions/membersActions';
import { CardBody, CardHeader, Divider } from '@heroui/react';
import { notFound } from 'next/navigation';
import React from 'react';
import EditForm from './EditForm';
import { MembersDto } from '@/app/types/(auth)/LoginsResponseDto';

export default async function EditPage(){

    const userId = await getAuthUserId();

    const member = (await getMemberByUserId(userId) as any);

    if(!member) return notFound();
    return (
        <>
            <CardHeader className='text-2xl font-semibold text-default'>
                Edit Profile
            </CardHeader>
            <Divider></Divider>
            <CardBody>
                <EditForm member={member.data as MembersDto}></EditForm>
            </CardBody>
        </>
    )
}