import CTASection from "@/components/CTASection";
import FAQSection from "@/components/FAQSection";
import Features from "@/components/Features";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";

export default function Page() {
    return (
        <div className="bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e]">
            <Hero />
            <Features />
            <HowItWorks />
            <CTASection />
            <FAQSection />
        </div>
    )
}