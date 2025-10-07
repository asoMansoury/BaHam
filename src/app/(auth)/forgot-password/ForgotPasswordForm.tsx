'use client';

import { generateResetPasswordEmail } from "@/app/actions/authActions";
import CardWrapper from "@/app/components/CardWrapper";
import ResultMessage from "@/app/components/ResultMessage";
import { ActionResult } from "@/types";
import { Button, Input } from "@heroui/react";
import { useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { GiPadlock } from "react-icons/gi";



export default function ForgotPasswordForm(){
    const [result,setResult] = useState<ActionResult<string> | null>(null);

    const {
        register,
        handleSubmit,
        reset,
        formState:{isSubmitting,isValid}
    } = useForm();

    const onSubmit = async (data:FieldValues) => {
        setResult(
            await generateResetPasswordEmail(data.email)
        );
        reset();
    }
    
    return (
        <CardWrapper
            headerIcon={GiPadlock}
            headerText="Forgot Password"
            subHeaderText="Enter your email to reset your password"
            body={
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="flex flex-col space-y-4"
                >
                    <Input
                        type="email"
                        placeholder="Email Address"
                        variant="bordered"
                        defaultValue=""
                        {
                            ...register("email",{
                                required:true
                            })
                        }
                    ></Input>
                    <Button
                        type="submit"
                        color="default"
                        isLoading={isSubmitting}
                        isDisabled={!isValid}
                    >
                        Send reset mail
                    </Button>
                </form>
            }
            footer={<ResultMessage result={result}></ResultMessage>}
        >
        </CardWrapper>
    )
}