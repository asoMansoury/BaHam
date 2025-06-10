import { CardBody, CardFooter, CardHeader, Divider } from '@heroui/react';
import React, { ReactNode } from 'react'

type CardInnerWrapperProps = {
    header:ReactNode | string;
    body:ReactNode;
    footer?:ReactNode;
}
export default function CardInnerWrapper({
    header,
    body,
    footer
}:CardInnerWrapperProps) {
  return (
    <>
        <CardHeader>
            {typeof header === "string" ?(
                <div className='text-2xl font-semibold text-default'>
                    {header}
                </div>
            ):(
                <>{header}</>
            )}
        </CardHeader>
        <Divider></Divider>
        <CardBody className='flex-1 overflow-auto p-4'>{body}</CardBody>
        {footer && (
            <CardFooter className='flex'>{footer}</CardFooter>
        )}
    </>
  )
}
