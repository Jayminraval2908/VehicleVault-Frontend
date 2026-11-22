import React from "react";
import { X, Check, Trash2, Clock } from "lucide-react";
import { display } from "../../utils/theme";

const PendingVehicle = ({ isOpen, onClose, vehicles, onApprove, onReject }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="relative flex h-full w-full max-w-md flex-col border-l border-white/10 bg-[#0A1628] shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 bg-[#0D1D33] p-6">
          <div>
            <h2
              className="flex items-center gap-2 text-xl font-bold text-white"
              style={display}
            >
              <Clock className="text-[#2DD4BF]" size={20} />
              Pending <span className="text-[#2DD4BF]">Approvals</span>
            </h2>
            <p className="mt-1 text-[10px] uppercase tracking-widest text-[#8EA0B5]">
              {vehicles.length} Vehicles Awaiting Review
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-[#8EA0B5] transition hover:bg-white/5 hover:text-white"
          >
            <X size={24} />
          </button>
        </div>

        {/* List */}
        <div className="flex-1 space-y-4 overflow-y-auto p-6">
          {vehicles.length === 0 ? (
            <div className="py-20 text-center italic text-[#8EA0B5]">
              No pending requests
            </div>
          ) : (
            vehicles.map((v) => (
              <div
                key={v._id}
                className="group rounded-2xl border border-white/10 bg-[#102238] p-4 transition-all hover:border-[#2DD4BF]/30"
              >
                <div className="mb-3 flex items-start justify-between">
                  <div>
                    <h3 className="font-bold uppercase tracking-tight text-white">
                      {v.make} {v.model}
                    </h3>
                    <p className="text-[10px] text-[#8EA0B5]">
                      {v.year} • {v.fuel_type}
                    </p>
                  </div>
                  <span className="text-xs font-bold text-[#2DD4BF]">
                    ₹{v.price?.toLocaleString()}
                  </span>
                </div>

                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => onApprove(v._id)}
                    className="flex flex-1 items-center justify-center gap-1 rounded-xl bg-emerald-500/10 py-2 text-[10px] font-black uppercase text-emerald-400 transition-all hover:bg-emerald-500 hover:text-white"
                  >
                    <Check size={14} /> Approve
                  </button>
                  <button
                    onClick={() => onReject(v._id)}
                    className="flex flex-1 items-center justify-center gap-1 rounded-xl bg-red-500/10 py-2 text-[10px] font-black uppercase text-red-400 transition-all hover:bg-red-500 hover:text-white"
                  >
                    <Trash2 size={14} /> Reject
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default PendingVehicle;