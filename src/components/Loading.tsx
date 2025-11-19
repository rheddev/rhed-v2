import { LoaderCircle } from "lucide-react"

export const Loading = () => {
    return (
        <div className="w-full h-full flex items-center justify-center">
            <LoaderCircle className="animate-spin" size={32} />
        </div>
    )
}