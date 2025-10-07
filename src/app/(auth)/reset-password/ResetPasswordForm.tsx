'use client'

import { resetPassword } from "@/app/actions/authActions";
import CardWrapper from "@/app/components/CardWrapper";
import ResultMessage from "@/app/components/ResultMessage";
import { resetPasswordSchema, ResetPasswordSchema } from "@/lib/schemas/ForgotPasswordSchema";
import { ActionResult } from "@/types";
import { Button, Input } from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { isValid } from "date-fns";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { GiPadlock } from "react-icons/gi";

export default function ResetPasswordForm(){

    const searchParams = useSearchParams();
    const [result, setResult] = 
     useState<ActionResult<string> | null>(null);

     const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
     } = useForm<ResetPasswordSchema>({
        mode:'onTouched',
        resolver:zodResolver(resetPasswordSchema)
     });

     const onSubmit = async(data:ResetPasswordSchema) =>{
        const token = searchParams.get('token');
        const res = await resetPassword(data.password, token);
        setResult(res);

        reset();
     }

     return (
        <CardWrapper
            headerIcon={GiPadlock}
            headerText="Reset Password"
            subHeaderText="Please enter your new password"
            body ={
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="flex flex-col space-y-4"
                >
                    <Input
                        type="password"
                        placeholder="Password"
                        variant="bordered"
                        defaultValue=""
                        {...register('password')}
                        isInvalid={!!errors.password}
                        errorMessage={errors.password?.message}
                    ></Input>

                    <Input
                        type="password"
                        placeholder="Confirm Password"
                        variant="bordered"
                        defaultValue=""
                        {...register('confirmPassword')}
                        isInvalid={!!errors.confirmPassword}
                        errorMessage={errors.confirmPassword?.message}
                    ></Input>

                    <Button
                        type="submit"
                        color="default"
                        isLoading={isSubmitting}
                        disabled={!isValid}
                    >
                        Reset Password
                    </Button>
                </form>
            }
            footer={<ResultMessage result={result} />}
        >

        </CardWrapper>
     )
}