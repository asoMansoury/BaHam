"use client";

import { HeroUIProvider } from "@heroui/react"
import { ReactNode, useEffect } from "react"
import { ToastContainer } from "react-toastify"
import { usePresenceChannel } from "../hooks/usePresenceChannel"

export type ProvidersType ={
    children:ReactNode
}
export default function Providers({
    children,
}:ProvidersType){
    usePresenceChannel();

    return <HeroUIProvider>
        <ToastContainer
            position="bottom-right"
            hideProgressBar
        ></ToastContainer>
        {children}
        </HeroUIProvider>
}
