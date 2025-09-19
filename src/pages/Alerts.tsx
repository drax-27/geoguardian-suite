import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { 
  AlertTriangle, Bell, CheckCircle, XCircle, 
  Clock, ChevronRight, Filter, Download,
  MessageSquare, MapPin, TrendingUp
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Alert } from '@/types';

export default function Alerts() {
  const { user, hasRole, canAccessMine } = useAuth();
  const [filterSeverity, setFilterSeverity] = useState('all');
  const [filterStatus, setFilterStatus] = useState('active');
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [resolveDialog, setResolveDialog] = useState(false);
  const [resolutionNote, setResolutionNote] = useState('');

  const alerts: Alert[] = [
    {
      id: 'alert-001',
      mineId: 'mine-12',
      cellId: 'c_123',
      type: 'slope_instability',
      severity: 'Critical',
      message: 'Critical displacement detected in North Wall sector. Immediate action required.',
      createdBy: 'ml_service',
      createdAt: new Date(Date.now() - 1000 * 60 * 2),
      acknowledgedBy: user?.role === 'operator' ? user.id : undefined,
      acknowledgedAt: user?.role === 'operator' ? new Date(Date.now() - 1000 * 60) : undefined,
    },
    {
      id: 'alert-002',
      mineId: 'mine-12',
      cellId: 'c_124',
      type: 'sensor_anomaly',
      severity: 'High',
      message: 'Increased strain readings on East Terrace. Monitor closely.',
      createdBy: 'ml_service',
      createdAt: new Date(Date.now() - 1000 * 60 * 15),
    },
    {
      id: 'alert-003',
      mineId: 'mine-12',
      cellId: 'c_125',
      type: 'maintenance',
      severity: 'Low',
      message: 'Routine maintenance required for sensor cluster C-125.',
      createdBy: 'system',
      createdAt: new Date(Date.now() - 1000 * 60 * 60),
      acknowledgedBy: 'op-42',
      acknowledgedAt: new Date(Date.now() - 1000 * 60 * 45),
      resolvedBy: 'op-42',
      resolvedAt: new Date(Date.now() - 1000 * 60 * 30),
      resolutionNote: 'Maintenance completed. Sensors recalibrated.',
    },
    {
      id: 'alert-004',
      mineId: 'mine-12',
      cellId: 'c_126',
      type: 'weather',
      severity: 'Medium',
      message: 'Heavy rainfall expected. Risk levels may increase.',
      createdBy: 'weather_service',
      createdAt: new Date(Date.now() - 1000 * 60 * 30),
    },
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Critical': return 'bg-risk-critical text-white';
      case 'High': return 'bg-risk-high text-white';
      case 'Medium': return 'bg-risk-medium text-white';
      case 'Low': return 'bg-risk-low text-white';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusBadge = (alert: Alert) => {
    if (alert.resolvedAt) return <Badge variant="outline" className="text-risk-low">Resolved</Badge>;
    if (alert.acknowledgedAt) return <Badge variant="outline" className="text-risk-medium">Acknowledged</Badge>;
    return <Badge variant="destructive">Active</Badge>;
  };

  const filteredAlerts = alerts.filter(alert => {
    if (filterSeverity !== 'all' && alert.severity !== filterSeverity) return false;
    if (filterStatus === 'active' && alert.resolvedAt) return false;
    if (filterStatus === 'acknowledged' && (!alert.acknowledgedAt || alert.resolvedAt)) return false;
    if (filterStatus === 'resolved' && !alert.resolvedAt) return false;
    
    // Role-based filtering
    if (hasRole('operator') && user?.assignedMineId && alert.mineId !== user.assignedMineId) {
      return false;
    }
    
    return true;
  });

  const handleAcknowledge = (alert: Alert) => {
    // In real app, this would call the API
    console.log('Acknowledging alert:', alert.id);
  };

  const handleResolve = () => {
    if (selectedAlert && resolutionNote) {
      // In real app, this would call the API
      console.log('Resolving alert:', selectedAlert.id, 'with note:', resolutionNote);
      setResolveDialog(false);
      setResolutionNote('');
      setSelectedAlert(null);
    }
  };

  const activeCount = alerts.filter(a => !a.resolvedAt).length;
  const criticalCount = alerts.filter(a => a.severity === 'Critical' && !a.resolvedAt).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Alert Management</h1>
          <p className="text-muted-foreground mt-2">
            Monitor and respond to system alerts
          </p>
        </div>
        <div className="flex space-x-2">
          <Badge variant="destructive" className="text-lg px-3 py-1">
            {activeCount} Active
          </Badge>
          {criticalCount > 0 && (
            <Badge variant="destructive" className="text-lg px-3 py-1 animate-pulse">
              {criticalCount} Critical
            </Badge>
          )}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Alerts</p>
              <p className="text-2xl font-bold">{alerts.length}</p>
            </div>
            <Bell className="w-8 h-8 text-primary" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Critical</p>
              <p className="text-2xl font-bold text-risk-critical">{criticalCount}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-risk-critical" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Acknowledged</p>
              <p className="text-2xl font-bold text-risk-medium">
                {alerts.filter(a => a.acknowledgedAt && !a.resolvedAt).length}
              </p>
            </div>
            <CheckCircle className="w-8 h-8 text-risk-medium" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Resolved</p>
              <p className="text-2xl font-bold text-risk-low">
                {alerts.filter(a => a.resolvedAt).length}
              </p>
            </div>
            <CheckCircle className="w-8 h-8 text-risk-low" />
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex items-center space-x-4">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <Select value={filterSeverity} onValueChange={setFilterSeverity}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Severity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Severities</SelectItem>
              <SelectItem value="Critical">Critical</SelectItem>
              <SelectItem value="High">High</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="Low">Low</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="acknowledged">Acknowledged</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
            </SelectContent>
          </Select>
          {hasRole(['operator', 'inspector', 'main_admin']) && (
            <Button variant="outline" className="ml-auto">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          )}
        </div>
      </Card>

      {/* Alert List */}
      <Card>
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Alert History</h2>
          <div className="space-y-3">
            {filteredAlerts.map((alert) => (
              <div key={alert.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge className={getSeverityColor(alert.severity)}>
                        {alert.severity}
                      </Badge>
                      {getStatusBadge(alert)}
                      <span className="text-sm text-muted-foreground">
                        {new Date(alert.createdAt).toLocaleString()}
                      </span>
                    </div>
                    
                    <p className="font-medium mb-2">{alert.message}</p>
                    
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <span className="flex items-center">
                        <MapPin className="w-3 h-3 mr-1" />
                        Cell {alert.cellId}
                      </span>
                      <span className="flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {alert.type.replace('_', ' ')}
                      </span>
                      {alert.acknowledgedBy && (
                        <span className="flex items-center text-risk-medium">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Acknowledged by {alert.acknowledgedBy}
                        </span>
                      )}
                      {alert.resolvedBy && (
                        <span className="flex items-center text-risk-low">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Resolved by {alert.resolvedBy}
                        </span>
                      )}
                    </div>

                    {alert.resolutionNote && (
                      <div className="mt-2 p-2 bg-muted rounded text-sm">
                        <span className="font-medium">Resolution: </span>
                        {alert.resolutionNote}
                      </div>
                    )}
                  </div>

                  {hasRole(['operator', 'inspector']) && !alert.resolvedAt && (
                    <div className="flex space-x-2 ml-4">
                      {!alert.acknowledgedAt && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleAcknowledge(alert)}
                        >
                          Acknowledge
                        </Button>
                      )}
                      {alert.acknowledgedAt && (
                        <Button 
                          size="sm" 
                          variant="default"
                          onClick={() => {
                            setSelectedAlert(alert);
                            setResolveDialog(true);
                          }}
                        >
                          Resolve
                        </Button>
                      )}
                      <Button size="sm" variant="outline">
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Resolve Dialog */}
      <Dialog open={resolveDialog} onOpenChange={setResolveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Resolve Alert</DialogTitle>
            <DialogDescription>
              Provide details about how this alert was resolved.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-2">Alert Details:</p>
              <p className="font-medium">{selectedAlert?.message}</p>
            </div>
            <div>
              <label className="text-sm font-medium">Resolution Note</label>
              <Textarea
                value={resolutionNote}
                onChange={(e) => setResolutionNote(e.target.value)}
                placeholder="Describe the actions taken to resolve this alert..."
                className="mt-2"
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setResolveDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleResolve} disabled={!resolutionNote}>
              Resolve Alert
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}