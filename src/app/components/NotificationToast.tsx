import Image from "next/image";
import Link from "next/link";
import { MessageDto } from "../types/Messages/MessageDto";
import { toast } from "react-toastify";

type NotificationToastProps = {
    image?: string | null;
    href:string;
    title: string;
    subtitle?: string;
}

function NotificationToast({ image, href, title, subtitle }: NotificationToastProps) {
   return  <Link
        href={href}
        className="flex items-center"
    >
        <div className="mr-2">
            <Image 
                src={image || "/images/user.png"}
                height={50}
                width={50}
                alt="Notification Image"
            >
            </Image>
        </div>
        <div className="flex flex-grow flex-col justify-center">
            <div className="font-semibold">
                {title}
            </div>
            <div className="text-sm">
                {subtitle || "Click to view"}
            </div>
        </div>
    </Link>
}

export const newMessageToast = (message:MessageDto) =>{
    toast(
        <NotificationToast 
            image={message.senderImage}
            href={`/members/${message.senderId}/chat`}
            title={message.senderName || "New Message"}
        />
    )
}


export const newLikeToast = (
    name:string,
    image: string | null,
    userId: string
) =>{
    toast(
        <NotificationToast 
            image={image}
            href={`/members/${userId}`}
            title={'You have been liked by ' + name}
            subtitle="Click here to view their profile!"
        />
    )
}