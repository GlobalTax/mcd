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
      base_restaurants: {
        Row: {
          address: string
          autonomous_community: string | null
          city: string
          company_tax_id: string | null
          country: string | null
          created_at: string
          created_by: string | null
          franchisee_email: string | null
          franchisee_name: string | null
          id: string
          opening_date: string | null
          postal_code: string | null
          property_type: string | null
          restaurant_name: string
          restaurant_type: string | null
          seating_capacity: number | null
          site_number: string
          square_meters: number | null
          state: string | null
          updated_at: string
        }
        Insert: {
          address: string
          autonomous_community?: string | null
          city: string
          company_tax_id?: string | null
          country?: string | null
          created_at?: string
          created_by?: string | null
          franchisee_email?: string | null
          franchisee_name?: string | null
          id?: string
          opening_date?: string | null
          postal_code?: string | null
          property_type?: string | null
          restaurant_name: string
          restaurant_type?: string | null
          seating_capacity?: number | null
          site_number: string
          square_meters?: number | null
          state?: string | null
          updated_at?: string
        }
        Update: {
          address?: string
          autonomous_community?: string | null
          city?: string
          company_tax_id?: string | null
          country?: string | null
          created_at?: string
          created_by?: string | null
          franchisee_email?: string | null
          franchisee_name?: string | null
          id?: string
          opening_date?: string | null
          postal_code?: string | null
          property_type?: string | null
          restaurant_name?: string
          restaurant_type?: string | null
          seating_capacity?: number | null
          site_number?: string
          square_meters?: number | null
          state?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      franchisee_restaurants: {
        Row: {
          advertising_fee_percentage: number | null
          assigned_at: string
          average_monthly_sales: number | null
          base_restaurant_id: string | null
          franchise_end_date: string | null
          franchise_fee_percentage: number | null
          franchise_start_date: string | null
          franchisee_id: string | null
          id: string
          last_year_revenue: number | null
          lease_end_date: string | null
          lease_start_date: string | null
          monthly_rent: number | null
          notes: string | null
          status: string | null
          updated_at: string
        }
        Insert: {
          advertising_fee_percentage?: number | null
          assigned_at?: string
          average_monthly_sales?: number | null
          base_restaurant_id?: string | null
          franchise_end_date?: string | null
          franchise_fee_percentage?: number | null
          franchise_start_date?: string | null
          franchisee_id?: string | null
          id?: string
          last_year_revenue?: number | null
          lease_end_date?: string | null
          lease_start_date?: string | null
          monthly_rent?: number | null
          notes?: string | null
          status?: string | null
          updated_at?: string
        }
        Update: {
          advertising_fee_percentage?: number | null
          assigned_at?: string
          average_monthly_sales?: number | null
          base_restaurant_id?: string | null
          franchise_end_date?: string | null
          franchise_fee_percentage?: number | null
          franchise_start_date?: string | null
          franchisee_id?: string | null
          id?: string
          last_year_revenue?: number | null
          lease_end_date?: string | null
          lease_start_date?: string | null
          monthly_rent?: number | null
          notes?: string | null
          status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "franchisee_restaurants_base_restaurant_id_fkey"
            columns: ["base_restaurant_id"]
            isOneToOne: false
            referencedRelation: "base_restaurants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "franchisee_restaurants_franchisee_id_fkey"
            columns: ["franchisee_id"]
            isOneToOne: false
            referencedRelation: "franchisees"
            referencedColumns: ["id"]
          },
        ]
      }
      franchisees: {
        Row: {
          address: string | null
          city: string | null
          company_name: string | null
          country: string | null
          created_at: string
          franchisee_name: string
          id: string
          postal_code: string | null
          state: string | null
          tax_id: string | null
          total_restaurants: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          address?: string | null
          city?: string | null
          company_name?: string | null
          country?: string | null
          created_at?: string
          franchisee_name: string
          id?: string
          postal_code?: string | null
          state?: string | null
          tax_id?: string | null
          total_restaurants?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          address?: string | null
          city?: string | null
          company_name?: string | null
          country?: string | null
          created_at?: string
          franchisee_name?: string
          id?: string
          postal_code?: string | null
          state?: string | null
          tax_id?: string | null
          total_restaurants?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "franchisees_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      monthly_tracking: {
        Row: {
          actual_food_cost: number | null
          actual_labor_cost: number | null
          actual_marketing: number | null
          actual_other_expenses: number | null
          actual_rent: number | null
          actual_revenue: number | null
          actual_utilities: number | null
          average_ticket: number | null
          created_at: string
          created_by: string | null
          customer_count: number | null
          franchisee_restaurant_id: string | null
          id: string
          labor_hours: number | null
          month: number
          notes: string | null
          updated_at: string
          year: number
        }
        Insert: {
          actual_food_cost?: number | null
          actual_labor_cost?: number | null
          actual_marketing?: number | null
          actual_other_expenses?: number | null
          actual_rent?: number | null
          actual_revenue?: number | null
          actual_utilities?: number | null
          average_ticket?: number | null
          created_at?: string
          created_by?: string | null
          customer_count?: number | null
          franchisee_restaurant_id?: string | null
          id?: string
          labor_hours?: number | null
          month: number
          notes?: string | null
          updated_at?: string
          year: number
        }
        Update: {
          actual_food_cost?: number | null
          actual_labor_cost?: number | null
          actual_marketing?: number | null
          actual_other_expenses?: number | null
          actual_rent?: number | null
          actual_revenue?: number | null
          actual_utilities?: number | null
          average_ticket?: number | null
          created_at?: string
          created_by?: string | null
          customer_count?: number | null
          franchisee_restaurant_id?: string | null
          id?: string
          labor_hours?: number | null
          month?: number
          notes?: string | null
          updated_at?: string
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "monthly_tracking_franchisee_restaurant_id_fkey"
            columns: ["franchisee_restaurant_id"]
            isOneToOne: false
            referencedRelation: "franchisee_restaurants"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          full_name: string | null
          id: string
          phone: string | null
          role: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          full_name?: string | null
          id: string
          phone?: string | null
          role?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          role?: string
          updated_at?: string
        }
        Relationships: []
      }
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
        Relationships: [
          {
            foreignKeyName: "fk_profit_loss_restaurant"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["site_number"]
          },
        ]
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
      restaurant_budgets: {
        Row: {
          budgeted_food_cost: number | null
          budgeted_labor_cost: number | null
          budgeted_marketing: number | null
          budgeted_other_expenses: number | null
          budgeted_rent: number | null
          budgeted_revenue: number
          budgeted_utilities: number | null
          created_at: string
          created_by: string | null
          franchisee_restaurant_id: string | null
          id: string
          monthly_profit_target: number | null
          monthly_revenue_target: number | null
          updated_at: string
          year: number
        }
        Insert: {
          budgeted_food_cost?: number | null
          budgeted_labor_cost?: number | null
          budgeted_marketing?: number | null
          budgeted_other_expenses?: number | null
          budgeted_rent?: number | null
          budgeted_revenue: number
          budgeted_utilities?: number | null
          created_at?: string
          created_by?: string | null
          franchisee_restaurant_id?: string | null
          id?: string
          monthly_profit_target?: number | null
          monthly_revenue_target?: number | null
          updated_at?: string
          year: number
        }
        Update: {
          budgeted_food_cost?: number | null
          budgeted_labor_cost?: number | null
          budgeted_marketing?: number | null
          budgeted_other_expenses?: number | null
          budgeted_rent?: number | null
          budgeted_revenue?: number
          budgeted_utilities?: number | null
          created_at?: string
          created_by?: string | null
          franchisee_restaurant_id?: string | null
          id?: string
          monthly_profit_target?: number | null
          monthly_revenue_target?: number | null
          updated_at?: string
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "restaurant_budgets_franchisee_restaurant_id_fkey"
            columns: ["franchisee_restaurant_id"]
            isOneToOne: false
            referencedRelation: "franchisee_restaurants"
            referencedColumns: ["id"]
          },
        ]
      }
      restaurants: {
        Row: {
          address: string
          city: string
          country: string | null
          created_at: string
          franchisee_id: string
          id: string
          opening_date: string | null
          postal_code: string | null
          restaurant_name: string
          restaurant_type: string | null
          seating_capacity: number | null
          site_number: string
          square_meters: number | null
          state: string | null
          status: string | null
          updated_at: string
        }
        Insert: {
          address: string
          city: string
          country?: string | null
          created_at?: string
          franchisee_id: string
          id?: string
          opening_date?: string | null
          postal_code?: string | null
          restaurant_name: string
          restaurant_type?: string | null
          seating_capacity?: number | null
          site_number: string
          square_meters?: number | null
          state?: string | null
          status?: string | null
          updated_at?: string
        }
        Update: {
          address?: string
          city?: string
          country?: string | null
          created_at?: string
          franchisee_id?: string
          id?: string
          opening_date?: string | null
          postal_code?: string | null
          restaurant_name?: string
          restaurant_type?: string | null
          seating_capacity?: number | null
          site_number?: string
          square_meters?: number | null
          state?: string | null
          status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "restaurants_franchisee_id_fkey"
            columns: ["franchisee_id"]
            isOneToOne: false
            referencedRelation: "franchisees"
            referencedColumns: ["id"]
          },
        ]
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
