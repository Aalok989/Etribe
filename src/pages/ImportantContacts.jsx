import React, { useState, useEffect } from "react";
import DashboardLayout from "../components/Layout/DashboardLayout";
import { FiDownload, FiFilter, FiEdit2, FiTrash2, FiChevronDown, FiChevronUp, FiFileText, FiFile, FiX, FiCopy, FiPlus, FiUser, FiMail, FiPhone, FiMapPin, FiRefreshCw, FiSearch } from "react-icons/fi";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import api from "../api/axiosConfig";

export default function ImportantContactsPage() {
  const [contactsData, setContactsData] = useState([]);
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
        setContactsData(mappedContacts);
        
      } catch (err) {
        console.error('Fetch contacts error:', err);
        console.error('Error details:', err.response?.data);
        setError('Failed to fetch contacts: ' + (err.response?.data?.message || err.message));
        setContactsData([]);
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
          <div className="rounded-2xl shadow-lg bg-white dark:bg-gray-800 max-w-7xl w-full mx-auto p-8">
            <div className="flex items-center justify-center">
              <div className="text-center text-gray-600 dark:text-gray-300">
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

        <div className="rounded-2xl shadow-lg bg-white dark:bg-gray-800 max-w-7xl w-full mx-auto">
          {/* Controls */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 px-6 py-4 border-b border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-4">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name..."
                  className="pl-10 pr-4 py-2 border rounded-lg text-sm bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 focus:ring-2 focus:ring-indigo-400 transition-colors"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  style={{ minWidth: 250 }}
                />
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <span>Showing {startIdx + 1} to {Math.min(startIdx + entriesPerPage, totalEntries)} of {totalEntries} entries</span>
              </div>
            </div>
            <div className="flex gap-2 items-center">
              <button className="flex items-center gap-1 bg-blue-500 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-600 transition" onClick={handleRefresh} title="Refresh Data"><FiRefreshCw /> Refresh</button>
              <button className="flex items-center gap-1 bg-gray-500 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-600 transition" onClick={handleCopyToClipboard} title="Copy to Clipboard"><FiCopy /> Copy</button>
              <button className="flex items-center gap-1 bg-green-500 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-green-600 transition" onClick={handleExportCSV} title="Export CSV"><FiDownload /> CSV</button>
              <button className="flex items-center gap-1 bg-emerald-500 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-emerald-600 transition" onClick={handleExportExcel} title="Export Excel"><FiFile /> Excel</button>
              <button className="flex items-center gap-1 bg-rose-500 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-rose-600 transition" onClick={handleExportPDF} title="Export PDF"><FiFile /> PDF</button>
            </div>
          </div>
          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead className="bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/50 dark:to-purple-900/50 text-gray-700 dark:text-gray-200 sticky top-0 z-10 shadow-sm">
                <tr className="border-b-2 border-indigo-200 dark:border-indigo-800">
                  <th className="p-3 text-center font-semibold border-r border-indigo-200 dark:border-indigo-800 whitespace-nowrap">Sr No</th>
                  <th className="p-3 text-left font-semibold border-r border-indigo-200 dark:border-indigo-800 whitespace-nowrap">Department</th>
                  <th className="p-3 text-left font-semibold border-r border-indigo-200 dark:border-indigo-800 whitespace-nowrap">Name</th>
                  <th className="p-3 text-left font-semibold border-r border-indigo-200 dark:border-indigo-800 whitespace-nowrap">Contact</th>
                  <th className="p-3 text-left font-semibold border-r border-indigo-200 dark:border-indigo-800 whitespace-nowrap">Email</th>
                  <th className="p-3 text-left font-semibold border-r border-indigo-200 dark:border-indigo-800 whitespace-nowrap">Address</th>
                  <th className="p-3 text-center font-semibold whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedContacts.map((c, idx) => (
                  <tr key={c.id} className={`border-b border-gray-200 dark:border-gray-700 transition-colors ${idx % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-900/50'} hover:bg-indigo-50 dark:hover:bg-gray-700 hover:shadow-sm`}>
                    <td className="p-3 text-center font-semibold text-indigo-700 dark:text-indigo-300 border-r border-gray-200 dark:border-gray-700">{startIdx + idx + 1}</td>
                    <td className="p-3 text-left border-r border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-100">{c.dept}</td>
                    <td className="p-3 text-left border-r border-gray-200 dark:border-gray-700">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 dark:from-indigo-800 dark:to-purple-900 rounded-full flex items-center justify-center text-white font-semibold text-xs">{c.name.charAt(0).toUpperCase()}</div>
                        <span className="font-medium text-gray-800 dark:text-gray-100">{c.name}</span>
                      </div>
                    </td>
                    <td className="p-3 text-left border-r border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-100">{c.contact}</td>
                    <td className="p-3 text-left border-r border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-100">{c.email}</td>
                    <td className="p-3 text-left border-r border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-100">{c.address}</td>
                    <td className="p-3 text-center">
                      <button className="text-yellow-600 hover:text-yellow-900 p-2 rounded-full hover:bg-yellow-100 dark:hover:bg-gray-700 transition-colors" onClick={() => setEditContact(c)} title="Edit Contact"><FiEdit2 size={18} /></button>
                      <button className="text-red-600 hover:text-red-900 p-2 rounded-full hover:bg-red-100 dark:hover:bg-gray-700 transition-colors" onClick={() => setDeleteContact(c)} title="Delete Contact"><FiTrash2 size={18} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Pagination Controls - moved outside scrollable area */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6 border-t border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Show</span>
                <select
                className="border rounded-lg px-3 py-1 text-sm bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 text-gray-700 focus:ring-2 focus:ring-indigo-400 transition-colors"
                  value={entriesPerPage}
                  onChange={handleEntriesChange}
                >
                {[5, 10, 25, 50, 100].map(num => (
                    <option key={num} value={num}>{num}</option>
                  ))}
                </select>
              <span className="text-sm text-gray-600 dark:text-gray-400">entries per page</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrev}
                  disabled={currentPage === 1}
                className={`px-3 py-1 rounded-lg text-indigo-600 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-gray-700 transition-colors ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                title="Previous"
                  >
                    Previous
                </button>
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                    Page {currentPage} of {totalPages}
                  </span>
                <button
                  onClick={handleNext}
                  disabled={currentPage === totalPages}
                className={`px-3 py-1 rounded-lg text-indigo-600 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-gray-700 transition-colors ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
                title="Next"
                  >
                    Next
                </button>
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