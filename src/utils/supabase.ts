import { createClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from './supabase/info';

const supabaseUrl = `https://${projectId}.supabase.co`;
const supabaseAnonKey = publicAnonKey;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export type Database = {
  public: {
    Tables: {
      blood_donors: {
        Row: {
          id: string;
          name: string;
          blood_group: string;
          phone: string;
          email: string;
          district: string;
          last_donation: string;
          available_for_donation: boolean;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['blood_donors']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['blood_donors']['Insert']>;
      };
      health_camps: {
        Row: {
          id: string;
          title: string;
          type: string;
          date: string;
          time: string;
          venue: string;
          organizer: string;
          contact: string;
          spots_available: number;
          total_spots: number;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['health_camps']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['health_camps']['Insert']>;
      };
      help_requests: {
        Row: {
          id: string;
          type: string;
          blood_group: string;
          patient_name: string;
          hospital: string;
          urgency: string;
          status: string;
          location: string;
          contact: string;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['help_requests']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['help_requests']['Insert']>;
      };
      volunteers: {
        Row: {
          id: string;
          name: string;
          email: string;
          phone: string;
          college: string;
          blood_group: string;
          hours_served: number;
          camps_attended: number;
          points: number;
          joined_at: string;
        };
        Insert: Omit<Database['public']['Tables']['volunteers']['Row'], 'id' | 'joined_at'>;
        Update: Partial<Database['public']['Tables']['volunteers']['Insert']>;
      };
      relief_missions: {
        Row: {
          id: string;
          title: string;
          type: string;
          district: string;
          status: string;
          urgency: string;
          location: string;
          start_date: string;
          end_date?: string;
          description: string;
          organized_by: string;
          contact_person: string;
          contact_phone: string;
          volunteers: any;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['relief_missions']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['relief_missions']['Insert']>;
      };
    };
  };
};
