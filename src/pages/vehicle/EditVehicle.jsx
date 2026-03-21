import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import vehicleService from "../../services/vehicleService";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import Loader from "../../components/common/Loader";
import Card from "../../components/common/Card";
import { Save, ArrowLeft, RefreshCw } from "lucide-react";

const EditVehicle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  
  const [formData, setFormData] = useState({
    make: "",
    model: "",
    year: "",
    price: "",
    mileage: "",
    fuelType: "",
    transmission: "",
    description: "",
    imageUrl: ""
  });

  // Fetch existing data on mount
  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        const res = await vehicleService.getVehicleById(id);
        const data = res.data;
        setFormData({
          make: data.make || "",
          model: data.model || "",
          year: data.year || "",
          price: data.price || "",
          mileage: data.mileage || "",
          fuelType: data.fuelType || "",
          transmission: data.transmission || "",
          description: data.description || "",
          imageUrl: data.imageUrl || ""
        });
      } catch (err) {
        alert("Could not load vehicle data.");
        navigate(-1);
      } finally {
        setLoading(false);
      }
    };
    fetchVehicle();
  }, [id, navigate]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      await vehicleService.updateVehicle(id, formData);
      alert("Listing Updated Successfully!");
      navigate(`/vehicle/${id}`);
    } catch (err) {
      alert("Update failed. Please check your inputs.");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <Loader fullScreen />;

  return (
    <div className="min-h-screen bg-[#0D0D0D] p-8 flex justify-center">
      <div className="max-w-4xl w-full">
        <button 
          onClick={() => navigate(-1)} 
          className="text-gray-500 hover:text-[#D4AF37] mb-6 flex items-center gap-2 transition-all"
        >
          <ArrowLeft size={18} /> Discard Changes
        </button>

        <Card className="border-[#D4AF37]/20 shadow-2xl p-10">
          <header className="mb-10">
            <h1 className="text-4xl font-bold text-white uppercase tracking-widest">
              Modify <span className="text-[#D4AF37]">Listing</span>
            </h1>
            <p className="text-gray-500 mt-2 text-sm italic">Update the details for your luxury asset.</p>
          </header>

          <form onSubmit={handleUpdate} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Input 
                label="Make" 
                value={formData.make}
                onChange={(e) => setFormData({...formData, make: e.target.value})}
                required 
              />
              <Input 
                label="Model" 
                value={formData.model}
                onChange={(e) => setFormData({...formData, model: e.target.value})}
                required 
              />
              <Input 
                label="Year" 
                type="number"
                value={formData.year}
                onChange={(e) => setFormData({...formData, year: e.target.value})}
                required 
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input 
                label="Price ($)" 
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
                required 
              />
              <Input 
                label="Mileage (km)" 
                type="number"
                value={formData.mileage}
                onChange={(e) => setFormData({...formData, mileage: e.target.value})}
                required 
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <Input 
                label="Fuel Type" 
                value={formData.fuelType}
                onChange={(e) => setFormData({...formData, fuelType: e.target.value})}
              />
              <Input 
                label="Image URL" 
                value={formData.imageUrl}
                onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
              />
            </div>

            <Input 
              label="Description" 
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="h-32"
              required
            />

            <div className="pt-6 border-t border-gray-800 flex gap-4">
              <Button 
                type="submit" 
                className="flex-1 py-4 text-lg font-bold flex items-center justify-center gap-2"
                disabled={updating}
              >
                {updating ? <RefreshCw className="animate-spin" size={20} /> : <Save size={20} />}
                SAVE CHANGES
              </Button>
              <Button 
                variant="outline" 
                onClick={() => navigate(-1)}
                className="px-10"
              >
                CANCEL
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default EditVehicle;