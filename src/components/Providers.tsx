import { HeroUIProvider } from "@heroui/react"
import { ReactNode } from "react"

export type ProvidersType ={
    children:ReactNode
}
export default function Providers({
    children,
}:ProvidersType){
    return <HeroUIProvider>{children}</HeroUIProvider>
}