import CardInnerWrapper from '@/app/components/CardInnerWrapper'
import React, { useEffect } from 'react'
import ChatForm from './ChatForm'
import { getMessageThread } from '@/app/actions/messageActions'
import { getAuthUserId } from '@/app/actions/authActions'
import MessageBox from './MessageBox'
import MessageList from './MessageList'
import { createChatId } from '@/lib/utils'

export default async function ChatPage({
  params,
}: {
  params: { memberId: string }
}) {
  var awaitedParams = await params;
  const userId = awaitedParams.memberId;
  const messages = await getMessageThread(userId);
  const currentUserId = await getAuthUserId();

  const chatId = createChatId(currentUserId, userId);
  return (
    <CardInnerWrapper 
      header="Chat" 
      body={<MessageList
        initialMessage={messages}
        currentUserId={currentUserId}
        chatId={chatId}
      ></MessageList>}
      footer={<ChatForm></ChatForm>}
      >
    </CardInnerWrapper>
  )
}
