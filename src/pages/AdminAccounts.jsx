import React, { useState } from "react";
import DashboardLayout from "../components/Layout/DashboardLayout";
import { FiEdit2, FiPlus, FiKey, FiX, FiFileText, FiFile, FiEye } from "react-icons/fi";

const userRoles = [
  "Admin",
  "Manager",
  "Support",
  "Finance",
  "HR",
  "IT",
  "Super Admin",
  "Custom Role 1",
  "Custom Role 2",
  "Custom Role 3",
];

const initialAdmins = [
  { name: "Rohit Arya", contact: "1234567890", email: "rohit@company.com", address: "123 Main Street", city: "Tech City", pincode: "123456", district: "Central", state: "Innovation State", country: "India", role: "Admin" },
  { name: "Priya Singh", contact: "9876543210", email: "priya@company.com", address: "456 Market Road", city: "Metro City", pincode: "654321", district: "West", state: "Growth State", country: "India", role: "Manager" },
  { name: "Amit Kumar", contact: "5551234567", email: "amit@company.com", address: "789 Tech Park", city: "Alpha City", pincode: "111222", district: "North", state: "Alpha State", country: "India", role: "Support" },
  { name: "Neha Verma", contact: "4445556666", email: "neha@company.com", address: "321 Business Ave", city: "Beta City", pincode: "333444", district: "East", state: "Beta State", country: "India", role: "Finance" },
  { name: "Suresh Patel", contact: "3332221111", email: "suresh@company.com", address: "654 Main Road", city: "Gamma City", pincode: "555666", district: "South", state: "Gamma State", country: "India", role: "HR" },
  { name: "Meena Joshi", contact: "8889990000", email: "meena@company.com", address: "987 Market Lane", city: "Delta City", pincode: "777888", district: "West", state: "Delta State", country: "India", role: "IT" },
  { name: "Vikas Sharma", contact: "1112223333", email: "vikas@company.com", address: "159 Tech Blvd", city: "Epsilon City", pincode: "999000", district: "Central", state: "Epsilon State", country: "India", role: "Super Admin" },
  { name: "Ritu Singh", contact: "9998887777", email: "ritu@company.com", address: "753 Alpha St", city: "Zeta City", pincode: "222333", district: "North", state: "Zeta State", country: "India", role: "Custom Role 1" },
  { name: "Deepak Mehta", contact: "1231231234", email: "deepak@company.com", address: "852 Beta Ave", city: "Eta City", pincode: "444555", district: "East", state: "Eta State", country: "India", role: "Custom Role 2" },
  { name: "Pooja Agarwal", contact: "3213214321", email: "pooja@company.com", address: "951 Gamma Rd", city: "Theta City", pincode: "666777", district: "South", state: "Theta State", country: "India", role: "Custom Role 3" },
  { name: "Sanjay Dutt", contact: "5556667777", email: "sanjay@company.com", address: "357 Delta Blvd", city: "Iota City", pincode: "888999", district: "West", state: "Iota State", country: "India", role: "Admin" },
  { name: "Asha Parekh", contact: "4443332222", email: "asha@company.com", address: "246 Epsilon St", city: "Kappa City", pincode: "111333", district: "Central", state: "Kappa State", country: "India", role: "Manager" },
  { name: "Ramesh Gupta", contact: "7778889999", email: "ramesh@company.com", address: "135 Zeta Ave", city: "Lambda City", pincode: "222444", district: "North", state: "Lambda State", country: "India", role: "Support" },
  { name: "Sunita Rao", contact: "2223334444", email: "sunita@company.com", address: "864 Eta Rd", city: "Mu City", pincode: "333555", district: "East", state: "Mu State", country: "India", role: "Finance" },
  { name: "Amitabh Bachchan", contact: "6665554444", email: "amitabh@company.com", address: "753 Theta Blvd", city: "Nu City", pincode: "444666", district: "South", state: "Nu State", country: "India", role: "HR" },
  { name: "Kiran Desai", contact: "3334445555", email: "kiran@company.com", address: "159 Iota St", city: "Xi City", pincode: "555777", district: "West", state: "Xi State", country: "India", role: "IT" },
  { name: "Manoj Bajpayee", contact: "8887776666", email: "manoj@company.com", address: "951 Kappa Ave", city: "Omicron City", pincode: "666888", district: "Central", state: "Omicron State", country: "India", role: "Super Admin" },
  { name: "Shilpa Shetty", contact: "1113335557", email: "shilpa@company.com", address: "357 Lambda Rd", city: "Pi City", pincode: "777999", district: "North", state: "Pi State", country: "India", role: "Custom Role 1" },
  { name: "Rajesh Khanna", contact: "2225558888", email: "rajesh@company.com", address: "246 Mu Blvd", city: "Rho City", pincode: "888111", district: "East", state: "Rho State", country: "India", role: "Custom Role 2" },
  { name: "Madhuri Dixit", contact: "9991113335", email: "madhuri@company.com", address: "135 Nu St", city: "Sigma City", pincode: "999222", district: "South", state: "Sigma State", country: "India", role: "Custom Role 3" },
];

export default function AdminAccounts() {
  const [admins, setAdmins] = useState(initialAdmins);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(5);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [selectedAdminIdx, setSelectedAdminIdx] = useState(null);
  const [passwordForm, setPasswordForm] = useState({ password: "", confirmPassword: "" });
  const [addUserForm, setAddUserForm] = useState({
    role: userRoles[0],
    name: "",
    contact: "",
    email: "",
    password: "",
    confirmPassword: "",
    address: "",
    city: "",
    pincode: "",
    district: "",
    state: "",
    country: "",
  });

  // Filtered and paginated data
  const filtered = admins.filter(a => a.name.toLowerCase().includes(search.toLowerCase()));
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
  const openPasswordModal = (idx) => {
    setSelectedAdminIdx(idx);
    setPasswordForm({ password: "", confirmPassword: "" });
    setShowPasswordModal(true);
  };
  const closePasswordModal = () => setShowPasswordModal(false);
  const handlePasswordChange = (e) => setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });
  const handlePasswordSave = (e) => {
    e.preventDefault();
    // Here you would update the password in your backend
    setShowPasswordModal(false);
  };

  // Add System User Modal
  const openAddUserModal = () => {
    setAddUserForm({
      role: userRoles[0],
      name: "",
      contact: "",
      email: "",
      password: "",
      confirmPassword: "",
      address: "",
      city: "",
      pincode: "",
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
    setAdmins([
      ...admins,
      {
        name: addUserForm.name,
        contact: addUserForm.contact,
        email: addUserForm.email,
        address: addUserForm.address,
        city: addUserForm.city,
        pincode: addUserForm.pincode,
        district: addUserForm.district,
        state: addUserForm.state,
        country: addUserForm.country,
        role: addUserForm.role,
      },
    ]);
    setShowAddUserModal(false);
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-4 py-3">
        <h1 className="text-2xl font-bold mb-4">Admin Accounts</h1>
        <div className="rounded-2xl shadow-lg bg-white max-w-7xl w-full mx-auto px-4">
          {/* Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 px-6 py-4 border-b border-gray-100">
            <input
              type="text"
              placeholder="Search by name..."
              className="border rounded-lg px-3 py-1 text-sm bg-indigo-50 text-indigo-700 focus:ring-2 focus:ring-indigo-400"
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ maxWidth: 220 }}
            />
            <div className="flex gap-2 items-center w-full sm:justify-end">
              <button className="flex items-center gap-1 bg-blue-500 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-blue-600 transition"><FiFileText />CSV</button>
              <button className="flex items-center gap-1 bg-emerald-500 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-emerald-600 transition"><FiFile />Excel</button>
              <button className="flex items-center gap-1 bg-rose-500 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-rose-600 transition"><FiFile />PDF</button>
              <button
                className="flex items-center gap-2 px-7 py-2 bg-green-600 text-white rounded-lg font-semibold shadow hover:bg-green-700 transition"
                onClick={openAddUserModal}
              >
                <FiPlus /> Add
              </button>
            </div>
          </div>
          {/* Table */}
          <div className="overflow-x-auto p-6 w-full">
            <table className="min-w-max text-sm w-full">
              <thead className="bg-indigo-50 text-indigo-700 sticky top-0 z-10">
                <tr>
                  <th className="p-3 rounded-l-xl text-left">Sr No</th>
                  <th className="p-3 text-left">Name</th>
                  <th className="p-3 text-left">Contact No</th>
                  <th className="p-3 text-left">Email</th>
                  <th className="p-3 text-left">Address</th>
                  <th className="p-3 text-left">City</th>
                  <th className="p-3 text-left">Pincode</th>
                  <th className="p-3 text-left">District</th>
                  <th className="p-3 text-left">State</th>
                  <th className="p-3 text-left">Country</th>
                  <th className="p-3 rounded-r-xl text-center">Action</th>
                </tr>
              </thead>
              <tbody className="border-separate border-spacing-y-2">
                {paginated.map((admin, idx) => (
                  <tr key={idx} className="bg-white shadow rounded-xl">
                    <td className="p-3 text-center font-semibold text-indigo-700">{startIdx + idx + 1}</td>
                    <td className="p-3">{admin.name}</td>
                    <td className="p-3">{admin.contact}</td>
                    <td className="p-3">{admin.email}</td>
                    <td className="p-3">{admin.address}</td>
                    <td className="p-3">{admin.city}</td>
                    <td className="p-3">{admin.pincode}</td>
                    <td className="p-3">{admin.district}</td>
                    <td className="p-3">{admin.state}</td>
                    <td className="p-3">{admin.country}</td>
                    <td className="p-3 flex justify-center">
                      <button
                        className="text-indigo-600 hover:text-indigo-900 p-2 rounded-full hover:bg-indigo-50 transition"
                        onClick={() => openPasswordModal(startIdx + idx)}
                        title="Change Password"
                      >
                        <FiEdit2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {/* Pagination Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mt-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Show</span>
                <select
                  className="border-none rounded-lg px-2 py-1 text-sm bg-indigo-100 text-indigo-700 focus:ring-2 focus:ring-indigo-400"
                  value={entriesPerPage}
                  onChange={handleEntriesChange}
                >
                  {[3, 5, 10, 20].map(num => (
                    <option key={num} value={num}>{num}</option>
                  ))}
                </select>
                <span className="text-sm text-gray-600">entries</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrev}
                  disabled={currentPage === 1}
                  className={`px-2 py-1 rounded-lg text-indigo-600 hover:bg-indigo-100 transition ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                  title="Previous"
                >
                  &lt;
                </button>
                <span className="text-sm font-semibold text-gray-700">Page {currentPage} of {totalPages}</span>
                <button
                  onClick={handleNext}
                  disabled={currentPage === totalPages}
                  className={`px-2 py-1 rounded-lg text-indigo-600 hover:bg-indigo-100 transition ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
                  title="Next"
                >
                  &gt;
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Change Password Modal */}
        {showPasswordModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md relative">
              <button
                className="absolute top-3 right-3 text-gray-400 hover:text-rose-500"
                onClick={closePasswordModal}
                title="Close"
              >
                <FiX size={22} />
              </button>
              <h2 className="text-xl font-bold mb-4 text-indigo-700">Change Password</h2>
              <form className="flex flex-col gap-6" onSubmit={handlePasswordSave}>
                <div className="flex flex-col gap-1">
                  <label className="font-medium text-gray-700">Password</label>
                  <input
                    type="password"
                    name="password"
                    value={passwordForm.password}
                    onChange={handlePasswordChange}
                    className="px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-400"
                    required
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-medium text-gray-700">Confirm Password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={passwordForm.confirmPassword}
                    onChange={handlePasswordChange}
                    className="px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-400"
                    required
                  />
                </div>
                <div className="flex justify-end gap-4 mt-6">
                  <button
                    type="button"
                    className="px-8 py-2 rounded-lg font-semibold shadow bg-red-600 text-white hover:bg-red-700 transition"
                    onClick={closePasswordModal}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-8 py-2 rounded-lg font-semibold shadow bg-green-600 text-white hover:bg-green-700 transition"
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Add System User Modal */}
        {showAddUserModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-lg relative max-h-[80vh] overflow-y-auto">
              <button
                className="absolute top-3 right-3 text-gray-400 hover:text-rose-500"
                onClick={closeAddUserModal}
                title="Close"
              >
                <FiX size={22} />
              </button>
              <h2 className="text-xl font-bold mb-4 text-indigo-700">Add System User</h2>
              <form className="grid grid-cols-1 gap-y-6" onSubmit={handleAddUserSubmit}>
                <div className="flex flex-col gap-1">
                  <label className="font-medium text-gray-700">User Role</label>
                  <select
                    name="role"
                    value={addUserForm.role}
                    onChange={handleAddUserChange}
                    className="px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-400 max-h-32 overflow-y-auto"
                    required
                  >
                    {userRoles.map((role, idx) => (
                      <option key={idx} value={role}>{role}</option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={addUserForm.name}
                    onChange={handleAddUserChange}
                    className="px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-400"
                    required
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-medium text-gray-700">Contact No</label>
                  <input
                    type="text"
                    name="contact"
                    value={addUserForm.contact}
                    onChange={handleAddUserChange}
                    className="px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-400"
                    required
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={addUserForm.email}
                    onChange={handleAddUserChange}
                    className="px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-400"
                    required
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-medium text-gray-700">Password</label>
                  <input
                    type="password"
                    name="password"
                    value={addUserForm.password}
                    onChange={handleAddUserChange}
                    className="px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-400"
                    required
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-medium text-gray-700">Confirm Password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={addUserForm.confirmPassword}
                    onChange={handleAddUserChange}
                    className="px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-400"
                    required
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-medium text-gray-700">City</label>
                  <input
                    type="text"
                    name="city"
                    value={addUserForm.city}
                    onChange={handleAddUserChange}
                    className="px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-400"
                    required
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-medium text-gray-700">Pincode</label>
                  <input
                    type="text"
                    name="pincode"
                    value={addUserForm.pincode}
                    onChange={handleAddUserChange}
                    className="px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-400"
                    required
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-medium text-gray-700">District</label>
                  <input
                    type="text"
                    name="district"
                    value={addUserForm.district}
                    onChange={handleAddUserChange}
                    className="px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-400"
                    required
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-medium text-gray-700">State</label>
                  <input
                    type="text"
                    name="state"
                    value={addUserForm.state}
                    onChange={handleAddUserChange}
                    className="px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-400"
                    required
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-medium text-gray-700">Country</label>
                  <input
                    type="text"
                    name="country"
                    value={addUserForm.country}
                    onChange={handleAddUserChange}
                    className="px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-400"
                    required
                  />
                </div>
                <div className="flex justify-end gap-4 mt-6">
                  <button
                    type="button"
                    className="px-8 py-2 rounded-lg font-semibold shadow bg-gray-300 text-gray-700 hover:bg-gray-400 transition"
                    onClick={closeAddUserModal}
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="px-8 py-2 rounded-lg font-semibold shadow bg-green-600 text-white hover:bg-green-700 transition"
                  >
                    Submit
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