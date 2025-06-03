import { getAuthUserId } from '@/app/actions/authActions'
import { getMemberByUserId, getMemberPhotoNyUserId } from '@/app/actions/membersActions';
import MemberPhotoUpload from '@/app/components/MemberPhotoUpload';
import { CardBody, CardHeader, Divider } from '@heroui/react'
import React from 'react'

export default async function PhotosPage() {
  const userId = await getAuthUserId();
  const member = await getMemberByUserId(userId);
  const photos = await getMemberPhotoNyUserId(userId);
  return (
    <>
      <CardHeader className='flex flex-row justify-between items-center'>
        <div className='text-2xl font-semibold text-default'>
          Edit Profile
        </div>
      </CardHeader>
      <Divider></Divider>
      <CardBody>
        <MemberPhotoUpload></MemberPhotoUpload>
      </CardBody>
    </>
  )
}
