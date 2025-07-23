import React, { useState, useEffect } from "react";
import DashboardLayout from "../components/Layout/DashboardLayout";
import { FiEdit2, FiX, FiRefreshCw, FiSave, FiHome, FiAlertCircle, FiCheckCircle, FiSettings, FiPlus, FiBriefcase } from "react-icons/fi";
import api from "../api/axiosConfig";

const initialData = {
  companyField1: "",
  companyField2: "",
  companyField3: "",
  companyField4: "",
  companyField5: "",
  companyField6: "",
  companyField7: "",
  companyField8: "",
  companyField9: "",
  companyField10: "",
};

export default function CompanyAdditionalFields() {
  const [data, setData] = useState(initialData);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState(initialData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  // Fetch company additional fields from API
  const fetchCompanyAdditionalFields = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const uid = localStorage.getItem('uid');
      
      if (!token || !uid) {
        throw new Error('Authentication required. Please log in.');
      }

      const response = await api.post('/groupSettings/get_company_additional_fields', {}, {
        headers: {
          'Client-Service': 'COHAPPRT',
          'Auth-Key': '4F21zrjoAASqz25690Zpqf67UyY',
          'uid': uid,
          'token': token,
          'rurl': 'login.etribes.in',
        }
      });

      console.log('Company Additional Fields Response:', response.data);
      
      // Map backend data to frontend format - handle nested structure
      const backendData = response.data?.data || response.data || {};
      console.log('Backend data received:', backendData);
      console.log('All available fields:', Object.keys(backendData));
      console.log('Response status:', response.data?.status);
      
      // Map backend data to frontend format based on actual API response
      const mappedData = {
        companyField1: backendData.ad1 || "",
        companyField2: backendData.ad2 || "",
        companyField3: backendData.ad3 || "",
        companyField4: backendData.ad4 || "",
        companyField5: backendData.ad5 || "",
        companyField6: backendData.ad6 || "",
        companyField7: backendData.ad7 || "",
        companyField8: backendData.ad8 || "",
        companyField9: backendData.ad9 || "",
        companyField10: backendData.ad10 || "",
      };
      
      console.log('Backend ad1 value:', backendData.ad1);
      console.log('Mapped companyField1 value:', mappedData.companyField1);

      console.log('Mapped data:', mappedData);
      
      // Check if backend data is an array (different structure)
      if (Array.isArray(backendData)) {
        console.log('Backend data is an array, processing differently');
        const arrayMappedData = { ...initialData };
        backendData.forEach((field, index) => {
          if (index < 10) {
            arrayMappedData[`companyField${index + 1}`] = field.name || field.label || field.value || field || initialData[`companyField${index + 1}`];
          }
        });
        setData(arrayMappedData);
        setForm(arrayMappedData);
      } else if (!backendData || Object.keys(backendData).length === 0) {
        console.log('No data from API, using default data');
        setData(initialData);
        setForm(initialData);
      } else {
        console.log('Setting data to state:', mappedData);
        console.log('Current data state before update:', data);
        setData(mappedData);
        setForm(mappedData);
        console.log('Data state should be updated to:', mappedData);
      }
    } catch (err) {
      console.error('Fetch company additional fields error:', err);
      const errorMessage = err.message || 'Failed to fetch company additional fields';
      setError(errorMessage);
      
      if (errorMessage.toLowerCase().includes('token') || errorMessage.toLowerCase().includes('unauthorized') || errorMessage.toLowerCase().includes('log in')) {
        localStorage.removeItem('token');
        localStorage.removeItem('uid');
        window.location.href = '/login';
      }
    } finally {
      setLoading(false);
    }
  };

  // Validate company additional fields
  const validateFields = (fieldsData) => {
    const errors = [];

    // Check for required fields (at least first 5 should be filled)
    for (let i = 1; i <= 5; i++) {
      const fieldName = `companyField${i}`;
      if (!fieldsData[fieldName] || fieldsData[fieldName].trim() === '') {
        errors.push(`Company Field ${i} is required`);
      }
    }

    // Check for duplicate field names
    const fieldValues = Object.values(fieldsData).filter(val => val && val.trim() !== '');
    const uniqueValues = new Set(fieldValues);
    if (fieldValues.length !== uniqueValues.size) {
      errors.push('Field names must be unique');
    }

    // Check for field name length
    Object.entries(fieldsData).forEach(([key, value]) => {
      if (value && value.trim() !== '') {
        if (value.trim().length < 2) {
          errors.push(`${key.replace('companyField', 'Company Field ')} must be at least 2 characters long`);
        }
        if (value.trim().length > 50) {
          errors.push(`${key.replace('companyField', 'Company Field ')} must be less than 50 characters`);
        }
      }
    });

    return errors;
  };

  // Save company additional fields to API
  const saveCompanyAdditionalFields = async (fieldsData) => {
    setSubmitting(true);
    setError(null);
    try {
      // Validate fields before saving
      const validationErrors = validateFields(fieldsData);
      if (validationErrors.length > 0) {
        throw new Error(validationErrors.join(', '));
      }

      const token = localStorage.getItem('token');
      const uid = localStorage.getItem('uid');
      if (!token || !uid) {
        throw new Error('Authentication required. Please log in.');
      }

      // Prepare payload for backend
      const payload = {
        ad1: fieldsData.companyField1,
        ad2: fieldsData.companyField2,
        ad3: fieldsData.companyField3,
        ad4: fieldsData.companyField4,
        ad5: fieldsData.companyField5,
        ad6: fieldsData.companyField6,
        ad7: fieldsData.companyField7,
        ad8: fieldsData.companyField8,
        ad9: fieldsData.companyField9,
        ad10: fieldsData.companyField10,
      };

      const response = await api.post('/GroupSettings/company_additional_fields_setting', payload, {
        headers: {
          'Client-Service': 'COHAPPRT',
          'Auth-Key': '4F21zrjoAASqz25690Zpqf67UyY',
          'uid': uid,
          'token': token,
          'rurl': 'login.etribes.in',
          'Content-Type': 'application/json',
        }
      });

      if (response.data?.status === 'success') {
        // Update the data with new values
        setData(fieldsData);
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000); // Hide success message after 3 seconds
        return { success: true };
      } else {
        throw new Error(response.data?.message || 'Failed to save company additional fields');
      }
    } catch (err) {
      console.error('Save company additional fields error:', err);
      throw err;
    } finally {
      setSubmitting(false);
    }
  };

  // Load company additional fields on component mount
  useEffect(() => {
    fetchCompanyAdditionalFields();
    
    // Set up polling every 60 seconds to keep data fresh
    const interval = setInterval(fetchCompanyAdditionalFields, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleEdit = () => {
    setForm(data);
    setEditMode(true);
    setError(null);
  };

  const handleCancel = () => {
    setEditMode(false);
    setError(null);
    // Reset form to current data
    setForm(data);
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await saveCompanyAdditionalFields(form);
    setEditMode(false);
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleRefresh = () => {
    fetchCompanyAdditionalFields();
  };

  // Check if fields are configured
  const configuredFields = Object.values(data).filter(field => field && field.trim() !== '').length;

  if (loading && Object.values(data).every(val => val === "")) {
    return (
      <DashboardLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="flex items-center gap-3">
            <FiRefreshCw className="animate-spin text-indigo-600 text-2xl" />
            <p className="text-indigo-700">Loading company additional fields...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-4 py-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-2xl font-bold text-orange-600">Company Additional Fields</h1>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <FiHome className="text-indigo-600" />
            <span>Configured: {configuredFields}/10 fields</span>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FiAlertCircle />
              <span>{error}</span>
            </div>
            <button onClick={() => setError(null)} className="text-red-500 hover:text-red-700">
              <FiX size={16} />
            </button>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FiCheckCircle />
              <span>Company additional fields saved successfully!</span>
            </div>
            <button onClick={() => setSuccess(false)} className="text-green-500 hover:text-green-700">
              <FiX size={16} />
            </button>
          </div>
        )}

        <div className="rounded-2xl shadow-lg bg-white dark:bg-gray-800 max-w-7xl w-full mx-auto border border-gray-200 dark:border-gray-700">
          {/* Header Controls */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 px-6 py-4 border-b border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <FiHome className="text-indigo-600 text-xl" />
                <span className="text-lg font-semibold text-gray-800 dark:text-gray-100">Company Fields Configuration</span>
              </div>
              {!editMode && (
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <FiSettings className="text-indigo-600" />
                  <span>Custom company profile fields</span>
                </div>
              )}
            </div>
            <div className="flex gap-2 items-center">
            {!editMode && (
                <>
                  <button className="flex items-center gap-1 bg-blue-500 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-600 transition" onClick={handleRefresh} disabled={loading} title="Refresh Fields"><FiRefreshCw className={loading ? "animate-spin" : ""} /> Refresh</button>
                  <button className="flex items-center gap-1 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition" onClick={handleEdit}><FiEdit2 /> Edit Fields</button>
                </>
            )}
            </div>
          </div>
          {/* Content */}
          <div className="p-6">
            {loading ? (
              <div className="flex items-center justify-center h-32 text-indigo-700 dark:text-indigo-300">
                <FiRefreshCw className="animate-spin text-indigo-600 dark:text-indigo-300 text-xl mr-2" />
                Loading company additional fields...
              </div>
            ) : !editMode ? (
              <div className="space-y-6">
                {/* Status Card */}
                <div className={`p-4 rounded-lg border ${configuredFields >= 5 ? 'bg-green-50 dark:bg-green-900/40 border-green-200 dark:border-green-700' : 'bg-yellow-50 dark:bg-yellow-900/40 border-yellow-200 dark:border-yellow-700'}`}>
                  <h3 className={`font-semibold mb-2 flex items-center gap-2 ${configuredFields >= 5 ? 'text-green-700 dark:text-green-200' : 'text-yellow-700 dark:text-yellow-200'}`}>
                    <FiSettings className={configuredFields >= 5 ? 'text-green-600 dark:text-green-200' : 'text-yellow-600 dark:text-yellow-200'} />
                    Configuration Status
                  </h3>
                  <p className={`text-sm ${configuredFields >= 5 ? 'text-green-600 dark:text-green-200' : 'text-yellow-600 dark:text-yellow-200'}`}>
                    {configuredFields >= 5 ? `${configuredFields} company fields are configured and ready for use.` : `${configuredFields} fields configured. At least 5 fields are recommended for better company profile management.`}
                  </p>
                </div>
                {/* Fields Display */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Array.from({ length: 10 }).map((_, i) => {
                    const fieldKey = `companyField${i + 1}`;
                    const fieldValue = data[fieldKey];
                    const isConfigured = fieldValue && fieldValue.trim() !== '';
                    return (
                      <div key={i} className={`p-4 rounded-lg border ${isConfigured ? 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700' : 'bg-gray-50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-700 opacity-60'}`}> 
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-gray-700 dark:text-gray-200 flex items-center gap-2">
                            <FiBriefcase className="text-indigo-600" />
                            Company Field {i + 1}
                          </h4>
                          {isConfigured && (
                            <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-200 rounded text-xs font-medium">Configured</span>
                          )}
                        </div>
                        <p className={`text-sm ${isConfigured ? 'text-gray-800 dark:text-gray-100' : 'text-gray-500 dark:text-gray-400'}`}>{isConfigured ? fieldValue : 'Not configured'}</p>
                      </div>
                    );
                  })}
                  </div>
              </div>
            ) : (
              <form className="space-y-6" onSubmit={handleSubmit}>
                {/* Form Header */}
                <div className="bg-yellow-50 dark:bg-yellow-900/40 p-4 rounded-lg border border-yellow-200 dark:border-yellow-700">
                  <h3 className="font-semibold text-yellow-700 dark:text-yellow-200 mb-2 flex items-center gap-2">
                    <FiAlertCircle className="text-yellow-600 dark:text-yellow-200" />
                    Company Fields Configuration
                  </h3>
                  <p className="text-yellow-700 dark:text-yellow-200 text-sm">Configure custom fields for company profiles. At least the first 5 fields are required. Field names must be unique.</p>
                </div>
                {/* Form Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Array.from({ length: 10 }).map((_, i) => {
                    const fieldKey = `companyField${i + 1}`;
                    const isRequired = i < 5;
                    return (
                      <div key={i} className="space-y-2">
                        <label className="block text-gray-700 dark:text-gray-200 font-medium">
                          Company Field {i + 1}
                          {isRequired && <span className="text-red-500 ml-1">*</span>}
                        </label>
                    <input
                      type="text"
                          name={fieldKey}
                          value={form[fieldKey]}
                      onChange={handleChange}
                          className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-gray-100 focus:ring-2 focus:ring-indigo-400 transition-colors"
                          placeholder={`Enter company field name ${i + 1}`}
                          required={isRequired}
                          disabled={submitting}
                        />
                        <p className="text-xs text-gray-500 dark:text-gray-400">{isRequired ? 'Required field' : 'Optional field'}</p>
                      </div>
                    );
                  })}
                  </div>
                {/* Form Actions */}
                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
                  <button type="button" className="px-6 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-100 font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors disabled:opacity-50" onClick={handleCancel} disabled={submitting}>Cancel</button>
                  <button type="submit" className="flex items-center gap-2 px-6 py-2 rounded-lg bg-green-600 text-white font-semibold shadow hover:bg-green-700 transition-colors disabled:opacity-50" disabled={submitting}>{submitting ? (<><FiRefreshCw className="animate-spin" />Saving...</>) : (<><FiSave />Save Fields</>)}</button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
} 