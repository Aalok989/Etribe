import React, { useState, useRef } from "react";
import DashboardLayout from "../components/Layout/DashboardLayout";
import etribeLogo from "../assets/Etribe-logo.jpg";
import defaultSignature from "../assets/company-logo/parent.jpg";
import { FiEdit2, FiX, FiUpload } from "react-icons/fi";

const initialData = {
  name: "Admin Name",
  email: "admin@company.com",
  contact: "9876543210",
  address: "123 Main Street",
  city: "Tech City",
  state: "Innovation State",
  pincode: "123456",
  country: "India",
  signatureName: "Admin Name",
  signatureDesignation: "Administrator",
  logo: etribeLogo,
  signature: defaultSignature,
};

export default function GroupData() {
  const [data, setData] = useState(initialData);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState(initialData);
  const [logoPreview, setLogoPreview] = useState(initialData.logo);
  const [signaturePreview, setSignaturePreview] = useState(initialData.signature);
  const logoInputRef = useRef();
  const signatureInputRef = useRef();

  const handleEdit = () => {
    setForm(data);
    setLogoPreview(data.logo);
    setSignaturePreview(data.signature);
    setEditMode(true);
  };

  const handleCancel = () => {
    setEditMode(false);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
        setForm((prev) => ({ ...prev, logo: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSignatureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSignaturePreview(reader.result);
        setForm((prev) => ({ ...prev, signature: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setData(form);
    setEditMode(false);
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-4 py-3 min-h-0">
        <h1 className="text-2xl font-bold text-black mb-4 ml-2">Group Data</h1>
        <div className="rounded-2xl shadow-lg bg-white max-w-7xl w-full mx-auto px-4">
          <div className="flex flex-col gap-0">
            <div className="flex items-center justify-between px-0 pt-6">
              <img
                src={data.logo}
                alt="Logo"
                className="w-16 h-16 object-contain rounded-lg border border-gray-200 shadow bg-white"
              />
              <button
                className="flex items-center gap-2 px-7 py-2 bg-indigo-600 text-white rounded-lg font-semibold shadow hover:bg-indigo-700 transition"
                onClick={handleEdit}
              >
                <FiEdit2 /> Edit
              </button>
            </div>
            <div className="pt-4 pb-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-8">
                <div>
                  <span className="font-bold text-gray-700 block mb-1">Name</span>
                  <span className="text-gray-900 text-base font-normal">{data.name}</span>
                </div>
                <div>
                  <span className="font-bold text-gray-700 block mb-1">Email</span>
                  <span className="text-gray-900 text-base font-normal">{data.email}</span>
                </div>
                <div>
                  <span className="font-bold text-gray-700 block mb-1">Contact No</span>
                  <span className="text-gray-900 text-base font-normal">{data.contact}</span>
                </div>
                <div>
                  <span className="font-bold text-gray-700 block mb-1">Address</span>
                  <span className="text-gray-900 text-base font-normal">{data.address}</span>
                </div>
                <div>
                  <span className="font-bold text-gray-700 block mb-1">City</span>
                  <span className="text-gray-900 text-base font-normal">{data.city}</span>
                </div>
                <div>
                  <span className="font-bold text-gray-700 block mb-1">State</span>
                  <span className="text-gray-900 text-base font-normal">{data.state}</span>
                </div>
                <div>
                  <span className="font-bold text-gray-700 block mb-1">Pincode</span>
                  <span className="text-gray-900 text-base font-normal">{data.pincode}</span>
                </div>
                <div>
                  <span className="font-bold text-gray-700 block mb-1">Country</span>
                  <span className="text-gray-900 text-base font-normal">{data.country}</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-end pb-6 pt-2">
              <img
                src={data.signature}
                alt="Signature"
                className="w-40 h-16 object-contain bg-white rounded border border-gray-200 shadow"
              />
              <span className="text-xs text-gray-400 mt-1 italic">{data.signatureName}, {data.signatureDesignation}</span>
            </div>
          </div>
        </div>

        {/* Edit Modal */}
        {editMode && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-2xl relative">
              <button
                className="absolute top-3 right-3 text-gray-400 hover:text-rose-500"
                onClick={handleCancel}
                title="Close"
              >
                <FiX size={22} />
              </button>
              <h2 className="text-xl font-bold mb-4 text-indigo-700">Edit Group Data</h2>
              <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                  <div className="flex flex-col gap-1">
                    <label className="font-medium text-gray-700">Name</label>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      className="px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-400"
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="font-medium text-gray-700">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      className="px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-400"
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="font-medium text-gray-700">Contact No</label>
                    <input
                      type="text"
                      name="contact"
                      value={form.contact}
                      onChange={handleChange}
                      className="px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-400"
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="font-medium text-gray-700">Address</label>
                    <input
                      type="text"
                      name="address"
                      value={form.address}
                      onChange={handleChange}
                      className="px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-400"
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="font-medium text-gray-700">City</label>
                    <input
                      type="text"
                      name="city"
                      value={form.city}
                      onChange={handleChange}
                      className="px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-400"
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="font-medium text-gray-700">State</label>
                    <input
                      type="text"
                      name="state"
                      value={form.state}
                      onChange={handleChange}
                      className="px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-400"
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="font-medium text-gray-700">Pincode</label>
                    <input
                      type="text"
                      name="pincode"
                      value={form.pincode}
                      onChange={handleChange}
                      className="px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-400"
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="font-medium text-gray-700">Country</label>
                    <input
                      type="text"
                      name="country"
                      value={form.country}
                      onChange={handleChange}
                      className="px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-400"
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="font-medium text-gray-700">Signature Name</label>
                    <input
                      type="text"
                      name="signatureName"
                      value={form.signatureName}
                      onChange={handleChange}
                      className="px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-400"
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="font-medium text-gray-700">Signature Designation</label>
                    <input
                      type="text"
                      name="signatureDesignation"
                      value={form.signatureDesignation}
                      onChange={handleChange}
                      className="px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-400"
                      required
                    />
                  </div>
                </div>
                <div className="flex flex-col md:flex-row gap-8 mt-4">
                  <div className="flex flex-col items-center gap-2 flex-1">
                    <label className="font-medium text-gray-700 mb-1">Logo</label>
                    <div className="relative w-28 h-28 mb-2">
                      <img
                        src={logoPreview}
                        alt="Logo Preview"
                        className="w-28 h-28 object-contain rounded-xl border-2 border-indigo-200 shadow"
                      />
                      <button
                        type="button"
                        className="absolute bottom-1 right-1 bg-indigo-600 text-white p-1 rounded-full shadow hover:bg-indigo-700"
                        onClick={() => logoInputRef.current.click()}
                        title="Upload Logo"
                      >
                        <FiUpload size={16} />
                      </button>
                      <input
                        type="file"
                        accept="image/*"
                        ref={logoInputRef}
                        className="hidden"
                        onChange={handleLogoChange}
                      />
                    </div>
                  </div>
                  <div className="flex flex-col items-center gap-2 flex-1">
                    <label className="font-medium text-gray-700 mb-1">Signature</label>
                    <div className="relative w-40 h-20 mb-2">
                      <img
                        src={signaturePreview}
                        alt="Signature Preview"
                        className="w-40 h-20 object-contain rounded border-2 border-indigo-200 shadow"
                      />
                      <button
                        type="button"
                        className="absolute bottom-1 right-1 bg-indigo-600 text-white p-1 rounded-full shadow hover:bg-indigo-700"
                        onClick={() => signatureInputRef.current.click()}
                        title="Upload Signature"
                      >
                        <FiUpload size={16} />
                      </button>
                      <input
                        type="file"
                        accept="image/*"
                        ref={signatureInputRef}
                        className="hidden"
                        onChange={handleSignatureChange}
                      />
                    </div>
                  </div>
                </div>
                <div className="flex justify-end mt-6">
                  <button
                    type="submit"
                    className="bg-indigo-600 text-white px-8 py-2 rounded-lg font-semibold shadow hover:bg-indigo-700 transition"
                  >
                    Save
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