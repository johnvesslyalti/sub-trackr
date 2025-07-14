import Features from "@/components/Features";
import Hero from "@/components/Hero";

export default function Page() {
    return (
        <div className="bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-white">
            <Hero />
            <Features />
        </div>
    )
}