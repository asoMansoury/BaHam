"use client";

import {
  profileSchema,
  registerSchema,
  RegisterSchema
} from "@/lib/schemas/RegisterSchema";
import {
  Card,
  CardHeader,
  CardBody,
  Button
} from "@heroui/react";
import React, { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { GiPadlock } from "react-icons/gi";
import { registerUser } from "@/app/actions/authActions";
import { toast } from "react-toastify";
import UserDetailsForm from "./UserDetailsForm";
import ProfileDetailsForm from "./ProfileDetailsForm";
import { handleFormServerErrors } from "@/app/utils/util";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
  const stepSchemas = [registerSchema,profileSchema];

export default function RegisterForm() {
  const [activeStep, setActiveStep] = React.useState(0);
  const currentValidationSchema = stepSchemas[activeStep];
  const registerFormMethods = useForm<RegisterSchema>({
    resolver:zodResolver(currentValidationSchema),
    mode: "onTouched",
    shouldUnregister: false,
  });
  const router = useRouter();
  const {
    handleSubmit,
    setError,
    formState: { errors,  isSubmitting },
  } = registerFormMethods;
  useEffect(() => {
    registerFormMethods.trigger();
  }, [activeStep, registerFormMethods]);

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return <UserDetailsForm />;
        case 1:
          return <ProfileDetailsForm />;
      default:
        throw new Error("Unknown step");
    }
  }

  const onSubmit = async (data: RegisterSchema) => {
    data = registerFormMethods.getValues();
    const result = await registerUser(data);
    if (result.status === "success") {
      toast.success("User registration successful");
      router.push("/register/success");
    } else {
      handleFormServerErrors(result, setError);
    }
  };

  const onBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  }

  const onNext = async (data: RegisterSchema) => {
    if (activeStep === stepSchemas.length - 1) {
      await onSubmit(data);
    } else {
      // Validate current step before moving to next
      const isStepValid = await registerFormMethods.trigger();
      if (isStepValid) {
        setActiveStep((prev) => prev + 1);
      }
    }
  }


  return (
    <Card className="w-3/5 mx-auto">
      <CardHeader className="flex flex-col items-center justify-center">
        <div className="flex flex-col gap-2 items-center text-default">
          <div className="flex flex-row items-center gap-3">
            <GiPadlock size={30} />
            <h1 className="text-3xl font-semibold">
              Register
            </h1>
          </div>
          <p className="text-neutral-500">
            Welcome to NextMatch
          </p>
        </div>
      </CardHeader>
      <CardBody>
      <FormProvider {...registerFormMethods}>
          <form onSubmit={handleSubmit(onNext)}>
            <div className="space-y-4">
              {getStepContent(activeStep)}
              {errors.root?.serverError && (
                <p className="text-danger text-sm">
                  {
                    errors.root.serverError
                      .message
                  }
                </p>
              )}
              <div className="flex flex-row items-center gap-6">
                {activeStep !== 0 && (
                  <Button
                    onPress={onBack}
                    fullWidth
                  >
                    Back
                  </Button>
                )}
                <Button
                  isLoading={isSubmitting}
                  //isDisabled={!isValid}
                  fullWidth
                  color="default"
                  type="submit"
                >
                  {activeStep ===
                  stepSchemas.length - 1
                    ? "Submit"
                    : "Continue"}
                </Button>
              </div>
            </div>
          </form>
        </FormProvider>
      </CardBody>
    </Card>
  );
}