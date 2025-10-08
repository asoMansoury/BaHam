import { Button } from "@heroui/react";
import { signIn } from "next-auth/react";
import { FaGithub, FaGoogle } from "react-icons/fa";

export default function SocialLogin(){

    const providers = [
        {
            name:'google',
            icon:<FaGoogle size={20}></FaGoogle>,
            text:"Google"
        },
        {
            name:"github",
            icon:<FaGithub size={20}></FaGithub>,
            text:"GitHub"
        }
    ];

    const onClick = (provider:"google" | "github") =>{
        signIn(provider, { callbackUrl: '/members' });
    };

    return(
        <div className="flex items-center w-full gap-2">
            {
                providers.map((provider)=>(
                    <Button
                        key={provider.name}
                        size="lg"
                        fullWidth
                        variant="bordered"
                        onPress={() => onClick(provider.name as "google" | "github")}
                    >
                        {provider.icon}
                    </Button>
                ))
            }
        </div>
    )

}