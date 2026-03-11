import React from "react";

export default function AdminDashboard() {
  return (
    <div className="p-6 text-gray-200">

      <h1 className="text-3xl font-bold text-amber-400 mb-6">
        Admin Dashboard
      </h1>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">

        <div className="bg-black/40 border border-gray-700 rounded-xl p-5">
          <h2 className="text-2xl font-bold text-amber-400">120</h2>
          <p className="text-gray-400 text-sm">Total Users</p>
        </div>

        <div className="bg-black/40 border border-gray-700 rounded-xl p-5">
          <h2 className="text-2xl font-bold text-amber-400">25</h2>
          <p className="text-gray-400 text-sm">Total Sellers</p>
        </div>

        <div className="bg-black/40 border border-gray-700 rounded-xl p-5">
          <h2 className="text-2xl font-bold text-amber-400">78</h2>
          <p className="text-gray-400 text-sm">Vehicles Listed</p>
        </div>

        <div className="bg-black/40 border border-gray-700 rounded-xl p-5">
          <h2 className="text-2xl font-bold text-amber-400">6</h2>
          <p className="text-gray-400 text-sm">Pending Approvals</p>
        </div>

      </div>

      {/* ADMIN ACTIONS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <div className="bg-black/40 border border-gray-700 rounded-xl p-5">
          <h2 className="text-lg text-amber-400">Manage Users</h2>
          <p className="text-gray-400 text-sm mt-2">
            View and manage platform users.
          </p>
        </div>

        <div className="bg-black/40 border border-gray-700 rounded-xl p-5">
          <h2 className="text-lg text-amber-400">Vehicle Listings</h2>
          <p className="text-gray-400 text-sm mt-2">
            Monitor all car listings.
          </p>
        </div>

        <div className="bg-black/40 border border-gray-700 rounded-xl p-5">
          <h2 className="text-lg text-amber-400">Platform Analytics</h2>
          <p className="text-gray-400 text-sm mt-2">
            Track platform activity.
          </p>
        </div>

      </div>

    </div>
  );
}