import { supabase } from './api/index';
// Helper function to convert any to YearlyValuationData
const convertToYearlyData = (data) => {
    if (!data || !Array.isArray(data))
        return [];
    return data;
};
// Helper function to convert any to Record
const convertToRecord = (data) => {
    if (!data || typeof data !== 'object')
        return {};
    return data;
};
export const fetchValuationsFromDB = async () => {
    const { data, error } = await supabase
        .from('restaurant_valuations')
        .select('*')
        .order('created_at', { ascending: false });
    if (error)
        throw error;
    // Convert Supabase data to our types
    const typedValuations = (data || []).map((item) => ({
        id: item.id,
        restaurant_id: item.restaurant_id,
        restaurant_name: item.restaurant_name,
        valuation_name: item.valuation_name,
        valuation_date: item.valuation_date,
        change_date: item.change_date,
        franchise_end_date: item.franchise_end_date,
        remaining_years: item.remaining_years,
        inflation_rate: item.inflation_rate,
        discount_rate: item.discount_rate,
        growth_rate: item.growth_rate,
        yearly_data: convertToYearlyData(item.yearly_data),
        total_present_value: item.total_present_value,
        projections: item.projections,
        created_at: item.created_at,
        updated_at: item.updated_at,
        created_by: item.created_by
    }));
    return typedValuations;
};
export const fetchScenariosFromDB = async (valuationId) => {
    const { data, error } = await supabase
        .from('valuation_scenarios')
        .select('*')
        .eq('valuation_id', valuationId)
        .order('created_at', { ascending: false });
    if (error)
        throw error;
    // Convert Supabase data to our types
    const typedScenarios = (data || []).map((item) => ({
        id: item.id,
        valuation_id: item.valuation_id,
        scenario_name: item.scenario_name,
        scenario_description: item.scenario_description || '',
        inflation_rate_modifier: item.inflation_rate_modifier || 0,
        discount_rate_modifier: item.discount_rate_modifier || 0,
        growth_rate_modifier: item.growth_rate_modifier || 0,
        yearly_modifications: convertToRecord(item.yearly_modifications),
        total_present_value: item.total_present_value || 0,
        projections: item.projections || {},
        variance_from_base: item.variance_from_base || 0,
        variance_percentage: item.variance_percentage || 0,
        created_at: item.created_at,
        updated_at: item.updated_at
    }));
    return typedScenarios;
};
export const saveValuationToDB = async (valuation, userId) => {
    // Convert our types to Supabase format
    const supabaseData = {
        restaurant_id: valuation.restaurant_id,
        restaurant_name: valuation.restaurant_name,
        valuation_name: valuation.valuation_name,
        valuation_date: valuation.valuation_date,
        change_date: valuation.change_date || null,
        franchise_end_date: valuation.franchise_end_date || null,
        remaining_years: valuation.remaining_years || null,
        inflation_rate: valuation.inflation_rate,
        discount_rate: valuation.discount_rate,
        growth_rate: valuation.growth_rate,
        yearly_data: valuation.yearly_data,
        total_present_value: valuation.total_present_value || null,
        projections: valuation.projections,
        created_by: userId || null
    };
    const { data, error } = await supabase
        .from('restaurant_valuations')
        .insert(supabaseData)
        .select()
        .single();
    if (error)
        throw error;
    // Convert back to our type
    const typedData = {
        id: data.id,
        restaurant_id: data.restaurant_id,
        restaurant_name: data.restaurant_name,
        valuation_name: data.valuation_name,
        valuation_date: data.valuation_date,
        change_date: data.change_date,
        franchise_end_date: data.franchise_end_date,
        remaining_years: data.remaining_years,
        inflation_rate: data.inflation_rate,
        discount_rate: data.discount_rate,
        growth_rate: data.growth_rate,
        yearly_data: convertToYearlyData(data.yearly_data),
        total_present_value: data.total_present_value,
        projections: data.projections,
        created_at: data.created_at,
        updated_at: data.updated_at,
        created_by: data.created_by
    };
    return typedData;
};
export const updateValuationInDB = async (id, updates) => {
    // Convert updates to Supabase format
    const supabaseUpdates = {};
    Object.keys(updates).forEach(key => {
        const value = updates[key];
        if (key === 'yearly_data') {
            supabaseUpdates[key] = value;
        }
        else if (key === 'projections') {
            supabaseUpdates[key] = value;
        }
        else {
            supabaseUpdates[key] = value;
        }
    });
    const { error } = await supabase
        .from('restaurant_valuations')
        .update(supabaseUpdates)
        .eq('id', id);
    if (error)
        throw error;
};
export const deleteValuationFromDB = async (id) => {
    const { error } = await supabase
        .from('restaurant_valuations')
        .delete()
        .eq('id', id);
    if (error)
        throw error;
};
export const saveScenarioToDB = async (scenario) => {
    const supabaseData = {
        valuation_id: scenario.valuation_id,
        scenario_name: scenario.scenario_name,
        scenario_description: scenario.scenario_description || null,
        inflation_rate_modifier: scenario.inflation_rate_modifier || 0,
        discount_rate_modifier: scenario.discount_rate_modifier || 0,
        growth_rate_modifier: scenario.growth_rate_modifier || 0,
        yearly_modifications: scenario.yearly_modifications,
        total_present_value: scenario.total_present_value || null,
        projections: scenario.projections,
        variance_from_base: scenario.variance_from_base || null,
        variance_percentage: scenario.variance_percentage || null
    };
    const { data, error } = await supabase
        .from('valuation_scenarios')
        .insert(supabaseData)
        .select()
        .single();
    if (error)
        throw error;
    // Convert back to our type
    const typedData = {
        id: data.id,
        valuation_id: data.valuation_id,
        scenario_name: data.scenario_name,
        scenario_description: data.scenario_description || '',
        inflation_rate_modifier: data.inflation_rate_modifier || 0,
        discount_rate_modifier: data.discount_rate_modifier || 0,
        growth_rate_modifier: data.growth_rate_modifier || 0,
        yearly_modifications: convertToRecord(data.yearly_modifications),
        total_present_value: data.total_present_value || 0,
        projections: data.projections || {},
        variance_from_base: data.variance_from_base || 0,
        variance_percentage: data.variance_percentage || 0,
        created_at: data.created_at,
        updated_at: data.updated_at
    };
    return typedData;
};
export const deleteScenarioFromDB = async (id) => {
    const { error } = await supabase
        .from('valuation_scenarios')
        .delete()
        .eq('id', id);
    if (error)
        throw error;
};
