import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { 
  Shield, CheckCircle, XCircle, AlertTriangle, FileText, 
  Camera, MapPin, Calendar, Clock, User, Download, 
  ChevronRight, ClipboardCheck, Send, Eye
} from 'lucide-react';
import { format } from 'date-fns';

interface InspectionItem {
  id: string;
  category: string;
  item: string;
  status: 'pass' | 'fail' | 'na' | 'pending';
  notes?: string;
  photo?: string;
}

interface Inspection {
  id: string;
  mineId: string;
  mineName: string;
  date: Date;
  inspector: string;
  type: 'routine' | 'incident' | 'compliance' | 'emergency';
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  complianceScore?: number;
  findings?: string;
  recommendations?: string;
  items?: InspectionItem[];
  incidents?: string[];
}

export default function Inspections() {
  const { user, hasRole } = useAuth();
  const [selectedInspection, setSelectedInspection] = useState<Inspection | null>(null);
  const [activeChecklist, setActiveChecklist] = useState<InspectionItem[]>([]);

  // Mock data
  const inspections: Inspection[] = [
    {
      id: 'insp-001',
      mineId: 'mine-12',
      mineName: 'Mine Site Alpha',
      date: new Date('2025-09-20T09:00:00'),
      inspector: 'Sarah Inspector',
      type: 'routine',
      status: 'completed',
      complianceScore: 92,
      findings: 'Minor crack observed in bench 3. Drainage system functioning well.',
      recommendations: 'Monitor crack progression. Schedule maintenance for sensor S-042.',
      incidents: ['inc-1001']
    },
    {
      id: 'insp-002',
      mineId: 'mine-12',
      mineName: 'Mine Site Alpha',
      date: new Date('2025-09-21T10:00:00'),
      inspector: 'Sarah Inspector',
      type: 'incident',
      status: 'in_progress',
      incidents: ['inc-1002', 'inc-1003']
    },
    {
      id: 'insp-003',
      mineId: 'mine-12',
      mineName: 'Mine Site Alpha',
      date: new Date('2025-09-22T08:00:00'),
      inspector: 'Mike Inspector',
      type: 'compliance',
      status: 'scheduled'
    }
  ];

  const checklistTemplate: InspectionItem[] = [
    { id: 'chk-001', category: 'Slope Stability', item: 'Visual inspection of benches', status: 'pending' },
    { id: 'chk-002', category: 'Slope Stability', item: 'Check for new cracks or displacement', status: 'pending' },
    { id: 'chk-003', category: 'Slope Stability', item: 'Verify monitoring equipment placement', status: 'pending' },
    { id: 'chk-004', category: 'Drainage', item: 'Check drainage channels clear', status: 'pending' },
    { id: 'chk-005', category: 'Drainage', item: 'Inspect pumping stations', status: 'pending' },
    { id: 'chk-006', category: 'Safety', item: 'Access roads condition', status: 'pending' },
    { id: 'chk-007', category: 'Safety', item: 'Warning signs visible and intact', status: 'pending' },
    { id: 'chk-008', category: 'Safety', item: 'Emergency equipment accessible', status: 'pending' },
    { id: 'chk-009', category: 'Sensors', item: 'All sensors operational', status: 'pending' },
    { id: 'chk-010', category: 'Sensors', item: 'Data transmission verified', status: 'pending' }
  ];

  const getStatusBadge = (status: Inspection['status']) => {
    const statusConfig = {
      scheduled: { variant: 'secondary' as const, icon: Clock },
      in_progress: { variant: 'default' as const, icon: Clock },
      completed: { variant: 'default' as const, icon: CheckCircle },
      cancelled: { variant: 'destructive' as const, icon: XCircle }
    };

    const config = statusConfig[status];
    const Icon = config.icon;

    return (
      <Badge 
        variant={config.variant} 
        className={status === 'completed' ? 'bg-risk-low text-white' : undefined}
      >
        <Icon className="w-3 h-3 mr-1" />
        {status.replace('_', ' ').charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
      </Badge>
    );
  };

  const getTypeBadge = (type: Inspection['type']) => {
    const typeConfig = {
      routine: { variant: 'outline' as const },
      incident: { variant: 'destructive' as const },
      compliance: { variant: 'default' as const },
      emergency: { variant: 'destructive' as const }
    };

    return (
      <Badge variant={typeConfig[type].variant}>
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </Badge>
    );
  };

  const updateChecklistItem = (itemId: string, field: keyof InspectionItem, value: any) => {
    setActiveChecklist(prev => 
      prev.map(item => 
        item.id === itemId ? { ...item, [field]: value } : item
      )
    );
  };

  const calculateComplianceScore = () => {
    const passCount = activeChecklist.filter(item => item.status === 'pass').length;
    const totalCount = activeChecklist.filter(item => item.status !== 'na').length;
    return totalCount > 0 ? Math.round((passCount / totalCount) * 100) : 0;
  };

  if (!hasRole('inspector')) {
    return (
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          You don't have permission to access the inspections module. Only inspectors can view this page.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Inspections</h1>
        <p className="text-muted-foreground mt-1">Manage compliance checks and incident verifications</p>
      </div>

      <Tabs defaultValue="active" className="space-y-4">
        <TabsList>
          <TabsTrigger value="active">Active Inspections</TabsTrigger>
          <TabsTrigger value="checklist">Compliance Checklist</TabsTrigger>
          <TabsTrigger value="verification">Incident Verification</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Inspection Schedule</CardTitle>
                  <CardDescription>
                    Your assigned inspections and their current status
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {inspections.map(inspection => (
                    <div
                      key={inspection.id}
                      className="p-4 border border-border rounded-lg hover:bg-accent/50 transition-colors cursor-pointer"
                      onClick={() => setSelectedInspection(inspection)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Shield className="w-4 h-4 text-muted-foreground" />
                            <span className="font-medium">{inspection.mineName}</span>
                            {getTypeBadge(inspection.type)}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {format(inspection.date, 'MMM dd, yyyy HH:mm')}
                            </span>
                            <span className="flex items-center gap-1">
                              <User className="w-3 h-3" />
                              {inspection.inspector}
                            </span>
                            {inspection.complianceScore && (
                              <span className="flex items-center gap-1">
                                <ClipboardCheck className="w-3 h-3" />
                                {inspection.complianceScore}% Compliance
                              </span>
                            )}
                          </div>
                          {inspection.findings && (
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {inspection.findings}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusBadge(inspection.status)}
                          <ChevronRight className="w-4 h-4 text-muted-foreground" />
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button className="w-full justify-start" variant="outline">
                    <ClipboardCheck className="w-4 h-4 mr-2" />
                    Start New Inspection
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Camera className="w-4 h-4 mr-2" />
                    Upload Photos
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <FileText className="w-4 h-4 mr-2" />
                    Generate Report
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Statistics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">This Week</span>
                    <span className="font-medium">8 Inspections</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Avg Compliance</span>
                    <span className="font-medium text-risk-low">94%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Incidents Verified</span>
                    <span className="font-medium">12</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Pending Reviews</span>
                    <span className="font-medium text-risk-medium">3</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="checklist" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Compliance Checklist</CardTitle>
              <CardDescription>
                Complete the inspection checklist for the current site visit
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex justify-between items-center p-4 bg-muted rounded-lg">
                <div>
                  <p className="font-medium">Current Compliance Score</p>
                  <p className="text-sm text-muted-foreground">Based on completed items</p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-risk-low">{calculateComplianceScore()}%</p>
                  <Progress value={calculateComplianceScore()} className="w-24 h-2 mt-2" />
                </div>
              </div>

              {activeChecklist.length === 0 && (
                <div className="text-center py-8">
                  <Button 
                    onClick={() => setActiveChecklist([...checklistTemplate])}
                    size="lg"
                  >
                    <ClipboardCheck className="w-4 h-4 mr-2" />
                    Start New Checklist
                  </Button>
                </div>
              )}

              {activeChecklist.length > 0 && (
                <div className="space-y-6">
                  {['Slope Stability', 'Drainage', 'Safety', 'Sensors'].map(category => (
                    <div key={category} className="space-y-3">
                      <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wider">
                        {category}
                      </h3>
                      <div className="space-y-2">
                        {activeChecklist
                          .filter(item => item.category === category)
                          .map(item => (
                            <div key={item.id} className="p-3 border border-border rounded-lg space-y-3">
                              <div className="flex items-center justify-between">
                                <Label htmlFor={item.id} className="flex items-center gap-2 cursor-pointer">
                                  <Checkbox 
                                    id={item.id}
                                    checked={item.status === 'pass'}
                                    onCheckedChange={(checked) => 
                                      updateChecklistItem(item.id, 'status', checked ? 'pass' : 'pending')
                                    }
                                  />
                                  {item.item}
                                </Label>
                                <div className="flex gap-1">
                                  <Button
                                    size="sm"
                                    variant={item.status === 'pass' ? 'default' : 'outline'}
                                    onClick={() => updateChecklistItem(item.id, 'status', 'pass')}
                                    className="h-7"
                                  >
                                    Pass
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant={item.status === 'fail' ? 'destructive' : 'outline'}
                                    onClick={() => updateChecklistItem(item.id, 'status', 'fail')}
                                    className="h-7"
                                  >
                                    Fail
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant={item.status === 'na' ? 'secondary' : 'outline'}
                                    onClick={() => updateChecklistItem(item.id, 'status', 'na')}
                                    className="h-7"
                                  >
                                    N/A
                                  </Button>
                                </div>
                              </div>
                              {item.status === 'fail' && (
                                <Textarea
                                  placeholder="Add notes about the failure..."
                                  value={item.notes || ''}
                                  onChange={(e) => updateChecklistItem(item.id, 'notes', e.target.value)}
                                  className="h-20"
                                />
                              )}
                            </div>
                          ))}
                      </div>
                    </div>
                  ))}

                  <div className="flex justify-end gap-2 pt-4">
                    <Button variant="outline">Save Draft</Button>
                    <Button>
                      <Send className="w-4 h-4 mr-2" />
                      Submit Inspection
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="verification" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Incident Verification Queue</CardTitle>
              <CardDescription>
                Review and verify reported incidents from operators
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  3 incidents pending verification. High priority items are marked in red.
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                {[
                  {
                    id: 'inc-1002',
                    title: 'Crack detected in bench 5',
                    reportedBy: 'John Operator',
                    time: '2 hours ago',
                    severity: 'high',
                    status: 'pending'
                  },
                  {
                    id: 'inc-1003',
                    title: 'Water accumulation near sensor array',
                    reportedBy: 'Mike Operator',
                    time: '5 hours ago',
                    severity: 'medium',
                    status: 'pending'
                  },
                  {
                    id: 'inc-1004',
                    title: 'Minor displacement in sector C',
                    reportedBy: 'John Operator',
                    time: '1 day ago',
                    severity: 'low',
                    status: 'reviewing'
                  }
                ].map(incident => (
                  <div key={incident.id} className={`p-4 border rounded-lg ${
                    incident.severity === 'high' ? 'border-risk-high bg-risk-high/10' : 'border-border'
                  }`}>
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-medium">{incident.title}</h4>
                        <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                          <span>Reported by {incident.reportedBy}</span>
                          <span>•</span>
                          <span>{incident.time}</span>
                        </div>
                      </div>
                      <Badge variant={
                        incident.severity === 'high' ? 'destructive' : 
                        incident.severity === 'medium' ? 'default' : 'secondary'
                      }>
                        {incident.severity}
                      </Badge>
                    </div>

                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Eye className="w-4 h-4 mr-1" />
                        View Details
                      </Button>
                      <Button size="sm" variant="default" className="bg-risk-low hover:bg-risk-low/90">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Verify
                      </Button>
                      <Button size="sm" variant="destructive">
                        <XCircle className="w-4 h-4 mr-1" />
                        Reject
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Inspection Reports</CardTitle>
              <CardDescription>
                Generate and download compliance reports
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Report Type</Label>
                  <select className="w-full p-2 border border-border rounded-lg bg-background">
                    <option>Compliance Report</option>
                    <option>Incident Verification Report</option>
                    <option>Monthly Summary</option>
                    <option>Safety Audit</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Date Range</Label>
                  <div className="flex gap-2">
                    <Input type="date" />
                    <Input type="date" />
                  </div>
                </div>
              </div>

              <Button className="w-full">
                <Download className="w-4 h-4 mr-2" />
                Generate Report
              </Button>

              <div className="space-y-3 pt-4">
                <h4 className="font-medium text-sm text-muted-foreground">Recent Reports</h4>
                {[
                  { name: 'Weekly_Compliance_Report_Sep15-21.pdf', date: '2 days ago', size: '2.4 MB' },
                  { name: 'Incident_Verification_Sep2025.pdf', date: '5 days ago', size: '1.8 MB' },
                  { name: 'Monthly_Safety_Audit_Aug2025.pdf', date: '3 weeks ago', size: '3.2 MB' }
                ].map((report, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 border border-border rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileText className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">{report.name}</p>
                        <p className="text-xs text-muted-foreground">{report.date} • {report.size}</p>
                      </div>
                    </div>
                    <Button size="sm" variant="ghost">
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}