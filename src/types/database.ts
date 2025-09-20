export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string | null
          name: string | null
          role: 'viewer' | 'inspector' | 'manager' | 'admin'
          mine_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email?: string | null
          name?: string | null
          role?: 'viewer' | 'inspector' | 'manager' | 'admin'
          mine_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string | null
          name?: string | null
          role?: 'viewer' | 'inspector' | 'manager' | 'admin'
          mine_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      mines: {
        Row: {
          id: string
          name: string
          location: unknown | null
          metadata: Json
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          location?: unknown | null
          metadata?: Json
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          location?: unknown | null
          metadata?: Json
          created_at?: string
        }
      }
      sensors: {
        Row: {
          id: string
          mine_id: string | null
          name: string | null
          sensor_type: string | null
          status: string
          latest_reading_value: number | null
          latest_reading_at: string | null
          metadata: Json
          created_at: string
        }
        Insert: {
          id?: string
          mine_id?: string | null
          name?: string | null
          sensor_type?: string | null
          status?: string
          latest_reading_value?: number | null
          latest_reading_at?: string | null
          metadata?: Json
          created_at?: string
        }
        Update: {
          id?: string
          mine_id?: string | null
          name?: string | null
          sensor_type?: string | null
          status?: string
          latest_reading_value?: number | null
          latest_reading_at?: string | null
          metadata?: Json
          created_at?: string
        }
      }
      sensor_readings: {
        Row: {
          id: string
          sensor_id: string | null
          value: number | null
          unit: string | null
          recorded_at: string
        }
        Insert: {
          id?: string
          sensor_id?: string | null
          value?: number | null
          unit?: string | null
          recorded_at?: string
        }
        Update: {
          id?: string
          sensor_id?: string | null
          value?: number | null
          unit?: string | null
          recorded_at?: string
        }
      }
      alerts: {
        Row: {
          id: string
          mine_id: string | null
          sensor_id: string | null
          level: string | null
          message: string | null
          acknowledged: boolean
          created_at: string
        }
        Insert: {
          id?: string
          mine_id?: string | null
          sensor_id?: string | null
          level?: string | null
          message?: string | null
          acknowledged?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          mine_id?: string | null
          sensor_id?: string | null
          level?: string | null
          message?: string | null
          acknowledged?: boolean
          created_at?: string
        }
      }
      incidents: {
        Row: {
          id: string
          mine_id: string | null
          title: string | null
          description: string | null
          status: string
          created_by: string | null
          created_at: string
          metadata: Json
        }
        Insert: {
          id?: string
          mine_id?: string | null
          title?: string | null
          description?: string | null
          status?: string
          created_by?: string | null
          created_at?: string
          metadata?: Json
        }
        Update: {
          id?: string
          mine_id?: string | null
          title?: string | null
          description?: string | null
          status?: string
          created_by?: string | null
          created_at?: string
          metadata?: Json
        }
      }
      drone_imagery: {
        Row: {
          id: string
          mine_id: string | null
          file_path: string
          thumbnail_path: string | null
          captured_at: string | null
          uploaded_by: string | null
          tags: string[] | null
          metadata: Json
          created_at: string
        }
        Insert: {
          id?: string
          mine_id?: string | null
          file_path: string
          thumbnail_path?: string | null
          captured_at?: string | null
          uploaded_by?: string | null
          tags?: string[] | null
          metadata?: Json
          created_at?: string
        }
        Update: {
          id?: string
          mine_id?: string | null
          file_path?: string
          thumbnail_path?: string | null
          captured_at?: string | null
          uploaded_by?: string | null
          tags?: string[] | null
          metadata?: Json
          created_at?: string
        }
      }
      inspections: {
        Row: {
          id: string
          mine_id: string | null
          title: string
          description: string | null
          status: string
          images: string[]
          created_by: string | null
          created_at: string
        }
        Insert: {
          id?: string
          mine_id?: string | null
          title: string
          description?: string | null
          status?: string
          images?: string[]
          created_by?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          mine_id?: string | null
          title?: string
          description?: string | null
          status?: string
          images?: string[]
          created_by?: string | null
          created_at?: string
        }
      }
      integrations: {
        Row: {
          id: string
          mine_id: string | null
          provider: string
          config: Json
          enabled: boolean
          created_at: string
        }
        Insert: {
          id?: string
          mine_id?: string | null
          provider: string
          config?: Json
          enabled?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          mine_id?: string | null
          provider?: string
          config?: Json
          enabled?: boolean
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}