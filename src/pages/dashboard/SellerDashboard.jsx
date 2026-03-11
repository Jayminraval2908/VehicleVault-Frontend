import React from "react";

export default function SellerDashboard() {
  return (
    <div className="p-6 text-gray-200">

      <h1 className="text-3xl font-bold text-amber-400 mb-4">
        Seller Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <div className="bg-black/40 border border-gray-700 rounded-xl p-5">
          <h2 className="text-lg text-amber-400">Add Vehicle</h2>
          <p className="text-gray-400 text-sm mt-2">
            List your car for sale.
          </p>
        </div>

        <div className="bg-black/40 border border-gray-700 rounded-xl p-5">
          <h2 className="text-lg text-amber-400">My Listings</h2>
          <p className="text-gray-400 text-sm mt-2">
            Manage your vehicle listings.
          </p>
        </div>

        <div className="bg-black/40 border border-gray-700 rounded-xl p-5">
          <h2 className="text-lg text-amber-400">Buyer Requests</h2>
          <p className="text-gray-400 text-sm mt-2">
            View inquiries from buyers.
          </p>
        </div>

      </div>

    </div>
  );
}