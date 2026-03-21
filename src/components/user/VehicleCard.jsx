// import React from "react";
// import Card from "../common/Card";
// import Button from "../common/Button";

// export default function VehicleCard({ vehicle, onView, onEdit, onDelete }) {
//   return (
//     <Card className="overflow-hidden">
      
//       {/* IMAGE */}
//       <div className="w-full h-48 bg-black rounded-xl overflow-hidden">
//         <img
//           src={vehicle?.images?.[0] || "/no-image.png"}
//           alt="vehicle"
//           className="w-full h-full object-cover hover:scale-105 transition duration-300"
//         />
//       </div>

//       {/* DETAILS */}
//       <div className="mt-4 flex flex-col gap-2">
        
//         <h2 className="text-lg font-semibold text-white">
//           {vehicle.make} {vehicle.model}
//         </h2>

//         <p className="text-gray-400 text-sm">
//           {vehicle.year} • {vehicle.fuel_type} • {vehicle.transmission}
//         </p>

//         <p className="text-[#D4AF37] font-bold text-lg">
//           ₹ {vehicle.price}
//         </p>

//         <p className="text-gray-500 text-sm">
//           {vehicle.location}
//         </p>
//       </div>

//       {/* ACTION BUTTONS */}
//       <div className="mt-4 flex gap-2 flex-wrap">
        
//         <Button onClick={() => onView(vehicle)}>
//           View
//         </Button>

//         {onEdit && (
//           <Button variant="outline" onClick={() => onEdit(vehicle)}>
//             Edit
//           </Button>
//         )}

//         {onDelete && (
//           <Button variant="danger" onClick={() => onDelete(vehicle._id)}>
//             Delete
//           </Button>
//         )}
//       </div>

//     </Card>
//   );
// }

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
          ${vehicle.price?.toLocaleString()}
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-white font-bold uppercase tracking-tight">{vehicle.make} {vehicle.model}</h3>
        <div className="flex justify-between mt-3 text-xs text-gray-500 border-t border-gray-800 pt-3">
          <span className="flex items-center gap-1"><Gauge size={12}/> {vehicle.mileage}km</span>
          <span className="flex items-center gap-1"><Fuel size={12}/> {vehicle.fuelType}</span>
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