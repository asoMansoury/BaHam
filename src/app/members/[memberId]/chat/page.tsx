import CardInnerWrapper from '@/app/components/CardInnerWrapper'
import React from 'react'
import ChatForm from './ChatForm'
import { getMessageThread } from '@/app/actions/messageActions'
import { getAuthUserId } from '@/app/actions/authActions'
import MessageBox from './MessageBox'

type ChatPageProps = {
  userId:string
}
export default async function ChatPage({
  userId
}:ChatPageProps) {
  const messages = await getMessageThread(userId);
  
  const currentUserId = await getAuthUserId();

  const body = (
    <div>
      {
        messages.length === 0? (
          "No messages to display"
        ):(
          <div>
            {messages.map((message)=>(
              <MessageBox
                currentUserId={currentUserId}
                message={message}
             ></MessageBox>
            ))}
          </div>
        )
      }
    </div>
  )
  return (
    <CardInnerWrapper 
      header="Chat" 
      body={body}
      footer={<ChatForm></ChatForm>}
      >
    </CardInnerWrapper>
  )
}
