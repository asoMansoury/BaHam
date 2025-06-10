import CardInnerWrapper from '@/app/components/CardInnerWrapper'
import React from 'react'
import ChatForm from './ChatForm'

export default async function page() {
  return (
    <CardInnerWrapper 
      header="Chat" 
      body="Welcome To chat"
      footer={<ChatForm></ChatForm>}
      >
    </CardInnerWrapper>
  )
}
