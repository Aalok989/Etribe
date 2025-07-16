import React, { useState } from "react";
import { FiDownload, FiFilter, FiEdit2, FiTrash2, FiX } from "react-icons/fi";

const contactsData = [
  { id: 1, dept: "CEO", name: "Rohit Arya", contact: "1234567890", email: "rohit@company.com", address: "123 Main St" },
  { id: 2, dept: "HR", name: "Priya Singh", contact: "9876543210", email: "priya@company.com", address: "456 Park Ave" },
  { id: 3, dept: "Tech", name: "Amit Kumar", contact: "5551234567", email: "amit@company.com", address: "789 Tech Blvd" },
  { id: 4, dept: "HR", name: "Neha Verma", contact: "4445556666", email: "neha@company.com", address: "321 Lake Rd" },
  { id: 5, dept: "Finance", name: "Rajesh Patel", contact: "7778889999", email: "rajesh@company.com", address: "654 Finance Ave" },
  { id: 6, dept: "Marketing", name: "Sneha Sharma", contact: "1112223333", email: "sneha@company.com", address: "987 Marketing St" },
  { id: 7, dept: "Operations", name: "Vikram Singh", contact: "4447778888", email: "vikram@company.com", address: "555 Operations Rd" },
  { id: 8, dept: "Legal", name: "Anjali Mehta", contact: "9998887777", email: "anjali@company.com", address: "222 Legal Blvd" },
  { id: 9, dept: "IT", name: "Deepak Gupta", contact: "6667778888", email: "deepak@company.com", address: "888 IT Street" },
  { id: 10, dept: "Sales", name: "Kavita Reddy", contact: "3334445555", email: "kavita@company.com", address: "777 Sales Lane" },
  { id: 11, dept: "Customer Support", name: "Rahul Verma", contact: "8889990000", email: "rahul@company.com", address: "444 Support Ave" },
  { id: 12, dept: "Product", name: "Meera Kapoor", contact: "2223334444", email: "meera@company.com", address: "111 Product St" },
  { id: 13, dept: "Quality Assurance", name: "Arjun Malhotra", contact: "5556667777", email: "arjun@company.com", address: "333 QA Road" },
  { id: 14, dept: "Research", name: "Zara Khan", contact: "7778889999", email: "zara@company.com", address: "666 Research Blvd" },
  { id: 15, dept: "Security", name: "Aditya Joshi", contact: "1112223333", email: "aditya@company.com", address: "999 Security Lane" },
];

const departments = ["All", ...Array.from(new Set(contactsData.map(c => c.dept)))];

export default function ImportantContacts() {
  const [filter, setFilter] = useState("All");
  const [contacts, setContacts] = useState(contactsData);
  const [editContact, setEditContact] = useState(null);
  const [deleteContact, setDeleteContact] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState("");
  const [editForm, setEditForm] = useState({ id: '', dept: '', name: '', contact: '', email: '', address: '' });

  const filteredContacts = filter === "All" ? contacts : contacts.filter(c => c.dept === filter);

  React.useEffect(() => {
    if (editContact) {
      setEditForm(editContact);
    }
  }, [editContact]);

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleEditSave = () => {
    setContacts(prev => prev.map(c => c.id === editForm.id ? { ...editForm } : c));
    setEditContact(null);
  };

  const handleDelete = () => {
    setContacts(prev => prev.filter(c => c.id !== deleteContact.id));
    setDeleteContact(null);
    setDeleteConfirm("");
  };

  return (
    <div className="rounded-2xl shadow-lg bg-white">
      <div className="relative rounded-t-2xl overflow-hidden flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-200 via-blue-100 to-blue-200" />
        <div className="absolute inset-0 bg-white/30 backdrop-blur-md border-b border-white/30" />
        <h2 className="relative z-10 text-xl font-bold text-gray-900 tracking-wide px-6 py-4">Important Contacts</h2>
        <div className="relative z-10 flex gap-2 items-center">
          <FiFilter className="text-indigo-500" />
          <label htmlFor="dept-filter" className="mr-2 text-sm font-medium text-indigo-700">Dept:</label>
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
        <div className="relative z-10 flex gap-2">
          <button className="flex items-center gap-1 bg-blue-500 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-blue-600 transition"><FiDownload />CSV</button>
          <button className="flex items-center gap-1 bg-emerald-500 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-emerald-600 transition"><FiDownload />Excel</button>
          <button className="flex items-center gap-1 bg-rose-500 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-rose-600 transition"><FiDownload />PDF</button>
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
                    <button className="flex items-center gap-1 bg-yellow-400 text-white px-2 py-1.5 rounded-lg text-xs font-semibold hover:bg-yellow-500 transition" onClick={() => setEditContact(c)}><FiEdit2 />Modify</button>
                    <button className="flex items-center gap-1 bg-rose-500 text-white px-2 py-1.5 rounded-lg text-xs font-semibold hover:bg-rose-600 transition" onClick={() => setDeleteContact(c)}><FiTrash2 />Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* Edit Popup */}
      {editContact && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md relative">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-rose-500"
              onClick={() => setEditContact(null)}
              title="Close"
            >
              <FiX size={22} />
            </button>
            <h2 className="text-xl font-bold mb-4 text-indigo-700">Edit Contact</h2>
            <form className="flex flex-col gap-3">
              <label className="text-sm font-medium text-gray-700">Department
                <input
                  type="text"
                  name="dept"
                  value={editForm.dept}
                  onChange={handleEditChange}
                  className="w-full mt-1 px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-400"
                />
              </label>
              <label className="text-sm font-medium text-gray-700">Person Name
                <input
                  type="text"
                  name="name"
                  value={editForm.name}
                  onChange={handleEditChange}
                  className="w-full mt-1 px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-400"
                />
              </label>
              <label className="text-sm font-medium text-gray-700">Contact
                <input
                  type="text"
                  name="contact"
                  value={editForm.contact}
                  onChange={handleEditChange}
                  className="w-full mt-1 px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-400"
                />
              </label>
              <label className="text-sm font-medium text-gray-700">Email ID
                <input
                  type="email"
                  name="email"
                  value={editForm.email}
                  onChange={handleEditChange}
                  className="w-full mt-1 px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-400"
                />
              </label>
              <label className="text-sm font-medium text-gray-700">Address
                <input
                  type="text"
                  name="address"
                  value={editForm.address}
                  onChange={handleEditChange}
                  className="w-full mt-1 px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-400"
                />
              </label>
              <button
                type="button"
                className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition"
                onClick={handleEditSave}
              >
                Save
              </button>
            </form>
          </div>
        </div>
      )}
      {/* Delete Popup */}
      {deleteContact && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md relative">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-rose-500"
              onClick={() => setDeleteContact(null)}
              title="Close"
            >
              <FiX size={22} />
            </button>
            <h2 className="text-xl font-bold mb-4 text-rose-600">Delete Contact</h2>
            <p className="mb-4 text-gray-700">Type <span className="font-mono bg-gray-100 px-2 py-1 rounded">Delete</span> to confirm deletion of <span className="font-semibold">{deleteContact.name}</span>.</p>
            <input
              type="text"
              className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-rose-400 mb-4"
              value={deleteConfirm}
              onChange={e => setDeleteConfirm(e.target.value)}
              placeholder="Type 'Delete' to confirm"
            />
            <button
              type="button"
              className={`bg-rose-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-rose-700 transition w-full ${deleteConfirm.trim().toLowerCase() === 'delete' ? 'font-bold' : 'opacity-50 cursor-not-allowed'}`}
              onClick={handleDelete}
              disabled={deleteConfirm.trim().toLowerCase() !== 'delete'}
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 