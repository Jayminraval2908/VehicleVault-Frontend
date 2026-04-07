import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { Plus, Car, MessageSquare, Trash2, Edit3, ExternalLink } from "lucide-react";
import Loader from "../../components/common/Loader";
import { toast } from "react-toastify";

const MyGarage = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMyVehicles();
  }, []);

  const fetchMyVehicles = async () => {
    try {
      const token = localStorage.getItem("token");
      // 🚩 Important: This route must be filtered by seller_id on the backend
      const res = await axios.get("/vehicles/my-garage", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setVehicles(res.data.data || res.data);
    } catch (err) {
      toast.error("Failed to load your garage.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delist this vehicle from the Vault?")) {
      try {
        await axios.delete(`/vehicles/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });
        setVehicles(prev => prev.filter(v => v._id !== id));
        toast.success("Vehicle removed from inventory.");
      } catch (err) {
        toast.error("Delete failed.");
      }
    }
  };

  if (loading) return <Loader fullScreen />;

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER SECTION */}
        <div className="flex justify-between items-end mb-12">
          <div>
            <h1 className="text-4xl font-black tracking-tighter uppercase">
              My <span className="text-amber-500">Garage</span>
            </h1>
            <p className="text-gray-500 text-sm mt-2 italic">Manage your active luxury listings</p>
          </div>
          
          <Link to="/seller/add-vehicle">
            <button className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-black px-6 py-3 rounded-xl font-bold uppercase text-xs tracking-widest transition-all active:scale-95 shadow-lg shadow-amber-500/20">
              <Plus size={18} /> Add Vehicle
            </button>
          </Link>
        </div>

        {/* 🚩 NEW SELLER / EMPTY STATE */}
        {vehicles.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 border border-dashed border-gray-800 rounded-[2rem] bg-white/5 backdrop-blur-sm">
            <div className="bg-amber-500/10 p-6 rounded-full mb-6">
              <Car size={48} className="text-amber-500 opacity-50" />
            </div>
            <h2 className="text-2xl font-bold text-gray-300">Your Garage is Empty</h2>
            <p className="text-gray-600 mt-2 mb-8 max-w-xs text-center">
              You haven't listed any premium assets in the marketplace yet.
            </p>
            <Link to="/seller/add-vehicle">
              <button className="text-amber-500 border border-amber-500/30 px-8 py-3 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-amber-500 hover:text-black transition-all">
                List Your First Car
              </button>
            </Link>
          </div>
        ) : (
          /* GRID VIEW FOR EXISTING VEHICLES */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {vehicles.map((car) => (
              <div key={car._id} className="group bg-[#121212] border border-gray-800 rounded-3xl overflow-hidden hover:border-amber-500/50 transition-all duration-500">
                
                {/* Image Placeholder or Actual Image */}
                <div className="h-48 bg-gray-900 relative overflow-hidden">
                  <img 
                    src={car.images?.[0] || "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=800&q=80"} 
                    alt={car.model}
                    className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700"
                  />
                  <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                    <span className="text-[10px] font-black uppercase text-amber-500 tracking-widest">${car.price?.toLocaleString()}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-lg font-bold text-white uppercase tracking-tight">{car.make} {car.model}</h3>
                  <div className="flex gap-4 mt-2 mb-6">
                    <span className="text-[10px] text-gray-500 uppercase font-bold px-2 py-1 bg-gray-800 rounded">{car.year}</span>
                    <span className="text-[10px] text-gray-500 uppercase font-bold px-2 py-1 bg-gray-800 rounded">{car.fuel_type}</span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-800">
                    <div className="flex gap-2">
                      <button 
                        onClick={() => navigate(`/seller/edit-vehicle/${car._id}`)}
                        className="p-2 text-gray-500 hover:text-amber-500 hover:bg-amber-500/10 rounded-lg transition-colors"
                      >
                        <Edit3 size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(car._id)}
                        className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                    
                    <Link to={`/vehicle/${car._id}`}>
                      <button className="flex items-center gap-2 text-[10px] font-black text-gray-400 hover:text-white transition-colors uppercase tracking-widest">
                        View Public <ExternalLink size={12} />
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyGarage;