"use client";

import { HeroUIProvider } from "@heroui/react"
import { ReactNode, useEffect } from "react"
import { ToastContainer } from "react-toastify"
import { usePresenceChannel } from "../hooks/usePresenceChannel"
import { useNotificationChannel } from "../hooks/useNotificationChannel";
import { SessionProvider } from "next-auth/react";

export type ProvidersType ={
    children:ReactNode,
    userId: string | null,
    profileComplete: boolean
}
export default function Providers({
    children,
    userId,
    profileComplete
}:ProvidersType){
    usePresenceChannel(userId,profileComplete);
    useNotificationChannel(userId,profileComplete);
    return <SessionProvider>
            <HeroUIProvider>
                <ToastContainer
                    position="bottom-right"
                    hideProgressBar
                ></ToastContainer>
                {children}
            </HeroUIProvider>
        </SessionProvider>
}
