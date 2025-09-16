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
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      content_creations: {
        Row: {
          content_type: string
          content_url: string | null
          created_at: string
          description: string | null
          id: string
          is_favorite: boolean | null
          is_shared: boolean | null
          lesson_number: number | null
          metadata: Json | null
          storage_url: string | null
          thumbnail_url: string | null
          title: string
          tool_used: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          content_type: string
          content_url?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_favorite?: boolean | null
          is_shared?: boolean | null
          lesson_number?: number | null
          metadata?: Json | null
          storage_url?: string | null
          thumbnail_url?: string | null
          title: string
          tool_used?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          content_type?: string
          content_url?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_favorite?: boolean | null
          is_shared?: boolean | null
          lesson_number?: number | null
          metadata?: Json | null
          storage_url?: string | null
          thumbnail_url?: string | null
          title?: string
          tool_used?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      content_feedback: {
        Row: {
          content_id: string
          created_at: string
          feedback_text: string
          id: string
          teacher_id: string
          updated_at: string
        }
        Insert: {
          content_id: string
          created_at?: string
          feedback_text: string
          id?: string
          teacher_id: string
          updated_at?: string
        }
        Update: {
          content_id?: string
          created_at?: string
          feedback_text?: string
          id?: string
          teacher_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "content_feedback_content_id_fkey"
            columns: ["content_id"]
            isOneToOne: false
            referencedRelation: "content_creations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "content_feedback_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      coupon_usage: {
        Row: {
          coupon_code: string
          created_at: string
          id: string
          used_at: string
          user_id: string
        }
        Insert: {
          coupon_code: string
          created_at?: string
          id?: string
          used_at?: string
          user_id: string
        }
        Update: {
          coupon_code?: string
          created_at?: string
          id?: string
          used_at?: string
          user_id?: string
        }
        Relationships: []
      }
      coupons: {
        Row: {
          access_duration_days: number | null
          code: string
          created_at: string
          current_uses: number
          discount_amount: number
          discount_type: string
          expires_at: string | null
          id: string
          is_active: boolean
          max_uses: number | null
          updated_at: string
        }
        Insert: {
          access_duration_days?: number | null
          code: string
          created_at?: string
          current_uses?: number
          discount_amount: number
          discount_type?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean
          max_uses?: number | null
          updated_at?: string
        }
        Update: {
          access_duration_days?: number | null
          code?: string
          created_at?: string
          current_uses?: number
          discount_amount?: number
          discount_type?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean
          max_uses?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      frequently_asked_questions: {
        Row: {
          answer: string
          category: string | null
          created_at: string
          id: string
          is_active: boolean
          keywords: string[] | null
          lesson_number: number | null
          question: string
          updated_at: string
        }
        Insert: {
          answer: string
          category?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          keywords?: string[] | null
          lesson_number?: number | null
          question: string
          updated_at?: string
        }
        Update: {
          answer?: string
          category?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          keywords?: string[] | null
          lesson_number?: number | null
          question?: string
          updated_at?: string
        }
        Relationships: []
      }
      google_drive_credentials: {
        Row: {
          access_token: string
          allowed_users: string[] | null
          created_at: string
          folder_id: string
          id: string
          refresh_token: string | null
          shared_drive_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          access_token: string
          allowed_users?: string[] | null
          created_at?: string
          folder_id: string
          id?: string
          refresh_token?: string | null
          shared_drive_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          access_token?: string
          allowed_users?: string[] | null
          created_at?: string
          folder_id?: string
          id?: string
          refresh_token?: string | null
          shared_drive_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          created_at: string
          currency: string
          id: string
          payer_email: string | null
          payer_id: string | null
          paypal_transaction_id: string | null
          paypal_verification_date: string | null
          service_type: string | null
          status: string
          updated_at: string | null
          user_id: string
          verified_with_paypal: boolean | null
        }
        Insert: {
          amount: number
          created_at?: string
          currency?: string
          id?: string
          payer_email?: string | null
          payer_id?: string | null
          paypal_transaction_id?: string | null
          paypal_verification_date?: string | null
          service_type?: string | null
          status?: string
          updated_at?: string | null
          user_id: string
          verified_with_paypal?: boolean | null
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string
          id?: string
          payer_email?: string | null
          payer_id?: string | null
          paypal_transaction_id?: string | null
          paypal_verification_date?: string | null
          service_type?: string | null
          status?: string
          updated_at?: string | null
          user_id?: string
          verified_with_paypal?: boolean | null
        }
        Relationships: []
      }
      question_responses: {
        Row: {
          content: string
          created_at: string
          id: string
          is_solution: boolean | null
          question_id: string
          teacher_id: string
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          is_solution?: boolean | null
          question_id: string
          teacher_id: string
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          is_solution?: boolean | null
          question_id?: string
          teacher_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "question_responses_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "student_questions"
            referencedColumns: ["id"]
          },
        ]
      }
      role_change_audit: {
        Row: {
          changed_by_user_id: string
          created_at: string | null
          id: string
          new_role: string
          old_role: string | null
          target_user_id: string
        }
        Insert: {
          changed_by_user_id: string
          created_at?: string | null
          id?: string
          new_role: string
          old_role?: string | null
          target_user_id: string
        }
        Update: {
          changed_by_user_id?: string
          created_at?: string | null
          id?: string
          new_role?: string
          old_role?: string | null
          target_user_id?: string
        }
        Relationships: []
      }
      security_audit_log: {
        Row: {
          action: string
          created_at: string | null
          details: Json | null
          id: string
          ip_address: unknown | null
          resource: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          details?: Json | null
          id?: string
          ip_address?: unknown | null
          resource?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          details?: Json | null
          id?: string
          ip_address?: unknown | null
          resource?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      service_costs_history: {
        Row: {
          cost: number
          created_at: string
          currency: string
          details: Json | null
          id: string
          recorded_at: string
          service_name: string
          status: string
          usage_percentage: number
        }
        Insert: {
          cost?: number
          created_at?: string
          currency?: string
          details?: Json | null
          id?: string
          recorded_at?: string
          service_name: string
          status?: string
          usage_percentage?: number
        }
        Update: {
          cost?: number
          created_at?: string
          currency?: string
          details?: Json | null
          id?: string
          recorded_at?: string
          service_name?: string
          status?: string
          usage_percentage?: number
        }
        Relationships: []
      }
      student_questions: {
        Row: {
          ai_responded_at: string | null
          ai_response: string | null
          content: string
          created_at: string
          id: string
          lesson_number: number | null
          needs_teacher_help: boolean | null
          priority: string
          status: string
          student_id: string
          teacher_id: string | null
          title: string
          updated_at: string
        }
        Insert: {
          ai_responded_at?: string | null
          ai_response?: string | null
          content: string
          created_at?: string
          id?: string
          lesson_number?: number | null
          needs_teacher_help?: boolean | null
          priority?: string
          status?: string
          student_id: string
          teacher_id?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          ai_responded_at?: string | null
          ai_response?: string | null
          content?: string
          created_at?: string
          id?: string
          lesson_number?: number | null
          needs_teacher_help?: boolean | null
          priority?: string
          status?: string
          student_id?: string
          teacher_id?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      system_settings: {
        Row: {
          created_at: string
          description: string | null
          id: string
          key: string
          updated_at: string
          value: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          key: string
          updated_at?: string
          value: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          key?: string
          updated_at?: string
          value?: string
        }
        Relationships: []
      }
      teacher_login_tokens: {
        Row: {
          created_at: string
          expires_at: string
          id: string
          redirect_path: string | null
          teacher_id: string
          token: string
          used_at: string | null
        }
        Insert: {
          created_at?: string
          expires_at: string
          id?: string
          redirect_path?: string | null
          teacher_id: string
          token: string
          used_at?: string | null
        }
        Update: {
          created_at?: string
          expires_at?: string
          id?: string
          redirect_path?: string | null
          teacher_id?: string
          token?: string
          used_at?: string | null
        }
        Relationships: []
      }
      teacher_notifications: {
        Row: {
          created_at: string
          email_notifications: boolean | null
          id: string
          offline_sms_delay_minutes: number | null
          phone_number: string | null
          sms_enabled: boolean | null
          teacher_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email_notifications?: boolean | null
          id?: string
          offline_sms_delay_minutes?: number | null
          phone_number?: string | null
          sms_enabled?: boolean | null
          teacher_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email_notifications?: boolean | null
          id?: string
          offline_sms_delay_minutes?: number | null
          phone_number?: string | null
          sms_enabled?: boolean | null
          teacher_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_sessions: {
        Row: {
          created_at: string
          device_fingerprint: string | null
          expires_at: string
          id: string
          ip_address: unknown | null
          is_active: boolean
          last_active: string
          location_info: Json | null
          session_token: string
          user_agent: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          device_fingerprint?: string | null
          expires_at?: string
          id?: string
          ip_address?: unknown | null
          is_active?: boolean
          last_active?: string
          location_info?: Json | null
          session_token: string
          user_agent?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          device_fingerprint?: string | null
          expires_at?: string
          id?: string
          ip_address?: unknown | null
          is_active?: boolean
          last_active?: string
          location_info?: Json | null
          session_token?: string
          user_agent?: string | null
          user_id?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          access_duration_days: number | null
          access_expires_at: string | null
          access_granted_at: string | null
          bina_access_expires_at: string | null
          bina_access_granted_at: string | null
          created_at: string
          email: string
          flipbook_access_expires_at: string | null
          flipbook_access_granted_at: string | null
          has_paid: boolean | null
          id: string
          last_seen: string | null
          name: string | null
          paid_for_bina: boolean | null
          paid_for_flipbook: boolean | null
          parent_emails: string[] | null
          payment_amount: number | null
          registered_for_bina: boolean | null
          registered_for_flipbook: boolean | null
          role: string | null
          updated_at: string | null
        }
        Insert: {
          access_duration_days?: number | null
          access_expires_at?: string | null
          access_granted_at?: string | null
          bina_access_expires_at?: string | null
          bina_access_granted_at?: string | null
          created_at?: string
          email?: string
          flipbook_access_expires_at?: string | null
          flipbook_access_granted_at?: string | null
          has_paid?: boolean | null
          id?: string
          last_seen?: string | null
          name?: string | null
          paid_for_bina?: boolean | null
          paid_for_flipbook?: boolean | null
          parent_emails?: string[] | null
          payment_amount?: number | null
          registered_for_bina?: boolean | null
          registered_for_flipbook?: boolean | null
          role?: string | null
          updated_at?: string | null
        }
        Update: {
          access_duration_days?: number | null
          access_expires_at?: string | null
          access_granted_at?: string | null
          bina_access_expires_at?: string | null
          bina_access_granted_at?: string | null
          created_at?: string
          email?: string
          flipbook_access_expires_at?: string | null
          flipbook_access_granted_at?: string | null
          has_paid?: boolean | null
          id?: string
          last_seen?: string | null
          name?: string | null
          paid_for_bina?: boolean | null
          paid_for_flipbook?: boolean | null
          parent_emails?: string[] | null
          payment_amount?: number | null
          registered_for_bina?: boolean | null
          registered_for_flipbook?: boolean | null
          role?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      cleanup_expired_sessions: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      cleanup_old_service_costs: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      create_payment: {
        Args: { p_amount: number; p_transaction_id: string; p_user_id: string }
        Returns: {
          amount: number
          created_at: string
          currency: string
          id: string
          paypal_transaction_id: string
          status: string
          updated_at: string
          user_id: string
        }[]
      }
      create_user_session: {
        Args: {
          p_device_fingerprint?: string
          p_ip_address?: unknown
          p_user_agent?: string
          p_user_id: string
        }
        Returns: string
      }
      get_access_days_remaining: {
        Args: { user_id?: string }
        Returns: number
      }
      get_allowed_google_drives: {
        Args: Record<PropertyKey, never>
        Returns: {
          allowed_users: string[]
          created_at: string
          folder_id: string
          id: string
          shared_drive_id: string
          updated_at: string
          user_id: string
        }[]
      }
      get_auth_email: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_google_drive_credentials_safe: {
        Args: { p_user_id?: string }
        Returns: {
          allowed_users: string[]
          created_at: string
          folder_id: string
          id: string
          shared_drive_id: string
          updated_at: string
          user_id: string
        }[]
      }
      get_google_drive_tokens: {
        Args: { p_user_id?: string }
        Returns: {
          access_token: string
          refresh_token: string
        }[]
      }
      get_user_payments: {
        Args: { p_user_id: string }
        Returns: {
          amount: number
          created_at: string
          currency: string
          id: string
          paypal_transaction_id: string
          status: string
          updated_at: string
          user_id: string
        }[]
      }
      grant_course_access: {
        Args: { amount?: number; duration_days?: number; user_id: string }
        Returns: undefined
      }
      grant_service_access: {
        Args: {
          amount?: number
          duration_days?: number
          service_name: string
          user_id: string
        }
        Returns: undefined
      }
      has_active_access: {
        Args: { user_id?: string }
        Returns: boolean
      }
      has_service_access: {
        Args: { service_name: string; user_id: string }
        Returns: boolean
      }
      is_parent_of: {
        Args: { p_student_id: string }
        Returns: boolean
      }
      is_parent_of_content: {
        Args: { p_content_id: string }
        Returns: boolean
      }
      is_user_online: {
        Args: { user_id: string }
        Returns: boolean
      }
      log_security_event: {
        Args: { p_action: string; p_details?: Json; p_resource?: string }
        Returns: undefined
      }
      redeem_coupon_access: {
        Args: {
          p_coupon_code: string
          p_duration_days: number
          p_user_id: string
        }
        Returns: undefined
      }
      reset_user_testing_data: {
        Args: { p_coupon_code: string; p_user_name: string }
        Returns: undefined
      }
      update_google_drive_tokens: {
        Args: {
          p_access_token: string
          p_refresh_token?: string
          p_user_id: string
        }
        Returns: boolean
      }
      update_user_last_seen: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      update_user_role: {
        Args: { new_role: string; target_user_id: string }
        Returns: undefined
      }
      validate_coupon: {
        Args: { coupon_code: string }
        Returns: {
          access_duration_days: number
          discount_amount: number
          discount_type: string
          message: string
          valid: boolean
        }[]
      }
      validate_teacher_token: {
        Args: { p_token: string }
        Returns: {
          redirect_path: string
          teacher_id: string
          valid: boolean
        }[]
      }
      validate_user_session: {
        Args: {
          p_ip_address?: unknown
          p_session_token: string
          p_user_agent?: string
          p_user_id: string
        }
        Returns: {
          is_valid: boolean
          message: string
          should_logout: boolean
          suspicious_activity: boolean
        }[]
      }
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
