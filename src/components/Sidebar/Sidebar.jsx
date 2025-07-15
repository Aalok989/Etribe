import React, { useState } from "react";
import { FiGrid, FiUsers, FiUserCheck, FiCalendar, FiBookOpen, FiSettings, FiLogOut, FiMenu, FiUser, FiChevronDown } from "react-icons/fi";
import { NavLink, useLocation } from "react-router-dom";
import companyLogo from "../../assets/company-logo/parent.jpg";

const menuItems = [
  {
    label: "Dashboard",
    icon: <FiGrid size={20} />,
    path: "/dashboard",
    dropdown: false,
  },
  {
    label: "Membership Management",
    icon: <FiUsers size={20} />,
    path: "/membership-management",
    dropdown: true,
  },
  {
    label: "Admin Management",
    icon: <FiUserCheck size={20} />,
    path: "/admin-management",
    dropdown: true,
  },
  {
    label: "Event Management",
    icon: <FiCalendar size={20} />,
    path: "/event-management",
    dropdown: true,
  },
  {
    label: "Important Contacts",
    icon: <FiBookOpen size={20} />,
    path: "/important-contacts",
    dropdown: false,
  },
  {
    label: "Master Settings",
    icon: <FiSettings size={20} />,
    path: "/master-settings",
    dropdown: true,
  },
];

export default function Sidebar({ className = "" }) {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  return (
    <aside className={`bg-blue-50 flex flex-col transition-all duration-200 ${collapsed ? 'w-20' : 'w-64'} shadow-lg ${className}`}>
      {/* Header with logo and collapse button */}
      <div className="flex items-center gap-3 p-4 border-b border-blue-100">
        <div className="flex items-center">
          <img 
            src={companyLogo} 
            alt="Company Logo" 
            className={`rounded-lg object-cover ${collapsed ? 'w-16 h-6' : 'w-32 h-8'}`}
          />
        </div>
        <button
          className="ml-auto text-blue-600 hover:text-blue-800 transition-colors duration-150"
          onClick={() => setCollapsed((prev) => !prev)}
          aria-label="Toggle sidebar"
        >
          <FiMenu size={20} />
        </button>
      </div>
      
      <nav className="flex-1 px-2 pt-4">
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.label}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors duration-150 text-left font-medium text-blue-900 hover:bg-blue-100 hover:text-blue-900 whitespace-nowrap ${
                    isActive ? 'bg-green-500 text-white' : ''
                  }`
                }
                end={item.path === "/dashboard"}
              >
                <span>{item.icon}</span>
                <span className={`${collapsed ? 'hidden' : ''} whitespace-nowrap`}>{item.label}</span>
                {!collapsed && item.dropdown && (
                  <FiChevronDown className="ml-auto" />
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      
      {/* Logout button */}
      <div className="p-4 border-t border-blue-100">
        <button 
          className="w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors duration-150 text-left font-medium text-blue-900 hover:bg-red-100 hover:text-red-600"
          title="Logout"
        >
          <FiLogOut size={20} />
          {!collapsed && <span className="whitespace-nowrap">Logout</span>}
        </button>
      </div>
    </aside>
  );
} 