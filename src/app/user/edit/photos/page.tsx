import { getAuthUserId } from '@/app/actions/authActions'
import { getMemberByUserId, getMemberPhotoNyUserId } from '@/app/actions/membersActions';
import CardInnerWrapper from '@/app/components/CardInnerWrapper';
import MemberPhotoUpload from '@/app/components/MemberPhotoUpload';
import { CardBody, CardHeader, Divider } from '@heroui/react'
import React from 'react'

export default async function PhotosPage() {
  const userId = await getAuthUserId();
  //const member = await getMemberByUserId(userId);
 // const photos = await getMemberPhotoNyUserId(userId);
  return (
    <>
        <CardInnerWrapper 
            header="Edit Profile" 
            body={
              <MemberPhotoUpload></MemberPhotoUpload>
            }>
        </CardInnerWrapper>
    </>
  )
}
