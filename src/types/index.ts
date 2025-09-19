import type { Point, Polygon, Geometry } from 'geojson';

// User and Authentication Types
export type UserRole = 'operator' | 'inspector' | 'main_admin' | 'site_admin' | 'visitor';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  assignedMineId?: string;
  createdAt: Date;
}

// Mine Types
export interface Mine {
  id: string;
  name: string;
  geom: Geometry;
  status: 'active' | 'inactive' | 'maintenance';
  timezone: string;
  contact?: string;
}

// Prediction Types
export interface Prediction {
  id: string;
  mineId: string;
  cellId: string;
  geom: Point;
  probability: number;
  riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  timestamp: Date;
  explanation?: {
    topFeatures: Array<{
      name: string;
      value: number;
      impact: number;
    }>;
  };
}

// Alert Types
export type AlertSeverity = 'Low' | 'Medium' | 'High' | 'Critical';
export type AlertStatus = 'active' | 'acknowledged' | 'resolved';

export interface Alert {
  id: string;
  mineId: string;
  cellId: string;
  type: string;
  severity: AlertSeverity;
  message: string;
  createdBy: string;
  createdAt: Date;
  acknowledgedBy?: string;
  acknowledgedAt?: Date;
  resolvedBy?: string;
  resolvedAt?: Date;
  resolutionNote?: string;
}

// Incident Types
export interface Incident {
  id: string;
  mineId: string;
  reportedBy: string;
  title: string;
  description: string;
  severity: 'Low' | 'Medium' | 'High';
  geom: Point;
  attachments?: string[];
  status: 'Reported' | 'Verified' | 'Rejected' | 'NeedsInfo';
  createdAt: Date;
  verifiedBy?: string;
  verifiedAt?: Date;
  verificationNotes?: string;
}

// Sensor Types
export interface Sensor {
  id: string;
  mineId: string;
  type: 'displacement' | 'pore_pressure' | 'rainfall' | 'temperature' | 'vibration' | 'strain';
  unit: string;
  lastSeen: Date;
  status: 'online' | 'offline' | 'maintenance';
  location?: Point;
}

export interface SensorReading {
  sensorId: string;
  timestamp: Date;
  value: number;
  unit: string;
}

// Drone Job Types
export interface DroneJob {
  id: string;
  mineId: string;
  uploadedBy: string;
  fileUrl: string;
  status: 'queued' | 'processing' | 'done' | 'failed';
  progress?: number;
  resultsUrl?: string;
  createdAt: Date;
  metadata?: {
    flightDate: Date;
    altitude?: number;
    camera?: string;
  };
}

// Zone Types
export interface RiskZone {
  id: string;
  name: string;
  mineId: string;
  geom: Polygon;
  currentRiskLevel: 'Low' | 'Medium' | 'High';
  displacement?: number;
  lastEvent?: Date;
  sensors?: string[];
}

// Dashboard Stats
export interface DashboardStats {
  activeZones: number;
  highRiskAreas: number;
  activeSensors: number;
  offlineSensors: number;
  lastUpdate: Date;
  currentRiskAssessment: {
    probability: number;
    riskLevel: string;
    trend: 'increasing' | 'stable' | 'decreasing';
  };
}