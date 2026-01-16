'use client';

import { useState } from 'react';
import { Navbar, Footer } from '@/components';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Button,
  Input,
  Switch,
  Select,
  Divider,
  Alert,
} from '@/components/ui';
import { useLocalStorage } from '@/hooks';

interface UserSettings {
  notifications: {
    tips: boolean;
    subscriptions: boolean;
    streaks: boolean;
    email: boolean;
  };
  display: {
    theme: 'dark' | 'light' | 'system';
    currency: 'ETH' | 'USD';
    compact: boolean;
  };
  privacy: {
    showActivity: boolean;
    showEarnings: boolean;
    allowTips: boolean;
  };
  creator: {
    minTip: string;
    message: string;
  };
}

const DEFAULT_SETTINGS: UserSettings = {
  notifications: {
    tips: true,
    subscriptions: true,
    streaks: true,
    email: false,
  },
  display: {
    theme: 'dark',
    currency: 'ETH',
    compact: false,
  },
  privacy: {
    showActivity: true,
    showEarnings: false,
    allowTips: true,
  },
  creator: {
    minTip: '0.001',
    message: 'Thanks for supporting my work!',
  },
};

export default function SettingsPage() {
  const [settings, setSettings] = useLocalStorage<UserSettings>('tipstream-settings', DEFAULT_SETTINGS);
  const [saved, setSaved] = useState(false);

  const updateSetting = <K extends keyof UserSettings>(
    category: K,
    key: keyof UserSettings[K],
    value: UserSettings[K][keyof UserSettings[K]]
  ) => {
    setSettings((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value,
      },
    }));
    setSaved(false);
  };

  const handleSave = () => {
    // Settings are auto-saved to localStorage, but we can trigger any API calls here
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleReset = () => {
    setSettings(DEFAULT_SETTINGS);
    setSaved(false);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900/20 to-gray-900">
      <Navbar />

      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
          <p className="text-gray-400">Manage your TipStream preferences</p>
        </div>

        {saved && (
          <Alert variant="success" className="mb-6" dismissible>
            Settings saved successfully!
          </Alert>
        )}

        <div className="space-y-6">
          {/* Notifications */}
          <Card variant="default" padding="lg">
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>Choose what you want to be notified about</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Switch
                checked={settings.notifications.tips}
                onChange={(checked) => updateSetting('notifications', 'tips', checked)}
                label="Tip notifications"
                description="Get notified when you receive a tip"
              />
              <Switch
                checked={settings.notifications.subscriptions}
                onChange={(checked) => updateSetting('notifications', 'subscriptions', checked)}
                label="Subscription notifications"
                description="Get notified about new subscribers"
              />
              <Switch
                checked={settings.notifications.streaks}
                onChange={(checked) => updateSetting('notifications', 'streaks', checked)}
                label="Streak reminders"
                description="Remind me to check in daily"
              />
              <Divider />
              <Switch
                checked={settings.notifications.email}
                onChange={(checked) => updateSetting('notifications', 'email', checked)}
                label="Email notifications"
                description="Receive notifications via email"
              />
            </CardContent>
          </Card>

          {/* Display */}
          <Card variant="default" padding="lg">
            <CardHeader>
              <CardTitle>Display</CardTitle>
              <CardDescription>Customize how TipStream looks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Select
                label="Theme"
                value={settings.display.theme}
                onChange={(value) => updateSetting('display', 'theme', value as 'dark' | 'light' | 'system')}
                options={[
                  { value: 'dark', label: 'Dark' },
                  { value: 'light', label: 'Light' },
                  { value: 'system', label: 'System' },
                ]}
              />
              <Select
                label="Currency Display"
                value={settings.display.currency}
                onChange={(value) => updateSetting('display', 'currency', value as 'ETH' | 'USD')}
                options={[
                  { value: 'ETH', label: 'ETH' },
                  { value: 'USD', label: 'USD' },
                ]}
              />
              <Switch
                checked={settings.display.compact}
                onChange={(checked) => updateSetting('display', 'compact', checked)}
                label="Compact mode"
                description="Use a more condensed layout"
              />
            </CardContent>
          </Card>

          {/* Privacy */}
          <Card variant="default" padding="lg">
            <CardHeader>
              <CardTitle>Privacy</CardTitle>
              <CardDescription>Control your privacy settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Switch
                checked={settings.privacy.showActivity}
                onChange={(checked) => updateSetting('privacy', 'showActivity', checked)}
                label="Show activity"
                description="Allow others to see your tipping activity"
              />
              <Switch
                checked={settings.privacy.showEarnings}
                onChange={(checked) => updateSetting('privacy', 'showEarnings', checked)}
                label="Show earnings"
                description="Display your earnings publicly"
              />
              <Switch
                checked={settings.privacy.allowTips}
                onChange={(checked) => updateSetting('privacy', 'allowTips', checked)}
                label="Accept tips"
                description="Allow others to send you tips"
              />
            </CardContent>
          </Card>

          {/* Creator Settings */}
          <Card variant="default" padding="lg">
            <CardHeader>
              <CardTitle>Creator Settings</CardTitle>
              <CardDescription>Configure your creator profile</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                label="Minimum tip amount (ETH)"
                type="number"
                value={settings.creator.minTip}
                onChange={(e) => updateSetting('creator', 'minTip', e.target.value)}
                placeholder="0.001"
                hint="Minimum amount others can tip you"
              />
              <Input
                label="Thank you message"
                value={settings.creator.message}
                onChange={(e) => updateSetting('creator', 'message', e.target.value)}
                placeholder="Thanks for your support!"
                hint="Shown to tippers after they send a tip"
              />
            </CardContent>
          </Card>

          {/* Actions */}
          <Card variant="default" padding="lg">
            <CardContent className="flex flex-col sm:flex-row gap-4 justify-between">
              <Button variant="outline" onClick={handleReset}>
                Reset to Defaults
              </Button>
              <Button variant="primary" onClick={handleSave}>
                Save Settings
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </main>
  );
}
