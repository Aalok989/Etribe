import React from "react";
import Sidebar from "../Sidebar/Sidebar";
import TopBar from "./TopBar";
import { FiMail, FiPhone, FiMapPin, FiFacebook, FiTwitter, FiInstagram, FiLinkedin, FiGithub } from "react-icons/fi";

export default function DashboardLayout({ children }) {
  return (
    <div className="bg-gray-50 font-sans min-h-screen flex">
      {/* Fixed Sidebar */}
      <Sidebar className="fixed left-0 top-0 h-screen z-30" />
      {/* Main content area with left padding for sidebar */}
      <main className="pl-72 min-h-screen flex flex-col flex-1">
        <div className="max-w-7xl mx-auto px-4 py-8 flex-1 flex flex-col">
          <TopBar />
          <div className="flex-1">
            {children}
          </div>
          
          {/* Enhanced Footer */}
          <footer className="bg-white rounded-xl shadow-lg mt-8 overflow-hidden">
            {/* Main Footer Content */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 p-8">
              {/* Company Info */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">E</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">Etribe</h3>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Empowering communities through innovative event management and membership solutions.
                </p>
                <div className="flex space-x-4">
                  <a href="#" className="text-gray-400 hover:text-indigo-500 transition-colors">
                    <FiFacebook size={20} />
                  </a>
                  <a href="#" className="text-gray-400 hover:text-indigo-500 transition-colors">
                    <FiTwitter size={20} />
                  </a>
                  <a href="#" className="text-gray-400 hover:text-indigo-500 transition-colors">
                    <FiInstagram size={20} />
                  </a>
                  <a href="#" className="text-gray-400 hover:text-indigo-500 transition-colors">
                    <FiLinkedin size={20} />
                  </a>
                </div>
              </div>

              {/* Quick Links */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-gray-800">Quick Links</h4>
                <ul className="space-y-2">
                  <li><a href="/about" className="text-gray-600 hover:text-indigo-500 transition-colors text-sm">About Us</a></li>
                  <li><a href="/services" className="text-gray-600 hover:text-indigo-500 transition-colors text-sm">Our Services</a></li>
                  <li><a href="/contact" className="text-gray-600 hover:text-indigo-500 transition-colors text-sm">Contact</a></li>
                  <li><a href="/policy" className="text-gray-600 hover:text-indigo-500 transition-colors text-sm">Policy</a></li>
                  <li><a href="/terms" className="text-gray-600 hover:text-indigo-500 transition-colors text-sm">Terms of Service</a></li>
                  <li><a href="/cookies" className="text-gray-600 hover:text-indigo-500 transition-colors text-sm">Cookie Policy</a></li>
                </ul>
              </div>

              {/* Services */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-gray-800">Services</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-600 hover:text-indigo-500 transition-colors text-sm">Event Management</a></li>
                  <li><a href="#" className="text-gray-600 hover:text-indigo-500 transition-colors text-sm">Membership Portal</a></li>
                  <li><a href="#" className="text-gray-600 hover:text-indigo-500 transition-colors text-sm">Analytics Dashboard</a></li>
                  <li><a href="#" className="text-gray-600 hover:text-indigo-500 transition-colors text-sm">Admin Tools</a></li>
                  <li><a href="#" className="text-gray-600 hover:text-indigo-500 transition-colors text-sm">Support</a></li>
                </ul>
              </div>

              {/* Contact Info */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-gray-800">Contact Info</h4>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <FiMapPin className="text-indigo-500" size={16} />
                    <span className="text-gray-600 text-sm">123 Business Ave, Tech City, TC 12345</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <FiPhone className="text-indigo-500" size={16} />
                    <span className="text-gray-600 text-sm">+1 (555) 123-4567</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <FiMail className="text-indigo-500" size={16} />
                    <span className="text-gray-600 text-sm">info@etribe.com</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Bottom */}
            <div className="border-t border-gray-200 px-8 py-4">
              <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
                <p className="text-gray-500 text-sm">
                  &copy; 2025 Etribe. All rights reserved.
                </p>
                <div className="flex space-x-6 text-sm">
                  <a href="/policy" className="text-gray-500 hover:text-indigo-500 transition-colors">Privacy Policy</a>
                  <a href="/terms" className="text-gray-500 hover:text-indigo-500 transition-colors">Terms of Service</a>
                  <a href="/cookies" className="text-gray-500 hover:text-indigo-500 transition-colors">Cookie Policy</a>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </main>
    </div>
  );
} 