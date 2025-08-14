"use client";

import { HeroUIProvider } from "@heroui/react"
import { ReactNode, useEffect } from "react"
import { ToastContainer } from "react-toastify"
import { usePresenceChannel } from "../hooks/usePresenceChannel"
import { useNotificationChannel } from "../hooks/useNotificationChannel";

export type ProvidersType ={
    children:ReactNode,
    userId: string | null
}
export default function Providers({
    children,
    userId
}:ProvidersType){
    usePresenceChannel();
    useNotificationChannel(userId);
    return <HeroUIProvider>
        <ToastContainer
            position="bottom-right"
            hideProgressBar
        ></ToastContainer>
        {children}
        </HeroUIProvider>
}
