import React, { useState, useEffect } from "react";
import DashboardLayout from "../components/Layout/DashboardLayout";
import { FiDownload, FiFilter, FiEdit2, FiTrash2, FiChevronDown, FiChevronUp, FiFileText, FiFile, FiX, FiCopy, FiPlus, FiUser, FiMail, FiPhone, FiMapPin, FiRefreshCw, FiSearch } from "react-icons/fi";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import api from "../api/axiosConfig";

// Fallback data in case API is not available
const fallbackContactsData = [
  { id: 1, dept: "CEO", name: "Rohit Arya", contact: "1234567890", email: "rohit@company.com", address: "123 Main St" },
  { id: 2, dept: "HR", name: "Priya Singh", contact: "9876543210", email: "priya@company.com", address: "456 Park Ave" },
  { id: 3, dept: "Tech", name: "Amit Kumar", contact: "5551234567", email: "amit@company.com", address: "789 Tech Blvd" },
  { id: 4, dept: "HR", name: "Neha Verma", contact: "4445556666", email: "neha@company.com", address: "321 Lake Rd" },
  { id: 5, dept: "Finance", name: "Suresh Patel", contact: "3332221111", email: "suresh@company.com", address: "654 Finance St" },
  { id: 6, dept: "Tech", name: "Sunita Rao", contact: "2223334444", email: "sunita@company.com", address: "987 Tech Park" },
  { id: 7, dept: "Admin", name: "Vikas Sharma", contact: "1112223333", email: "vikas@company.com", address: "159 Admin Ave" },
  { id: 8, dept: "Finance", name: "Meena Joshi", contact: "8889990000", email: "meena@company.com", address: "753 Finance Blvd" },
  { id: 9, dept: "CEO", name: "Anil Kapoor", contact: "7778889999", email: "anil@company.com", address: "852 Main St" },
  { id: 10, dept: "HR", name: "Kiran Desai", contact: "6665554444", email: "kiran@company.com", address: "357 HR Lane" },
  { id: 11, dept: "Admin", name: "Ritu Singh", contact: "9998887777", email: "ritu@company.com", address: "951 Admin Rd" },
  { id: 12, dept: "Tech", name: "Deepak Mehta", contact: "1231231234", email: "deepak@company.com", address: "246 Tech Ave" },
  { id: 13, dept: "Finance", name: "Pooja Agarwal", contact: "3213214321", email: "pooja@company.com", address: "135 Finance St" },
  { id: 14, dept: "CEO", name: "Sanjay Dutt", contact: "5556667777", email: "sanjay@company.com", address: "864 Main St" },
  { id: 15, dept: "HR", name: "Asha Parekh", contact: "4443332222", email: "asha@company.com", address: "753 HR Blvd" },
];

export default function ImportantContactsPage() {
  const [contactsData, setContactsData] = useState(fallbackContactsData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [sortAsc, setSortAsc] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [editContact, setEditContact] = useState(null);
  const [deleteContact, setDeleteContact] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState("");
  const [showAddContactModal, setShowAddContactModal] = useState(false);
  const [addContactForm, setAddContactForm] = useState({
    dept: "",
    name: "",
    contact: "",
    email: "",
    address: ""
  });

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch real data from contacts API
        const token = localStorage.getItem('token');
        const uid = localStorage.getItem('uid');
        
        console.log('Fetching contacts with token:', token, 'uid:', uid);
        
        const response = await api.get('/contact', {
          headers: {
            'Client-Service': 'COHAPPRT',
            'Auth-Key': '4F21zrjoAASqz25690Zpqf67UyY',
            'uid': uid,
            'token': token,
            'rurl': 'login.etribes.in',
            'Content-Type': 'application/json',
          }
        });

        console.log('API Response:', response.data);

        let contacts = [];
        // Handle the nested structure: response.data.data.contact
        if (response.data?.data?.contact && Array.isArray(response.data.data.contact)) {
          contacts = response.data.data.contact;
        } else if (Array.isArray(response.data?.data)) {
          contacts = response.data.data;
        } else if (Array.isArray(response.data)) {
          contacts = response.data;
        } else if (response.data?.data && typeof response.data.data === 'object') {
          contacts = Object.values(response.data.data);
        } else if (response.data?.contacts && Array.isArray(response.data.contacts)) {
          contacts = response.data.contacts;
        } else if (response.data?.contact && Array.isArray(response.data.contact)) {
          contacts = response.data.contact;
        } else {
          contacts = [];
        }

        console.log('Extracted contacts:', contacts);

        // Map backend contacts to frontend format
        const mappedContacts = contacts.map((contact, index) => {
          console.log('Processing contact:', contact);
          return {
            id: contact.id || contact.contact_id || contact.contactId || index + 1,
            dept: contact.department || contact.dept || contact.role || contact.contact_department || 'General',
            name: contact.name || contact.person_name || contact.contact_name || contact.contactName || `Contact ${index + 1}`,
            contact: contact.contact || contact.phone || contact.phone_number || contact.mobile || contact.contact_number || contact.contact_no || '',
            email: contact.email || contact.email_address || contact.contact_email || contact.email_id || '',
            address: contact.address || contact.location || contact.contact_address || contact.address_line || '',
          };
        });

        console.log('Mapped contacts:', mappedContacts);

        // If no real data, use fallback
        if (mappedContacts.length === 0) {
          console.log('No contacts found, using fallback data');
          setContactsData(fallbackContactsData);
        } else {
          console.log('Setting contacts data:', mappedContacts);
          setContactsData(mappedContacts);
        }
        
      } catch (err) {
        console.error('Fetch contacts error:', err);
        console.error('Error details:', err.response?.data);
        setError('Failed to fetch contacts: ' + (err.response?.data?.message || err.message));
        // Use fallback data on error
        setContactsData(fallbackContactsData);
      } finally {
        setLoading(false);
      }
    };

    fetchContacts();
    const interval = setInterval(fetchContacts, 60000); // Poll every minute
    return () => clearInterval(interval);
  }, []);

  const departments = ["All", ...Array.from(new Set(contactsData.map(c => c.dept)))];

  const filteredContacts = contactsData.filter(c => {
    const matchesFilter = filter === "All" || c.dept === filter;
    const matchesSearch = search === "" || 
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.contact.includes(search) ||
      c.dept.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const sortedContacts = [...filteredContacts].sort((a, b) => {
    if (sortAsc) {
      return a.name.localeCompare(b.name);
    } else {
      return b.name.localeCompare(a.name);
    }
  });

  // Pagination logic
  const totalEntries = sortedContacts.length;
  const totalPages = Math.ceil(totalEntries / entriesPerPage);
  const startIdx = (currentPage - 1) * entriesPerPage;
  const endIdx = startIdx + entriesPerPage;
  const paginatedContacts = sortedContacts.slice(startIdx, endIdx);

  const handlePrev = () => setCurrentPage((p) => Math.max(1, p - 1));
  const handleNext = () => setCurrentPage((p) => Math.min(totalPages, p + 1));
  const handleEntriesChange = (e) => {
    setEntriesPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  // Handlers for edit form
  const [editForm, setEditForm] = useState({ id: '', dept: '', name: '', contact: '', email: '', address: '' });
  React.useEffect(() => {
    if (editContact) {
      setEditForm(editContact);
    }
  }, [editContact]);

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleEditSave = () => {
    // Update the contact in the local state
    setContactsData(prev => prev.map(c => c.id === editForm.id ? editForm : c));
    setEditContact(null);
  };

  const handleDelete = () => {
    if (deleteConfirm === "DELETE") {
      // Remove the contact from the local state
      setContactsData(prev => prev.filter(c => c.id !== deleteContact.id));
      setDeleteContact(null);
      setDeleteConfirm("");
    }
  };

  // Add contact handlers
  const handleAddContactChange = (e) => {
    setAddContactForm({ ...addContactForm, [e.target.name]: e.target.value });
  };

  const handleAddContactSubmit = (e) => {
    e.preventDefault();
    // Add the contact to the local state
    const newContact = {
      id: Math.max(...contactsData.map(c => c.id)) + 1,
      ...addContactForm
    };
    setContactsData(prev => [...prev, newContact]);
    setShowAddContactModal(false);
    setAddContactForm({ dept: "", name: "", contact: "", email: "", address: "" });
  };

  // Copy handler
  const handleCopy = (value) => {
    navigator.clipboard.writeText(value);
  };

  // Export handlers
  const handleExportCSV = () => {
    const headers = ["Department", "Name", "Contact", "Email", "Address"];
    const rows = contactsData.map(c => [c.dept, c.name, c.contact, c.email, c.address]);
    let csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].map(e => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "important_contacts.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(
      contactsData.map(c => ({
        Department: c.dept,
        Name: c.name,
        Contact: c.contact,
        Email: c.email,
        Address: c.address,
      }))
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Important Contacts");
    XLSX.writeFile(wb, "important_contacts.xlsx");
  };

  const handleExportPDF = () => {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "pt",
      format: "a4"
    });
    const headers = [[
      "Department", "Name", "Contact", "Email", "Address"
    ]];
    const rows = contactsData.map(c => [
      c.dept,
      c.name,
      c.contact,
      c.email,
      c.address,
    ]);
    try {
      autoTable(doc, {
        head: headers,
        body: rows,
        startY: 20,
        styles: { fontSize: 8 },
        headStyles: { fillColor: [41, 128, 185] }
      });
      doc.save("important_contacts.pdf");
    } catch (err) {
      alert("PDF export failed: " + err.message);
    }
  };

  const handleCopyToClipboard = () => {
    const data = contactsData.map(c => 
      `${c.dept},${c.name},${c.contact},${c.email},${c.address}`
    ).join('\n');
    navigator.clipboard.writeText(data);
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex flex-col gap-4 py-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h1 className="text-2xl font-bold text-orange-600">Important Contacts</h1>
          </div>
          <div className="rounded-2xl shadow-lg bg-white max-w-7xl w-full mx-auto p-8">
            <div className="flex items-center justify-center">
              <div className="text-center text-gray-600">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-2"></div>
                <p>Loading contacts...</p>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-4 py-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-2xl font-bold text-orange-600">Important Contacts</h1>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <FiUser className="text-indigo-600" />
            <span>Total Contacts: {contactsData.length}</span>
          </div>
        </div>

        <div className="rounded-2xl shadow-lg bg-white max-w-7xl w-full mx-auto">
          {/* Header Controls */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 px-6 py-4 border-b border-gray-100">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <FiUser className="text-indigo-600 text-xl" />
                <span className="text-lg font-semibold text-gray-800">Contact Management</span>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <FiMail className="text-indigo-600" />
                <span>Manage important contacts and departments</span>
              </div>
            </div>

            <div className="flex gap-2 items-center">
              <button
                className="flex items-center gap-1 bg-blue-500 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-600 transition"
                onClick={handleExportCSV}
                title="Export to CSV"
              >
                <FiFileText />
                CSV
              </button>
              <button
                className="flex items-center gap-1 bg-emerald-500 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-emerald-600 transition"
                onClick={handleExportExcel}
                title="Export to Excel"
              >
                <FiFile />
                Excel
              </button>
              <button
                className="flex items-center gap-1 bg-red-500 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-red-600 transition"
                onClick={handleExportPDF}
                title="Export to PDF"
              >
                <FiFile />
                PDF
              </button>
              <button
                className="flex items-center gap-1 bg-gray-500 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-600 transition"
                onClick={handleCopyToClipboard}
                title="Copy to Clipboard"
              >
                <FiCopy />
                Copy
              </button>
              <button
                className="flex items-center gap-1 bg-indigo-500 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-indigo-600 transition"
                onClick={handleRefresh}
                title="Refresh Contacts"
              >
                <FiRefreshCw />
                Refresh
              </button>
              <button
                className="flex items-center gap-1 bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition"
                onClick={() => setShowAddContactModal(true)}
              >
                <FiPlus />
                Add Contact
              </button>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="px-6 py-4 border-b border-gray-100">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search contacts, email, or department..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
                />
              </div>
              <div className="flex items-center gap-2">
                <FiFilter className="text-gray-400" />
                <span className="text-sm text-gray-600">Filtered: {filteredContacts.length} of {contactsData.length}</span>
              </div>
              <div className="flex items-center gap-2">
                <label htmlFor="dept-filter" className="text-sm font-medium text-gray-700">Department:</label>
              <select
                id="dept-filter"
                  className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
                value={filter}
                onChange={e => setFilter(e.target.value)}
              >
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-indigo-50 to-purple-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-indigo-700 uppercase tracking-wider">
                    Sr No
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-indigo-700 uppercase tracking-wider">
                    Department
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-indigo-700 uppercase tracking-wider cursor-pointer hover:bg-indigo-100 transition-colors" onClick={() => setSortAsc(!sortAsc)}>
                    <div className="flex items-center gap-2">
                      <FiUser />
                      Person {sortAsc ? <FiChevronDown /> : <FiChevronUp />}
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-indigo-700 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <FiPhone />
                      Contact
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-indigo-700 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <FiMail />
                      Email ID
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-indigo-700 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <FiMapPin />
                      Address
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-indigo-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedContacts.map((c, idx) => (
                  <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-center font-semibold text-indigo-700">
                      {startIdx + idx + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {c.dept}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8">
                          <div className="h-8 w-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center">
                            <span className="text-xs font-medium text-white">
                              {c.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">{c.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-900">{c.contact}</span>
                        <button
                          className="text-indigo-600 hover:text-indigo-900 transition-colors"
                          title="Copy phone number"
                          onClick={() => handleCopy(c.contact)}
                        >
                          <FiCopy size={14} />
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-900">{c.email}</span>
                        <button
                          className="text-indigo-600 hover:text-indigo-900 transition-colors"
                          title="Copy email address"
                          onClick={() => handleCopy(c.email)}
                        >
                          <FiCopy size={14} />
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs truncate" title={c.address}>
                        {c.address}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                      <button
                          className="text-yellow-600 hover:text-yellow-900 transition-colors"
                        onClick={() => setEditContact(c)}
                          title="Edit Contact"
                      >
                          <FiEdit2 size={16} />
                      </button>
                      <button
                          className="text-red-600 hover:text-red-900 transition-colors"
                        onClick={() => setDeleteContact(c)}
                          title="Delete Contact"
                      >
                          <FiTrash2 size={16} />
                      </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-6 py-4 border-t border-gray-100">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <span>Showing {startIdx + 1} to {Math.min(startIdx + entriesPerPage, filteredContacts.length)} of {filteredContacts.length} results</span>
              </div>
              
              <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-700">Show</span>
                <select
                    className="border border-gray-200 rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
                  value={entriesPerPage}
                  onChange={handleEntriesChange}
                >
                    {[5, 10, 20, 50].map(num => (
                    <option key={num} value={num}>{num}</option>
                  ))}
                </select>
                  <span className="text-sm text-gray-700">entries</span>
              </div>
                
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrev}
                  disabled={currentPage === 1}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                      currentPage === 1 
                        ? 'text-gray-400 cursor-not-allowed' 
                        : 'text-indigo-600 hover:bg-indigo-50'
                    }`}
                  >
                    Previous
                </button>
                  <span className="text-sm font-medium text-gray-700">
                    Page {currentPage} of {totalPages}
                  </span>
                <button
                  onClick={handleNext}
                  disabled={currentPage === totalPages}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                      currentPage === totalPages 
                        ? 'text-gray-400 cursor-not-allowed' 
                        : 'text-indigo-600 hover:bg-indigo-50'
                    }`}
                  >
                    Next
                </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Add Contact Modal */}
        {showAddContactModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md mx-4 relative">
              <button
                className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
                onClick={() => setShowAddContactModal(false)}
                title="Close"
              >
                <FiX size={24} />
              </button>
              
              <div className="mb-6">
                <h2 className="text-xl font-bold text-indigo-700 flex items-center gap-2">
                  <FiPlus className="text-indigo-600" />
                  Add New Contact
                </h2>
                <p className="text-gray-600 text-sm mt-1">Create a new important contact</p>
              </div>
              
              <form className="space-y-4" onSubmit={handleAddContactSubmit}>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Department <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="dept"
                    value={addContactForm.dept}
                    onChange={handleAddContactChange}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-colors"
                    placeholder="Enter department"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Person Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={addContactForm.name}
                    onChange={handleAddContactChange}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-colors"
                    placeholder="Enter person name"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="contact"
                    value={addContactForm.contact}
                    onChange={handleAddContactChange}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-colors"
                    placeholder="Enter contact number"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email ID <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={addContactForm.email}
                    onChange={handleAddContactChange}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-colors"
                    placeholder="Enter email address"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={addContactForm.address}
                    onChange={handleAddContactChange}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-colors"
                    placeholder="Enter address"
                  />
                </div>
                
                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                  <button
                    type="button"
                    className="px-6 py-2 rounded-lg bg-gray-200 text-gray-700 font-medium hover:bg-gray-300 transition-colors"
                    onClick={() => setShowAddContactModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex items-center gap-2 px-6 py-2 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700 transition-colors"
                  >
                    <FiPlus />
                    Add Contact
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit Contact Modal */}
        {editContact && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md mx-4 relative">
              <button
                className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
                onClick={() => setEditContact(null)}
                title="Close"
              >
                <FiX size={24} />
              </button>
              
              <div className="mb-6">
                <h2 className="text-xl font-bold text-indigo-700 flex items-center gap-2">
                  <FiEdit2 className="text-indigo-600" />
                  Edit Contact
                </h2>
                <p className="text-gray-600 text-sm mt-1">Update contact information</p>
              </div>
              
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Department <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="dept"
                    value={editForm.dept}
                    onChange={handleEditChange}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-colors"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Person Name <span className="text-red-500">*</span>
                </label>
                  <input
                    type="text"
                    name="name"
                    value={editForm.name}
                    onChange={handleEditChange}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-colors"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact <span className="text-red-500">*</span>
                </label>
                  <input
                    type="text"
                    name="contact"
                    value={editForm.contact}
                    onChange={handleEditChange}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-colors"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email ID <span className="text-red-500">*</span>
                </label>
                  <input
                    type="email"
                    name="email"
                    value={editForm.email}
                    onChange={handleEditChange}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-colors"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address
                </label>
                  <input
                    type="text"
                    name="address"
                    value={editForm.address}
                    onChange={handleEditChange}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-colors"
                  />
                </div>
                
                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                  <button
                    type="button"
                    className="px-6 py-2 rounded-lg bg-gray-200 text-gray-700 font-medium hover:bg-gray-300 transition-colors"
                    onClick={() => setEditContact(null)}
                  >
                    Cancel
                  </button>
                <button
                  type="button"
                    className="flex items-center gap-2 px-6 py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors"
                  onClick={handleEditSave}
                >
                    <FiEdit2 />
                    Save Changes
                </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Contact Modal */}
        {deleteContact && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md mx-4 relative">
              <button
                className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
                onClick={() => setDeleteContact(null)}
                title="Close"
              >
                <FiX size={24} />
              </button>
              
              <div className="mb-6">
                <h2 className="text-xl font-bold text-red-600 flex items-center gap-2">
                  <FiTrash2 className="text-red-600" />
                  Delete Contact
                </h2>
                <p className="text-gray-600 text-sm mt-1">This action cannot be undone</p>
              </div>
              
              <div className="space-y-4">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-sm text-red-700">
                    Type <span className="font-mono bg-red-100 px-2 py-1 rounded">Delete</span> to confirm deletion of <span className="font-semibold">{deleteContact.name}</span>.
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirmation
                  </label>
              <input
                type="text"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-400 focus:border-transparent transition-colors"
                value={deleteConfirm}
                onChange={e => setDeleteConfirm(e.target.value)}
                placeholder="Type 'Delete' to confirm"
              />
                </div>
                
                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                  <button
                    type="button"
                    className="px-6 py-2 rounded-lg bg-gray-200 text-gray-700 font-medium hover:bg-gray-300 transition-colors"
                    onClick={() => setDeleteContact(null)}
                  >
                    Cancel
                  </button>
              <button
                type="button"
                    className={`flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition-colors ${
                      deleteConfirm.trim().toLowerCase() === 'delete' 
                        ? 'bg-red-600 text-white hover:bg-red-700' 
                        : 'bg-gray-400 text-white cursor-not-allowed'
                    }`}
                onClick={handleDelete}
                disabled={deleteConfirm.trim().toLowerCase() !== 'delete'}
              >
                    <FiTrash2 />
                    Delete Contact
              </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
} 