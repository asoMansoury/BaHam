import React, { useCallback } from 'react'
import { getMessagesByContainer } from '../actions/messageActions'
import MessageSidebar from './MessageSidebar'
import MessageTable from './MessageTable'
import { MessageDto } from '../types/Messages/MessageDto';
import { getAuthUserId } from '../actions/authActions';

export default async function MessagePage({
  searchParams,
}:{searchParams:{container:string}}) {
  var awaitedParams = await searchParams;
  const messages = await getMessagesByContainer(awaitedParams.container);
  const user = await getAuthUserId();
  return (
    <div className='grid grid-cols-12 gap-5 h-[80vh] mt-10'>
      <div className='col-span-2'>
        <MessageSidebar />
      </div>
      <div className='col-span-10'>
        <MessageTable 
        userId={user}
        messages={messages} />
      </div>
    </div>
  )
}
