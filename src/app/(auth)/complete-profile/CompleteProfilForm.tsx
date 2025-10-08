"use client";

import CardWrapper from "@/app/components/CardWrapper";
import { profileSchema, ProfileSchema } from "@/lib/schemas/RegisterSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { FormProvider, useForm } from "react-hook-form"
import {RiProfileLine} from 'react-icons/ri'
import ProfileDetailsForm from "../register/ProfileDetailsForm";
import { Button } from "@heroui/react";
import { completeSocialLoginProfile } from "@/app/actions/authActions";
export default function CompleteProfilForm() {
    const methods = useForm<ProfileSchema>({
        resolver:zodResolver(profileSchema),
        mode:"onTouched"
    });

    const { handleSubmit,
        formState:{errors,isSubmitting,isValid} 
    } = methods;

    const onSubmit = async (data:ProfileSchema) => {
        const result = await completeSocialLoginProfile(data);

        if(result.status === 'success' && result.data) {
            signIn(result.data,{
                callbackUrl:"/members"
            });
        }
    }
    return <CardWrapper
        headerText="About you"
        subHeaderText="Please complete your profile"
        headerIcon={RiProfileLine}
        body={
            <FormProvider {...methods}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="space-y-4">
                        <ProfileDetailsForm></ProfileDetailsForm>
                        {errors.root?.serverError &&(
                            <p className="text-red-600 text-sm">
                                {
                                    errors.root?.serverError
                                                .message
                                }
                            </p>
                        )}
                        <div className="flex flex-row items-center gap-6">
                            <Button
                                isLoading={isSubmitting}
                                type="submit"
                                isDisabled={!isValid}
                                fullWidth
                                color="default"

                            >
                                Submit
                            </Button>
                        </div>
                    </div>
                </form>
            </FormProvider>
        }
    ></CardWrapper>
}