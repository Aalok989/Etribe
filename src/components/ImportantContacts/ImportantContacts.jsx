import React, { useState, useEffect } from "react";
import { FiDownload, FiFilter, FiEdit2, FiTrash2, FiUser, FiMail, FiPhone, FiMapPin, FiRefreshCw, FiSearch, FiCopy, FiPlus, FiFileText, FiFile, FiX } from "react-icons/fi";
import { useContacts } from "../../context/ContactsContext";
import { toast } from "react-toastify";

export default function ImportantContacts() {
  const { contactsData, loading, error, editContact: editContactAPI, deleteContact: deleteContactAPI, fetchContacts } = useContacts();
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
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
  const [formError, setFormError] = useState(null);

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

  const handleEditSave = async () => {
    setFormError(null);
    try {
      await editContactAPI(editForm);
      setEditContact(null);
      toast.success("Contact updated successfully!");
    } catch (err) {
      setFormError(err.toString());
      toast.error("Failed to update contact.");
    }
  };

  const handleDelete = async () => {
    if (deleteConfirm.trim().toLowerCase() === "delete") {
      setFormError(null);
      try {
        await deleteContactAPI(deleteContact.id);
        setDeleteContact(null);
        setDeleteConfirm("");
        toast.success("Contact deleted successfully!");
      } catch (err) {
        setFormError(err.toString());
        toast.error("Failed to delete contact.");
      }
    }
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
    toast.success("Contacts exported to CSV!");
  };

  const handleExportExcel = () => {
    // This would require XLSX library - simplified for component
    alert('Excel export would be implemented here');
    toast.info("Excel export functionality is not yet available.");
  };

  const handleExportPDF = () => {
    // This would require jsPDF library - simplified for component
    alert('PDF export would be implemented here');
    toast.info("PDF export functionality is not yet available.");
  };

  const handleCopyToClipboard = () => {
    const data = contactsData.map(c => 
      `${c.dept},${c.name},${c.contact},${c.email},${c.address}`
    ).join('\n');
    navigator.clipboard.writeText(data);
    toast.success("Contacts copied to clipboard!");
  };

  const handleRefresh = () => {
    fetchContacts();
    toast.info("Refreshing contacts...");
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
        <h2 className="text-xl font-bold text-gray-800 dark:text-white tracking-wide">Important Contacts</h2>
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
            {formError && <p className="text-red-500 text-sm bg-red-100 p-2 rounded-lg">{formError}</p>}
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
            {formError && <p className="text-red-500 text-sm bg-red-100 p-2 rounded-lg">{formError}</p>}
            <div className="space-y-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm text-red-700">
                  Type <span className="font-mono bg-red-100 px-2 py-1 rounded">delete</span> to confirm deletion of <span className="font-semibold">{deleteContact.name}</span>.
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
                  placeholder="Type 'delete' to confirm"
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
  );
} 