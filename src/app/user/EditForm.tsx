'use client'

import { updateMemberProfile } from '@/app/actions/userActions'
import { MembersDto } from '@/app/types/(auth)/LoginsResponseDto'
import { memberEditSchema, MemberEditSchema } from '@/lib/schemas/MemberEditSchema'
import { Button, Input, Textarea } from '@heroui/react'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'

import { useRouter } from "next/navigation";
import { handleFormServerErrors } from '@/app/utils/util'

type props = {
    member:MembersDto
}
export default function EditForm({member}:props) {
  const router = useRouter();
  const {register,
    handleSubmit,
    reset,
    setError,
    formState:{
      isValid,
      isDirty,
      isSubmitting,
      errors
    }
  }  = useForm<MemberEditSchema>({
    resolver:zodResolver(memberEditSchema),
    mode:"onTouched"
  })

  useEffect(()=>{
    if(member){
      reset({
        name:member.name,
        city:member.city,
        description:member.description,
        country:member.country
      })
    }
  },[member,reset]);


  const onSumbit =async (data:MemberEditSchema) =>{
    const nameUpdated = data.name != member.name;
    const result = await updateMemberProfile(data,nameUpdated);
    console.log({result});
    if(result.status = 'success'){
      toast.success("Profile updated successfully");
      router.refresh();
      reset({ ...data });
    }else{
      handleFormServerErrors(result as any,setError);
    }
  }

  return <form
        onSubmit={handleSubmit(onSumbit)}
        className='flex flex-col space-y-4'
  >
    <Input
      label="Name"
      variant='bordered'
      {...register("name")}
      defaultValue={member.name}
      isInvalid={!!errors.name}
      errorMessage={errors.name?.message}
    ></Input>
    <Textarea
      label="Description"
      variant='bordered'
      {...register("description")}
      defaultValue={member.description}
      isInvalid ={!!errors.description}
      errorMessage={errors.description?.message}
      minRows={6}
    ></Textarea>
    <div className='flex flex-row gap-3'>
      <Input
        label="city"
        variant='bordered'
        {...register("city")}
        defaultValue={member.city}
        isInvalid={!!errors.city}
        errorMessage={errors.city?.message}
      ></Input>
      <Input
        label="Country"
        variant='bordered'
        {...register("country")}
        defaultValue={member.country}
        isInvalid={!!errors.country}
        errorMessage={errors.country?.message}
      ></Input>
    </div>
    {errors.root?.serverError &&(
      <p className='text-danger text-sm'>
        {errors.root.serverError.message}
      </p>
    )}

    <Button
      type='submit'
      className='flex self-end'
      variant='solid'
      isDisabled={!isValid || !isDirty}
      color='secondary'
    >
      Update Profile
    </Button>
  </form>
}
