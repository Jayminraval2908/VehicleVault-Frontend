import React from "react";
import { X, Check, Trash2, Clock } from "lucide-react";

const PendingVehicle = ({ isOpen, onClose, vehicles, onApprove, onReject }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      {/* Drawer Content */}
      <div className="relative w-full max-w-md bg-[#111] border-l border-gray-800 h-full shadow-2xl flex flex-col">
        <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-[#0D0D0D]">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Clock className="text-amber-500" size={20} />
              Pending <span className="text-amber-500">Approvals</span>
            </h2>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">
              {vehicles.length} Vehicles Awaiting Review
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-gray-400">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {vehicles.length === 0 ? (
            <div className="text-center py-20 text-gray-600 italic">No pending requests</div>
          ) : (
            vehicles.map((v) => (
              <div key={v._id} className="p-4 bg-white/5 border border-gray-800 rounded-2xl group hover:border-amber-500/30 transition-all">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-bold text-white uppercase tracking-tight">{v.make} {v.model}</h3>
                    <p className="text-[10px] text-gray-500">{v.year} • {v.fuel_type}</p>
                  </div>
                  <span className="text-amber-500 font-bold text-xs">₹{v.price?.toLocaleString()}</span>
                </div>

                <div className="flex gap-2 mt-4">
                  <button 
                    onClick={() => onApprove(v._id)}
                    className="flex-1 bg-green-600/10 hover:bg-green-600 text-green-500 hover:text-white py-2 rounded-xl text-[10px] font-black uppercase transition-all flex items-center justify-center gap-1"
                  >
                    <Check size={14} /> Approve
                  </button>
                  <button 
                    onClick={() => onReject(v._id)}
                    className="flex-1 bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white py-2 rounded-xl text-[10px] font-black uppercase transition-all flex items-center justify-center gap-1"
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