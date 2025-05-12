import { Spinner } from "@heroui/react"

type LoadingComponentProps = {
    label?:string
}
export default function LoadingComponent({
    label
}:LoadingComponentProps){
    return (
        <div className="fixed inset-0 flex justify-center items-center">
            <Spinner
                label={label || "Loading..."}
                color="default"
            ></Spinner>
        </div>
    )
}