import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import vehicleService from "../../services/vehicleService";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import Loader from "../../components/common/Loader";
import Card from "../../components/common/Card";
import { Save, ArrowLeft, RefreshCw, X } from "lucide-react";
import { toast } from "react-toastify";

const EditVehicle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]); // New state for file uploads

  const [formData, setFormData] = useState({
    make: "",
    model: "",
    year: "",
    price: "",
    mileage: "",
    fuelType: "",
    transmission: "",
    description: "",
    images: [] // Changed from imageUrl to images array
  });

  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        const res = await vehicleService.getVehicleById(id);
        const data = res.data?.data || res.data;
        if (data) {
          setFormData({
            make: data.make || "",
            model: data.model || "",
            year: data.year || "",
            price: data.price || "",
            mileage: data.mileage || "",
            fuelType: data.fuelType || "",
            transmission: data.transmission || "",
            description: data.description || "",
            images: data.images || []
          });
        }
      } catch (err) {
        toast.error("Could not load vehicle data.");
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
      // 🚩 Use FormData because we are sending files
      const data = new FormData();

      // Append text fields
      data.append("make", formData.make);
      data.append("model", formData.model);
      data.append("year", Number(formData.year));
      data.append("price", Number(formData.price));
      data.append("mileage", Number(formData.mileage));
      data.append("fuelType", formData.fuelType);
      data.append("transmission", formData.transmission);
      data.append("description", formData.description);

      // Append existing images (as a stringified array or individual items)
      // This tells the backend which old images to KEEP
      formData.images.forEach((img) => data.append("existingImages", img));

      // Append new files
      if (selectedFiles.length > 0) {
        selectedFiles.forEach((file) => {
          data.append("images", file); // Must match backend upload.array("images")
        });
      }

      await vehicleService.updateVehicle(id, data);

      toast.success("Listing Updated Successfully!");
      navigate(`/vehicle/${id}`);
    } catch (err) {
      console.error("Update Error:", err.response?.data);
      toast.error(err.response?.data?.message || "Update failed.");
    } finally {
      setUpdating(false);
    }
  };

  // Function to remove an existing image from the state before saving
  const removeExistingImage = (indexToRemove) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, index) => index !== indexToRemove)
    });
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
          </header>

          <form onSubmit={handleUpdate} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Input label="Make" value={formData.make} onChange={(e) => setFormData({ ...formData, make: e.target.value })} required />
              <Input label="Model" value={formData.model} onChange={(e) => setFormData({ ...formData, model: e.target.value })} required />
              <Input label="Year" type="number" value={formData.year} onChange={(e) => setFormData({ ...formData, year: e.target.value })} required />
            </div>

            {/* --- IMAGE MANAGEMENT SECTION --- */}
            <div className="space-y-4">
              <label className="text-[10px] uppercase font-bold tracking-widest text-gray-500">
                Current Gallery
              </label>
              <div className="grid grid-cols-4 gap-4">
                {formData.images.map((img, index) => (
                  <div key={index} className="relative aspect-video rounded-lg overflow-hidden border border-gray-800">

                    <img src={img} alt="Vehicle" className="w-full h-full object-cover" />

                    {/* ❌ Remove Image */}
                    <button
                      type="button"
                      onClick={() => removeExistingImage(index)}
                      className="absolute top-1 right-1 bg-red-600 p-1 rounded-full text-white hover:bg-red-700 transition"
                    >
                      <X size={14} />
                    </button>

                    {/* ✅ SET COVER BUTTON */}
                    <button
                      type="button"
                      onClick={() => {
                        const newImages = [...formData.images];
                        const selected = newImages.splice(index, 1);
                        newImages.unshift(selected[0]); // move selected to first
                        setFormData({ ...formData, images: newImages });
                      }}
                      className="absolute bottom-1 left-1 bg-[#D4AF37] text-black text-[10px] px-2 py-1 rounded"
                    >
                      Set Cover
                    </button>

                  </div>
                ))}
              </div>

              <div className="mt-4">
                <label className="text-sm text-gray-400 mb-2 block">Upload New Images</label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => setSelectedFiles(Array.from(e.target.files))}
                  className="w-full bg-[#111] border border-gray-700 p-3 rounded-lg text-white text-sm"
                />
                <p className="text-[10px] text-gray-600 mt-2">Uploading new images will add them to the existing gallery.</p>
              </div>
            </div>
            {/* ------------------------------- */}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input label="Price (rs.)" type="number" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} required />
              <Input label="Mileage (km)" type="number" value={formData.mileage} onChange={(e) => setFormData({ ...formData, mileage: e.target.value })} required />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input label="Fuel Type" value={formData.fuelType} onChange={(e) => setFormData({ ...formData, fuelType: e.target.value })} />
              <div className="flex flex-col">
                <label className="text-[10px] uppercase font-bold tracking-widest text-gray-500 mb-2">Transmission</label>
                <select
                  className="bg-[#1a1a1a] border border-gray-800 rounded-lg p-3 text-white focus:border-[#D4AF37] outline-none transition-all"
                  value={formData.transmission}
                  onChange={(e) => setFormData({ ...formData, transmission: e.target.value })}
                >
                  <option value="">Select Transmission</option>
                  <option value="Automatic">Automatic</option>
                  <option value="Manual">Manual</option>
                </select>
              </div>
            </div>

            <Input label="Description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="h-32" required />

            <div className="pt-6 border-t border-gray-800 flex gap-4">
              <Button type="submit" className="flex-1 py-4 text-lg font-bold flex items-center justify-center gap-2" disabled={updating}>
                {updating ? <RefreshCw className="animate-spin" size={20} /> : <Save size={20} />}
                SAVE CHANGES
              </Button>
              <Button variant="outline" onClick={() => navigate(-1)} className="px-10">CANCEL</Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default EditVehicle; 