import { SettingsForm } from "@/components/settings/SettingsForm";

export default function Page() {
    // 1. Define the initial settings object directly (or call the function once)
    const initialSettings = {
        // 2. Correct property names to match the expected type
        reminderDaysBefore: 3, // Changed from remainderDays
        emailReminders: true    // Changed from emailRemainders
    };

    return (
        // 3. Pass the object, not the function
        <SettingsForm initialSettings={initialSettings} />
    )
}