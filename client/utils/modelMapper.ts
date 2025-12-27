export const mapFormToApiPayload = (formData: any) => {
    // Clone to avoid mutating original state
    const payload: any = { ...formData };
  
    // 1. Map Education
    const educationMap: Record<string, string> = {
      'HighSchool': 'education_highschool',
      'Bachelor': 'education_bachelor',
      'Master': 'education_master',
      'PhD': 'education_phd'
    };
    // Reset all to 0
    Object.values(educationMap).forEach(key => payload[key] = 0);
    // Set selected to 1
    if (educationMap[formData.education]) {
      payload[educationMap[formData.education]] = 1;
    }
  
    // 2. Map Employment Type
    const employmentMap: Record<string, string> = {
      'FullTime': 'employment_type_fulltime',
      'PartTime': 'employment_type_parttime',
      'SelfEmployed': 'employment_type_selfemployed',
      'Unemployed': 'employment_type_unemployed'
    };
    Object.values(employmentMap).forEach(key => payload[key] = 0);
    if (employmentMap[formData.employment_type]) {
      payload[employmentMap[formData.employment_type]] = 1;
    }
  
    // 3. Map Marital Status
    const maritalMap: Record<string, string> = {
      'Married': 'marital_status_married',
      'Single': 'marital_status_single',
      'Divorced': 'marital_status_divorced' 
    };
    // Note: API Pydantic model might not explicitly list 'divorced' in my previous code 
    // but the model feature_names usually has it. 
    // We'll set it; if API ignores it, fine. But likely needed for model alignment.
    Object.values(maritalMap).forEach(key => payload[key] = 0);
    if (maritalMap[formData.marital_status]) {
      payload[maritalMap[formData.marital_status]] = 1;
    }
  
    // Remove the raw string fields to keep payload clean (optional, but good practice)
    delete payload.education;
    delete payload.employment_type;
    delete payload.marital_status;
  
    return payload;
  };
