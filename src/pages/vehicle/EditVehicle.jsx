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
  const [selectedFiles, setSelectedFiles] = useState([]);

  const [formData, setFormData] = useState({
    make: "",
    model: "",
    year: "",
    price: "",
    mileage: "",
    fuelType: "",
    transmission: "",
    description: "",
    images: []
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
      const data = new FormData();

      data.append("make", formData.make);
      data.append("model", formData.model);
      data.append("year", Number(formData.year));
      data.append("price", Number(formData.price));
      data.append("mileage", Number(formData.mileage));
      data.append("fuelType", formData.fuelType);
      data.append("transmission", formData.transmission);
      data.append("description", formData.description);

      formData.images.forEach((img) => data.append("existingImages", img));

      selectedFiles.forEach((file) => {
        data.append("images", file);
      });

      await vehicleService.updateVehicle(id, data);

      toast.success("Listing Updated Successfully!");
      navigate(`/vehicle/${id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed.");
    } finally {
      setUpdating(false);
    }
  };

  const removeExistingImage = (indexToRemove) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== indexToRemove)
    });
  };

  if (loading) return <Loader fullScreen />;

  return (
    <div className="min-h-screen bg-[#0D0D0D] p-4 sm:p-6 md:p-8 flex justify-center">
      <div className="w-full max-w-5xl">

        {/* BACK BUTTON */}
        <button
          onClick={() => navigate(-1)}
          className="text-gray-500 hover:text-[#D4AF37] mb-6 flex items-center gap-2 text-sm sm:text-base"
        >
          <ArrowLeft size={18} /> Back
        </button>

        <Card className="p-4 sm:p-6 md:p-10">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 text-white">
            Edit <span className="text-[#D4AF37]">Vehicle</span>
          </h1>

          <form onSubmit={handleUpdate} className="space-y-6">

            {/* BASIC INFO */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
              <Input label="Make" value={formData.make} onChange={(e) => setFormData({ ...formData, make: e.target.value })} />
              <Input label="Model" value={formData.model} onChange={(e) => setFormData({ ...formData, model: e.target.value })} />
              <Input label="Year" type="number" value={formData.year} onChange={(e) => setFormData({ ...formData, year: e.target.value })} />
            </div>

            {/* IMAGE GALLERY */}
            <div>
              <label className="text-xs text-gray-500 uppercase">Current Images</label>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mt-3">
                {formData.images.map((img, index) => (
                  <div key={index} className="relative aspect-video rounded overflow-hidden border border-gray-700">

                    <img src={img} className="w-full h-full object-cover" />

                    <button
                      type="button"
                      onClick={() => removeExistingImage(index)}
                      className="absolute top-1 right-1 bg-red-600 p-1 rounded-full"
                    >
                      <X size={14} />
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        const imgs = [...formData.images];
                        const selected = imgs.splice(index, 1);
                        imgs.unshift(selected[0]);
                        setFormData({ ...formData, images: imgs });
                      }}
                      className="absolute bottom-1 left-1 bg-[#D4AF37] text-black text-[10px] px-2 py-1 rounded"
                    >
                      Cover
                    </button>

                  </div>
                ))}
              </div>

              {/* FILE INPUT */}
              <input
                type="file"
                multiple
                onChange={(e) => setSelectedFiles(Array.from(e.target.files))}
                className="mt-4 w-full bg-[#111] border border-gray-700 p-3 rounded"
              />
            </div>

            {/* PRICE + MILEAGE */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="Price" type="number" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} />
              <Input label="Mileage" type="number" value={formData.mileage} onChange={(e) => setFormData({ ...formData, mileage: e.target.value })} />
            </div>

            {/* FUEL + TRANSMISSION */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="Fuel Type" value={formData.fuelType} onChange={(e) => setFormData({ ...formData, fuelType: e.target.value })} />

              <select
                className="bg-[#1a1a1a] border border-gray-700 p-3 rounded text-white"
                value={formData.transmission}
                onChange={(e) => setFormData({ ...formData, transmission: e.target.value })}
              >
                <option value="">Transmission</option>
                <option>Automatic</option>
                <option>Manual</option>
              </select>
            </div>

            {/* DESCRIPTION */}
            <textarea
              placeholder="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full h-28 sm:h-32 bg-[#1a1a1a] border border-gray-700 rounded p-3 text-white"
            />

            {/* BUTTONS */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button type="submit" className="flex-1 flex items-center justify-center gap-2">
                {updating ? <RefreshCw className="animate-spin" /> : <Save />}
                Save
              </Button>

              <Button
                variant="outline"
                onClick={() => navigate(-1)}
                className="flex-1 sm:flex-none"
              >
                Cancel
              </Button>
            </div>

          </form>
        </Card>
      </div>
    </div>
  );
};

export default EditVehicle;