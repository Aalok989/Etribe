import React, { useState, useEffect } from "react";
import { FiDownload, FiFilter, FiEdit2, FiTrash2, FiUser, FiMail, FiPhone, FiMapPin, FiRefreshCw, FiSearch, FiCopy, FiPlus, FiFileText, FiFile, FiX } from "react-icons/fi";
import api from "../../api/axiosConfig";

export default function ImportantContacts() {
  const [contactsData, setContactsData] = useState([]);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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
        
        console.log('Component: Fetching contacts with token:', token, 'uid:', uid);
        
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

        console.log('Component: API Response:', response.data);

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

        console.log('Component: Extracted contacts:', contacts);

        // Map backend contacts to frontend format
        const mappedContacts = contacts.map((contact, index) => {
          console.log('Component: Processing contact:', contact);
          return {
            id: contact.id || contact.contact_id || contact.contactId || index + 1,
            dept: contact.department || contact.dept || contact.role || contact.contact_department || 'General',
            name: contact.name || contact.person_name || contact.contact_name || contact.contactName || `Contact ${index + 1}`,
            contact: contact.contact || contact.phone || contact.phone_number || contact.mobile || contact.contact_number || contact.contact_no || '',
            email: contact.email || contact.email_address || contact.contact_email || contact.email_id || '',
            address: contact.address || contact.location || contact.contact_address || contact.address_line || '',
          };
        });

        console.log('Component: Mapped contacts:', mappedContacts);
        setContactsData(mappedContacts);
        
      } catch (err) {
        console.error('Component: Fetch contacts error:', err);
        console.error('Component: Error details:', err.response?.data);
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
    // This would require XLSX library - simplified for component
    alert('Excel export would be implemented here');
  };

  const handleExportPDF = () => {
    // This would require jsPDF library - simplified for component
    alert('PDF export would be implemented here');
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
      <div className="rounded-2xl shadow-lg bg-white dark:bg-gray-900">
        <div className="rounded-t-2xl inset-0 bg-gradient-to-r from-indigo-300 via-blue-200 to-blue-300 dark:from-indigo-900 dark:via-blue-900 dark:to-gray-900 px-6 py-4">
          <h2 className="text-xl font-bold text-white tracking-wide">Important Contacts</h2>
        </div>
        <div className="p-6 flex items-center justify-center">
          <div className="text-center text-gray-600 dark:text-gray-300">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-2"></div>
            <p>Loading contacts...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl shadow-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
      <div className="rounded-t-2xl inset-0 bg-gradient-to-r from-indigo-300 via-blue-200 to-blue-300 dark:from-indigo-900 dark:via-blue-900 dark:to-gray-900 px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div className="flex items-center gap-4">
        <h2 className="text-xl font-bold text-white tracking-wide">Important Contacts</h2>
          <div className="flex items-center gap-2 text-sm text-white">
            <FiUser className="text-white" />
            <span>Total: {contactsData.length}</span>
          </div>
        </div>
        <div className="flex gap-2 items-center">
          <div className="flex items-center gap-2">
          <FiFilter className="text-white" />
          <label htmlFor="dept-filter" className="mr-2 text-sm font-medium text-white">Dept:</label>
          <select
            id="dept-filter"
              className="border-none rounded-lg px-3 py-1 text-sm bg-indigo-100 dark:bg-gray-800 text-indigo-700 dark:text-gray-100 focus:ring-2 focus:ring-indigo-400"
            value={filter}
            onChange={e => setFilter(e.target.value)}
          >
            {departments.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
        </div>
        <div className="flex gap-2">
            <button 
              className="flex items-center gap-1 bg-blue-500 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-blue-600 transition"
              onClick={handleExportCSV}
              title="Export to CSV"
            >
              <FiFileText />
              CSV
            </button>
            <button 
              className="flex items-center gap-1 bg-emerald-500 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-emerald-600 transition"
              onClick={handleExportExcel}
              title="Export to Excel"
            >
              <FiFile />
              Excel
            </button>
            <button 
              className="flex items-center gap-1 bg-rose-500 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-rose-600 transition"
              onClick={handleExportPDF}
              title="Export to PDF"
            >
              <FiFile />
              PDF
            </button>
            <button 
              className="flex items-center gap-1 bg-gray-500 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-gray-600 transition"
              onClick={handleCopyToClipboard}
              title="Copy to Clipboard"
            >
              <FiCopy />
              Copy
            </button>
            <button 
              className="flex items-center gap-1 bg-indigo-500 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-indigo-600 transition"
              onClick={handleRefresh}
              title="Refresh Contacts"
            >
              <FiRefreshCw />
              Refresh
            </button>
          </div>
        </div>
      </div>
      <div className="overflow-x-auto p-6">
        <div className="max-h-96 overflow-y-auto">
          <table className="min-w-full text-sm bg-white dark:bg-gray-800">
            <thead className="bg-indigo-50 dark:bg-gray-800 text-indigo-700 dark:text-indigo-200 sticky top-0 z-10">
              <tr>
                <th className="p-3 rounded-l-xl text-left">Sr No</th>
                <th className="p-3 text-left">Department</th>
                <th className="p-3 text-left">Person Name</th>
                <th className="p-3 text-left">Contact</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Address</th>
                <th className="p-3 rounded-r-xl text-center">Action</th>
              </tr>
            </thead>
            <tbody className="border-separate border-spacing-y-2">
              {filteredContacts.map((c, idx) => (
                <tr key={c.id} className="bg-white dark:bg-gray-900 shadow rounded-xl">
                  <td className="p-3 text-center font-semibold text-indigo-700 dark:text-indigo-300">{idx + 1}</td>
                  <td className="p-3 text-gray-900 dark:text-gray-100">{c.dept}</td>
                  <td className="p-3 text-gray-900 dark:text-gray-100">{c.name}</td>
                  <td className="p-3 text-gray-700 dark:text-gray-200">{c.contact}</td>
                  <td className="p-3 text-gray-700 dark:text-gray-200">{c.email}</td>
                  <td className="p-3 text-gray-500 dark:text-gray-400">{c.address}</td>
                  <td className="p-3 flex gap-2 justify-center">
                    <button 
                      className="flex items-center gap-1 bg-yellow-400 text-white px-2 py-1.5 rounded-lg text-xs font-semibold hover:bg-yellow-500 transition"
                      onClick={() => setEditContact(c)}
                    >
                      <FiEdit2 />
                      Modify
                    </button>
                    <button 
                      className="flex items-center gap-1 bg-rose-500 text-white px-2 py-1.5 rounded-lg text-xs font-semibold hover:bg-rose-600 transition"
                      onClick={() => setDeleteContact(c)}
                    >
                      <FiTrash2 />
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 