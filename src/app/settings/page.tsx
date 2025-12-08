import { SettingsForm } from "@/components/settings/SettingsForm";
import { getNotificationSettings } from "@/server/settings/queries";

export default async function SettingsPage() {
    const settings = await getNotificationSettings();

    return (
        <div className="space-y-6 p-8">
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-foreground">
                    Settings
                </h1>
                <p className="text-muted-foreground">
                    Control how and when you receive subscription reminders.
                </p>
            </div>

            <SettingsForm initialSettings={settings} />
        </div>
    );
}

