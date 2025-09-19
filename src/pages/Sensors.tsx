import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Activity, AlertCircle, CheckCircle, XCircle, 
  TrendingUp, Settings, Download, RefreshCw,
  Thermometer, Droplets, Move, Vibrate
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from '@/components/ui/progress';

export default function Sensors() {
  const { user, hasRole } = useAuth();
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const sensors = [
    {
      id: 's-001',
      name: 'Displacement Sensor A1',
      type: 'displacement',
      status: 'online',
      value: 0.023,
      unit: 'mm/hr',
      battery: 85,
      lastSeen: '2 mins ago',
      location: 'Zone A - North Wall',
      trend: 'increasing'
    },
    {
      id: 's-002',
      name: 'Pore Pressure B3',
      type: 'pore_pressure',
      status: 'online',
      value: 45.2,
      unit: 'kPa',
      battery: 92,
      lastSeen: '1 min ago',
      location: 'Zone B - East Terrace',
      trend: 'stable'
    },
    {
      id: 's-003',
      name: 'Rain Gauge R1',
      type: 'rainfall',
      status: 'online',
      value: 12.5,
      unit: 'mm/24h',
      battery: 78,
      lastSeen: '5 mins ago',
      location: 'Central Station',
      trend: 'decreasing'
    },
    {
      id: 's-004',
      name: 'Temperature Sensor T2',
      type: 'temperature',
      status: 'offline',
      value: null,
      unit: '°C',
      battery: 0,
      lastSeen: '2 hours ago',
      location: 'Zone C - South Ramp',
      trend: 'unknown'
    },
    {
      id: 's-005',
      name: 'Vibration Monitor V1',
      type: 'vibration',
      status: 'maintenance',
      value: 0.012,
      unit: 'g',
      battery: 65,
      lastSeen: '30 mins ago',
      location: 'Zone D - West Pit',
      trend: 'stable'
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online': return <CheckCircle className="w-4 h-4 text-risk-low" />;
      case 'offline': return <XCircle className="w-4 h-4 text-risk-high" />;
      case 'maintenance': return <AlertCircle className="w-4 h-4 text-risk-medium" />;
      default: return <Activity className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'displacement': return <Move className="w-4 h-4" />;
      case 'pore_pressure': return <Droplets className="w-4 h-4" />;
      case 'rainfall': return <Droplets className="w-4 h-4" />;
      case 'temperature': return <Thermometer className="w-4 h-4" />;
      case 'vibration': return <Vibrate className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  const getBatteryColor = (level: number) => {
    if (level >= 70) return 'text-risk-low';
    if (level >= 30) return 'text-risk-medium';
    return 'text-risk-high';
  };

  const filteredSensors = sensors.filter(sensor => {
    if (filterType !== 'all' && sensor.type !== filterType) return false;
    if (filterStatus !== 'all' && sensor.status !== filterStatus) return false;
    return true;
  });

  const onlineCount = sensors.filter(s => s.status === 'online').length;
  const offlineCount = sensors.filter(s => s.status === 'offline').length;
  const maintenanceCount = sensors.filter(s => s.status === 'maintenance').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Sensor Network</h1>
          <p className="text-muted-foreground mt-2">
            Real-time monitoring of {sensors.length} sensors
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="icon">
            <RefreshCw className="w-4 h-4" />
          </Button>
          {hasRole(['operator', 'inspector', 'main_admin']) && (
            <>
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export Data
              </Button>
              <Button variant="outline">
                <Settings className="w-4 h-4 mr-2" />
                Configure
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Sensors</p>
              <p className="text-2xl font-bold">{sensors.length}</p>
            </div>
            <Activity className="w-8 h-8 text-primary" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Online</p>
              <p className="text-2xl font-bold text-risk-low">{onlineCount}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-risk-low" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Offline</p>
              <p className="text-2xl font-bold text-risk-high">{offlineCount}</p>
            </div>
            <XCircle className="w-8 h-8 text-risk-high" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Maintenance</p>
              <p className="text-2xl font-bold text-risk-medium">{maintenanceCount}</p>
            </div>
            <AlertCircle className="w-8 h-8 text-risk-medium" />
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">Type:</span>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-[150px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="displacement">Displacement</SelectItem>
                <SelectItem value="pore_pressure">Pore Pressure</SelectItem>
                <SelectItem value="rainfall">Rainfall</SelectItem>
                <SelectItem value="temperature">Temperature</SelectItem>
                <SelectItem value="vibration">Vibration</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">Status:</span>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[150px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="online">Online</SelectItem>
                <SelectItem value="offline">Offline</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Sensor List */}
      <Card>
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Sensor Details</h2>
          <div className="space-y-3">
            {filteredSensors.map((sensor) => (
              <div key={sensor.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      {getTypeIcon(sensor.type)}
                      <h3 className="font-medium">{sensor.name}</h3>
                      {getStatusIcon(sensor.status)}
                      <Badge variant={sensor.status === 'online' ? 'default' : 'secondary'}>
                        {sensor.status}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Location:</span>
                        <p className="font-medium">{sensor.location}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Current Value:</span>
                        <p className="font-medium">
                          {sensor.value !== null ? `${sensor.value} ${sensor.unit}` : 'N/A'}
                        </p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Battery:</span>
                        <div className="flex items-center space-x-2">
                          <Progress value={sensor.battery} className="w-20" />
                          <span className={`text-xs font-medium ${getBatteryColor(sensor.battery)}`}>
                            {sensor.battery}%
                          </span>
                        </div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Last Seen:</span>
                        <p className="font-medium">{sensor.lastSeen}</p>
                      </div>
                    </div>

                    {sensor.trend !== 'unknown' && (
                      <div className="mt-2">
                        <Badge variant="outline" className="text-xs">
                          {sensor.trend === 'increasing' && <TrendingUp className="w-3 h-3 mr-1" />}
                          {sensor.trend}
                        </Badge>
                      </div>
                    )}
                  </div>

                  {hasRole(['operator', 'inspector', 'main_admin']) && (
                    <div className="flex space-x-2 ml-4">
                      <Button size="sm" variant="outline">View Data</Button>
                      {sensor.status === 'offline' && (
                        <Button size="sm" variant="destructive">Investigate</Button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}