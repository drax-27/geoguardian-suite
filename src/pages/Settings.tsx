import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Settings as SettingsIcon, Bell, Shield, Database, 
  Mail, Phone, Globe, Key, AlertTriangle, Save
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';

export default function Settings() {
  const { user, hasRole } = useAuth();
  const [isSaving, setIsSaving] = useState(false);

  // Settings state
  const [alertSettings, setAlertSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    criticalOnly: false,
    escalationTime: 10,
  });

  const [thresholds, setThresholds] = useState({
    lowRisk: 40,
    highRisk: 70,
    displacementAlert: 0.02,
    debounceWindow: 10,
  });

  const [integrations, setIntegrations] = useState({
    mapbox: { enabled: true, token: 'pk.xxx...xxx' },
    twilio: { enabled: false, token: '' },
    sendgrid: { enabled: true, token: 'SG.xxx...xxx' },
  });

  const handleSave = async (section: string) => {
    setIsSaving(true);
    // In real app, this would call the API
    console.log(`Saving ${section} settings...`);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-2">
          Configure system preferences and integrations
        </p>
      </div>

      <Tabs defaultValue="notifications" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="thresholds">Risk Thresholds</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
        </TabsList>

        {/* Notifications Tab */}
        <TabsContent value="notifications">
          <Card className="p-6">
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-4">Alert Notifications</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <label className="text-sm font-medium">Email Notifications</label>
                      <p className="text-xs text-muted-foreground">
                        Receive alert notifications via email
                      </p>
                    </div>
                    <Switch
                      checked={alertSettings.emailNotifications}
                      onCheckedChange={(checked) => 
                        setAlertSettings({...alertSettings, emailNotifications: checked})
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <label className="text-sm font-medium">SMS Notifications</label>
                      <p className="text-xs text-muted-foreground">
                        Receive critical alerts via SMS
                      </p>
                    </div>
                    <Switch
                      checked={alertSettings.smsNotifications}
                      onCheckedChange={(checked) => 
                        setAlertSettings({...alertSettings, smsNotifications: checked})
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <label className="text-sm font-medium">Critical Alerts Only</label>
                      <p className="text-xs text-muted-foreground">
                        Only receive notifications for high and critical severity alerts
                      </p>
                    </div>
                    <Switch
                      checked={alertSettings.criticalOnly}
                      onCheckedChange={(checked) => 
                        setAlertSettings({...alertSettings, criticalOnly: checked})
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Escalation Time (minutes)</label>
                    <p className="text-xs text-muted-foreground">
                      Time before unacknowledged alerts are escalated
                    </p>
                    <div className="flex items-center space-x-4">
                      <Slider
                        value={[alertSettings.escalationTime]}
                        onValueChange={([value]) => 
                          setAlertSettings({...alertSettings, escalationTime: value})
                        }
                        min={5}
                        max={60}
                        step={5}
                        className="flex-1"
                      />
                      <span className="w-12 text-sm font-medium">
                        {alertSettings.escalationTime}m
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={() => handleSave('notifications')} disabled={isSaving}>
                  <Save className="w-4 h-4 mr-2" />
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Risk Thresholds Tab */}
        <TabsContent value="thresholds">
          <Card className="p-6">
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-4">Risk Level Thresholds</h2>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Low Risk Threshold (%)</label>
                    <p className="text-xs text-muted-foreground">
                      Probability below this is considered low risk
                    </p>
                    <div className="flex items-center space-x-4">
                      <Slider
                        value={[thresholds.lowRisk]}
                        onValueChange={([value]) => 
                          setThresholds({...thresholds, lowRisk: value})
                        }
                        min={20}
                        max={50}
                        step={5}
                        className="flex-1"
                      />
                      <span className="w-12 text-sm font-medium">{thresholds.lowRisk}%</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">High Risk Threshold (%)</label>
                    <p className="text-xs text-muted-foreground">
                      Probability above this is considered high risk
                    </p>
                    <div className="flex items-center space-x-4">
                      <Slider
                        value={[thresholds.highRisk]}
                        onValueChange={([value]) => 
                          setThresholds({...thresholds, highRisk: value})
                        }
                        min={60}
                        max={90}
                        step={5}
                        className="flex-1"
                      />
                      <span className="w-12 text-sm font-medium">{thresholds.highRisk}%</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Displacement Alert (mm/hr)</label>
                    <p className="text-xs text-muted-foreground">
                      Alert when displacement rate exceeds this value
                    </p>
                    <div className="flex items-center space-x-4">
                      <Slider
                        value={[thresholds.displacementAlert * 100]}
                        onValueChange={([value]) => 
                          setThresholds({...thresholds, displacementAlert: value / 100})
                        }
                        min={1}
                        max={10}
                        step={0.5}
                        className="flex-1"
                      />
                      <span className="w-16 text-sm font-medium">
                        {thresholds.displacementAlert.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Debounce Window (minutes)</label>
                    <p className="text-xs text-muted-foreground">
                      Suppress repeated alerts within this time window
                    </p>
                    <div className="flex items-center space-x-4">
                      <Slider
                        value={[thresholds.debounceWindow]}
                        onValueChange={([value]) => 
                          setThresholds({...thresholds, debounceWindow: value})
                        }
                        min={5}
                        max={30}
                        step={5}
                        className="flex-1"
                      />
                      <span className="w-12 text-sm font-medium">
                        {thresholds.debounceWindow}m
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {hasRole(['main_admin', 'site_admin']) && (
                <div className="flex justify-end">
                  <Button onClick={() => handleSave('thresholds')} disabled={isSaving}>
                    <Save className="w-4 h-4 mr-2" />
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              )}
            </div>
          </Card>
        </TabsContent>

        {/* Integrations Tab */}
        <TabsContent value="integrations">
          <Card className="p-6">
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">External Integrations</h2>
              
              {/* Mapbox */}
              <div className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <Globe className="w-5 h-5 text-primary" />
                    <h3 className="font-medium">Mapbox</h3>
                    {integrations.mapbox.enabled && (
                      <Badge variant="outline" className="text-risk-low">Connected</Badge>
                    )}
                  </div>
                  <Switch
                    checked={integrations.mapbox.enabled}
                    onCheckedChange={(checked) => 
                      setIntegrations({...integrations, 
                        mapbox: {...integrations.mapbox, enabled: checked}
                      })
                    }
                  />
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Interactive maps and 3D visualization
                </p>
                <Input
                  value={integrations.mapbox.token}
                  onChange={(e) => 
                    setIntegrations({...integrations, 
                      mapbox: {...integrations.mapbox, token: e.target.value}
                    })
                  }
                  placeholder="API Token"
                  type="password"
                  disabled={!hasRole(['main_admin', 'site_admin'])}
                />
              </div>

              {/* Twilio */}
              <div className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <Phone className="w-5 h-5 text-primary" />
                    <h3 className="font-medium">Twilio</h3>
                    {integrations.twilio.enabled && (
                      <Badge variant="outline" className="text-risk-low">Connected</Badge>
                    )}
                  </div>
                  <Switch
                    checked={integrations.twilio.enabled}
                    onCheckedChange={(checked) => 
                      setIntegrations({...integrations, 
                        twilio: {...integrations.twilio, enabled: checked}
                      })
                    }
                  />
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  SMS notifications for critical alerts
                </p>
                <Input
                  value={integrations.twilio.token}
                  onChange={(e) => 
                    setIntegrations({...integrations, 
                      twilio: {...integrations.twilio, token: e.target.value}
                    })
                  }
                  placeholder="Account SID"
                  type="password"
                  disabled={!hasRole(['main_admin', 'site_admin'])}
                />
              </div>

              {/* SendGrid */}
              <div className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <Mail className="w-5 h-5 text-primary" />
                    <h3 className="font-medium">SendGrid</h3>
                    {integrations.sendgrid.enabled && (
                      <Badge variant="outline" className="text-risk-low">Connected</Badge>
                    )}
                  </div>
                  <Switch
                    checked={integrations.sendgrid.enabled}
                    onCheckedChange={(checked) => 
                      setIntegrations({...integrations, 
                        sendgrid: {...integrations.sendgrid, enabled: checked}
                      })
                    }
                  />
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Email notifications and reports
                </p>
                <Input
                  value={integrations.sendgrid.token}
                  onChange={(e) => 
                    setIntegrations({...integrations, 
                      sendgrid: {...integrations.sendgrid, token: e.target.value}
                    })
                  }
                  placeholder="API Key"
                  type="password"
                  disabled={!hasRole(['main_admin', 'site_admin'])}
                />
              </div>

              {hasRole(['main_admin', 'site_admin']) && (
                <div className="flex justify-end">
                  <Button onClick={() => handleSave('integrations')} disabled={isSaving}>
                    <Save className="w-4 h-4 mr-2" />
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              )}
            </div>
          </Card>
        </TabsContent>

        {/* System Tab */}
        <TabsContent value="system">
          <Card className="p-6">
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">System Information</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between py-2 border-b">
                  <span className="text-sm text-muted-foreground">Version</span>
                  <span className="text-sm font-medium">v2.3.1</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-sm text-muted-foreground">Last Update</span>
                  <span className="text-sm font-medium">2 days ago</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-sm text-muted-foreground">Database Status</span>
                  <Badge variant="outline" className="text-risk-low">Healthy</Badge>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-sm text-muted-foreground">ML Service</span>
                  <Badge variant="outline" className="text-risk-low">Online</Badge>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-sm text-muted-foreground">Storage Used</span>
                  <span className="text-sm font-medium">45.2 GB / 100 GB</span>
                </div>
              </div>

              {hasRole(['site_admin']) && (
                <div className="space-y-3">
                  <Button variant="outline" className="w-full">
                    <Database className="w-4 h-4 mr-2" />
                    Backup Database
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Shield className="w-4 h-4 mr-2" />
                    Security Scan
                  </Button>
                  <Button variant="outline" className="w-full text-risk-high">
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    Clear Cache
                  </Button>
                </div>
              )}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}