import { IoMdArrowBack } from "react-icons/io";

export default function BackButton() {
    const handleBack = () => {
        history.back();
    }
    return (
        <button className="flex items-center" onClick={handleBack}>
            <IoMdArrowBack className="" />
        </button>
    )
}