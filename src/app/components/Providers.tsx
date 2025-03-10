import { HeroUIProvider } from "@heroui/react"
import { ReactNode } from "react"
import { ToastContainer } from "react-toastify"

export type ProvidersType ={
    children:ReactNode
}
export default function Providers({
    children,
}:ProvidersType){
    return <HeroUIProvider>
        <ToastContainer
            position="bottom-right"
            hideProgressBar
        ></ToastContainer>
        {children}
        </HeroUIProvider>
}