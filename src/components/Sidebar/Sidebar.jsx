import React, { useState } from "react";
import { FiGrid, FiUsers, FiUserCheck, FiCalendar, FiBookOpen, FiSettings, FiLogOut, FiMenu, FiUser, FiChevronDown } from "react-icons/fi";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
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
    path: "#", // Changed from a path to a toggle-only indicator
    basePath: "/membership-management", // Used for checking active state of sub-items
    dropdown: true,
    subItems: [
      { label: "Active Members", path: "/membership-management/active" },
      { label: "Inactive Members", path: "/membership-management/inactive" },
      { label: "Membership Expired", path: "/membership-management/expired" },
    ],
  },
  {
    label: "Admin Management",
    icon: <FiUserCheck size={20} />,
    path: "#",
    basePath: "/admin-management",
    dropdown: true,
    subItems: [
      { label: "Admin Accounts", path: "/admin-management/accounts" },
      { label: "User Roles", path: "/admin-management/user-roles" },
      { label: "Role Management", path: "/admin-management/role-management" },
    ],
  },
  {
    label: "Event Management",
    icon: <FiCalendar size={20} />,
    path: "#",
    basePath: "/event-management",
    dropdown: true,
    subItems: [
      { label: "Calendar", path: "/calendar" },
      { label: "All Events", path: "/event-management/all" },
      { label: "Upcoming Events", path: "/event-management/upcoming" },
      { label: "Past Events", path: "/event-management/past" },
    ],
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
    path: "#",
    basePath: "/master-settings",
    dropdown: true,
    subItems: [
      { label: "Group Data", path: "/master-settings/group-data" },
      { label: "SMTP Settings", path: "/master-settings/smtp-settings" },
      { label: "Message Settings", path: "/master-settings/message-settings" },
      { label: "User Additional Fields", path: "/master-settings/user-additional-fields" },
      { label: "Company Additional Fields", path: "/master-settings/company-additional-fields" },
      { label: "Membership Plans", path: "/master-settings/membership-plans" },
    ],
  },
];

export default function Sidebar({ className = "" }) {
  const [collapsed, setCollapsed] = useState(false);
  const [openDropdown, setOpenDropdown] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  // Open the dropdown if a sub-item is active on page load
  React.useEffect(() => {
    const activeItem = menuItems.find(item => item.subItems?.some(sub => sub.path === location.pathname));
    if (activeItem) {
      setOpenDropdown(activeItem.label);
    }
  }, [location.pathname]);

  return (
    <aside className={`bg-blue-50 flex flex-col transition-all duration-200 ${collapsed ? 'w-20' : 'w-72'} shadow-lg ${className}`}>
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
          {menuItems.map((item) => {
            // Check if any subitem is active for dropdowns
            const isParentOfActive = item.subItems && item.subItems.some(sub => location.pathname === sub.path);

            // This logic is for items that are pure toggles (like Membership Management)
            if (item.path === "#") {
              return (
                <li key={item.label}>
                  <button
                    onClick={() => setOpenDropdown(openDropdown === item.label ? "" : item.label)}
                    className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors duration-150 text-left font-medium text-blue-900 hover:bg-blue-100 hover:text-blue-900 whitespace-nowrap ${
                      isParentOfActive ? 'bg-green-500 text-white' : ''
                    }`}
                  >
                    <span>{item.icon}</span>
                    <span className={`${collapsed ? 'hidden' : ''} whitespace-nowrap flex-1`}>{item.label}</span>
                    {!collapsed && item.dropdown && (
                      <span className="flex items-center ml-auto">
                        <FiChevronDown
                          className={`transition-transform duration-200 ${openDropdown === item.label ? 'rotate-180' : ''}`}
                          size={20}
                        />
                      </span>
                    )}
                  </button>
                  {/* Dropdown sub-menu */}
                  {item.dropdown && openDropdown === item.label && !collapsed && (
                    <ul className="ml-8 mt-1 bg-blue-100 rounded-lg shadow-inner py-2">
                      {item.subItems.map((sub) => (
                        <li key={sub.label}>
                          <NavLink
                            to={sub.path}
                            className={({ isActive }) =>
                              `block px-4 py-1 text-blue-900 text-sm rounded hover:bg-blue-200 cursor-pointer ${
                                isActive ? 'font-bold text-indigo-700' : ''
                              }`
                            }
                          >
                            {sub.label}
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              );
            }

            // This is for all other linkable menu items
            return (
              <li key={item.label}>
                <div className="relative">
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
                      <button
                        type="button"
                        className={`ml-auto transition-transform duration-200 ${
                          openDropdown === item.label ? 'rotate-180' : ''
                        }`}
                        onClick={(e) => {
                          e.preventDefault();
                          setOpenDropdown(openDropdown === item.label ? '' : item.label);
                        }}
                        tabIndex={-1}
                      >
                        <FiChevronDown />
                      </button>
                    )}
                  </NavLink>
                  {/* Dropdown sub-menu */}
                  {item.dropdown && openDropdown === item.label && !collapsed && (
                    <ul className="ml-8 mt-1 bg-blue-100 rounded-lg shadow-inner py-2">
                      {item.subItems.map((sub) => (
                        <li key={sub.label}>
                           <NavLink
                            to={sub.path}
                            className={({ isActive }) =>
                              `block px-4 py-1 text-blue-900 text-sm rounded hover:bg-blue-200 cursor-pointer ${
                                isActive ? 'font-bold text-indigo-700' : ''
                              }`
                            }
                          >
                            {sub.label}
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </nav>
      
      {/* Logout button */}
      <div className="p-4 border-t border-blue-100">
        <button 
          className="w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors duration-150 text-left font-medium text-blue-900 hover:bg-red-100 hover:text-red-600"
          title="Logout"
          onClick={() => {
            localStorage.removeItem('token');
            navigate('/login', { replace: true });
          }}
        >
          <FiLogOut size={20} />
          {!collapsed && <span className="whitespace-nowrap">Logout</span>}
        </button>
      </div>
    </aside>
  );
} 