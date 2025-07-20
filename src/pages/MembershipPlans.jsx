import React, { useState, useEffect } from "react";
import DashboardLayout from "../components/Layout/DashboardLayout";
import { FiPlus, FiX, FiEdit2, FiTrash2, FiRefreshCw, FiSave, FiAlertCircle, FiCheckCircle, FiDollarSign, FiCalendar, FiPackage, FiSearch, FiFilter } from "react-icons/fi";
import api from "../api/axiosConfig";

export default function MembershipPlans() {
  const [plans, setPlans] = useState([]);
  const [addMode, setAddMode] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [form, setForm] = useState({ 
    name: "", 
    description: "", 
    price: "", 
    validity: "",
    status: "active"
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortField, setSortField] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");

  // Fetch membership plans from API
  const fetchPlans = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const uid = localStorage.getItem('uid');
      
      if (!token || !uid) {
        throw new Error('Authentication required. Please log in.');
      }

      const response = await api.get('/groupSettings/get_membership_plans', {
        headers: {
          'Client-Service': 'COHAPPRT',
          'Auth-Key': '4F21zrjoAASqz25690Zpqf67UyY',
          'uid': uid,
          'token': token,
          'rurl': 'login.etribes.in',
        }
      });

      console.log('Membership Plans Response:', response.data);
      
      // Map backend fields to frontend fields
      const plansData = Array.isArray(response.data?.data) ? response.data.data : [];
      const mappedPlans = plansData.map(plan => ({
        id: plan.id || plan.plan_id || Math.random().toString(36).substr(2, 9),
        name: plan.plan_name || plan.name || "",
        description: plan.plan_description || plan.description || "",
        price: plan.plan_price || plan.price || "",
        validity: plan.plan_validity || plan.validity || "",
        status: plan.status || "active",
        created_at: plan.created_at || new Date().toISOString(),
        updated_at: plan.updated_at || new Date().toISOString(),
      }));

      setPlans(mappedPlans);
    } catch (err) {
      console.error('Fetch membership plans error:', err);
      const errorMessage = err.message || 'Failed to fetch membership plans';
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

  // Validate membership plan
  const validatePlan = (planData) => {
    const errors = [];

    if (!planData.name || planData.name.trim() === '') {
      errors.push('Plan name is required');
    } else if (planData.name.trim().length < 3) {
      errors.push('Plan name must be at least 3 characters long');
    }

    if (!planData.description || planData.description.trim() === '') {
      errors.push('Plan description is required');
    } else if (planData.description.trim().length < 10) {
      errors.push('Plan description must be at least 10 characters long');
    }

    if (!planData.price || planData.price <= 0) {
      errors.push('Plan price must be greater than 0');
    }

    if (!planData.validity || planData.validity <= 0) {
      errors.push('Plan validity must be greater than 0 months');
    }

    // Check for duplicate plan names
    const existingPlan = plans.find(plan => 
      plan.name.toLowerCase() === planData.name.toLowerCase() && 
      (!editMode || plan.id !== editingPlan?.id)
    );
    if (existingPlan) {
      errors.push('A plan with this name already exists');
    }

    return errors;
  };

  // Save membership plan to API
  const savePlan = async (planData) => {
    setSubmitting(true);
    setError(null);
    try {
      // Validate plan before saving
      const validationErrors = validatePlan(planData);
      if (validationErrors.length > 0) {
        throw new Error(validationErrors.join(', '));
      }

      const token = localStorage.getItem('token');
      const uid = localStorage.getItem('uid');
      
      if (!token || !uid) {
        throw new Error('Authentication required. Please log in.');
      }

      const payload = {
        plan_name: planData.name,
        plan_description: planData.description,
        plan_price: parseFloat(planData.price),
        plan_validity: parseInt(planData.validity),
        status: planData.status,
      };

      let response;
      if (editMode && editingPlan) {
        // Update existing plan
        payload.id = editingPlan.id;
        response = await api.put('/groupSettings/update_membership_plan', payload, {
          headers: {
            'Client-Service': 'COHAPPRT',
            'Auth-Key': '4F21zrjoAASqz25690Zpqf67UyY',
            'uid': uid,
            'token': token,
            'rurl': 'login.etribes.in',
          }
        });
      } else {
        // Create new plan
        response = await api.post('/groupSettings/create_membership_plan', payload, {
          headers: {
            'Client-Service': 'COHAPPRT',
            'Auth-Key': '4F21zrjoAASqz25690Zpqf67UyY',
            'uid': uid,
            'token': token,
            'rurl': 'login.etribes.in',
          }
        });
      }

      if (response.data?.status === 'success') {
        // Refresh plans after successful save
        await fetchPlans();
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
        return { success: true };
      } else {
        throw new Error(response.data?.message || 'Failed to save membership plan');
      }
    } catch (err) {
      console.error('Save membership plan error:', err);
      throw err;
    } finally {
      setSubmitting(false);
    }
  };

  // Delete membership plan
  const deletePlan = async (planId) => {
    if (!window.confirm('Are you sure you want to delete this membership plan?')) {
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const uid = localStorage.getItem('uid');
      
      if (!token || !uid) {
        throw new Error('Authentication required. Please log in.');
      }

      const response = await api.delete(`/groupSettings/delete_membership_plan/${planId}`, {
        headers: {
          'Client-Service': 'COHAPPRT',
          'Auth-Key': '4F21zrjoAASqz25690Zpqf67UyY',
          'uid': uid,
          'token': token,
          'rurl': 'login.etribes.in',
        }
      });

      if (response.data?.status === 'success') {
        await fetchPlans();
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        throw new Error(response.data?.message || 'Failed to delete membership plan');
      }
    } catch (err) {
      console.error('Delete membership plan error:', err);
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // Load membership plans on component mount
  useEffect(() => {
    fetchPlans();
  }, []);

  // Sorting function
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Sort data
  const sortedData = [...plans].sort((a, b) => {
    const aValue = a[sortField] || '';
    const bValue = b[sortField] || '';
    
    if (sortDirection === 'asc') {
      return aValue.toString().localeCompare(bValue.toString());
    } else {
      return bValue.toString().localeCompare(aValue.toString());
    }
  });

  // Filter and search plans
  const filteredPlans = sortedData.filter(plan => {
    const matchesSearch = plan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         plan.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || plan.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  // Pagination
  const totalEntries = filteredPlans.length;
  const totalPages = Math.ceil(totalEntries / entriesPerPage);
  const startIdx = (currentPage - 1) * entriesPerPage;
  const paginated = filteredPlans.slice(startIdx, startIdx + entriesPerPage);

  const handlePrev = () => setCurrentPage(p => Math.max(1, p - 1));
  const handleNext = () => setCurrentPage(p => Math.min(totalPages, p + 1));
  const handleEntriesChange = e => {
    setEntriesPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const handleAdd = () => {
    setForm({ name: "", description: "", price: "", validity: "", status: "active" });
    setAddMode(true);
    setEditMode(false);
    setEditingPlan(null);
    setError(null);
  };

  const handleEdit = (plan) => {
    setForm({
      name: plan.name,
      description: plan.description,
      price: plan.price,
      validity: plan.validity,
      status: plan.status
    });
    setEditMode(true);
    setAddMode(false);
    setEditingPlan(plan);
    setError(null);
  };

  const handleCancel = () => {
    setAddMode(false);
    setEditMode(false);
    setEditingPlan(null);
    setError(null);
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await savePlan(form);
    setAddMode(false);
      setEditMode(false);
      setEditingPlan(null);
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleRefresh = () => {
    fetchPlans();
  };

  if (loading && plans.length === 0) {
    return (
      <DashboardLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="flex items-center gap-3">
            <FiRefreshCw className="animate-spin text-indigo-600 text-2xl" />
            <p className="text-indigo-700">Loading membership plans...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-4 py-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-2xl font-bold text-orange-600">Membership Plans</h1>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <FiPackage className="text-indigo-600" />
            <span>Total Plans: {plans.length}</span>
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
              <span>Membership plan saved successfully!</span>
            </div>
            <button onClick={() => setSuccess(false)} className="text-green-500 hover:text-green-700">
              <FiX size={16} />
            </button>
          </div>
        )}

        <div className="rounded-2xl shadow-lg bg-white max-w-7xl w-full mx-auto">

          {/* Controls */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 px-6 py-4 border-b border-gray-100">
            <div className="flex items-center gap-4">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by plan name..."
                  className="pl-10 pr-4 py-2 border rounded-lg text-sm bg-white text-gray-700 focus:ring-2 focus:ring-indigo-400 transition-colors"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  style={{ minWidth: 250 }}
                />
              </div>
              
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>Showing {startIdx + 1} to {Math.min(startIdx + entriesPerPage, totalEntries)} of {totalEntries} entries</span>
              </div>
            </div>

            <div className="flex gap-2 items-center">
              <button
                className="flex items-center gap-1 bg-blue-500 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-600 transition"
                onClick={handleRefresh}
                disabled={loading}
                title="Refresh Plans"
              >
                <FiRefreshCw className={loading ? "animate-spin" : ""} />
                Refresh
              </button>
              <button
                className="flex items-center gap-1 bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition"
                onClick={handleAdd}
              >
                <FiPlus />
                Add Plan
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead className="bg-gradient-to-r from-indigo-100 to-purple-100 text-gray-700 sticky top-0 z-10 shadow-sm">
                <tr className="border-b-2 border-indigo-200">
                  <th 
                    className="p-3 text-center font-semibold border-r border-indigo-200 whitespace-nowrap cursor-pointer hover:bg-indigo-200 transition-colors"
                    style={{ minWidth: '80px', width: '80px' }}
                    onClick={() => handleSort('id')}
                  >
                    <div className="flex items-center justify-center gap-1">
                      Sr No
                      {sortField === 'id' && (
                        <span className="text-indigo-600">
                          {sortDirection === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </div>
                  </th>
                  <th 
                    className="p-3 text-left font-semibold border-r border-indigo-200 whitespace-nowrap cursor-pointer hover:bg-indigo-200 transition-colors"
                    style={{ minWidth: '150px', width: '150px' }}
                    onClick={() => handleSort('name')}
                  >
                    <div className="flex items-center gap-1">
                      Plan Name
                      {sortField === 'name' && (
                        <span className="text-indigo-600">
                          {sortDirection === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </div>
                  </th>
                  <th 
                    className="p-3 text-left font-semibold border-r border-indigo-200 whitespace-nowrap cursor-pointer hover:bg-indigo-200 transition-colors"
                    style={{ minWidth: '200px', width: '200px' }}
                    onClick={() => handleSort('description')}
                  >
                    <div className="flex items-center gap-1">
                      Description
                      {sortField === 'description' && (
                        <span className="text-indigo-600">
                          {sortDirection === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </div>
                  </th>
                  <th 
                    className="p-3 text-left font-semibold border-r border-indigo-200 whitespace-nowrap cursor-pointer hover:bg-indigo-200 transition-colors"
                    style={{ minWidth: '120px', width: '120px' }}
                    onClick={() => handleSort('price')}
                  >
                    <div className="flex items-center gap-1">
                      Price
                      {sortField === 'price' && (
                        <span className="text-indigo-600">
                          {sortDirection === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </div>
                  </th>
                  <th 
                    className="p-3 text-left font-semibold border-r border-indigo-200 whitespace-nowrap cursor-pointer hover:bg-indigo-200 transition-colors"
                    style={{ minWidth: '120px', width: '120px' }}
                    onClick={() => handleSort('validity')}
                  >
                    <div className="flex items-center gap-1">
                      Validity
                      {sortField === 'validity' && (
                        <span className="text-indigo-600">
                          {sortDirection === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </div>
                  </th>
                  <th 
                    className="p-3 text-left font-semibold border-r border-indigo-200 whitespace-nowrap cursor-pointer hover:bg-indigo-200 transition-colors"
                    style={{ minWidth: '100px', width: '100px' }}
                    onClick={() => handleSort('status')}
                  >
                    <div className="flex items-center gap-1">
                      Status
                      {sortField === 'status' && (
                        <span className="text-indigo-600">
                          {sortDirection === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </div>
                  </th>
                  <th 
                    className="p-3 text-center font-semibold whitespace-nowrap"
                    style={{ minWidth: '100px', width: '100px' }}
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((plan, idx) => (
                  <tr 
                    key={plan.id} 
                    className={`border-b border-gray-200 transition-colors ${
                      idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                    } hover:bg-indigo-50 hover:shadow-sm`}
                  >
                    <td className="p-3 text-center font-semibold text-indigo-700 border-r border-gray-200">
                      {startIdx + idx + 1}
                    </td>
                    <td className="p-3 text-left border-r border-gray-200">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-xs">
                          {plan.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-medium text-gray-800">{plan.name}</span>
                      </div>
                    </td>
                    <td className="p-3 text-left border-r border-gray-200 text-gray-600">
                      {plan.description}
                    </td>
                    <td className="p-3 text-left border-r border-gray-200">
                      <span className="flex items-center gap-1 text-green-600 font-medium">
                        <FiDollarSign size={14} />
                        {plan.price}
                      </span>
                    </td>
                    <td className="p-3 text-left border-r border-gray-200">
                      <span className="flex items-center gap-1 text-blue-600">
                        <FiCalendar size={14} />
                        {plan.validity} months
                      </span>
                    </td>
                    <td className="p-3 text-left border-r border-gray-200">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        plan.status === 'active' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {plan.status}
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      <div className="flex gap-2 justify-center">
                        <button
                          onClick={() => handleEdit(plan)}
                          className="text-blue-600 hover:text-blue-900 p-2 rounded-full hover:bg-blue-100 transition-colors"
                          title="Edit Plan"
                        >
                          <FiEdit2 size={18} />
                        </button>
                        <button
                          onClick={() => deletePlan(plan.id)}
                          className="text-red-600 hover:text-red-900 p-2 rounded-full hover:bg-red-100 transition-colors"
                          title="Delete Plan"
                          disabled={submitting}
                        >
                          <FiTrash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {paginated.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <FiPackage className="mx-auto text-4xl mb-2 text-gray-300" />
                <p>No membership plans found</p>
          </div>
            )}
            
          {/* Pagination Controls */}
            {!addMode && !editMode && totalEntries > 0 && (
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6 border-t border-gray-100">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Show</span>
              <select
                    className="border rounded-lg px-3 py-1 text-sm bg-white text-gray-700 focus:ring-2 focus:ring-indigo-400 transition-colors"
                value={entriesPerPage}
                onChange={handleEntriesChange}
              >
                    {[5, 10, 25, 50, 100].map(num => (
                  <option key={num} value={num}>{num}</option>
                ))}
              </select>
                  <span className="text-sm text-gray-600">entries per page</span>
            </div>
                
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrev}
                disabled={currentPage === 1}
                    className={`px-3 py-1 rounded-lg text-indigo-600 hover:bg-indigo-100 transition-colors ${
                      currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                title="Previous"
              >
                    Previous
              </button>
                  <span className="text-sm font-semibold text-gray-700">
                    Page {currentPage} of {totalPages}
                  </span>
              <button
                onClick={handleNext}
                disabled={currentPage === totalPages}
                    className={`px-3 py-1 rounded-lg text-indigo-600 hover:bg-indigo-100 transition-colors ${
                      currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                title="Next"
              >
                    Next
              </button>
            </div>
              </div>
            )}
          </div>
        </div>

        {/* Add/Edit Modal */}
        {(addMode || editMode) && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
              <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-lg relative">
                <button
                  className="absolute top-3 right-3 text-gray-400 hover:text-rose-500"
                  onClick={handleCancel}
                  title="Close"
                >
                  <FiX size={22} />
                </button>
              <h2 className="text-xl font-bold mb-4 text-indigo-700">
                {editMode ? 'Edit Membership Plan' : 'Add Membership Plan'}
              </h2>
                <form className="grid grid-cols-1 gap-y-6" onSubmit={handleSubmit}>
                  <div className="flex flex-col gap-1">
                    <label className="font-medium text-gray-700 flex items-center gap-1">
                      Plan Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      className="px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-400"
                    placeholder="Enter plan name"
                      required
                    disabled={submitting}
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="font-medium text-gray-700 flex items-center gap-1">
                      Plan Description <span className="text-red-500">*</span>
                    </label>
                  <textarea
                      name="description"
                      value={form.description}
                      onChange={handleChange}
                      className="px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-400"
                    placeholder="Enter plan description"
                    rows={3}
                      required
                    disabled={submitting}
                    />
                  </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="font-medium text-gray-700 flex items-center gap-1">
                      Plan Price <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={form.price}
                      onChange={handleChange}
                      className="px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-400"
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                      required
                      disabled={submitting}
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="font-medium text-gray-700 flex items-center gap-1">
                      Validity (Months) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="validity"
                      value={form.validity}
                      onChange={handleChange}
                      className="px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-400"
                      placeholder="12"
                      min="1"
                      required
                      disabled={submitting}
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-medium text-gray-700">Status</label>
                  <select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                    className="px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-400"
                    disabled={submitting}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                  </div>
                  <div className="flex justify-end gap-4 mt-6">
                    <button
                      type="button"
                    className="px-6 py-2 rounded-lg bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300 transition-colors disabled:opacity-50"
                      onClick={handleCancel}
                    disabled={submitting}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                    className="flex items-center gap-2 px-6 py-2 rounded-lg bg-green-600 text-white font-semibold shadow hover:bg-green-700 transition-colors disabled:opacity-50"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <FiRefreshCw className="animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <FiSave />
                        {editMode ? 'Update Plan' : 'Save Plan'}
                      </>
                    )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
      </div>
    </DashboardLayout>
  );
} 