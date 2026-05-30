export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      contact_submissions: {
        Row: {
          created_at: string
          email: string
          id: string
          message: string
          name: string
          status: string
          subject: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
          status?: string
          subject: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
          status?: string
          subject?: string
        }
        Relationships: []
      }
      pwa_analytics: {
        Row: {
          created_at: string
          event_type: string
          id: string
          metadata: Json
          path: string | null
          platform: string | null
          session_id: string | null
          user_agent: string | null
        }
        Insert: {
          created_at?: string
          event_type: string
          id?: string
          metadata?: Json
          path?: string | null
          platform?: string | null
          session_id?: string | null
          user_agent?: string | null
        }
        Update: {
          created_at?: string
          event_type?: string
          id?: string
          metadata?: Json
          path?: string | null
          platform?: string | null
          session_id?: string | null
          user_agent?: string | null
        }
        Relationships: []
      }
      registrations: {
        Row: {
          accommodation_needed: boolean
          amount_kobo: number | null
          attendee_type: string
          calendar_downloaded: boolean
          checked_in_at: string | null
          checked_in_by: string | null
          created_at: string
          dietary_restrictions: string | null
          email: string
          email_confirmed: boolean
          full_name: string
          heard_about_summit: string | null
          id: string
          payment_status: string
          paystack_reference: string | null
          phone: string
          pwa_installed: boolean
          state: string
          ticket_code: string
          track_selection: string | null
          travel_support_needed: boolean
          verification_checked_at: string | null
          verification_confidence: number | null
          verification_model: string | null
          verification_reason: string | null
          verification_status: string
          whatsapp_notified: boolean
          yali_certificate_url: string | null
          yali_id: string | null
        }
        Insert: {
          accommodation_needed?: boolean
          amount_kobo?: number | null
          attendee_type: string
          calendar_downloaded?: boolean
          checked_in_at?: string | null
          checked_in_by?: string | null
          created_at?: string
          dietary_restrictions?: string | null
          email: string
          email_confirmed?: boolean
          full_name: string
          heard_about_summit?: string | null
          id?: string
          payment_status?: string
          paystack_reference?: string | null
          phone: string
          pwa_installed?: boolean
          state: string
          ticket_code?: string
          track_selection?: string | null
          travel_support_needed?: boolean
          verification_checked_at?: string | null
          verification_confidence?: number | null
          verification_model?: string | null
          verification_reason?: string | null
          verification_status?: string
          whatsapp_notified?: boolean
          yali_certificate_url?: string | null
          yali_id?: string | null
        }
        Update: {
          accommodation_needed?: boolean
          amount_kobo?: number | null
          attendee_type?: string
          calendar_downloaded?: boolean
          checked_in_at?: string | null
          checked_in_by?: string | null
          created_at?: string
          dietary_restrictions?: string | null
          email?: string
          email_confirmed?: boolean
          full_name?: string
          heard_about_summit?: string | null
          id?: string
          payment_status?: string
          paystack_reference?: string | null
          phone?: string
          pwa_installed?: boolean
          state?: string
          ticket_code?: string
          track_selection?: string | null
          travel_support_needed?: boolean
          verification_checked_at?: string | null
          verification_confidence?: number | null
          verification_model?: string | null
          verification_reason?: string | null
          verification_status?: string
          whatsapp_notified?: boolean
          yali_certificate_url?: string | null
          yali_id?: string | null
        }
        Relationships: []
      }
      sponsor_inquiries: {
        Row: {
          assigned_to: string | null
          budget_range: string
          company_name: string
          contact_name: string
          created_at: string
          decision_timeline: string
          email: string
          goals: string
          id: string
          notes: string | null
          phone: string
          preferred_tier: string
          status: string
        }
        Insert: {
          assigned_to?: string | null
          budget_range: string
          company_name: string
          contact_name: string
          created_at?: string
          decision_timeline: string
          email: string
          goals: string
          id?: string
          notes?: string | null
          phone: string
          preferred_tier: string
          status?: string
        }
        Update: {
          assigned_to?: string | null
          budget_range?: string
          company_name?: string
          contact_name?: string
          created_at?: string
          decision_timeline?: string
          email?: string
          goals?: string
          id?: string
          notes?: string | null
          phone?: string
          preferred_tier?: string
          status?: string
        }
        Relationships: []
      }
      stats: {
        Row: {
          id: string
          key: string
          updated_at: string
          value: number
        }
        Insert: {
          id?: string
          key: string
          updated_at?: string
          value?: number
        }
        Update: {
          id?: string
          key?: string
          updated_at?: string
          value?: number
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "staff"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "staff"],
    },
  },
} as const
