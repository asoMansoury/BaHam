import { Spinner } from '@heroui/react'
import React from 'react'

export default function Loading() {
  return (
    <div className='flex justify-center items-center cursor-vertical-text'>
        <Spinner
            label='Loading...'
            color='default'
        >

        </Spinner>
    </div>
  )
}
