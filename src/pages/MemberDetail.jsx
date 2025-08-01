import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiEdit2, FiArrowUp, FiUser, FiMail, FiPhone, FiMapPin, FiHome, FiCalendar, FiShield, FiFileText, FiGlobe, FiAlertCircle, FiChevronLeft, FiRefreshCw, FiBriefcase } from "react-icons/fi";
import DashboardLayout from "../components/Layout/DashboardLayout";
import api from "../api/axiosConfig";
import { toast } from 'react-toastify';
import { getAuthHeaders } from "../utils/apiHeaders";

export default function MemberDetail() {
  const { memberId } = useParams();
  const navigate = useNavigate();
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('user-profile');

  useEffect(() => {
    const fetchMemberDetails = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem('token');
        const uid = localStorage.getItem('uid');

        if (!token || !uid) {
          toast.error('Please log in to view member details');
          navigate('/login');
          return;
        }

        // Fetch member details by ID - using the active_members endpoint with filtering
        const response = await api.post('/userDetail/active_members', {}, {
          headers: getAuthHeaders()
        });

        if (response.data.success || response.data) {
          // Find the specific member by ID
          const members = Array.isArray(response.data) ? response.data : response.data.data || [];
          const foundMember = members.find(m => m.id === memberId || m.company_detail_id === memberId || m.user_detail_id === memberId);
          
          if (foundMember) {
            setMember(foundMember);
          } else {
            setError('Member not found');
            toast.error('Member not found');
          }
        } else {
          setError('Failed to fetch member details');
          toast.error(response.data.message || 'Failed to fetch member details');
        }
      } catch (err) {
        console.error('Fetch member details error:', err);
        setError('Failed to fetch member details');
        toast.error(err.response?.data?.message || err.message || 'Failed to fetch member details');
      } finally {
        setLoading(false);
      }
    };

    if (memberId) {
      fetchMemberDetails();
    }
  }, [memberId, navigate]);

  const handleEditData = () => {
    // Navigate to edit page or open edit modal
    toast.info('Edit functionality will be implemented');
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const tabs = [
    { id: 'user-profile', label: 'User Profile' },
    { id: 'business-profile', label: 'Business Profile' },
    { id: 'company-documents', label: 'Company Documents' },
    { id: 'personal-documents', label: 'Personal Documents' },
    { id: 'payment-details', label: 'Payment Details' },
    { id: 'products', label: 'Products' }
  ];

  if (loading) {
    return (
      <DashboardLayout>
        <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-800">
          <div className="flex items-center gap-3">
            <FiRefreshCw className="animate-spin text-indigo-600 text-2xl" />
            <p className="text-indigo-700 dark:text-indigo-300">Loading member details...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !member) {
    return (
      <DashboardLayout>
        <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-800">
          <div className="text-center">
            <FiAlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Member Not Found</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">{error || 'The requested member could not be found.'}</p>
            <button
              onClick={() => navigate(-1)}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const renderUserProfile = () => (
    <div className="relative w-full flex flex-col md:flex-row gap-8 items-start">
      {/* Left: Profile Picture */}
      <div className="flex flex-col items-center gap-6 min-w-[220px] w-full md:w-[220px]">
        <div className="relative">
          <img
            src={member.profile_image ? `https://api.etribes.in/${member.profile_image}` : ''}
            alt="User Profile"
            className="w-28 h-28 rounded-full object-cover border-2 border-gray-300 dark:border-gray-700 shadow-md bg-gray-100 dark:bg-gray-800"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
          <div className="w-28 h-28 rounded-full border-2 border-gray-300 dark:border-gray-700 shadow-md bg-gray-100 dark:bg-gray-800 flex items-center justify-center" style={{ display: member.profile_image ? 'none' : 'flex' }}>
            <div className="text-center text-gray-600 dark:text-gray-400">
              <div className="text-3xl font-bold mb-1">
                {member.name ? member.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="text-xs">
                {member.name || 'User'}
              </div>
            </div>
          </div>
        </div>
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mt-2">{member.name || 'User'}</h2>
          <div className="text-sm text-gray-500 dark:text-gray-300 font-medium">{member.email}</div>
          <div className="text-sm text-gray-400 dark:text-gray-400">{member.phone_num}</div>
        </div>
      </div>

      {/* Right: Details Table */}
      <div className="flex-1 w-full">
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 dark:border-gray-700 rounded-xl">
            <tbody>
              {[
                { label: 'Name', key: 'name' },
                { label: 'Email', key: 'email' },
                { label: 'Contact No', key: 'phone_num' },
                { label: 'Address', key: 'address' },
                { label: 'City', key: 'city' },
                { label: 'State', key: 'district' },
                { label: 'Country', key: 'country', value: 'India' },
                { label: 'PAN Number', key: 'ad1' },
                { label: 'Aadhaar Number', key: 'ad2' },
                { label: 'Driving License Number', key: 'ad3' },
                { label: 'Date Of Birth', key: 'ad4' },
                ...(member.ad5 ? [{ label: 'Valid Until', key: 'ad5' }] : []),
                ...(member.ad6 ? [{ label: 'Additional Field 6', key: 'ad6' }] : []),
                ...(member.ad7 ? [{ label: 'Additional Field 7', key: 'ad7' }] : []),
                ...(member.ad8 ? [{ label: 'Additional Field 8', key: 'ad8' }] : []),
                ...(member.ad9 ? [{ label: 'Additional Field 9', key: 'ad9' }] : []),
                ...(member.ad10 ? [{ label: 'Additional Field 10', key: 'ad10' }] : []),
              ].map(({ label, key, value }) => (
                <tr key={key} className="border-b last:border-b-0 border-gray-200 dark:border-gray-700">
                  <td className="px-6 py-4 font-semibold text-gray-700 dark:text-gray-200 bg-gray-50 dark:bg-gray-900/50 w-48 align-top">{label}</td>
                  <td className="px-6 py-4 bg-white dark:bg-gray-800">
                    <span className="text-gray-900 dark:text-gray-100 text-base font-normal">{value || member[key] || '-'}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderBusinessProfile = () => (
    <div className="relative w-full flex flex-col md:flex-row gap-8 items-start">
      {/* Left: Business Logo */}
      <div className="flex flex-col items-center gap-6 min-w-[220px] w-full md:w-[220px]">
        <div className="relative">
          <img
            src={member.logo ? `https://api.etribes.in/${member.logo}` : ''}
            alt="Business Logo"
            className="w-28 h-28 rounded-full object-cover border-2 border-gray-300 dark:border-gray-700 shadow-md bg-gray-100 dark:bg-gray-800"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
          <div className="w-28 h-28 rounded-full border-2 border-gray-300 dark:border-gray-700 shadow-md bg-gray-100 dark:bg-gray-800 flex items-center justify-center" style={{ display: member.logo ? 'none' : 'flex' }}>
            <div className="text-center text-gray-600 dark:text-gray-400">
              <div className="text-3xl font-bold mb-1">
                {member.company_name ? member.company_name.charAt(0).toUpperCase() : 'B'}
              </div>
              <div className="text-xs">
                {member.company_name || 'Business'}
              </div>
            </div>
          </div>
        </div>
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mt-2">{member.company_name || 'Business'}</h2>
          <div className="text-sm text-gray-500 dark:text-gray-300 font-medium">{member.company_email || member.email}</div>
          <div className="text-sm text-gray-400 dark:text-gray-400">{member.company_contact || member.phone_num}</div>
        </div>
      </div>

      {/* Right: Business Details Table */}
      <div className="flex-1 w-full">
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 dark:border-gray-700 rounded-xl">
            <tbody>
              {[
                { label: 'Name', key: 'company_name' },
                { label: 'Email', key: 'company_email', fallback: 'email' },
                { label: 'Contact No', key: 'company_contact', fallback: 'phone_num' },
                { label: 'Address', key: 'company_address', fallback: 'address' },
                { label: 'City', key: 'city' },
                { label: 'District', key: 'district' },
                { label: 'State', key: 'district' },
                { label: 'Country', key: 'country', value: 'India' },
                { label: 'Pincode', key: 'pincode' },
                { label: 'GST No', key: 'company_gstn', fallback: 'cad1' },
                { label: 'IEC No', key: 'company_iec', fallback: 'cad2' },
                { label: 'PAN Number', key: 'company_pan', fallback: 'cad3' },
                { label: 'CIN No', key: 'cad4' },
                { label: 'Website', key: 'website' },
                { label: 'Helpline', key: 'cad5' },
                { label: 'Aadhar No', key: 'cad6' },
                ...(member.cad7 ? [{ label: 'Additional Field 7', key: 'cad7' }] : []),
                ...(member.cad8 ? [{ label: 'Additional Field 8', key: 'cad8' }] : []),
                ...(member.cad9 ? [{ label: 'Additional Field 9', key: 'cad9' }] : []),
                ...(member.cad10 ? [{ label: 'Additional Field 10', key: 'cad10' }] : []),
              ].map(({ label, key, value, fallback }) => (
                <tr key={key} className="border-b last:border-b-0 border-gray-200 dark:border-gray-700">
                  <td className="px-6 py-4 font-semibold text-gray-700 dark:text-gray-200 bg-gray-50 dark:bg-gray-900/50 w-48 align-top">{label}</td>
                  <td className="px-6 py-4 bg-white dark:bg-gray-800">
                    <span className="text-gray-900 dark:text-gray-100 text-base font-normal">
                      {value || member[key] || (fallback ? member[fallback] : null) || '-'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'user-profile':
        return renderUserProfile();
      case 'business-profile':
        return renderBusinessProfile();
      case 'company-documents':
        return (
          <div className="text-center py-8">
            <FiFileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-500">Company Documents section will be implemented</p>
          </div>
        );
      case 'personal-documents':
        return (
          <div className="text-center py-8">
            <FiFileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-500">Personal Documents section will be implemented</p>
          </div>
        );
      case 'payment-details':
        return (
          <div className="text-center py-8">
            <FiShield className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-500">Payment Details section will be implemented</p>
          </div>
        );
      case 'products':
        return (
          <div className="text-center py-8">
            <FiBriefcase className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-500">Products section will be implemented</p>
          </div>
        );
      default:
        return renderUserProfile();
    }
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-4 py-3">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <FiChevronLeft size={20} />
            </button>
            <h1 className="text-xl sm:text-2xl font-bold text-orange-600">
              {activeTab === 'user-profile' ? 'User Profile' : activeTab === 'business-profile' ? 'Business Profile' : 'Member Profile'}
            </h1>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <FiUser className="text-indigo-600" />
            <span>Member ID: {memberId}</span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-8 border-b border-gray-200 dark:border-gray-700">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Controls */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center gap-4">
            <button 
              className="flex items-center gap-1 bg-blue-500 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-600 transition"
              onClick={handleRefresh}
              title="Refresh Data"
            >
              <FiRefreshCw /> 
              <span>Refresh</span>
            </button>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={handleEditData}
              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2"
            >
              <FiEdit2 size={16} />
              Edit Data
            </button>
          </div>
        </div>

        {/* Profile Content */}
        {renderTabContent()}

        {/* Scroll to Top Button */}
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 bg-red-500 text-white p-3 rounded-full shadow-lg hover:bg-red-600 transition-colors"
          title="Scroll to top"
        >
          <FiArrowUp size={20} />
        </button>
      </div>
    </DashboardLayout>
  );
} 