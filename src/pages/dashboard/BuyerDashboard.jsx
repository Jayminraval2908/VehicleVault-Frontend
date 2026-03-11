import React from "react";

export default function BuyerDashboard() {
  return (
    <div className="p-6 text-gray-200">
      <h1 className="text-3xl font-bold text-amber-400 mb-4">
        Buyer Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <div className="bg-black/40 border border-gray-700 rounded-xl p-5">
          <h2 className="text-lg text-amber-400">Browse Cars</h2>
          <p className="text-gray-400 text-sm mt-2">
            Explore available cars from sellers.
          </p>
        </div>

        <div className="bg-black/40 border border-gray-700 rounded-xl p-5">
          <h2 className="text-lg text-amber-400">Saved Vehicles</h2>
          <p className="text-gray-400 text-sm mt-2">
            View your favorite cars.
          </p>
        </div>

        <div className="bg-black/40 border border-gray-700 rounded-xl p-5">
          <h2 className="text-lg text-amber-400">Test Drives</h2>
          <p className="text-gray-400 text-sm mt-2">
            Manage scheduled test drives.
          </p>
        </div>

      </div>
    </div>
  );
}