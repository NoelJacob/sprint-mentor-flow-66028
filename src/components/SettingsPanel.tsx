import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { useAppContext } from "@/contexts/AppContext";
import { Settings as SettingsIcon, Bell, Mail, MessageSquare, Zap } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export const SettingsPanel = () => {
  const { settings, updateSettings } = useAppContext();

  const handleFrequencyChange = (frequency: 'realtime' | 'daily' | 'weekly') => {
    updateSettings({ nudgeFrequency: frequency });
    toast.success(`Nudge frequency set to ${frequency}`);
  };

  const handleDeliveryToggle = (mode: 'in-app' | 'slack' | 'email') => {
    const newModes = settings.deliveryModes.includes(mode)
      ? settings.deliveryModes.filter(m => m !== mode)
      : [...settings.deliveryModes, mode];
    
    if (newModes.length === 0) {
      toast.error("At least one delivery mode must be enabled");
      return;
    }
    
    updateSettings({ deliveryModes: newModes });
    toast.success(`${mode} ${settings.deliveryModes.includes(mode) ? 'disabled' : 'enabled'}`);
  };

  const handleIntensityChange = (value: number[]) => {
    updateSettings({ notificationIntensity: value[0] });
  };

  return (
    <Card className="p-4 sm:p-6">
      <div className="flex items-center gap-2 mb-4 sm:mb-6">
        <SettingsIcon className="w-5 h-5" />
        <h3 className="text-base sm:text-lg font-semibold">Nudge Settings</h3>
      </div>

      <div className="space-y-6">
        {/* Frequency Settings */}
        <div>
          <Label className="text-xs sm:text-sm font-semibold mb-3 block">Nudge Frequency</Label>
          <div className="flex flex-wrap gap-2">
            {(['realtime', 'daily', 'weekly'] as const).map(freq => (
              <Button
                key={freq}
                variant={settings.nudgeFrequency === freq ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleFrequencyChange(freq)}
                className="text-xs capitalize"
              >
                {freq === 'realtime' && <Zap className="w-3 h-3 mr-1" />}
                {freq}
              </Button>
            ))}
          </div>
          <p className="text-[10px] sm:text-xs text-muted-foreground mt-2">
            {settings.nudgeFrequency === 'realtime' && 'Get nudges as events happen'}
            {settings.nudgeFrequency === 'daily' && 'Receive a daily digest of nudges'}
            {settings.nudgeFrequency === 'weekly' && 'Get a weekly summary report'}
          </p>
        </div>

        {/* Delivery Modes */}
        <div>
          <Label className="text-xs sm:text-sm font-semibold mb-3 block">Delivery Channels</Label>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-muted-foreground" />
                <Label htmlFor="in-app" className="text-xs sm:text-sm cursor-pointer">In-App Notifications</Label>
              </div>
              <Switch
                id="in-app"
                checked={settings.deliveryModes.includes('in-app')}
                onCheckedChange={() => handleDeliveryToggle('in-app')}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-muted-foreground" />
                <Label htmlFor="slack" className="text-xs sm:text-sm cursor-pointer">Slack Messages</Label>
                <Badge variant="secondary" className="text-[10px]">Simulate</Badge>
              </div>
              <Switch
                id="slack"
                checked={settings.deliveryModes.includes('slack')}
                onCheckedChange={() => handleDeliveryToggle('slack')}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <Label htmlFor="email" className="text-xs sm:text-sm cursor-pointer">Email Alerts</Label>
                <Badge variant="secondary" className="text-[10px]">Simulate</Badge>
              </div>
              <Switch
                id="email"
                checked={settings.deliveryModes.includes('email')}
                onCheckedChange={() => handleDeliveryToggle('email')}
              />
            </div>
          </div>
        </div>

        {/* Notification Intensity */}
        <div>
          <Label className="text-xs sm:text-sm font-semibold mb-3 block">
            Notification Intensity
          </Label>
          <div className="flex items-center gap-4">
            <Slider
              value={[settings.notificationIntensity]}
              onValueChange={handleIntensityChange}
              max={10}
              min={1}
              step={1}
              className="flex-1"
            />
            <Badge variant="outline" className="text-xs min-w-[3rem] justify-center">
              {settings.notificationIntensity}/10
            </Badge>
          </div>
          <p className="text-[10px] sm:text-xs text-muted-foreground mt-2">
            {settings.notificationIntensity <= 3 && 'Critical alerts only'}
            {settings.notificationIntensity > 3 && settings.notificationIntensity <= 7 && 'Balanced notifications'}
            {settings.notificationIntensity > 7 && 'All insights and suggestions'}
          </p>
        </div>

        {/* Category Toggles */}
        <div>
          <Label className="text-xs sm:text-sm font-semibold mb-3 block">Enabled Categories</Label>
          <div className="flex flex-wrap gap-2">
            {['team-health', 'blockers', 'velocity', 'engagement'].map(category => (
              <Badge
                key={category}
                variant={settings.enabledCategories.includes(category) ? 'default' : 'outline'}
                className="text-xs capitalize cursor-pointer"
                onClick={() => {
                  const newCategories = settings.enabledCategories.includes(category)
                    ? settings.enabledCategories.filter(c => c !== category)
                    : [...settings.enabledCategories, category];
                  updateSettings({ enabledCategories: newCategories });
                }}
              >
                {category}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};