import React, { useState, useEffect, useRef } from "react";
import DashboardLayout from "../components/Layout/DashboardLayout";
import { FiEdit2, FiPlus, FiKey, FiX, FiFileText, FiFile, FiEye, FiRefreshCw, FiTrash2, FiUser, FiMail, FiPhone, FiMapPin, FiShield, FiCheckCircle, FiAlertCircle, FiCopy, FiDownload, FiChevronDown, FiChevronUp, FiChevronLeft, FiChevronRight, FiSearch, FiUsers, FiHome, FiCalendar } from "react-icons/fi";
import api from "../api/axiosConfig";
import { toast } from 'react-toastify';

import * as XLSX from 'xlsx';
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// Cache for additional fields to avoid repeated API calls
let additionalFieldsCache = null;
let cacheTimestamp = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Fetch additional fields function
const fetchAdditionalFields = async () => {
  // Return cached data if still valid
  if (additionalFieldsCache && cacheTimestamp && (Date.now() - cacheTimestamp) < CACHE_DURATION) {
    return additionalFieldsCache;
  }

  try {
    const token = localStorage.getItem('token');
    const uid = localStorage.getItem('uid');
    
    if (!token || !uid) {
      throw new Error('Authentication required');
    }

    const response = await api.post('/groupSettings/get_user_additional_fields', {}, {
      headers: {
        'Client-Service': 'COHAPPRT',
        'Auth-Key': '4F21zrjoAASqz25690Zpqf67UyY',
        'uid': uid,
        'token': token,
        'rurl': 'login.etribes.in',
      }
    });

    console.log('Additional Fields Response:', response.data);
    
    // Map backend data to frontend format
    const backendData = response.data?.data || response.data || {};
    
    let mappedFields = [];
    
    if (Array.isArray(backendData)) {
      // Handle array response
      mappedFields = backendData
        .filter(field => field && (field.name || field.label || field.value || field))
        .map((field, index) => ({
          id: index + 1,
          name: field.name || field.label || field.value || field || `Field ${index + 1}`,
          key: `additionalField${index + 1}`,
          backendKey: `ad${index + 1}` || `field${index + 1}`
        }));
    } else {
      // Handle object response
      mappedFields = Object.keys(backendData)
        .filter(key => backendData[key] && backendData[key].trim() !== '')
        .map((key, index) => ({
          id: index + 1,
          name: backendData[key],
          key: key,
          backendKey: key
        }));
    }

    // Cache the result
    additionalFieldsCache = mappedFields;
    cacheTimestamp = Date.now();
    
    return mappedFields;
  } catch (err) {
    console.error('Fetch additional fields error:', err);
    // Return empty array on error
    return [];
  }
};

// Get table headers for member pages
const getMemberTableHeaders = (additionalFields = []) => {
  const baseHeaders = [
    { key: 'sr', name: 'SR No', sortable: true, width: '60px' },
    { key: 'name', name: 'Name', sortable: true, width: '120px' },
    { key: 'contact', name: 'Contact', sortable: true, width: '120px' },
    { key: 'email', name: 'Email', sortable: true, width: '180px' },
    { key: 'address', name: 'Address', sortable: true, width: '200px' },
  ];

  // Add dynamic additional fields
  const dynamicHeaders = additionalFields.map(field => ({
    key: field.key,
    name: field.name,
    sortable: true,
    width: '120px',
    isAdditional: true
  }));

  const endHeaders = [
    { key: 'company', name: 'Company Name', sortable: true, width: '150px' },
    { key: 'validUpto', name: 'Valid Upto', sortable: true, width: '120px' },
    { key: 'status', name: 'Status', sortable: true, width: '100px' },
    { key: 'actions', name: 'Actions', sortable: false, width: '120px' }
  ];

  return [...baseHeaders, ...dynamicHeaders, ...endHeaders];
};

// Get mobile card fields for member pages
const getMemberCardFields = (additionalFields = []) => {
  return additionalFields.map(field => ({
    key: field.key,
    name: field.name,
    backendKey: field.backendKey
  }));
};

// Fetch plans for dropdown with real-time functionality
function useMembershipPlans() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  
    const fetchPlans = async () => {
      try {
      setLoading(true);
        const token = localStorage.getItem('token');
        const uid = localStorage.getItem('uid');
      
      if (!token || !uid) {
        console.error('Authentication required for fetching plans');
        return;
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
      
        const plansData = Array.isArray(response.data?.data) ? response.data.data : [];
        setPlans(plansData);
      console.log('Plans loaded:', plansData);
    } catch (error) {
      console.error('Failed to fetch membership plans:', error);
      toast.error('Failed to load membership plans');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchPlans();
  }, []);
  
  return { plans, loading, refetch: fetchPlans };
}

// Get plan ID from plan name
const getPlanId = (planName) => {
  const planMapping = {
    "Basic": "1",
    "Standard": "2",
    "Premium": "3",
    "Platinum": "4",
    "Diamond": "5",
    "Gold": "6",
    "Voice over plan": "7",
  };
  return planMapping[planName] || "1";
};

// Activate membership via API
const activateMembership = async ({ company_detail_id, membership_plan_id, valid_upto }) => {
  const token = localStorage.getItem('token');
  const uid = localStorage.getItem('uid');
  if (!token || !uid) {
    throw new Error('Authentication required');
  }
  const payload = {
    company_detail_id: String(company_detail_id),
    membership_plan_id: String(membership_plan_id),
    valid_upto: valid_upto,
  };
  const response = await api.post('/UserDetail/activate_membership', payload, {
    headers: {
      'Client-Service': 'COHAPPRT',
      'Auth-Key': '4F21zrjoAASqz25690Zpqf67UyY',
      'uid': uid,
      'token': token,
      'rurl': 'login.etribes.in',
      'Content-Type': 'application/json',
    },
    timeout: 15000,
  });
  return response.data;
};

export default function MembershipExpired() {
  const { plans, loading: plansLoading, refetch: refetchPlans } = useMembershipPlans();
  const [members, setMembers] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [loading, setLoading] = useState(true);
  const [sortField, setSortField] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");
  const [showExportDropdown, setShowExportDropdown] = useState(false);
  const [additionalFields, setAdditionalFields] = useState([]);
  const [tableHeaders, setTableHeaders] = useState([]);
  const [cardFields, setCardFields] = useState([]);
  const [viewMember, setViewMember] = useState(null);

  // Load additional fields on component mount
  useEffect(() => {
    const loadAdditionalFields = async () => {
      try {
        const fields = await fetchAdditionalFields();
        setAdditionalFields(fields);
        setTableHeaders(getMemberTableHeaders(fields));
        setCardFields(getMemberCardFields(fields));
      } catch (error) {
        console.error('Failed to load additional fields:', error);
      }
    };
    loadAdditionalFields();
  }, []);

  // Close export dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showExportDropdown && !event.target.closest('.export-dropdown')) {
        setShowExportDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showExportDropdown]);

  // Fetch expired members from API
  const fetchExpiredMembers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const uid = localStorage.getItem('uid');
      
      if (!token) {
        toast.error('Please log in to view expired members');
        window.location.href = '/login';
        return;
      }

      const response = await api.post('/userDetail/membership_expired', { uid }, {
        headers: {
          'token': token,
          'uid': uid,
        }
      });

      console.log('Expired Members Response:', response.data);
      
      // Handle different response formats
      let membersData = [];
      if (Array.isArray(response.data)) {
        membersData = response.data;
      } else if (response.data?.data && Array.isArray(response.data.data)) {
        membersData = response.data.data;
      } else if (response.data?.members && Array.isArray(response.data.members)) {
        membersData = response.data.members;
      }
      
      setMembers(membersData);
    } catch (err) {
      console.error('Fetch expired members error:', err);
      toast.error('Failed to fetch expired members');
      setMembers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpiredMembers();
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-800">
          <div className="flex items-center gap-3">
            <FiRefreshCw className="animate-spin text-indigo-600 text-2xl" />
            <p className="text-indigo-700 dark:text-indigo-300">Loading expired members...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

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
  const sortedData = [...members].sort((a, b) => {
    const aValue = a[sortField] || '';
    const bValue = b[sortField] || '';
    
    if (sortDirection === 'asc') {
      return aValue.toString().localeCompare(bValue.toString());
    } else {
      return bValue.toString().localeCompare(aValue.toString());
    }
  });

  // Filter by name
  const filtered = sortedData.filter(m => m.name?.toLowerCase().includes(search.toLowerCase()) ||
                                      m.email?.toLowerCase().includes(search.toLowerCase()) ||
                                      m.phone_num?.toLowerCase().includes(search.toLowerCase()) ||
                                      m.company_name?.toLowerCase().includes(search.toLowerCase()));
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

  // Removed openModify function
  // Removed closeModify function

  // Removed handleFormChange function
  // Removed handleDateChange function
  // Removed handleUpdate function

  // Export Handlers
  const handleExportCSV = () => {
    if (!members.length) return;
    const headers = [
      "Name", "Contact", "Email", "Address", "PAN Number", "Aadhar Number", "DL Number", "D.O.B", "Company Name", "Membership Expiry Date"
    ];
    const rows = members.map(m => [
      m.name,
      m.phone_num || m.contact,
      m.email,
      m.address,
      m.ad1 || m.pan,
      m.ad2 || m.aadhar,
      m.ad3 || m.dl,
      m.ad4 || m.dob,
      m.company_name || m.company,
      m.membershipExpired || m.membership_expired || ""
    ]);
    let csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].map(e => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "membership_expired.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportExcel = () => {
    if (!members.length) return;
    const ws = XLSX.utils.json_to_sheet(
      members.map(m => ({
        Name: m.name,
        Contact: m.phone_num || m.contact,
        Email: m.email,
        Address: m.address,
        "PAN Number": m.ad1 || m.pan,
        "Aadhar Number": m.ad2 || m.aadhar,
        "DL Number": m.ad3 || m.dl,
        "D.O.B": m.ad4 || m.dob,
        "Company Name": m.company_name || m.company,
        "Membership Expiry Date": m.membershipExpired || m.membership_expired || ""
      }))
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Membership Expired");
    XLSX.writeFile(wb, "membership_expired.xlsx");
  };

  const handleExportPDF = () => {
    if (!members.length) return;
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "pt",
      format: "a4"
    });
    const headers = [[
      "Name", "Contact", "Email", "Address", "PAN Number", "Aadhar Number", "DL Number", "D.O.B", "Company Name", "Membership Expiry Date"
    ]];
    const rows = members.map(m => [
      m.name,
      m.phone_num || m.contact,
      m.email,
      m.address,
      m.ad1 || m.pan,
      m.ad2 || m.aadhar,
      m.ad3 || m.dl,
      m.ad4 || m.dob,
      m.company_name || m.company,
      m.membershipExpired || m.membership_expired || ""
    ]);
    try {
      autoTable(doc, {
        head: headers,
        body: rows,
        startY: 20,
        styles: { fontSize: 8 },
        headStyles: { fillColor: [41, 128, 185] }
      });
      doc.save("membership_expired.pdf");
    } catch (err) {
      console.error("autoTable failed:", err);
      alert("PDF export failed: " + err.message);
    }
  };

  const handleCopyToClipboard = () => {
    if (!members.length) return;
    const data = members.map(m => 
      `${m.name}, ${m.phone_num || m.contact}, ${m.email}, ${m.address}, ${m.ad1 || m.pan}, ${m.ad2 || m.aadhar}, ${m.ad3 || m.dl}, ${m.ad4 || m.dob}, ${m.company_name || m.company}, ${m.membershipExpired || m.membership_expired || ""}`
    ).join('\n');
    navigator.clipboard.writeText(data);
  };

  const handleRefresh = () => {
    fetchExpiredMembers();
    setCurrentPage(1);
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-4 py-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-2xl font-bold text-orange-600">Membership Expired</h1>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>Total Expired Members: {members.length}</span>
          </div>
        </div>

        <div className="rounded-2xl shadow-lg bg-white dark:bg-gray-800 max-w-7xl w-full mx-auto">
          {/* Controls */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 px-6 py-4 border-b border-gray-100 dark:border-gray-700">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="relative flex-1">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
                  placeholder="Search by name, email, contact, or company..."
                  className="pl-10 pr-4 py-2 border rounded-lg text-sm bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 focus:ring-2 focus:ring-indigo-400 transition-colors"
              value={search}
              onChange={e => setSearch(e.target.value)}
                  style={{ minWidth: '100%', maxWidth: '100%' }}
            />
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 flex-shrink-0">
                <span>Showing {startIdx + 1} to {Math.min(startIdx + entriesPerPage, totalEntries)} of {totalEntries} entries</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 items-center justify-between xl:justify-start">
              <button 
                className="flex items-center gap-1 bg-blue-500 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-600 transition"
                onClick={handleRefresh}
                title="Refresh Data"
              >
                <FiRefreshCw /> 
                <span>Refresh</span>
              </button>
              
              {/* Desktop Export Buttons - Show on larger screens */}
              <div className="hidden xl:flex gap-2">
              <button 
                className="flex items-center gap-1 bg-gray-500 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-600 transition"
                  onClick={handleCopyToClipboard}
                title="Copy to Clipboard"
              >
                  <FiCopy /> 
                  Copy
              </button>
              
              <button 
                className="flex items-center gap-1 bg-green-500 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-green-600 transition"
                onClick={handleExportCSV}
                title="Export CSV"
              >
                  <FiDownload /> 
                  CSV
              </button>
              
              <button 
                className="flex items-center gap-1 bg-emerald-500 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-emerald-600 transition"
                onClick={handleExportExcel}
                title="Export Excel"
              >
                  <FiFile /> 
                  Excel
              </button>
              
              <button 
                className="flex items-center gap-1 bg-rose-500 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-rose-600 transition"
                onClick={handleExportPDF}
                title="Export PDF"
              >
                  <FiFile /> 
                  PDF
                </button>
              </div>
              
              {/* Mobile/Tablet Export Dropdown - Show on smaller screens */}
              <div className="relative xl:hidden">
                <button
                  className="flex items-center gap-1 bg-indigo-500 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-indigo-600 transition"
                  onClick={() => setShowExportDropdown(!showExportDropdown)}
                >
                  <FiDownload />
                  <span>Export</span>
                  <FiChevronDown className={`transition-transform ${showExportDropdown ? 'rotate-180' : ''}`} />
                </button>
                
                {showExportDropdown && (
                  <div className="absolute right-0 top-full mt-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-20 min-w-32 export-dropdown">
                    <button
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-t-lg"
                      onClick={() => {
                        handleCopyToClipboard();
                        setShowExportDropdown(false);
                      }}
                    >
                      <FiCopy className="text-gray-500" />
                      Copy
                    </button>
                    <button
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() => {
                        handleExportCSV();
                        setShowExportDropdown(false);
                      }}
                    >
                      <FiDownload className="text-green-500" />
                      CSV
                    </button>
                    <button
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() => {
                        handleExportExcel();
                        setShowExportDropdown(false);
                      }}
                    >
                      <FiFile className="text-emerald-500" />
                      Excel
                    </button>
                    <button
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-b-lg"
                      onClick={() => {
                        handleExportPDF();
                        setShowExportDropdown(false);
                      }}
                    >
                      <FiFile className="text-rose-500" />
                      PDF
              </button>
                  </div>
                )}
              </div>
            </div>
          </div>
          {/* Table - Desktop View */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead className="bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/50 dark:to-purple-900/50 text-gray-700 dark:text-gray-200 sticky top-0 z-10 shadow-sm">
                <tr className="border-b-2 border-indigo-200 dark:border-indigo-800">
                  {tableHeaders.map((header, index) => (
                    <th 
                      key={header.key}
                      className={`p-3 font-semibold cursor-pointer hover:bg-indigo-200 dark:hover:bg-indigo-900 transition-colors border-r border-indigo-200 dark:border-indigo-800 whitespace-nowrap ${
                        header.sortable ? '' : 'cursor-default'
                      }`}
                      onClick={() => header.sortable && handleSort(header.key)}
                      style={{ minWidth: header.width, width: header.width }}
                  >
                    <div className="flex items-center gap-1">
                        {header.name}
                        {header.sortable && (
                          <div className="flex flex-col">
                            <span className={`text-xs ${sortField === header.key && sortDirection === "asc" ? "text-indigo-600" : "text-gray-400"}`}>▲</span>
                            <span className={`text-xs ${sortField === header.key && sortDirection === "desc" ? "text-indigo-600" : "text-gray-400"}`}>▼</span>
                    </div>
                      )}
                    </div>
                  </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginated.map((m, idx) => (
                  <tr 
                    key={m.id} 
                    className={`border-b border-gray-200 dark:border-gray-700 transition-colors ${
                      idx % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-900/50'
                    } hover:bg-indigo-50 dark:hover:bg-gray-700 hover:shadow-sm`}
                  >
                    {tableHeaders.map((header, headerIndex) => {
                      if (header.key === 'sr') {
                        return (
                          <td key={header.key} className="p-3 text-center font-semibold text-indigo-700 dark:text-indigo-300 border-r border-gray-200 dark:border-gray-700">
                      {startIdx + idx + 1}
                    </td>
                        );
                      } else if (header.key === 'name') {
                        return (
                          <td key={header.key} className="p-3 text-left border-r border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-100">
                      <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-pink-600 rounded-full flex items-center justify-center text-white font-semibold text-xs">
                          {m.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-medium text-gray-800 dark:text-gray-100">{m.name}</span>
                      </div>
                    </td>
                        );
                      } else if (header.key === 'contact') {
                        return (
                          <td key={header.key} className="p-3 text-left border-r border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-100">
                            {m.phone_num || m.contact}
                          </td>
                        );
                      } else if (header.key === 'email') {
                        return (
                          <td key={header.key} className="p-3 text-left border-r border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-100">
                            {m.email}
                          </td>
                        );
                      } else if (header.key === 'address') {
                        return (
                          <td key={header.key} className="p-3 text-left border-r border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-100">
                            {m.address}
                          </td>
                        );
                      } else if (header.key === 'company') {
                        return (
                          <td key={header.key} className="p-3 text-left border-r border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-100">
                            {m.company_name || m.company}
                          </td>
                        );
                      } else if (header.key === 'validUpto') {
                        return (
                          <td key={header.key} className="p-3 text-left border-r border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-100">
                            {m.valid_upto || m.validUpto || '-'}
                          </td>
                        );
                      } else if (header.key === 'status') {
                        return (
                          <td key={header.key} className="p-3 text-left border-r border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-100">
                            <span className="px-2 py-1 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-full text-xs font-medium">
                        {m.membershipExpired || m.membership_expired || "Expired"}
                      </span>
                    </td>
                        );
                      } else if (header.key === 'actions') {
                        return (
                          <td key={header.key} className="p-3 text-center">
                      <button
                              className="text-indigo-600 dark:text-indigo-300 hover:text-indigo-900 p-2 rounded-full hover:bg-indigo-100 dark:hover:bg-gray-700 transition-colors"
                              title="Renew Membership"
                        onClick={() => setViewMember(m)}
                      >
                        <FiEdit2 size={18} />
                      </button>
                    </td>
                        );
                      } else if (header.isAdditional) {
                        return (
                          <td key={header.key} className="p-3 text-left border-r border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-100">
                            {m[header.key] || m[header.key.replace('additionalField', 'ad')] || '-'}
                          </td>
                        );
                      } else {
                        return (
                          <td key={header.key} className="p-3 text-left border-r border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-100">
                            {m[header.key] || '-'}
                          </td>
                        );
                      }
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards View */}
          <div className="lg:hidden p-4 sm:p-6 space-y-4">
            {paginated.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-300">
                <FiUsers className="mx-auto text-4xl mb-2 text-gray-300 dark:text-gray-700" />
                <p className="text-sm">No expired members found</p>
              </div>
            ) : (
              <>
                {paginated.map((member, idx) => (
                  <div key={member.id} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-orange-500 to-amber-600 dark:from-orange-800 dark:to-amber-900 flex items-center justify-center flex-shrink-0">
                          <span className="text-sm font-medium text-white">
                            {member.name ? member.name.charAt(0).toUpperCase() : 'N'}
                          </span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">{member.name || 'Unknown'}</h3>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Member #{startIdx + idx + 1}</p>
                          <span className="inline-block px-2 py-1 bg-red-100 text-red-800 border border-red-200 rounded-full text-xs font-medium">
                            Expired
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button
                          className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300 transition-colors p-1"
                          onClick={() => setViewMember(member)}
                          title="View Member"
                        >
                          <FiEye size={16} />
                        </button>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <FiPhone className="text-gray-400 flex-shrink-0" size={14} />
                        <span className="text-gray-700 dark:text-gray-300 truncate">{member.phone_num || member.contact || 'No contact'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FiMail className="text-gray-400 flex-shrink-0" size={14} />
                        <span className="text-gray-700 dark:text-gray-300 truncate">{member.email || 'No email'}</span>
                      </div>
                      {member.address && (
                        <div className="flex items-start gap-2">
                          <FiMapPin className="text-gray-400 flex-shrink-0 mt-0.5" size={14} />
                          <span className="text-gray-700 dark:text-gray-300 text-xs line-clamp-2">
                            {member.address}
                          </span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <FiHome className="text-gray-400 flex-shrink-0" size={14} />
                        <span className="text-gray-700 dark:text-gray-300 truncate">{member.company_name || member.company || 'No company'}</span>
                      </div>
                      
                      {/* Dynamic Additional Fields for Mobile */}
                      {cardFields.map(field => {
                        const fieldValue = member[field.backendKey] || member[field.key];
                        if (fieldValue) {
                          return (
                            <div key={field.key} className="flex items-center gap-2">
                              <FiUser className="text-gray-400 flex-shrink-0" size={14} />
                              <span className="text-gray-700 dark:text-gray-300 text-xs">
                                <span className="font-medium">{field.name}:</span> {fieldValue}
                              </span>
                            </div>
                          );
                        }
                        return null;
                      })}
                      
                      <div className="flex items-center gap-2">
                        <FiCalendar className="text-red-400 flex-shrink-0" size={14} />
                        <span className="text-red-600 dark:text-red-400 text-xs">
                          <span className="font-medium">Expired:</span> {member.membershipExpired || member.membership_expired || member.ad5 || member.valid_upto || "Unknown"}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
          
          {/* Pagination Controls */}
          {totalEntries > 0 && (
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6 border-t border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">Show</span>
                <select
                  className="border rounded-lg px-3 py-1 text-sm bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 text-gray-700 focus:ring-2 focus:ring-indigo-400 transition-colors"
                  value={entriesPerPage}
                  onChange={handleEntriesChange}
                >
                  {[10, 25, 50, 100].map(num => (
                    <option key={num} value={num}>{num}</option>
                  ))}
                </select>
                <span className="text-sm text-gray-600 dark:text-gray-400">entries per page</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrev}
                  disabled={currentPage === 1}
                  className={`px-3 py-1 rounded-lg text-indigo-600 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-gray-700 transition-colors ${
                    currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  title="Previous"
                >
                  &lt;
                </button>
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={handleNext}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-1 rounded-lg text-indigo-600 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-gray-700 transition-colors ${
                    currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  title="Next"
                >
                  &gt;
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}