export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      profit_loss_data: {
        Row: {
          advertising: number | null
          advertising_fee: number | null
          benefits: number | null
          created_at: string
          created_by: string | null
          crew_labor: number | null
          food_cost: number | null
          franchise_fee: number | null
          gross_profit: number | null
          id: string
          insurance: number | null
          maintenance: number | null
          management_labor: number | null
          month: number
          net_sales: number
          notes: string | null
          operating_income: number | null
          other_expenses: number | null
          other_revenue: number | null
          paper_cost: number | null
          rent: number | null
          rent_percentage: number | null
          restaurant_id: string
          supplies: number | null
          total_cost_of_sales: number | null
          total_labor: number | null
          total_mcdonalds_fees: number | null
          total_operating_expenses: number | null
          total_revenue: number | null
          updated_at: string
          utilities: number | null
          year: number
        }
        Insert: {
          advertising?: number | null
          advertising_fee?: number | null
          benefits?: number | null
          created_at?: string
          created_by?: string | null
          crew_labor?: number | null
          food_cost?: number | null
          franchise_fee?: number | null
          gross_profit?: number | null
          id?: string
          insurance?: number | null
          maintenance?: number | null
          management_labor?: number | null
          month: number
          net_sales?: number
          notes?: string | null
          operating_income?: number | null
          other_expenses?: number | null
          other_revenue?: number | null
          paper_cost?: number | null
          rent?: number | null
          rent_percentage?: number | null
          restaurant_id: string
          supplies?: number | null
          total_cost_of_sales?: number | null
          total_labor?: number | null
          total_mcdonalds_fees?: number | null
          total_operating_expenses?: number | null
          total_revenue?: number | null
          updated_at?: string
          utilities?: number | null
          year: number
        }
        Update: {
          advertising?: number | null
          advertising_fee?: number | null
          benefits?: number | null
          created_at?: string
          created_by?: string | null
          crew_labor?: number | null
          food_cost?: number | null
          franchise_fee?: number | null
          gross_profit?: number | null
          id?: string
          insurance?: number | null
          maintenance?: number | null
          management_labor?: number | null
          month?: number
          net_sales?: number
          notes?: string | null
          operating_income?: number | null
          other_expenses?: number | null
          other_revenue?: number | null
          paper_cost?: number | null
          rent?: number | null
          rent_percentage?: number | null
          restaurant_id?: string
          supplies?: number | null
          total_cost_of_sales?: number | null
          total_labor?: number | null
          total_mcdonalds_fees?: number | null
          total_operating_expenses?: number | null
          total_revenue?: number | null
          updated_at?: string
          utilities?: number | null
          year?: number
        }
        Relationships: []
      }
      profit_loss_templates: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_default: boolean | null
          name: string
          template_data: Json
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_default?: boolean | null
          name: string
          template_data: Json
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_default?: boolean | null
          name?: string
          template_data?: Json
        }
        Relationships: []
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
