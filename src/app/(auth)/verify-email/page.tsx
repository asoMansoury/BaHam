import { verifyEmail } from "@/app/actions/authActions";
import CardWrapper from "@/app/components/CardWrapper";
import ResultMessage from "@/app/components/ResultMessage";
import { MdOutlineMailOutline } from "react-icons/md";

export default async function VerifyEmailPage({
    searchParams
}:{searchParams:{token:string};
}){
    const params =  await searchParams;
    const result = await verifyEmail(params.token);
    return (
        <CardWrapper
            headerText="Verify your email address"
            headerIcon={MdOutlineMailOutline}
            footer={<ResultMessage result={result}></ResultMessage>}
        >

        </CardWrapper>
    )
}