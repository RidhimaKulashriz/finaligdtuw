import { useState } from "react";
import { Settings as SettingsIcon, User, Bell, Lock, Eye, Shield, Palette, Globe } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Separator } from "@/components/ui/separator";

const Settings = () => {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    weeklyDigest: true,
    starCursor: true,
    safeMode: true,
    twoFactor: false,
    profilePublic: false,
    shareActivity: false,
  });

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
    if (key === "starCursor") {
      localStorage.setItem("starCursor", (!settings.starCursor).toString());
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-heading font-bold mb-4 flex items-center gap-3">
            <SettingsIcon className="h-10 w-10 text-primary" />
            Settings
          </h1>
          <p className="text-xl text-muted-foreground">
            Manage your account and preferences
          </p>
        </div>

        {/* Profile Settings */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <User className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-heading font-semibold">Profile</h2>
          </div>
          
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" defaultValue="Sarah Johnson" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" defaultValue="sarah@example.com" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Input id="bio" placeholder="Tell us about yourself..." />
            </div>

            <Button className="rounded-full">Save Changes</Button>
          </div>
        </Card>

        {/* Notifications */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <Bell className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-heading font-semibold">Notifications</h2>
          </div>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Email Notifications</p>
                <p className="text-sm text-muted-foreground">Receive updates via email</p>
              </div>
              <Switch
                checked={settings.emailNotifications}
                onCheckedChange={() => toggleSetting("emailNotifications")}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Push Notifications</p>
                <p className="text-sm text-muted-foreground">Get real-time alerts</p>
              </div>
              <Switch
                checked={settings.pushNotifications}
                onCheckedChange={() => toggleSetting("pushNotifications")}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Weekly Digest</p>
                <p className="text-sm text-muted-foreground">Summary of your activity</p>
              </div>
              <Switch
                checked={settings.weeklyDigest}
                onCheckedChange={() => toggleSetting("weeklyDigest")}
              />
            </div>
          </div>
        </Card>

        {/* Security & Privacy */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <Lock className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-heading font-semibold">Security & Privacy</h2>
          </div>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Two-Factor Authentication</p>
                <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
              </div>
              <Switch
                checked={settings.twoFactor}
                onCheckedChange={() => toggleSetting("twoFactor")}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Safe Mode</p>
                <p className="text-sm text-muted-foreground">Blur sensitive content automatically</p>
              </div>
              <Switch
                checked={settings.safeMode}
                onCheckedChange={() => toggleSetting("safeMode")}
              />
            </div>

            <Separator />

            <div>
              <Button variant="outline" className="rounded-full">
                Change Password
              </Button>
            </div>
          </div>
        </Card>

        {/* Privacy Settings */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <Eye className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-heading font-semibold">Privacy</h2>
          </div>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Public Profile</p>
                <p className="text-sm text-muted-foreground">Make your profile visible to others</p>
              </div>
              <Switch
                checked={settings.profilePublic}
                onCheckedChange={() => toggleSetting("profilePublic")}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Share Activity</p>
                <p className="text-sm text-muted-foreground">Let others see your activity</p>
              </div>
              <Switch
                checked={settings.shareActivity}
                onCheckedChange={() => toggleSetting("shareActivity")}
              />
            </div>
          </div>
        </Card>

        {/* Appearance */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <Palette className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-heading font-semibold">Appearance</h2>
          </div>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Star Cursor</p>
                <p className="text-sm text-muted-foreground">Enable custom star cursor with trail</p>
              </div>
              <Switch
                checked={settings.starCursor}
                onCheckedChange={() => toggleSetting("starCursor")}
              />
            </div>

            <Separator />

            <div>
              <p className="font-medium mb-3">Theme</p>
              <div className="flex gap-3">
                <Button variant="outline" className="rounded-full">
                  <Globe className="mr-2 h-4 w-4" />
                  System
                </Button>
                <Button variant="outline" className="rounded-full">
                  ☀️ Light
                </Button>
                <Button variant="outline" className="rounded-full">
                  🌙 Dark
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Parental Controls (conditional) */}
        <Card className="p-6 bg-blue-500/10 border-blue-500/20">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="h-6 w-6 text-blue-500" />
            <h2 className="text-2xl font-heading font-semibold">Parental Controls</h2>
          </div>
          
          <p className="text-muted-foreground mb-4">
            Enhanced safety features for child accounts
          </p>
          
          <Button variant="outline" className="rounded-full">
            Manage Parental Controls
          </Button>
        </Card>

        {/* Danger Zone */}
        <Card className="p-6 bg-red-500/10 border-red-500/20">
          <h2 className="text-2xl font-heading font-semibold mb-6 text-red-500">
            Danger Zone
          </h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Export Data</p>
                <p className="text-sm text-muted-foreground">Download all your data</p>
              </div>
              <Button variant="outline" size="sm" className="rounded-full">
                Export
              </Button>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Delete Account</p>
                <p className="text-sm text-muted-foreground">Permanently delete your account</p>
              </div>
              <Button variant="destructive" size="sm" className="rounded-full">
                Delete
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
