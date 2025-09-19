import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { 
  AlertTriangle, Activity, MapPin, TrendingUp, 
  Clock, Users, Shield, ChevronRight 
} from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();

  const stats = [
    { label: 'Active Zones', value: '12', icon: MapPin, color: 'text-primary' },
    { label: 'High Risk Areas', value: '3', icon: AlertTriangle, color: 'text-risk-high' },
    { label: 'Active Sensors', value: '47/50', icon: Activity, color: 'text-risk-low' },
    { label: 'Last Update', value: '2m ago', icon: Clock, color: 'text-muted-foreground' },
  ];

  const recentAlerts = [
    { id: 1, severity: 'High', message: 'Critical displacement detected in North Wall sector', time: '2 mins ago', zone: 'Zone A-3' },
    { id: 2, severity: 'Medium', message: 'Increased strain readings on East Terrace', time: '15 mins ago', zone: 'Zone B-2' },
    { id: 3, severity: 'Low', message: 'Routine maintenance required for sensor cluster', time: '1 hour ago', zone: 'Zone C-1' },
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'High': return 'bg-risk-high text-white';
      case 'Medium': return 'bg-risk-medium text-white';
      case 'Low': return 'bg-risk-low text-white';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          Risk Monitoring Dashboard
        </h1>
        <p className="text-muted-foreground mt-2">
          Real-time rockfall risk assessment and monitoring
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className="bg-card hover:bg-card-hover transition-colors">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold text-foreground mt-1">{stat.value}</p>
                </div>
                <stat.icon className={`w-8 h-8 ${stat.color}`} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Live Risk Map Preview */}
        <Card className="bg-card border-border">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-foreground">Live Risk Map</h2>
              <span className="flex items-center text-xs text-risk-low">
                <span className="w-2 h-2 bg-risk-low rounded-full mr-2 animate-pulse"></span>
                Live monitoring active
              </span>
            </div>
            <div className="h-64 bg-gradient-dark rounded-lg flex items-center justify-center">
              <p className="text-muted-foreground">Interactive map loads here</p>
            </div>
            <div className="flex justify-between mt-4 text-sm">
              <span className="text-muted-foreground">Risk Levels</span>
              <div className="flex space-x-4">
                <span className="flex items-center"><span className="w-3 h-3 bg-risk-high rounded mr-1"></span> High</span>
                <span className="flex items-center"><span className="w-3 h-3 bg-risk-medium rounded mr-1"></span> Medium</span>
                <span className="flex items-center"><span className="w-3 h-3 bg-risk-low rounded mr-1"></span> Low</span>
              </div>
            </div>
          </div>
        </Card>

        {/* 24-Hour Forecast */}
        <Card className="bg-card border-border">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-foreground mb-4">24-Hour Forecast</h2>
            <div className="space-y-4">
              <div className="bg-gradient-dark rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Risk Assessment</span>
                  <span className="text-2xl font-bold text-risk-high">72%</span>
                </div>
                <div className="text-sm text-risk-high">High Risk</div>
                <div className="flex items-center mt-2 text-xs text-muted-foreground">
                  <TrendingUp className="w-3 h-3 mr-1 text-risk-high" />
                  Increasing trend - Next 24 hours
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Zone A - North Wall</span>
                  <span className="text-risk-high font-medium">85%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Zone B - East Terrace</span>
                  <span className="text-risk-medium font-medium">62%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Zone C - South Ramp</span>
                  <span className="text-risk-low font-medium">28%</span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Alerts */}
      <Card className="bg-card border-border">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-foreground">Recent Alerts</h2>
            <Button variant="ghost" size="sm" className="text-primary">
              View All
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
          <div className="space-y-3">
            {recentAlerts.map((alert) => (
              <div key={alert.id} className="flex items-start space-x-3 p-3 rounded-lg bg-secondary hover:bg-muted transition-colors">
                <span className={`px-2 py-1 text-xs font-medium rounded ${getSeverityColor(alert.severity)}`}>
                  {alert.severity.toUpperCase()}
                </span>
                <div className="flex-1">
                  <p className="text-sm text-foreground">{alert.message}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Location: {alert.zone} • {alert.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}