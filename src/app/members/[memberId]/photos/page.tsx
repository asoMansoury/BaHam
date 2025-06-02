import { getMemberPhotoNyUserId } from '@/app/actions/membersActions'
import { CardBody, CardHeader, Divider, Image } from '@heroui/react'
import React from 'react'

type PhotosPageProps = {
  params:{
    userId:string
  }
}
export default async function PhotosPage({
  params,
}: {
  params: { userId: string };

}) {
   const awaitedParams = await params;
  const photos = await getMemberPhotoNyUserId(awaitedParams.userId);
  return (
    <>
      <CardHeader className='text-2xl font-semibold text-secondary-50'>
        Photos
      </CardHeader>
      <Divider></Divider>
      <CardBody>
        <div className='grid grid-col-5 gap-3'>
          {photos && 
            photos.map((photo)=>(
              <div key={photo.id}>
                <Image
                  src={photo.url}
                  alt="Image of member"
                  className='object-cover aspect-square'
                ></Image>
              </div>
            ))
          }
        </div>
      </CardBody>
    </>
  )
}
