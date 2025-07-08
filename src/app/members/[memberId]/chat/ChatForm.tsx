"use client"

import { createMessage } from '@/app/actions/messageActions';
import { handleFormServerErrors } from '@/app/utils/util';
import { messageSchema,MessageSchema } from '@/lib/schemas/MessageSchema'
import { Button, Input } from '@heroui/react';
import { zodResolver } from '@hookform/resolvers/zod'
import { useParams, useRouter } from 'next/navigation';
import React from 'react'
import { useForm } from 'react-hook-form';
import { HiPaperAirplane } from 'react-icons/hi2';

export default function ChatForm() {
    const params = useParams<{memberId:string}>();
    const router = useRouter();
    const {
        register,
        handleSubmit,
        reset,
        setError,
        setFocus,
        formState: {isSubmitting, isValid, errors },
        } = useForm<MessageSchema>({
        resolver: zodResolver(messageSchema),
        });

    const onSubmit = async(
        data:MessageSchema
    ) =>{
        const result = await createMessage(
            params.memberId,
            data
        );
        if(result.status === "error")
        {
            handleFormServerErrors(result,setError)
        }else{
            reset();
            router.refresh();
        }

    }
  return (
    <form
        onSubmit={handleSubmit(onSubmit)}
        className='w-full'
    >
        <div className='flex items-center gap-2'>
            <Input
                fullWidth
                placeholder='Type a message'
                variant='faded'
                {...register("text")}
                isInvalid={!!errors.text}
                errorMessage={errors.text?.message}
            ></Input>
            <Button
                type='submit'
                isIconOnly
                color='default'
                radius='full'
                isLoading={isSubmitting}
                isDisabled={!isValid || isSubmitting}
            >
                <HiPaperAirplane size={18}></HiPaperAirplane>
            </Button>
        </div>
        <div className='flex flex-col'>
            {errors.root?.serverError &&(
                <p className='text-danger text-sm'>
                    {errors.root?.serverError.message}
                </p>
            )}
        </div>
    </form>
  )
}
 