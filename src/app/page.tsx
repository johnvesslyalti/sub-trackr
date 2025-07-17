import CTASection from "@/components/CTASection";
import FAQSection from "@/components/FAQSection";
import Features from "@/components/Features";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";

export default function Page() {
    return (
        <div>
            <Hero />
            <Features />
            <HowItWorks />
            <CTASection />
            <FAQSection />
        </div>
    )
}