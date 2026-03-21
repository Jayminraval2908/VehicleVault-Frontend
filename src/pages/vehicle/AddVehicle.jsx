import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import vehicleService from "../../services/vehicleService";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import Loader from "../../components/common/Loader";
import Card from "../../components/common/Card";
import { Car, Image as ImageIcon, Plus, ArrowLeft } from "lucide-react";
import { toast } from "react-toastify";

const AddVehicle = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    make: "",
    model: "",
    year: "",
    price: "",
    mileage: "",
    fuelType: "Petrol",
    transmission: "Automatic",
    description: "",
    imageUrl: "" // Assuming URL for now, or you can integrate ImageUpload.jsx
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const submissionData = {
        ...formData,
        year: Number(formData.year),
        price: Number(formData.price),
        mileage: Number(formData.mileage)
      };

      if (isNaN(submissionData.year) || isNaN(submissionData.price)) {
        toast.error("Please enter valid numbers for Year, Price, and Mileage.");
        setLoading(false);
        return;
      }
      await vehicleService.addVehicle(formData);
      toast.success("Vehicle Listed in the Vault Successfully!");
      navigate("/seller/dashboard");
    } catch (err) {
      toast.error("Error creating listing. Check all fields.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader fullScreen />;

  return (
    <div className="min-h-screen bg-[#0D0D0D] p-8 flex justify-center">
      <div className="max-w-4xl w-full">
        <button onClick={() => navigate(-1)} className="text-gray-500 hover:text-[#D4AF37] mb-6 flex items-center gap-2 transition-all">
          <ArrowLeft size={18} /> Back to Dashboard
        </button>

        <Card className="border-[#D4AF37]/20 shadow-2xl p-10">
          <header className="mb-10 text-center">
            <h1 className="text-4xl font-bold text-white uppercase tracking-widest">
              List Your <span className="text-[#D4AF37]">Asset</span>
            </h1>
            <p className="text-gray-500 mt-2 italic text-sm">Provide the details for your luxury vehicle listing.</p>
          </header>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* General Specs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Input 
                label="Make (Brand)" 
                placeholder="e.g. Lamborghini" 
                value={formData.make}
                onChange={(e) => setFormData({...formData, make: e.target.value})}
                required 
              />
              <Input 
                label="Model" 
                placeholder="e.g. Aventador" 
                value={formData.model}
                onChange={(e) => setFormData({...formData, model: e.target.value})}
                required 
              />
              <Input 
                label="Year" 
                type="number"
                placeholder="2024" 
                value={formData.year}
                onChange={(e) => setFormData({...formData, year: e.target.value})}
                required 
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input 
                label="Price ($)" 
                type="number"
                placeholder="500000" 
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
                required 
              />
              <Input 
                label="Mileage (km)" 
                type="number"
                placeholder="1200" 
                value={formData.mileage}
                onChange={(e) => setFormData({...formData, mileage: e.target.value})}
                required 
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <Input 
                label="Fuel Type" 
                placeholder="Petrol / Hybrid / Electric" 
                value={formData.fuelType}
                onChange={(e) => setFormData({...formData, fuelType: e.target.value})}
              />
              <Input 
                label="Image URL" 
                placeholder="https://image-link.com" 
                value={formData.imageUrl}
                onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
              />
            </div>

            <Input 
              label="Description" 
              placeholder="Tell us about the history, condition, and special features..." 
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="h-32"
              required
            />

            <div className="pt-6 border-t border-gray-800">
              <Button type="submit" className="w-full py-4 text-lg font-bold flex items-center justify-center gap-2">
                <Plus size={20} /> PUBLISH TO MARKETPLACE
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default AddVehicle;