import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import vehicleService from "../../services/vehicleService";
import Loader from "../../components/common/Loader";
import Button from "../../components/common/Button";
import Card from "../../components/common/Card";
import { Fuel, Gauge, Eye, ArrowUpRight } from "lucide-react";

const VehicleList = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const data = await vehicleService.getAllVehicles();

        // ✅ only approved vehicles visible in marketplace
        const approvedVehicles = data.filter(
          (v) => v.status === "Approved"
        );

        setVehicles(approvedVehicles);
        console.log("🔥 Vehicles:", data);
      } catch (err) {
        console.error("Failed to load collection", err);
      } finally {
        setLoading(false);
      }
    };
    fetchVehicles();
  }, []);

  if (loading) return <Loader fullScreen />;

  return (
    <div className="min-h-screen bg-[#0D0D0D] p-8">
      {/* SECTION HEADER */}
      <div className="max-w-7xl mx-auto mb-12 flex flex-col md:flex-row justify-between items-end gap-4">
        <div>
          <h2 className="text-[#D4AF37] text-xs font-black uppercase tracking-[0.4em] mb-2">
            The Vault
          </h2>
          <h1 className="text-5xl font-black text-white uppercase tracking-tighter">
            Premier <span className="text-gray-500">Collection</span>
          </h1>
        </div>
        <p className="text-gray-500 text-sm max-w-xs text-right italic">
          Curated excellence. Every vehicle in our vault is certified for performance and luxury.
        </p>
      </div>

      {/* GRID LAYOUT */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {vehicles.length === 0 ? (
          <div className="col-span-full py-20 text-center border border-dashed border-gray-800 rounded-3xl">
            <p className="text-gray-600 italic">Our vault is currently being updated. Check back soon.</p>
          </div>
        ) : (
          vehicles.map((car) => (

            <Card key={car._id} className="group p-0 overflow-hidden border-gray-900 bg-[#111111]">
              {/* Image Container */}
              <div className="relative aspect-[16/10] overflow-hidden">
                <img
                  src={
                    car.coverImage ||
                    (car.images && car.images.length > 0 ? car.images[0] : "https://images.unsplash.com/photo-1503376780353-7e6692767b70")
                  }
                  alt={car.model}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0D] via-transparent to-transparent opacity-80" />

                {/* Price Tag Overlay */}
                <div className="absolute bottom-4 left-4">
                  <span className="text-2xl font-black text-[#D4AF37]">
                    ${car.price?.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white uppercase tracking-tight">
                      {car.make} {car.model}
                    </h3>
                    <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                      Year: {car.year}
                    </span>
                  </div>
                  <Link to={`/vehicle/${car._id}`}>
                    <div className="bg-[#D4AF37]/10 p-2 rounded-lg text-[#D4AF37] group-hover:bg-[#D4AF37] group-hover:text-black transition-all">
                      <ArrowUpRight size={20} />
                    </div>
                  </Link>
                </div>

                {/* Quick Specs */}
                <div className="flex items-center gap-6 py-4 border-t border-gray-800/50">
                  <div className="flex items-center gap-2 text-gray-400 text-xs">
                    <Gauge size={14} className="text-[#D4AF37]" />
                    <span>{car.mileage} km</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400 text-xs">
                    <Fuel size={14} className="text-[#D4AF37]" />
                    <span>{car.fuel_type || car.fuelType || "Not Specified"}</span>
                  </div>
                </div>

                <Link to={`/vehicle/${car._id}`} className="block mt-2">
                  <Button variant="outline" className="w-full py-3 flex items-center justify-center gap-2 text-xs">
                    <Eye size={14} /> VIEW DETAILS
                  </Button>
                </Link>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default VehicleList;