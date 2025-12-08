import CTASection from "@/components/landing-page/CTASection";
import FAQSection from "@/components/landing-page/FAQSection";
import Features from "@/components/landing-page/Features";
import Hero from "@/components/landing-page/Hero";
import HowItWorks from "@/components/landing-page/HowItWorks";

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