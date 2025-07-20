import React, { useState, useEffect } from "react";
import { FiDownload, FiFilter, FiEdit2, FiTrash2, FiUser, FiMail, FiPhone, FiMapPin, FiRefreshCw, FiSearch, FiCopy, FiPlus, FiFileText, FiFile, FiX } from "react-icons/fi";
import api from "../../api/axiosConfig";

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

export default function ImportantContacts() {
  const [contactsData, setContactsData] = useState(fallbackContactsData);
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
        
        // Since there's no /contact/list endpoint, we'll use the fallback data
        // but structure it to be ready for when the API is available
        const token = localStorage.getItem('token');
        const uid = localStorage.getItem('uid');
        
        // For now, simulate API call with fallback data
        // When the contact API is available, uncomment this section:
        /*
        const response = await api.post('/contact/list', {}, {
          headers: {
            'Client-Service': 'COHAPPRT',
            'Auth-Key': '4F21zrjoAASqz25690Zpqf67UyY',
            'uid': uid,
            'token': token,
            'rurl': 'login.etribes.in',
            'Content-Type': 'application/json',
          }
        });

        let backendContacts = [];
        if (Array.isArray(response.data?.data?.contacts)) {
          backendContacts = response.data.data.contacts;
        } else if (Array.isArray(response.data?.data)) {
          backendContacts = response.data.data;
        } else if (Array.isArray(response.data)) {
          backendContacts = response.data;
        } else {
          backendContacts = fallbackContactsData;
        }

        const mappedContacts = backendContacts.map((contact, index) => ({
          id: contact.id || index + 1,
          dept: contact.department || contact.dept || 'General',
          name: contact.name || contact.person_name || `Contact ${index + 1}`,
          contact: contact.contact || contact.phone || contact.phone_number || '',
          email: contact.email || contact.email_address || '',
          address: contact.address || contact.location || '',
        }));

        setContactsData(mappedContacts);
        */
        
        // Use fallback data for now
        setContactsData(fallbackContactsData);
        
      } catch (err) {
        console.error('Fetch contacts error:', err);
        setError('Failed to fetch contacts');
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
      <div className="rounded-2xl shadow-lg bg-white">
        <div className="rounded-t-2xl inset-0 bg-gradient-to-r from-indigo-300 via-blue-200 to-blue-300 px-6 py-4">
          <h2 className="text-xl font-bold text-white tracking-wide">Important Contacts</h2>
        </div>
        <div className="p-6 flex items-center justify-center">
          <div className="text-center text-gray-600">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-2"></div>
            <p>Loading contacts...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl shadow-lg bg-white">
      <div className="rounded-t-2xl inset-0 bg-gradient-to-r from-indigo-300 via-blue-200 to-blue-300 px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
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
              className="border-none rounded-lg px-3 py-1 text-sm bg-indigo-100 text-indigo-700 focus:ring-2 focus:ring-indigo-400"
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
          <table className="min-w-full text-sm">
            <thead className="bg-indigo-50 text-indigo-700 sticky top-0 z-10">
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
                <tr key={c.id} className="bg-white shadow rounded-xl">
                  <td className="p-3 text-center font-semibold text-indigo-700">{idx + 1}</td>
                  <td className="p-3">{c.dept}</td>
                  <td className="p-3">{c.name}</td>
                  <td className="p-3">{c.contact}</td>
                  <td className="p-3">{c.email}</td>
                  <td className="p-3">{c.address}</td>
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

      {/* Edit Contact Modal */}
      {editContact && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Edit Contact</h3>
              <button onClick={() => setEditContact(null)} className="text-gray-500 hover:text-gray-700">
                <FiX />
              </button>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); handleEditSave(); }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                  <input
                    type="text"
                    name="dept"
                    value={editForm.dept}
                    onChange={handleEditChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={editForm.name}
                    onChange={handleEditChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contact</label>
                  <input
                    type="text"
                    name="contact"
                    value={editForm.contact}
                    onChange={handleEditChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={editForm.email}
                    onChange={handleEditChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <textarea
                    name="address"
                    value={editForm.address}
                    onChange={handleEditChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    rows="3"
                    required
                  />
                </div>
                <div className="flex gap-2 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition"
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditContact(null)}
                    className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Contact Modal */}
      {deleteContact && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-red-600">Delete Contact</h3>
              <button onClick={() => setDeleteContact(null)} className="text-gray-500 hover:text-gray-700">
                <FiX />
              </button>
            </div>
            <div className="mb-4">
              <p className="text-gray-700 mb-2">Are you sure you want to delete this contact?</p>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="font-semibold">{deleteContact.name}</p>
                <p className="text-sm text-gray-600">{deleteContact.dept} • {deleteContact.email}</p>
              </div>
              <p className="text-sm text-gray-600 mt-3">Type "DELETE" to confirm:</p>
              <input
                type="text"
                value={deleteConfirm}
                onChange={(e) => setDeleteConfirm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg mt-1"
                placeholder="Type DELETE to confirm"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleDelete}
                disabled={deleteConfirm !== "DELETE"}
                className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Delete Contact
              </button>
              <button
                onClick={() => setDeleteContact(null)}
                className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 