import { getAuthUserId } from '@/app/actions/authActions';
import { getMemberByUserId } from '@/app/actions/membersActions';
import { CardBody, CardHeader, Divider } from '@heroui/react';
import { notFound } from 'next/navigation';
import React from 'react';
import EditForm from './EditForm';
import { MembersDto } from '@/app/types/(auth)/LoginsResponseDto';
import CardInnerWrapper from '../components/CardInnerWrapper';

export default async function EditPage(){

    const userId = await getAuthUserId();

    const member = (await getMemberByUserId(userId) as any);

    if(!member) return notFound();
    return (
        <CardInnerWrapper 
            header="Edit Profile" 
            body={
                <EditForm member={member.data as MembersDto}></EditForm>
            }>
        </CardInnerWrapper>
    )
}