import React from "react";
import { Link } from "react-router-dom";
import Card from "../common/Card";
import { Gauge, Fuel } from "lucide-react";

const VehicleCard = ({ vehicle }) => {
  return (
    <Card className="p-0 overflow-hidden group">
      <div className="relative h-48">
        <img
          src={vehicle.imageUrl || "https://images.unsplash.com/photo-1583121274602-3e2820c69888?q=80&w=1000"}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          alt={vehicle.model}
        />
        <div className="absolute bottom-2 right-2 bg-black/80 px-3 py-1 rounded text-[#D4AF37] font-bold">
          Rs {vehicle.price?.toLocaleString()}
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-white font-bold uppercase tracking-tight">{vehicle.make} {vehicle.model}</h3>
        <div className="flex justify-between mt-3 text-xs text-gray-500 border-t border-gray-800 pt-3">
          <span className="flex items-center gap-1"><Gauge size={12} /> {vehicle.mileage}km</span>
          <span className="flex items-center gap-1"><Fuel size={12} /> {vehicle.fuelType}</span>
        </div>
        <Link to={`/vehicle/${vehicle._id}`}>
          <button className="w-full mt-4 py-2 border border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black transition-all text-xs font-bold rounded-lg uppercase">
            View Asset
          </button>
        </Link>
      </div>
    </Card>
  );
};

export default VehicleCard;