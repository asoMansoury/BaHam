import { RegisterSchema } from "@/lib/schemas/RegisterSchema";
import { Input, Select, SelectItem, Textarea } from "@heroui/react";
import { subYears ,format} from "date-fns";
import { useController, useFormContext } from "react-hook-form";

export default function ProfileDetailsForm(){
    const {
        register,
        getValues,
        setValue,
        formState: { errors } } = useFormContext<RegisterSchema>();

    const { field: genderField } = useController({
        name: "gender",
        rules: { required: true }
    });

        const genderList= [
            {label:"Male",value:"male"},
            {label:"Female",value:"female"}
        ];

        return(
            <div className="space-y-4">
                <Select
                    label="Gender"
                    aria-label="Select gender"
                    variant="bordered"
                    selectedKeys={genderField.value ? [genderField.value] : []}
                    onSelectionChange={(keys) => genderField.onChange(Array.from(keys)[0])}
                    isInvalid={!!errors.gender}
                    errorMessage={
                        errors.gender?.message as string
                    }
                >
                    {genderList.map((item)=>(
                        <SelectItem
                            key={item.value}
                            value={item.value}
                        >
                            {item.label}
                        </SelectItem>
                    ))}
                </Select>
                <Input
                    defaultValue={getValues("dateOfBirth") || ""}
                    label="Date of Birth"
                    max={format(subYears(new Date(),18),"yyyy-MM-dd")}
                    type="date"
                    variant="bordered"
                    {...register("dateOfBirth")}
                    isInvalid={!!errors.dateOfBirth}
                    errorMessage={
                        errors.dateOfBirth?.message as string
                    }
                ></Input>
                <Textarea
                    defaultValue={getValues("description") || ""}
                    label="Description"
                    placeholder="Write something about yourself"
                    spellCheck="false"
                    data-gramm="false"
                    {...register("description")}
                    errorMessage={
                        errors.description?.message as string
                    }
                    isInvalid={!!errors.description}
                ></Textarea>
                <Input
                    defaultValue={getValues("city") || ""}
                    label="City"
                    placeholder="Enter your city"
                    variant="bordered"
                    {...register("city")}
                    isInvalid={!!errors.city}
                    errorMessage={
                        errors.city?.message as string
                    }
                ></Input>
                <Input
                    defaultValue={getValues("country") || ""}
                    label="Country"
                    placeholder="Enter your country"
                    variant="bordered"
                    {...register("country")}
                    isInvalid={!!errors.country}
                    errorMessage={
                        errors.country?.message as string
                    }
                ></Input>
            </div>
        )

}
