import { CardBody, CardHeader, Divider } from '@heroui/react'
import React from 'react'

export default function page() {
  return (
    <>
      <CardHeader className='text-2xl font-semibold text-default'>
        Chat
      </CardHeader>
      <Divider></Divider>
      <CardBody>
        Chat goes here
      </CardBody>
    </>
  )
}
