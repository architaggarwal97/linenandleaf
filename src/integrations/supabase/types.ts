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
      credit_failures: {
        Row: {
          amount: number | null
          created_at: string
          id: string
          kind: string
          message: string
          order_id: string | null
          order_reference: string | null
          phone: string | null
          referral_id: string | null
          resolved_at: string | null
          updated_at: string
        }
        Insert: {
          amount?: number | null
          created_at?: string
          id?: string
          kind?: string
          message?: string
          order_id?: string | null
          order_reference?: string | null
          phone?: string | null
          referral_id?: string | null
          resolved_at?: string | null
          updated_at?: string
        }
        Update: {
          amount?: number | null
          created_at?: string
          id?: string
          kind?: string
          message?: string
          order_id?: string | null
          order_reference?: string | null
          phone?: string | null
          referral_id?: string | null
          resolved_at?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      orders: {
        Row: {
          cashback_amount: number | null
          cashback_credited_at: string | null
          created_at: string
          customer_name: string
          delivery_photo_url: string | null
          id: string
          order_amount: number | null
          order_reference: string
          paid: boolean
          paid_method: string | null
          pickup_address: string
          pickup_photo_url: string | null
          preferred_date: string | null
          preferred_window: string | null
          referral_credited_at: string | null
          referred_by_phone: string | null
          review_requested_at: string | null
          service_notes: string | null
          status: string
          whatsapp_number: string
        }
        Insert: {
          cashback_amount?: number | null
          cashback_credited_at?: string | null
          created_at?: string
          customer_name: string
          delivery_photo_url?: string | null
          id?: string
          order_amount?: number | null
          order_reference?: string
          paid?: boolean
          paid_method?: string | null
          pickup_address: string
          pickup_photo_url?: string | null
          preferred_date?: string | null
          preferred_window?: string | null
          referral_credited_at?: string | null
          referred_by_phone?: string | null
          review_requested_at?: string | null
          service_notes?: string | null
          status?: string
          whatsapp_number: string
        }
        Update: {
          cashback_amount?: number | null
          cashback_credited_at?: string | null
          created_at?: string
          customer_name?: string
          delivery_photo_url?: string | null
          id?: string
          order_amount?: number | null
          order_reference?: string
          paid?: boolean
          paid_method?: string | null
          pickup_address?: string
          pickup_photo_url?: string | null
          preferred_date?: string | null
          preferred_window?: string | null
          referral_credited_at?: string | null
          referred_by_phone?: string | null
          review_requested_at?: string | null
          service_notes?: string | null
          status?: string
          whatsapp_number?: string
        }
        Relationships: []
      }
      referrals: {
        Row: {
          completed_at: string | null
          created_at: string
          id: string
          referred_phone: string
          referring_phone: string
          status: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          id?: string
          referred_phone: string
          referring_phone: string
          status?: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          id?: string
          referred_phone?: string
          referring_phone?: string
          status?: string
        }
        Relationships: []
      }
      testimonials: {
        Row: {
          created_at: string
          customer_name: string
          id: string
          order_reference: string | null
          phone: string | null
          rating: number
          review: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          customer_name: string
          id?: string
          order_reference?: string | null
          phone?: string | null
          rating: number
          review: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          customer_name?: string
          id?: string
          order_reference?: string | null
          phone?: string | null
          rating?: number
          review?: string
          updated_at?: string
        }
        Relationships: []
      }
      wallet_balances: {
        Row: {
          balance: number
          created_at: string
          id: string
          phone: string
          updated_at: string
        }
        Insert: {
          balance?: number
          created_at?: string
          id?: string
          phone: string
          updated_at?: string
        }
        Update: {
          balance?: number
          created_at?: string
          id?: string
          phone?: string
          updated_at?: string
        }
        Relationships: []
      }
      wallet_entries: {
        Row: {
          amount: number
          bonus: number
          created_at: string
          customer_name: string
          entry_type: string
          id: string
          note: string | null
          updated_at: string
          whatsapp_number: string
        }
        Insert: {
          amount?: number
          bonus?: number
          created_at?: string
          customer_name?: string
          entry_type?: string
          id?: string
          note?: string | null
          updated_at?: string
          whatsapp_number: string
        }
        Update: {
          amount?: number
          bonus?: number
          created_at?: string
          customer_name?: string
          entry_type?: string
          id?: string
          note?: string | null
          updated_at?: string
          whatsapp_number?: string
        }
        Relationships: []
      }
      wallet_login_codes: {
        Row: {
          attempts: number
          code: string
          code_hash: string
          consumed_at: string | null
          created_at: string
          expires_at: string
          id: string
          phone: string
        }
        Insert: {
          attempts?: number
          code?: string
          code_hash: string
          consumed_at?: string | null
          created_at?: string
          expires_at: string
          id?: string
          phone: string
        }
        Update: {
          attempts?: number
          code?: string
          code_hash?: string
          consumed_at?: string | null
          created_at?: string
          expires_at?: string
          id?: string
          phone?: string
        }
        Relationships: []
      }
      wallet_transactions: {
        Row: {
          amount: number
          bonus: number
          created_at: string
          id: string
          note: string | null
          notified_at: string | null
          phone: string
          resulting_balance: number | null
          status: string
          type: string
        }
        Insert: {
          amount?: number
          bonus?: number
          created_at?: string
          id?: string
          note?: string | null
          notified_at?: string | null
          phone: string
          resulting_balance?: number | null
          status?: string
          type?: string
        }
        Update: {
          amount?: number
          bonus?: number
          created_at?: string
          id?: string
          note?: string | null
          notified_at?: string | null
          phone?: string
          resulting_balance?: number | null
          status?: string
          type?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      order_apply_cashback: { Args: { _order_id: string }; Returns: number }
      referral_complete: {
        Args: { _credit?: number; _referral_id: string }
        Returns: string
      }
      wallet_credit: {
        Args: { _amount: number; _bonus: number; _note: string; _phone: string }
        Returns: number
      }
      wallet_credit_typed: {
        Args: {
          _amount: number
          _bonus: number
          _note: string
          _phone: string
          _type: string
        }
        Returns: number
      }
      wallet_deduct: {
        Args: { _amount: number; _note: string; _phone: string }
        Returns: number
      }
      wallet_pay_order: {
        Args: {
          _amount: number
          _note: string
          _phone: string
          _reference: string
        }
        Returns: number
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
