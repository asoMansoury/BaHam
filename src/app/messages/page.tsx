import React from 'react'
import { getMessagesByContainer } from '../actions/messageActions'
import MessageSidebar from './MessageSidebar'
import MessageTable from './MessageTable'

export default async function MessagePage({
  searchParams,
}:{searchParams:{container:string}}) {
  var awaitedParams = await searchParams;
  const messages = await getMessagesByContainer(awaitedParams.container);
  return (
    <div className='grid grid-cols-12 gap-5 h-[80vh] mt-10'>
      <div className='col-span-2'>
        <MessageSidebar />
      </div>
      <div className='col-span-10'>
        <MessageTable messages={messages} />
      </div>
    </div>
  )
}
