import React, { useState, useEffect } from "react";
import DashboardLayout from "../components/Layout/DashboardLayout";
import { FiEdit2, FiPlus, FiKey, FiX, FiFileText, FiFile, FiEye, FiRefreshCw, FiTrash2, FiUser, FiMail, FiPhone, FiMapPin, FiShield, FiCheckCircle, FiAlertCircle, FiCopy, FiDownload } from "react-icons/fi";
import api from "../api/axiosConfig";

// Default roles fallback
const defaultUserRoles = [
  "Admin",
  "Manager",
  "Support",
  "Finance",
  "HR",
  "IT",
  "Super Admin",
];

// Updated data to match System Users table
const initialSystemUsers = [
  { id: 1, name: "Rohit Arya", contact: "7017064745", email: "rohit@30days.in", address: "Shiv Murti Gandhi Chowk Shamli", city: "Shamli", district: "Shamli", state: "Uttar Pradesh", country: "India", role: "Admin", status: "active" },
  { id: 2, name: "Parveen", contact: "9876543220", email: "parveen@30dats.in", address: "nangloi", city: "delhi", district: "nangloi", state: "Gujarat", country: "India", role: "Manager", status: "active" },
  { id: 3, name: "naman", contact: "7876467065", email: "arya.rohi13@gmail.com", address: "test", city: "Rohtak", district: "rohtak", state: "Uttar Pradesh", country: "India", role: "Support", status: "active" },
  { id: 4, name: "sourav", contact: "9876543210", email: "namanjain@30days.in", address: "test address", city: "Delhi", district: "Central Delhi", state: "Delhi", country: "India", role: "Finance", status: "active" },
  { id: 5, name: "Test User", contact: "1234567890", email: "test@gmail.com", address: "test address line", city: "Mumbai", district: "Mumbai", state: "Maharashtra", country: "India", role: "HR", status: "active" },
  { id: 6, name: "Amit Kumar", contact: "5551234567", email: "amit@company.com", address: "789 Tech Park", city: "Bangalore", district: "Bangalore Urban", state: "Karnataka", country: "India", role: "IT", status: "active" },
  { id: 7, name: "Neha Verma", contact: "4445556666", email: "neha@company.com", address: "321 Business Ave", city: "Chennai", district: "Chennai", state: "Tamil Nadu", country: "India", role: "Super Admin", status: "active" },
  { id: 8, name: "Suresh Patel", contact: "3332221111", email: "suresh@company.com", address: "654 Main Road", city: "Hyderabad", district: "Hyderabad", state: "Telangana", country: "India", role: "Admin", status: "active" },
  { id: 9, name: "Meena Joshi", contact: "8889990000", email: "meena@company.com", address: "987 Market Lane", city: "Pune", district: "Pune", state: "Maharashtra", country: "India", role: "Manager", status: "active" },
  { id: 10, name: "Vikas Sharma", contact: "1112223333", email: "vikas@company.com", address: "159 Tech Blvd", city: "Ahmedabad", district: "Ahmedabad", state: "Gujarat", country: "India", role: "Support", status: "active" },
];

// Role color mapping
const getRoleColor = (role) => {
  const roleColors = {
    "Super Admin": "bg-red-100 text-red-800 border-red-200",
    "Admin": "bg-purple-100 text-purple-800 border-purple-200",
    "Manager": "bg-blue-100 text-blue-800 border-blue-200",
    "Support": "bg-green-100 text-green-800 border-green-200",
    "Finance": "bg-yellow-100 text-yellow-800 border-yellow-200",
    "HR": "bg-pink-100 text-pink-800 border-pink-200",
    "IT": "bg-indigo-100 text-indigo-800 border-indigo-200",
  };
  return roleColors[role] || "bg-gray-100 text-gray-800 border-gray-200";
};

export default function AdminAccounts() {
  const [systemUsers, setSystemUsers] = useState([]);
  const [userRoles, setUserRoles] = useState(defaultUserRoles);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(100);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [passwordForm, setPasswordForm] = useState({ password: "", confirmPassword: "" });
  const [addUserForm, setAddUserForm] = useState({
    role: defaultUserRoles[0],
    name: "",
    contact: "",
    email: "",
    password: "",
    confirmPassword: "",
    address: "",
    city: "",
    district: "",
    state: "",
    country: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [sortField, setSortField] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");

  // Fetch roles from API
  const fetchRoles = async () => {
    try {
      const token = localStorage.getItem('token');
      const uid = localStorage.getItem('uid') || '1';
      
      if (!token) {
        setError('Please log in to view system users');
        window.location.href = '/login';
        return;
      }

      const response = await api.post('/userRole', {}, {
        headers: {
          'token': token,
          'uid': uid,
        }
      });

      console.log('System Users - Roles Response:', response.data);
      
      // Handle different response formats
      let rolesData = [];
      if (Array.isArray(response.data)) {
        rolesData = response.data;
      } else if (response.data?.data && Array.isArray(response.data.data)) {
        rolesData = response.data.data;
      } else if (response.data?.roles && Array.isArray(response.data.roles)) {
        rolesData = response.data.roles;
      } else {
        // If no roles found, use default roles
        rolesData = defaultUserRoles.map(role => ({ role }));
      }

      // Transform data to match expected format
      const transformedRoles = rolesData.map((role, index) => 
        role.role || role.role_name || role.name || `Role ${index + 1}`
      );

      setUserRoles(transformedRoles);
      
      // Update addUserForm role if current role is not in new list
      if (addUserForm.role && !transformedRoles.includes(addUserForm.role)) {
        setAddUserForm(prev => ({ ...prev, role: transformedRoles[0] || defaultUserRoles[0] }));
      }
    } catch (err) {
      console.error('Fetch roles error:', err);
      // Use default roles on error
      setUserRoles(defaultUserRoles);
    } finally {
      setLoading(false);
    }
  };

  // Fetch system users from API
  const fetchSystemUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const uid = localStorage.getItem('uid') || '1';
      if (!token) {
        setError('Please log in to view system users');
        window.location.href = '/login';
        return;
      }
      const response = await api.post('/userDetail', {}, {
        headers: {
          'Client-Service': 'COHAPPRT',
          'Auth-Key': '4F21zrjoAASqz25690Zpqf67UyY',
          'uid': uid,
          'token': token,
          'rurl': 'login.etribes.in',
          'Content-Type': 'application/json',
        }
      });
      let usersData = [];
      if (Array.isArray(response.data)) {
        usersData = response.data;
      } else if (response.data?.data && Array.isArray(response.data.data)) {
        usersData = response.data.data;
      } else if (response.data?.users && Array.isArray(response.data.users)) {
        usersData = response.data.users;
      }
      setSystemUsers(usersData);
    } catch (err) {
      setError('Failed to fetch system users.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
    fetchSystemUsers();
    const interval = setInterval(() => {
      fetchRoles();
      fetchSystemUsers();
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  // Sorting function
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Sort data
  const sortedData = [...systemUsers].sort((a, b) => {
    const aValue = a[sortField] || "";
    const bValue = b[sortField] || "";
    
    if (sortDirection === "asc") {
      return aValue.toString().localeCompare(bValue.toString());
    } else {
      return bValue.toString().localeCompare(aValue.toString());
    }
  });

  // Filtered and paginated data
  const filtered = sortedData.filter(user => {
    return user.name.toLowerCase().includes(search.toLowerCase()) ||
           user.email.toLowerCase().includes(search.toLowerCase()) ||
           user.contact.includes(search) ||
           user.city.toLowerCase().includes(search.toLowerCase()) ||
           user.district.toLowerCase().includes(search.toLowerCase()) ||
           user.state.toLowerCase().includes(search.toLowerCase());
  });
  
  const totalEntries = filtered.length;
  const totalPages = Math.ceil(totalEntries / entriesPerPage);
  const startIdx = (currentPage - 1) * entriesPerPage;
  const paginated = filtered.slice(startIdx, startIdx + entriesPerPage);

  const handlePrev = () => setCurrentPage(p => Math.max(1, p - 1));
  const handleNext = () => setCurrentPage(p => Math.min(totalPages, p + 1));
  const handleEntriesChange = e => {
    setEntriesPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  // Change Password Modal
  const openPasswordModal = (user) => {
    setSelectedUser(user);
    setPasswordForm({ password: "", confirmPassword: "" });
    setShowPasswordModal(true);
  };
  const closePasswordModal = () => setShowPasswordModal(false);
  const handlePasswordChange = (e) => setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });
  const handlePasswordSave = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    if (passwordForm.password !== passwordForm.confirmPassword) {
      setError("Passwords don't match");
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const uid = localStorage.getItem('uid') || (selectedUser && selectedUser.id);
      if (!token || !uid) {
        setError('Authentication required. Please log in.');
        return;
      }
      const response = await api.post('/userDetail/update_password', {
        id: selectedUser.id,
        password: passwordForm.password,
        confirm_password: passwordForm.confirmPassword
      }, {
        headers: {
          'Client-Service': 'COHAPPRT',
          'Auth-Key': '4F21zrjoAASqz25690Zpqf67UyY',
          'uid': uid,
          'token': token,
          'Content-Type': 'application/json',
        }
      });
      if (response.data?.status === 'success' || response.data?.message?.toLowerCase().includes('success')) {
        setSuccess('Password updated successfully!');
    setTimeout(() => setSuccess(null), 3000);
    setShowPasswordModal(false);
      } else {
        setError(response.data?.message || 'Failed to update password.');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to update password.');
    }
  };

  // View User Modal
  const openViewModal = (user) => {
    setSelectedUser(user);
    setShowViewModal(true);
  };
  const closeViewModal = () => setShowViewModal(false);

  // Delete User
  const handleDeleteUser = (userId) => {
    if (window.confirm("Are you sure you want to delete this system user?")) {
      setSystemUsers(systemUsers.filter(user => user.id !== userId));
      setSuccess("System user deleted successfully!");
      setTimeout(() => setSuccess(null), 3000);
    }
  };

  // Add System User Modal
  const openAddUserModal = () => {
    setAddUserForm({
      role: userRoles[0] || defaultUserRoles[0],
      name: "",
      contact: "",
      email: "",
      password: "",
      confirmPassword: "",
      address: "",
      city: "",
      district: "",
      state: "",
      country: "",
    });
    setShowAddUserModal(true);
  };
  const closeAddUserModal = () => setShowAddUserModal(false);
  const handleAddUserChange = (e) => setAddUserForm({ ...addUserForm, [e.target.name]: e.target.value });
  const handleAddUserSubmit = (e) => {
    e.preventDefault();
    if (addUserForm.password !== addUserForm.confirmPassword) {
      setError("Passwords don't match");
      return;
    }
    const newUser = {
      id: Date.now(),
        name: addUserForm.name,
        contact: addUserForm.contact,
        email: addUserForm.email,
        address: addUserForm.address,
        city: addUserForm.city,
        district: addUserForm.district,
        state: addUserForm.state,
        country: addUserForm.country,
        role: addUserForm.role,
      status: "active",
    };
    setSystemUsers([...systemUsers, newUser]);
    setSuccess("System user created successfully!");
    setTimeout(() => setSuccess(null), 3000);
    setShowAddUserModal(false);
  };

  // Export functions
  const handleExportCopy = () => {
    const tableData = filtered.map(user => 
      `${user.name}\t${user.contact}\t${user.email}\t${user.address}\t${user.city}\t${user.district}\t${user.state}\t${user.country}`
    ).join('\n');
    
    const headers = "Name\tContact No.\tEmail Address\tAddress\tCity\tDistrict\tState\tCountry";
    const fullData = headers + '\n' + tableData;
    
    navigator.clipboard.writeText(fullData).then(() => {
      setSuccess("Data copied to clipboard!");
      setTimeout(() => setSuccess(null), 3000);
    });
  };

  const handleExportExcel = () => {
    // Excel export logic
    setSuccess("Excel export functionality would be implemented here!");
    setTimeout(() => setSuccess(null), 3000);
  };

  const handleExportCSV = () => {
    const headers = ["Name", "Contact No.", "Email Address", "Address", "City", "District", "State", "Country"];
    const csvData = filtered.map(user => [
      user.name,
      user.contact,
      user.email,
      user.address,
      user.city,
      user.district,
      user.state,
      user.country
    ]);
    
    let csvContent = "data:text/csv;charset=utf-8," + [headers, ...csvData].map(e => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "system_users.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    setSuccess("CSV exported successfully!");
    setTimeout(() => setSuccess(null), 3000);
  };

  const handleExportPDF = () => {
    // PDF export logic
    setSuccess("PDF export functionality would be implemented here!");
    setTimeout(() => setSuccess(null), 3000);
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="flex items-center gap-3">
            <FiRefreshCw className="animate-spin text-indigo-600 text-2xl" />
            <p className="text-indigo-700">Loading system users...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-4 py-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-2xl font-bold text-orange-600">System Users</h1>
          <button
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg font-semibold shadow hover:bg-green-700 transition"
            onClick={openAddUserModal}
          >
            <FiPlus /> + Add System User
          </button>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FiCheckCircle />
              <span>{success}</span>
            </div>
            <button onClick={() => setSuccess(null)} className="text-green-500 hover:text-green-700">
              <FiX size={16} />
            </button>
          </div>
        )}

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

        <div className="rounded-2xl shadow-lg bg-white dark:bg-gray-800 max-w-7xl w-full mx-auto">
          {/* Filter and Export Controls */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 px-6 py-4 border-b border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Filter:</label>
                <div className="relative">
            <input
              type="text"
                    placeholder="Type to filter..."
                    className="pl-10 pr-4 py-2 border rounded-lg text-sm bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 focus:ring-2 focus:ring-indigo-400 transition-colors"
              value={search}
              onChange={e => setSearch(e.target.value)}
                    style={{ minWidth: 200 }}
                  />
                  <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Show:</label>
                <select
                  className="px-3 py-2 border rounded-lg text-sm bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 focus:ring-2 focus:ring-indigo-400 transition-colors"
                  value={entriesPerPage}
                  onChange={handleEntriesChange}
                >
                  {[10, 25, 50, 100].map(num => (
                    <option key={num} value={num}>{num}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex gap-2 items-center">
              <button 
                className="flex items-center gap-1 bg-blue-500 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-600 transition"
                onClick={handleExportCopy}
                title="Copy to Clipboard"
              >
                <FiCopy /> Copy
              </button>
              <button 
                className="flex items-center gap-1 bg-emerald-500 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-emerald-600 transition"
                onClick={handleExportExcel}
                title="Export to Excel"
              >
                <FiFile /> Excel
              </button>
              <button 
                className="flex items-center gap-1 bg-green-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition"
                onClick={handleExportCSV}
                title="Export to CSV"
              >
                <FiDownload /> CSV
              </button>
              <button
                className="flex items-center gap-1 bg-red-500 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-red-600 transition"
                onClick={handleExportPDF}
                title="Export to PDF"
              >
                <FiFile /> PDF
              </button>
            </div>
          </div>

          {/* System Users Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead className="bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/50 dark:to-purple-900/50 text-gray-700 dark:text-gray-200 sticky top-0 z-10 shadow-sm">
                <tr className="border-b-2 border-indigo-200 dark:border-indigo-800">
                  <th 
                    className="p-3 text-center font-semibold cursor-pointer hover:bg-indigo-200 dark:hover:bg-indigo-900 transition-colors border-r border-indigo-200 dark:border-indigo-800 whitespace-nowrap"
                    onClick={() => handleSort("id")}
                    style={{ minWidth: '60px', width: '60px' }}
                  >
                    <div className="flex items-center justify-center gap-1">
                      SN
                      <div className="flex flex-col">
                        <span className={`text-xs ${sortField === "id" && sortDirection === "asc" ? "text-indigo-600" : "text-gray-400"}`}>▲</span>
                        <span className={`text-xs ${sortField === "id" && sortDirection === "desc" ? "text-indigo-600" : "text-gray-400"}`}>▼</span>
                      </div>
                    </div>
                  </th>
                  <th 
                    className="p-3 font-semibold cursor-pointer hover:bg-indigo-200 dark:hover:bg-indigo-900 transition-colors border-r border-indigo-200 dark:border-indigo-800 whitespace-nowrap"
                    onClick={() => handleSort("name")}
                    style={{ minWidth: '120px', width: '120px' }}
                  >
                    <div className="flex items-center gap-1">
                      Name
                      <div className="flex flex-col">
                        <span className={`text-xs ${sortField === "name" && sortDirection === "asc" ? "text-indigo-600" : "text-gray-400"}`}>▲</span>
                        <span className={`text-xs ${sortField === "name" && sortDirection === "desc" ? "text-indigo-600" : "text-gray-400"}`}>▼</span>
                      </div>
                    </div>
                  </th>
                  <th 
                    className="p-3 text-left font-semibold cursor-pointer hover:bg-indigo-200 dark:hover:bg-indigo-900 transition-colors border-r border-indigo-200 dark:border-indigo-800 whitespace-nowrap"
                    onClick={() => handleSort("contact")}
                    style={{ minWidth: '120px', width: '120px' }}
                  >
                    <div className="flex items-center gap-1">
                      Contact
                      <div className="flex flex-col">
                        <span className={`text-xs ${sortField === "contact" && sortDirection === "asc" ? "text-indigo-600" : "text-gray-400"}`}>▲</span>
                        <span className={`text-xs ${sortField === "contact" && sortDirection === "desc" ? "text-indigo-600" : "text-gray-400"}`}>▼</span>
                      </div>
                    </div>
                  </th>
                  <th 
                    className="p-3 text-left font-semibold cursor-pointer hover:bg-indigo-200 dark:hover:bg-indigo-900 transition-colors border-r border-indigo-200 dark:border-indigo-800 whitespace-nowrap"
                    onClick={() => handleSort("email")}
                    style={{ minWidth: '180px', width: '180px' }}
                  >
                    <div className="flex items-center gap-1">
                      Email
                      <div className="flex flex-col">
                        <span className={`text-xs ${sortField === "email" && sortDirection === "asc" ? "text-indigo-600" : "text-gray-400"}`}>▲</span>
                        <span className={`text-xs ${sortField === "email" && sortDirection === "desc" ? "text-indigo-600" : "text-gray-400"}`}>▼</span>
                      </div>
                    </div>
                  </th>
                  <th 
                    className="p-3 text-left font-semibold cursor-pointer hover:bg-indigo-200 dark:hover:bg-indigo-900 transition-colors border-r border-indigo-200 dark:border-indigo-800 whitespace-nowrap"
                    onClick={() => handleSort("address")}
                    style={{ minWidth: '200px', width: '200px' }}
                  >
                    <div className="flex items-center gap-1">
                      Address
                      <div className="flex flex-col">
                        <span className={`text-xs ${sortField === "address" && sortDirection === "asc" ? "text-indigo-600" : "text-gray-400"}`}>▲</span>
                        <span className={`text-xs ${sortField === "address" && sortDirection === "desc" ? "text-indigo-600" : "text-gray-400"}`}>▼</span>
                      </div>
                    </div>
                  </th>
                  <th 
                    className="p-3 text-left font-semibold cursor-pointer hover:bg-indigo-200 dark:hover:bg-indigo-900 transition-colors border-r border-indigo-200 dark:border-indigo-800 whitespace-nowrap"
                    onClick={() => handleSort("city")}
                    style={{ minWidth: '100px', width: '100px' }}
                  >
                    <div className="flex items-center gap-1">
                      City
                      <div className="flex flex-col">
                        <span className={`text-xs ${sortField === "city" && sortDirection === "asc" ? "text-indigo-600" : "text-gray-400"}`}>▲</span>
                        <span className={`text-xs ${sortField === "city" && sortDirection === "desc" ? "text-indigo-600" : "text-gray-400"}`}>▼</span>
                      </div>
                    </div>
                  </th>
                  <th 
                    className="p-3 text-left font-semibold cursor-pointer hover:bg-indigo-200 dark:hover:bg-indigo-900 transition-colors border-r border-indigo-200 dark:border-indigo-800 whitespace-nowrap"
                    onClick={() => handleSort("district")}
                    style={{ minWidth: '120px', width: '120px' }}
                  >
                    <div className="flex items-center gap-1">
                      District
                      <div className="flex flex-col">
                        <span className={`text-xs ${sortField === "district" && sortDirection === "asc" ? "text-indigo-600" : "text-gray-400"}`}>▲</span>
                        <span className={`text-xs ${sortField === "district" && sortDirection === "desc" ? "text-indigo-600" : "text-gray-400"}`}>▼</span>
                      </div>
                    </div>
                  </th>
                  <th 
                    className="p-3 text-left font-semibold cursor-pointer hover:bg-indigo-200 dark:hover:bg-indigo-900 transition-colors border-r border-indigo-200 dark:border-indigo-800 whitespace-nowrap"
                    onClick={() => handleSort("state")}
                    style={{ minWidth: '120px', width: '120px' }}
                  >
                    <div className="flex items-center gap-1">
                      State
                      <div className="flex flex-col">
                        <span className={`text-xs ${sortField === "state" && sortDirection === "asc" ? "text-indigo-600" : "text-gray-400"}`}>▲</span>
                        <span className={`text-xs ${sortField === "state" && sortDirection === "desc" ? "text-indigo-600" : "text-gray-400"}`}>▼</span>
                      </div>
                    </div>
                  </th>
                  <th 
                    className="p-3 text-left font-semibold cursor-pointer hover:bg-indigo-200 dark:hover:bg-indigo-900 transition-colors border-r border-indigo-200 dark:border-indigo-800 whitespace-nowrap"
                    onClick={() => handleSort("country")}
                    style={{ minWidth: '100px', width: '100px' }}
                  >
                    <div className="flex items-center gap-1">
                      Country
                      <div className="flex flex-col">
                        <span className={`text-xs ${sortField === "country" && sortDirection === "asc" ? "text-indigo-600" : "text-gray-400"}`}>▲</span>
                        <span className={`text-xs ${sortField === "country" && sortDirection === "desc" ? "text-indigo-600" : "text-gray-400"}`}>▼</span>
                      </div>
                    </div>
                  </th>
                  <th 
                    className="p-3 text-left font-semibold cursor-pointer hover:bg-indigo-200 dark:hover:bg-indigo-900 transition-colors border-r border-indigo-200 dark:border-indigo-800 whitespace-nowrap"
                    onClick={() => handleSort("role")}
                    style={{ minWidth: '120px', width: '120px' }}
                  >
                    <div className="flex items-center gap-1">
                      Role
                      <div className="flex flex-col">
                        <span className={`text-xs ${sortField === "role" && sortDirection === "asc" ? "text-indigo-600" : "text-gray-400"}`}>▲</span>
                        <span className={`text-xs ${sortField === "role" && sortDirection === "desc" ? "text-indigo-600" : "text-gray-400"}`}>▼</span>
                      </div>
                    </div>
                  </th>
                  <th 
                    className="p-3 text-center font-semibold whitespace-nowrap"
                    style={{ minWidth: '80px', width: '80px' }}
                  >
                    <div className="flex items-center justify-center gap-1">
                      Action
                      <div className="flex flex-col">
                        <span className="text-xs text-gray-400">▲</span>
                        <span className="text-xs text-gray-400">▼</span>
                      </div>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((user, idx) => (
                  <tr 
                    key={user.id} 
                    className={`border-b border-gray-200 dark:border-gray-700 transition-colors ${
                      idx % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-900/50'
                    } hover:bg-indigo-50 dark:hover:bg-gray-700 hover:shadow-sm`}
                  >
                    <td className="p-3 text-center font-semibold text-indigo-700 dark:text-indigo-300 border-r border-gray-200 dark:border-gray-700">
                      {startIdx + idx + 1}
                    </td>
                    <td className="p-3 font-medium text-gray-900 dark:text-gray-100 border-r border-gray-200 dark:border-gray-700">
                      {user.name}
                    </td>
                    <td className="p-3 text-gray-600 dark:text-gray-300 border-r border-gray-200 dark:border-gray-700">
                      {user.contact}
                    </td>
                    <td className="p-3 text-gray-600 dark:text-gray-300 border-r border-gray-200 dark:border-gray-700">
                      {user.email}
                    </td>
                    <td className="p-3 text-gray-600 dark:text-gray-300 max-w-xs truncate border-r border-gray-200 dark:border-gray-700">
                      {user.address}
                    </td>
                    <td className="p-3 text-gray-600 dark:text-gray-300 border-r border-gray-200 dark:border-gray-700">
                      {user.city}
                    </td>
                    <td className="p-3 text-gray-600 dark:text-gray-300 border-r border-gray-200 dark:border-gray-700">
                      {user.district}
                    </td>
                    <td className="p-3 text-gray-600 dark:text-gray-300 border-r border-gray-200 dark:border-gray-700">
                      {user.state}
                    </td>
                    <td className="p-3 text-gray-600 dark:text-gray-300 border-r border-gray-200 dark:border-gray-700">
                      {user.country}
                    </td>
                    <td className="p-3 text-center border-r border-gray-200 dark:border-gray-700">
                      <span className={
                        `px-2 py-1 rounded-full text-xs font-medium border ${getRoleColor(user.role)} dark:bg-indigo-900 dark:text-gray-100 dark:border-indigo-800`
                      }>
                        {user.role || "No Role"}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center justify-center">
                      <button
                          className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-100 dark:text-blue-300 dark:hover:bg-gray-700 rounded-lg transition-colors border border-blue-200 hover:border-blue-300"
                          onClick={() => openViewModal(user)}
                          title="View User"
                        >
                          <FiEye size={18} />
                      </button>
                      <button
                          className="p-2 text-green-600 hover:text-green-800 hover:bg-green-100 dark:text-green-300 dark:hover:bg-gray-700 rounded-lg transition-colors border border-green-200 hover:border-green-300"
                          onClick={() => openPasswordModal(user)}
                          title="Change Password"
                        >
                          <FiKey size={18} />
                      </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Pagination Controls - moved outside scrollable area */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-6 py-4 border-t border-gray-100">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>Showing {startIdx + 1} to {Math.min(startIdx + entriesPerPage, totalEntries)} of {totalEntries} entries</span>
              </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrev}
                  disabled={currentPage === 1}
                  className={`px-3 py-1 rounded-lg text-indigo-600 hover:bg-indigo-100 transition ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                  title="Previous"
                >
                  &lt;
                </button>
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-200 px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-lg">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={handleNext}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-1 rounded-lg text-indigo-600 hover:bg-indigo-100 transition ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
                  title="Next"
                >
                  &gt;
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Change Password Modal */}
        {showPasswordModal && selectedUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 w-full max-w-md relative">
              <button
                className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
                onClick={closePasswordModal}
                title="Close"
              >
                <FiX size={24} />
              </button>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                  {selectedUser.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">Manage User</h2>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">{selectedUser.name}</p>
                </div>
              </div>
              <form className="flex flex-col gap-6" onSubmit={handlePasswordSave}>
                <div className="flex flex-col gap-2">
                  <label className="font-medium text-gray-700 dark:text-gray-300">New Password</label>
                  <input
                    type="password"
                    name="password"
                    value={passwordForm.password}
                    onChange={handlePasswordChange}
                    className="px-4 py-3 rounded-lg border bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 dark:text-gray-100 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-colors"
                    placeholder="Enter new password"
                    required
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="font-medium text-gray-700 dark:text-gray-300">Confirm Password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={passwordForm.confirmPassword}
                    onChange={handlePasswordChange}
                    className="px-4 py-3 rounded-lg border bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 dark:text-gray-100 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-colors"
                    placeholder="Confirm new password"
                    required
                  />
                </div>
                <div className="flex justify-end gap-4 mt-6">
                  <button
                    type="button"
                    className="px-6 py-2 rounded-lg font-semibold bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
                    onClick={closePasswordModal}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 rounded-lg font-semibold bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
                  >
                    Update Password
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Enhanced Add System User Modal */}
        {showAddUserModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 w-full max-w-2xl relative max-h-[90vh] overflow-y-auto">
              <button
                className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
                onClick={closeAddUserModal}
                title="Close"
              >
                <FiX size={24} />
              </button>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-semibold">
                  <FiPlus size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">Add System User</h2>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">Create a new system user account</p>
                </div>
              </div>
              
              <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={handleAddUserSubmit}>
                <div className="md:col-span-2">
                  <label className="font-medium text-gray-700 dark:text-gray-300">User Role *</label>
                  <select
                    name="role"
                    value={addUserForm.role}
                    onChange={handleAddUserChange}
                    className="w-full px-4 py-3 rounded-lg border bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 dark:text-gray-100 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-colors"
                    required
                  >
                    {userRoles.map((role, idx) => (
                      <option key={idx} value={role}>{role}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="font-medium text-gray-700 dark:text-gray-300">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={addUserForm.name}
                    onChange={handleAddUserChange}
                    className="w-full px-4 py-3 rounded-lg border bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 dark:text-gray-100 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-colors"
                    placeholder="Enter full name"
                    required
                  />
                </div>
                
                <div>
                  <label className="font-medium text-gray-700 dark:text-gray-300">Contact Number *</label>
                  <input
                    type="tel"
                    name="contact"
                    value={addUserForm.contact}
                    onChange={handleAddUserChange}
                    className="w-full px-4 py-3 rounded-lg border bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 dark:text-gray-100 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-colors"
                    placeholder="Enter contact number"
                    required
                  />
                </div>
                
                <div>
                  <label className="font-medium text-gray-700 dark:text-gray-300">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={addUserForm.email}
                    onChange={handleAddUserChange}
                    className="w-full px-4 py-3 rounded-lg border bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 dark:text-gray-100 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-colors"
                    placeholder="Enter email address"
                    required
                  />
                </div>
                
                <div>
                  <label className="font-medium text-gray-700 dark:text-gray-300">Password *</label>
                  <input
                    type="password"
                    name="password"
                    value={addUserForm.password}
                    onChange={handleAddUserChange}
                    className="w-full px-4 py-3 rounded-lg border bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 dark:text-gray-100 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-colors"
                    placeholder="Enter password"
                    required
                  />
                </div>
                
                <div>
                  <label className="font-medium text-gray-700 dark:text-gray-300">Confirm Password *</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={addUserForm.confirmPassword}
                    onChange={handleAddUserChange}
                    className="w-full px-4 py-3 rounded-lg border bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 dark:text-gray-100 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-colors"
                    placeholder="Confirm password"
                    required
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="font-medium text-gray-700 dark:text-gray-300">Address</label>
                  <input
                    type="text"
                    name="address"
                    value={addUserForm.address}
                    onChange={handleAddUserChange}
                    className="w-full px-4 py-3 rounded-lg border bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 dark:text-gray-100 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-colors"
                    placeholder="Enter address"
                  />
                </div>
                
                <div>
                  <label className="font-medium text-gray-700 dark:text-gray-300">City</label>
                  <input
                    type="text"
                    name="city"
                    value={addUserForm.city}
                    onChange={handleAddUserChange}
                    className="w-full px-4 py-3 rounded-lg border bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 dark:text-gray-100 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-colors"
                    placeholder="Enter city"
                  />
                </div>
                
                <div>
                  <label className="font-medium text-gray-700 dark:text-gray-300">District</label>
                  <input
                    type="text"
                    name="district"
                    value={addUserForm.district}
                    onChange={handleAddUserChange}
                    className="w-full px-4 py-3 rounded-lg border bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 dark:text-gray-100 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-colors"
                    placeholder="Enter district"
                  />
                </div>
                
                <div>
                  <label className="font-medium text-gray-700 dark:text-gray-300">State</label>
                  <input
                    type="text"
                    name="state"
                    value={addUserForm.state}
                    onChange={handleAddUserChange}
                    className="w-full px-4 py-3 rounded-lg border bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 dark:text-gray-100 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-colors"
                    placeholder="Enter state"
                  />
                </div>
                
                <div>
                  <label className="font-medium text-gray-700 dark:text-gray-300">Country</label>
                  <input
                    type="text"
                    name="country"
                    value={addUserForm.country}
                    onChange={handleAddUserChange}
                    className="w-full px-4 py-3 rounded-lg border bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 dark:text-gray-100 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-colors"
                    placeholder="Enter country"
                  />
                </div>
                
                <div className="md:col-span-2 flex justify-end gap-4 mt-6 pt-6 border-t border-gray-200 dark:border-gray-600">
                  <button
                    type="button"
                    className="px-6 py-2 rounded-lg font-semibold bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
                    onClick={closeAddUserModal}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 rounded-lg font-semibold bg-green-600 text-white hover:bg-green-700 transition-colors"
                  >
                    Create User
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* View User Modal */}
        {showViewModal && selectedUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 w-full max-w-lg relative">
              <button
                className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
                onClick={closeViewModal}
                title="Close"
              >
                <FiX size={24} />
              </button>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold text-xl">
                  {selectedUser.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{selectedUser.name}</h2>
                  <p className="text-gray-600 dark:text-gray-400">System User Profile</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg space-y-2">
                  <h3 className="font-semibold text-gray-700 dark:text-gray-200 mb-2 border-b dark:border-gray-600 pb-2">User Details</h3>
                  <p><strong className="text-gray-600 dark:text-gray-300">Contact:</strong> <span className="text-gray-800 dark:text-gray-100">{selectedUser.contact}</span></p>
                  <p><strong className="text-gray-600 dark:text-gray-300">Email:</strong> <span className="text-gray-800 dark:text-gray-100">{selectedUser.email}</span></p>
                  <p><strong className="text-gray-600 dark:text-gray-300">Role:</strong> 
                    <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium border ${getRoleColor(selectedUser.role)} dark:bg-indigo-900 dark:text-gray-100 dark:border-indigo-800`}>
                      {selectedUser.role}
                    </span>
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg space-y-2">
                  <h3 className="font-semibold text-gray-700 dark:text-gray-200 mb-2 border-b dark:border-gray-600 pb-2">Location</h3>
                  <p><strong className="text-gray-600 dark:text-gray-300">Address:</strong> <span className="text-gray-800 dark:text-gray-100">{selectedUser.address}</span></p>
                  <p><strong className="text-gray-600 dark:text-gray-300">City:</strong> <span className="text-gray-800 dark:text-gray-100">{selectedUser.city}</span></p>
                  <p><strong className="text-gray-600 dark:text-gray-300">District:</strong> <span className="text-gray-800 dark:text-gray-100">{selectedUser.district}</span></p>
                  <p><strong className="text-gray-600 dark:text-gray-300">State:</strong> <span className="text-gray-800 dark:text-gray-100">{selectedUser.state}</span></p>
                  <p><strong className="text-gray-600 dark:text-gray-300">Country:</strong> <span className="text-gray-800 dark:text-gray-100">{selectedUser.country}</span></p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
} 