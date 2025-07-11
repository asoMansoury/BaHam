import { differenceInYears, formatDistance } from 'date-fns';


import { FieldValues, Path, UseFormSetError } from 'react-hook-form';


import { ZodIssue } from 'zod';



export function calculateAge(dob: Date) {

    return differenceInYears(new Date(), dob);


}

export function generateUniqueFilename(extension: string) {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000);
  return `${timestamp}_${random}.${extension}`;
}



export function handleFormServerErrors<TFieldValues extends FieldValues>(


    errorResponse: { error: string | ZodIssue[] },


    setError: UseFormSetError<TFieldValues>


) {


    if (Array.isArray(errorResponse.error)) {


        errorResponse.error.forEach((e) => {


            const fieldName = e.path.join('.') as Path<TFieldValues>


            setError(fieldName, { message: e.message })


        })


    } else {


        setError('root.serverError', { message: errorResponse.error });


    }

}

export function truncateString(text?: string | null, num = 50) {
    if (!text) return null;
    if (text.length <= num) {
        return text;
    }
    return text.slice(0, num) + '...';
}

export function timeAgo(date:string){
    return formatDistance(new Date(date),new Date())+' ago';
}