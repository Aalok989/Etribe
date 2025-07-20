import React from "react";

export default function Footer() {
  return (
    <footer className="bg-white rounded-xl shadow p-4 text-center">
      <span className="text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} Etribe. All rights reserved.
      </span>
    </footer>
  );
}