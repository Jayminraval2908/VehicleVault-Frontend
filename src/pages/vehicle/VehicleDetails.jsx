import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import vehicleService from "../../services/vehicleService";
import Button from "../../components/common/Button";
import Loader from "../../components/common/Loader";
import Card from "../../components/common/Card";
import { 
  ChevronLeft, 
  Gauge, 
  Fuel, 
  Settings, 
  Calendar, 
  MessageSquare, 
  DollarSign, 
  ClipboardCheck, 
  CarFront 
} from "lucide-react";

const VehicleDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      if (!id || id === "add") {
        setLoading(false);
        return;
      }
      try {
        const data = await vehicleService.getVehicleById(id);
        setVehicle(data.data);
      } catch (err) {
        console.error("Error fetching vehicle details", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  if (loading) return <Loader fullScreen />;
  if (!vehicle) return <div className="text-white text-center mt-20">Vehicle not found.</div>;

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white pb-20">
      {/* HEADER NAVIGATION */}
      <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-2 text-gray-500 hover:text-[#D4AF37] transition-all"
        >
          <ChevronLeft size={20} /> Back to Collection
        </button>
        <div className="text-xs uppercase tracking-[0.3em] text-gray-500">
          Ref: <span className="text-white">{vehicle._id ? vehicle._id.slice(-8) : 'Pending...'}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-12">
        
        {/* LEFT COLUMN: IMAGES & SPECS */}
        <div className="lg:col-span-2 space-y-8">
          {/* Main Image Container */}
          <div className="relative group overflow-hidden rounded-3xl border border-gray-800 bg-[#111111] aspect-video">
            <img 
              src={vehicle.imageUrl || "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=1000"} 
              alt={vehicle.model}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute top-6 left-6 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 text-[#D4AF37] font-bold text-sm">
              NEW ARRIVAL
            </div>
          </div>

          {/* Title & Description */}
          <div>
            <h1 className="text-5xl font-black uppercase tracking-tighter mb-4">
              {vehicle.make} <span className="text-[#D4AF37]">{vehicle.model}</span>
            </h1>
            <p className="text-gray-400 text-lg leading-relaxed max-w-2xl">
              {vehicle.description || "Experience the pinnacle of automotive engineering. This vehicle has been meticulously maintained and is ready for its next connoisseur."}
            </p>
          </div>

          {/* Specs Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <SpecBox icon={<Calendar size={18}/>} label="Year" value={vehicle.year} />
            <SpecBox icon={<Gauge size={18}/>} label="Mileage" value={`${vehicle.mileage} KM`} />
            <SpecBox icon={<Fuel size={18}/>} label="Fuel" value={vehicle.fuelType} />
            <SpecBox icon={<Settings size={18}/>} label="Drive" value={vehicle.transmission} />
          </div>
        </div>

        {/* RIGHT COLUMN: ACTION SIDEBAR */}
        <div className="space-y-6">
          <Card className="border-[#D4AF37]/30 shadow-2xl sticky top-10">
            <div className="mb-6">
              <span className="text-gray-500 text-xs uppercase tracking-widest block mb-1">Current Value</span>
              <h2 className="text-4xl font-bold text-[#D4AF37]">
                ${vehicle.price?.toLocaleString()}
              </h2>
            </div>

            <div className="space-y-3">
              <Link to={`/inquiry/send/${vehicle._id}`}>
                <Button className="w-full flex justify-center gap-3 py-4">
                  <MessageSquare size={18} /> INQUIRE NOW
                </Button>
              </Link>
              
              <Link to={`/offer/send/${vehicle._id}`}>
                <Button variant="outline" className="w-full flex justify-center gap-3 py-4">
                  <DollarSign size={18} /> MAKE AN OFFER
                </Button>
              </Link>

              <Link to={`/testdrive/book/${vehicle._id}`}>
                <Button variant="ghost" className="w-full flex justify-center gap-3 py-4">
                  <CarFront size={18} /> BOOK TEST DRIVE
                </Button>
              </Link>
            </div>

            <hr className="my-8 border-gray-800" />

            <Link to={`/inspection/vehicle/${vehicle._id}`} className="flex items-center justify-between group">
               <div className="flex items-center gap-3">
                  <ClipboardCheck className="text-green-500" size={20} />
                  <span className="text-sm font-semibold group-hover:text-[#D4AF37] transition">Inspection Report</span>
               </div>
               <span className="text-xs text-gray-500 bg-gray-800 px-2 py-1 rounded">VIEW</span>
            </Link>
          </Card>

          <div className="p-6 border border-gray-800 rounded-2xl bg-[#0D0D0D]">
            <h4 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-2">Seller Notes</h4>
            <p className="text-xs text-gray-500 italic">"This vehicle includes a 12-month luxury warranty and free home delivery within 50 miles."</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// HELPER COMPONENT FOR SPECS
const SpecBox = ({ icon, label, value }) => (
  <div className="bg-[#111111] border border-gray-800 p-4 rounded-2xl flex flex-col items-center justify-center text-center">
    <div className="text-[#D4AF37] mb-2">{icon}</div>
    <span className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">{label}</span>
    <span className="text-sm font-bold text-white uppercase">{value}</span>
  </div>
);

export default VehicleDetails;