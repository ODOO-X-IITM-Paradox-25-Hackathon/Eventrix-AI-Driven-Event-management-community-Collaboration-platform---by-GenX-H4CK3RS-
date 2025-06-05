
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Cookie, Settings, X, Check } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const CookieConsent = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState({
    necessary: true, // Always true, can't be disabled
    analytics: false,
    marketing: false,
    functional: false,
  });

  useEffect(() => {
    // Check if user has already made a choice
    const cookieConsent = localStorage.getItem('cookieConsent');
    if (!cookieConsent) {
      setShowBanner(true);
    } else {
      const savedPreferences = JSON.parse(cookieConsent);
      setPreferences(savedPreferences);
    }
  }, []);

  const acceptAllCookies = () => {
    const allAccepted = {
      necessary: true,
      analytics: true,
      marketing: true,
      functional: true,
    };
    setPreferences(allAccepted);
    localStorage.setItem('cookieConsent', JSON.stringify(allAccepted));
    localStorage.setItem('cookieConsentDate', new Date().toISOString());
    setShowBanner(false);
    console.log('All cookies accepted');
  };

  const rejectOptionalCookies = () => {
    const onlyNecessary = {
      necessary: true,
      analytics: false,
      marketing: false,
      functional: false,
    };
    setPreferences(onlyNecessary);
    localStorage.setItem('cookieConsent', JSON.stringify(onlyNecessary));
    localStorage.setItem('cookieConsentDate', new Date().toISOString());
    setShowBanner(false);
    console.log('Only necessary cookies accepted');
  };

  const saveCustomPreferences = () => {
    localStorage.setItem('cookieConsent', JSON.stringify(preferences));
    localStorage.setItem('cookieConsentDate', new Date().toISOString());
    setShowBanner(false);
    setShowSettings(false);
    console.log('Custom cookie preferences saved:', preferences);
  };

  const updatePreference = (key: string, value: boolean) => {
    if (key === 'necessary') return; // Can't disable necessary cookies
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }));
  };

  if (!showBanner) return null;

  return (
    <>
      {/* Cookie Banner */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-lg z-50 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div className="flex items-start gap-3 flex-1">
              <Cookie className="h-6 w-6 text-eventrix mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                  🍪 We use cookies to enhance your experience
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                  We use cookies and similar technologies to provide essential website functionality, 
                  analyze usage patterns, and improve your experience on Eventrix. You can customize 
                  your preferences or accept all cookies.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 lg:flex-shrink-0">
              <Button
                variant="outline"
                size="sm"
                onClick={rejectOptionalCookies}
                className="text-gray-600 hover:text-gray-800"
              >
                Reject Optional
              </Button>
              
              <Dialog open={showSettings} onOpenChange={setShowSettings}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-1">
                    <Settings className="h-4 w-4" />
                    Customize
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <Cookie className="h-5 w-5 text-eventrix" />
                      Cookie Preferences
                    </DialogTitle>
                    <DialogDescription>
                      Choose which cookies you want to allow. You can change these settings at any time.
                    </DialogDescription>
                  </DialogHeader>

                  <div className="space-y-6">
                    {/* Necessary Cookies */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-gray-100">
                            Necessary Cookies
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            Required for basic website functionality, authentication, and security.
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">Always Active</Badge>
                          <Switch checked={true} disabled />
                        </div>
                      </div>
                    </div>

                    <Separator />

                    {/* Analytics Cookies */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-gray-100">
                            Analytics Cookies
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            Help us understand how you use our website to improve performance.
                          </p>
                        </div>
                        <Switch
                          checked={preferences.analytics}
                          onCheckedChange={(checked) => updatePreference('analytics', checked)}
                        />
                      </div>
                    </div>

                    <Separator />

                    {/* Functional Cookies */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-gray-100">
                            Functional Cookies
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            Enable enhanced features like preferences, chat history, and personalization.
                          </p>
                        </div>
                        <Switch
                          checked={preferences.functional}
                          onCheckedChange={(checked) => updatePreference('functional', checked)}
                        />
                      </div>
                    </div>

                    <Separator />

                    {/* Marketing Cookies */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-gray-100">
                            Marketing Cookies
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            Used to show you relevant events and personalized recommendations.
                          </p>
                        </div>
                        <Switch
                          checked={preferences.marketing}
                          onCheckedChange={(checked) => updatePreference('marketing', checked)}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-4">
                    <Button variant="outline" onClick={() => setShowSettings(false)}>
                      Cancel
                    </Button>
                    <Button onClick={saveCustomPreferences} className="gap-1">
                      <Check className="h-4 w-4" />
                      Save Preferences
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>

              <Button 
                onClick={acceptAllCookies}
                className="bg-eventrix hover:bg-eventrix-hover text-white gap-1"
                size="sm"
              >
                <Check className="h-4 w-4" />
                Accept All
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CookieConsent;
