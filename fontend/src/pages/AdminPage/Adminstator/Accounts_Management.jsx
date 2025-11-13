import React, { useState } from "react";
import Employee_Management from "./Accounts_Management/Employee_Management";
import User_Management from "./Accounts_Management/User_Management";

export default function Accounts_Management() {
  const [activeTab, setActiveTab] = useState("User_Management");

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Quản lý tài khoản</h1>

      {/* Tabs */}
      <div className="flex gap-4 mb-6">
        <button
          className={`px-4 py-2 rounded-lg ${
            activeTab === "customer" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
          onClick={() => setActiveTab("User_Management")}
        >
          Khách hàng
        </button>
        <button
          className={`px-4 py-2 rounded-lg ${
            activeTab === "Employee_Management" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
          onClick={() => setActiveTab("Employee_Management")}
        >
          Nhân viên
        </button>
      </div>

      {/* Content */}
      {activeTab === "User_Management" ? <User_Management /> : <Employee_Management />}
    </div>
  );
}
