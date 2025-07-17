import React, { useState } from "react";
import DashboardLayout from "../components/Layout/DashboardLayout";
import { FiEdit2, FiX, FiCalendar, FiFileText, FiFile } from "react-icons/fi";

const demoMembers = [
  { id: 1, name: "Rohit Arya", contact: "1234567890", email: "rohit@company.com", pan: "ABCDE1234F", aadhar: "1234-5678-9012", dl: "DL-1234567890", dob: "1990-01-01", company: "Tech Solutions", validUpto: "2025-12-31", plan: "Basic" },
  { id: 2, name: "Priya Singh", contact: "9876543210", email: "priya@company.com", pan: "PQRSX5678Y", aadhar: "2345-6789-0123", dl: "DL-0987654321", dob: "1992-05-15", company: "InnovateX", validUpto: "2024-11-30", plan: "Premium" },
  { id: 3, name: "Amit Kumar", contact: "5551234567", email: "amit@company.com", pan: "LMNOP3456Q", aadhar: "3456-7890-1234", dl: "DL-1122334455", dob: "1988-07-20", company: "Alpha Corp", validUpto: "2026-03-15", plan: "Gold" },
  { id: 4, name: "Neha Verma", contact: "4445556666", email: "neha@company.com", pan: "TUVWX6789Z", aadhar: "4567-8901-2345", dl: "DL-5566778899", dob: "1995-09-10", company: "Beta Ltd", validUpto: "2025-08-22", plan: "Standard" },
  { id: 5, name: "Suresh Patel", contact: "3332221111", email: "suresh@company.com", pan: "ABCDE9999F", aadhar: "5678-9012-3456", dl: "DL-6677889900", dob: "1985-12-05", company: "Gamma Pvt Ltd", validUpto: "2023-10-10", plan: "Platinum" },
  { id: 6, name: "Meena Joshi", contact: "8889990000", email: "meena@company.com", pan: "FGHIJ1234K", aadhar: "6789-0123-4567", dl: "DL-2233445566", dob: "1991-03-18", company: "Delta Inc", validUpto: "2025-05-20", plan: "Diamond" },
  { id: 7, name: "Vikas Sharma", contact: "1112223333", email: "vikas@company.com", pan: "KLMNO5678P", aadhar: "7890-1234-5678", dl: "DL-3344556677", dob: "1987-11-23", company: "Epsilon LLC", validUpto: "2024-09-15", plan: "Voice over plan" },
  { id: 8, name: "Ritu Singh", contact: "9998887777", email: "ritu@company.com", pan: "QRSTU9012V", aadhar: "8901-2345-6789", dl: "DL-4455667788", dob: "1993-06-30", company: "Zeta Group", validUpto: "2026-01-01", plan: "Basic" },
  { id: 9, name: "Deepak Mehta", contact: "1231231234", email: "deepak@company.com", pan: "VWXYZ3456A", aadhar: "9012-3456-7890", dl: "DL-5566778899", dob: "1989-08-12", company: "Eta Pvt Ltd", validUpto: "2025-07-07", plan: "Premium" },
  { id: 10, name: "Pooja Agarwal", contact: "3213214321", email: "pooja@company.com", pan: "ABCDE6789F", aadhar: "0123-4567-8901", dl: "DL-6677889900", dob: "1994-02-14", company: "Theta Ltd", validUpto: "2024-12-31", plan: "Gold" },
  { id: 11, name: "Sanjay Dutt", contact: "5556667777", email: "sanjay@company.com", pan: "FGHIJ2345K", aadhar: "1234-5678-9012", dl: "DL-7788990011", dob: "1986-04-25", company: "Iota Corp", validUpto: "2025-03-10", plan: "Standard" },
  { id: 12, name: "Asha Parekh", contact: "4443332222", email: "asha@company.com", pan: "KLMNO6789P", aadhar: "2345-6789-0123", dl: "DL-8899001122", dob: "1990-10-19", company: "Kappa Inc", validUpto: "2026-06-18", plan: "Platinum" },
  { id: 13, name: "Ramesh Gupta", contact: "7778889999", email: "ramesh@company.com", pan: "QRSTU1234V", aadhar: "3456-7890-1234", dl: "DL-9900112233", dob: "1983-01-30", company: "Lambda Group", validUpto: "2025-11-11", plan: "Diamond" },
  { id: 14, name: "Sunita Rao", contact: "2223334444", email: "sunita@company.com", pan: "VWXYZ5678A", aadhar: "4567-8901-2345", dl: "DL-0011223344", dob: "1992-08-08", company: "Mu Pvt Ltd", validUpto: "2024-04-04", plan: "Voice over plan" },
  { id: 15, name: "Amitabh Bachchan", contact: "6665554444", email: "amitabh@company.com", pan: "ABCDE3456F", aadhar: "5678-9012-3456", dl: "DL-1122334455", dob: "1975-11-11", company: "Nu Ltd", validUpto: "2025-09-09", plan: "Basic" },
  { id: 16, name: "Kiran Desai", contact: "3334445555", email: "kiran@company.com", pan: "FGHIJ6789K", aadhar: "6789-0123-4567", dl: "DL-2233445566", dob: "1996-12-12", company: "Xi Solutions", validUpto: "2026-02-02", plan: "Premium" },
  { id: 17, name: "Manoj Bajpayee", contact: "8887776666", email: "manoj@company.com", pan: "KLMNO1234P", aadhar: "7890-1234-5678", dl: "DL-3344556677", dob: "1982-03-03", company: "Omicron LLC", validUpto: "2025-05-05", plan: "Gold" },
  { id: 18, name: "Shilpa Shetty", contact: "1113335557", email: "shilpa@company.com", pan: "QRSTU5678V", aadhar: "8901-2345-6789", dl: "DL-4455667788", dob: "1987-07-07", company: "Pi Group", validUpto: "2024-08-08", plan: "Standard" },
  { id: 19, name: "Rajesh Khanna", contact: "2225558888", email: "rajesh@company.com", pan: "VWXYZ9012A", aadhar: "9012-3456-7890", dl: "DL-5566778899", dob: "1979-09-09", company: "Rho Pvt Ltd", validUpto: "2025-10-10", plan: "Platinum" },
  { id: 20, name: "Madhuri Dixit", contact: "9991113335", email: "madhuri@company.com", pan: "ABCDE7890F", aadhar: "0123-4567-8901", dl: "DL-6677889900", dob: "1988-05-05", company: "Sigma Ltd", validUpto: "2026-12-12", plan: "Diamond" },
];

const planOptions = [
  "Basic",
  "Standard",
  "Premium",
  "Platinum",
  "Diamond",
  "Gold",
  "Voice over plan",
];

export default function InactiveMembers() {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(3);
  const [modifyMember, setModifyMember] = useState(null);
  const [form, setForm] = useState({ plan: "", validUpto: "" });

  // Filter by name
  const filtered = demoMembers.filter(m => m.name.toLowerCase().includes(search.toLowerCase()));
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

  const openModify = (member) => {
    setModifyMember(member);
    setForm({ plan: member.plan || "", validUpto: member.validUpto || "" });
  };

  const closeModify = () => {
    setModifyMember(null);
    setForm({ plan: "", validUpto: "" });
  };

  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleDateChange = (e) => {
    setForm({ ...form, validUpto: e.target.value });
  };

  const handleUpdate = () => {
    // Here you would update the member's plan and validUpto in your backend or state
    closeModify();
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-4 py-3">
        <h1 className="text-2xl font-bold mb-4">Inactive Members</h1>
        <div className="rounded-2xl shadow-lg bg-white">
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
            <div className="flex gap-2 items-center">
              <button className="flex items-center gap-1 bg-blue-500 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-blue-600 transition"><FiFileText />CSV</button>
              <button className="flex items-center gap-1 bg-emerald-500 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-emerald-600 transition"><FiFile />Excel</button>
              <button className="flex items-center gap-1 bg-rose-500 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-rose-600 transition"><FiFile />PDF</button>
            </div>
          </div>
          {/* Table */}
          <div className="overflow-x-auto p-6">
            <table className="min-w-max text-sm">
              <thead className="bg-indigo-50 text-indigo-700 sticky top-0 z-10">
                <tr>
                  <th className="p-3 rounded-l-xl text-left">Sr No</th>
                  <th className="p-3 text-left">Name</th>
                  <th className="p-3 text-left">Contact</th>
                  <th className="p-3 text-left">Email</th>
                  <th className="p-3 text-left">PAN Number</th>
                  <th className="p-3 text-left">Aadhar Number</th>
                  <th className="p-3 text-left">DL Number</th>
                  <th className="p-3 text-left">D.O.B</th>
                  <th className="p-3 text-left">Company Name</th>
                  <th className="p-3 text-left">Valid Upto</th>
                  <th className="p-3 text-left">Membership Plan</th>
                  <th className="p-3 rounded-r-xl text-center">Action</th>
                </tr>
              </thead>
              <tbody className="border-separate border-spacing-y-2">
                {paginated.map((m, idx) => (
                  <tr key={m.id} className="bg-white shadow rounded-xl">
                    <td className="p-3 text-center font-semibold text-indigo-700">{startIdx + idx + 1}</td>
                    <td className="p-3">{m.name}</td>
                    <td className="p-3">{m.contact}</td>
                    <td className="p-3">{m.email}</td>
                    <td className="p-3">{m.pan}</td>
                    <td className="p-3">{m.aadhar}</td>
                    <td className="p-3">{m.dl}</td>
                    <td className="p-3">{m.dob}</td>
                    <td className="p-3">{m.company}</td>
                    <td className="p-3">{m.validUpto}</td>
                    <td className="p-3">{m.plan}</td>
                    <td className="p-3 flex justify-center">
                      <button
                        className="text-indigo-600 hover:text-indigo-900 p-2 rounded-full hover:bg-indigo-50 transition"
                        title="Modify Membership"
                        onClick={() => openModify(m)}
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
        {/* Modify Membership Modal */}
        {modifyMember && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md relative">
              <button
                className="absolute top-3 right-3 text-gray-400 hover:text-rose-500"
                onClick={closeModify}
                title="Close"
              >
                <FiX size={22} />
              </button>
              <h2 className="text-xl font-bold mb-4 text-indigo-700">Modify Membership</h2>
              <form className="flex flex-col gap-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-1">Membership Plan</label>
                  <select
                    name="plan"
                    value={form.plan}
                    onChange={handleFormChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-400"
                  >
                    <option value="">Select Plan</option>
                    {planOptions.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-1">Valid Upto</label>
                  <div className="relative">
                    <input
                      type="date"
                      name="validUpto"
                      value={form.validUpto}
                      onChange={handleDateChange}
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-400 pr-10"
                    />
                  </div>
                </div>
                <div className="flex gap-4 justify-end mt-2">
                  <button
                    type="button"
                    className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300 transition"
                    onClick={closeModify}
                  >
                    Close Popup
                  </button>
                  <button
                    type="button"
                    className="px-4 py-2 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition"
                    onClick={handleUpdate}
                  >
                    Update Membership
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