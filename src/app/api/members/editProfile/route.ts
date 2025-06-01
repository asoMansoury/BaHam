import { getUserByEmail } from "@/app/actions/authActions";
import { updateMemberProfileFunc } from "@/app/actions/userActions";
import { apiAuth, apiTokenEmail } from "@/app/middleware/apiAuth";
import { EditProfileRequestDto } from "@/app/types/Api/Request/Member/EditProfile";
import RequestDtoInvalidException from "@/app/utils/exceptions/RequestDtoInvalidException";
import { memberEditSchema } from "@/lib/schemas/MemberEditSchema";
import { NextResponse } from "next/server";
import { handleError } from "@/app/utils/errorHandler";

export async function PATCH(request:Request){
    try {
        const authResponse = apiAuth(request);
        if (authResponse) return authResponse; // Return the response if token is invalid

        const email = apiTokenEmail(request);//Fetch email of requester
        const userData = await getUserByEmail(email); //Get details of user by email

        const body = await request.json();
        const validated = memberEditSchema.safeParse(body);
        if (!validated.success) 
                    return NextResponse.json({message:"Invalid body request",status:400});

        var params = validated.data as EditProfileRequestDto;
        var result = await updateMemberProfileFunc(params,userData);
        
        return NextResponse.json(result);
    } catch (error) {
        return handleError(error);
    }
}
