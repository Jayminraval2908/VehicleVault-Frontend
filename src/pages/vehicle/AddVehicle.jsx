import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import vehicleService from "../../services/vehicleService";
import Loader from "../../components/common/Loader";
import { display, body, mono, focusRing } from "../../utils/theme";
import {
  Image as ImageIcon,
  Plus,
  ArrowLeft,
  Car,
  Upload,
  ShieldCheck,
} from "lucide-react";
import { toast } from "react-toastify";

const fieldClass =
  "w-full rounded-xl border border-white/15 bg-[#0A1628] px-4 py-3 text-sm text-white placeholder-[#8EA0B5] transition-colors focus:border-[#2DD4BF] focus:outline-none [color-scheme:dark]";

const labelClass =
  "mb-2 block text-xs font-medium uppercase tracking-wider text-[#8EA0B5]";

const fileInputClass =
  "w-full cursor-pointer rounded-xl border border-dashed border-white/20 bg-[#0A1628] px-4 py-3 text-xs text-[#C8D3E0] file:mr-3.5 file:rounded-lg file:border-0 file:bg-[#2DD4BF]/15 file:px-3.5 file:py-1.5 file:text-xs file:font-semibold file:text-[#2DD4BF] hover:border-[#2DD4BF]/50 file:hover:bg-[#2DD4BF]/25 sm:text-sm";

const AddVehicle = () => {
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();

  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState([]);
  const [coverFile, setCoverFile] = useState(null);

  const [formData, setFormData] = useState({
    make: "",
    model: "",
    year: "",
    price: "",
    mileage: "",
    fuel_type: "",
    transmission: "",
    owner_number: "1st Owner",
    rto_code: "",
    insurance_type: "Comprehensive",
    insurance_validity: "",
    description: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const form = new FormData();

      form.append("make", formData.make.trim());
      form.append("model", formData.model.trim());
      form.append("year", Number(formData.year));
      form.append("price", Number(formData.price));
      form.append("mileage", Number(formData.mileage));
      form.append("fuel_type", formData.fuel_type);
      form.append("transmission", formData.transmission);
      form.append("owner_number", formData.owner_number);
      form.append("rto_code", formData.rto_code.trim().toUpperCase());
      form.append("insurance_type", formData.insurance_type);
      if (formData.insurance_validity) {
        form.append("insurance_validity", formData.insurance_validity);
      }
      form.append("description", formData.description.trim());
      form.append("status", "draft");

      if (coverFile) {
        form.append("images", coverFile);
      }

      files.forEach((file) => {
        form.append("images", file);
      });

      await vehicleService.addVehicle(form);

      toast.success("Vehicle added to active inventory");
      navigate("/seller/dashboard");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Error creating listing");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader fullScreen label="Publishing vehicle..." />;

  return (
    <div
      style={body}
      className="relative min-h-screen overflow-x-clip bg-[#0A1628] px-4 py-6 text-[#C8D3E0] sm:px-6 lg:px-8 lg:py-10"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 top-0 h-80 w-80 rounded-full bg-[#2DD4BF]/10 blur-3xl"
      />

      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="relative mx-auto w-full max-w-4xl"
      >
        <button
          type="button"
          onClick={() => navigate(-1)}
          className={`mb-6 inline-flex items-center gap-2 rounded-xl border border-white/15 bg-[#0D1D33] px-3.5 py-2 text-xs font-semibold text-white transition-colors hover:border-[#2DD4BF]/50 hover:bg-[#102238] hover:text-[#2DD4BF] sm:text-sm ${focusRing}`}
        >
          <ArrowLeft size={17} />
          <span>Back to dashboard</span>
        </button>

        <div className="rounded-2xl border border-white/10 bg-[#0D1D33] p-5 shadow-xl sm:p-8 lg:p-10">
          <header className="mb-8 border-b border-white/10 pb-6 text-center sm:mb-10">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl border border-[#2DD4BF]/30 bg-[#2DD4BF]/10 text-[#2DD4BF]">
              <Car size={24} />
            </div>
            <h1
              style={display}
              className="text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl"
            >
              List Your <span className="text-[#2DD4BF]">Vehicle</span>
            </h1>
            <p className="mx-auto mt-2 max-w-md text-sm text-[#8EA0B5]">
              Provide verified ownership, RTO registration, insurance details,
              and clear photos for buyer trust.
            </p>
          </header>

          <form onSubmit={handleSubmit} className="space-y-7">
            {/* MAKE, MODEL, YEAR */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 md:grid-cols-3">
              <div>
                <label htmlFor="add-make" className={labelClass}>
                  Make (Brand)
                </label>
                <input
                  id="add-make"
                  type="text"
                  placeholder="e.g. Hyundai, ŠKODA"
                  value={formData.make}
                  onChange={(e) =>
                    setFormData({ ...formData, make: e.target.value })
                  }
                  className={`${fieldClass} ${focusRing}`}
                  required
                />
              </div>

              <div>
                <label htmlFor="add-model" className={labelClass}>
                  Model
                </label>
                <input
                  id="add-model"
                  type="text"
                  placeholder="e.g. Creta SX, Kushaq"
                  value={formData.model}
                  onChange={(e) =>
                    setFormData({ ...formData, model: e.target.value })
                  }
                  className={`${fieldClass} ${focusRing}`}
                  required
                />
              </div>

              <div className="sm:col-span-2 md:col-span-1">
                <label htmlFor="add-year" className={labelClass}>
                  Year
                </label>
                <input
                  id="add-year"
                  type="number"
                  min="1990"
                  max="2027"
                  placeholder="2024"
                  value={formData.year}
                  onChange={(e) =>
                    setFormData({ ...formData, year: e.target.value })
                  }
                  style={mono}
                  className={`${fieldClass} ${focusRing}`}
                  required
                />
              </div>
            </div>

            {/* PRICE & MILEAGE */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
              <div>
                <label htmlFor="add-price" className={labelClass}>
                  Price (₹)
                </label>
                <input
                  id="add-price"
                  type="number"
                  min="10000"
                  placeholder="1450000"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                  style={mono}
                  className={`${fieldClass} ${focusRing}`}
                  required
                />
              </div>

              <div>
                <label htmlFor="add-mileage" className={labelClass}>
                  Odometer / Mileage (km)
                </label>
                <input
                  id="add-mileage"
                  type="number"
                  min="0"
                  placeholder="18500"
                  value={formData.mileage}
                  onChange={(e) =>
                    setFormData({ ...formData, mileage: e.target.value })
                  }
                  style={mono}
                  className={`${fieldClass} ${focusRing}`}
                  required
                />
              </div>
            </div>

            {/* FUEL & TRANSMISSION */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
              <div>
                <label htmlFor="add-fuel" className={labelClass}>
                  Fuel Type
                </label>
                <select
                  id="add-fuel"
                  value={formData.fuel_type}
                  onChange={(e) =>
                    setFormData({ ...formData, fuel_type: e.target.value })
                  }
                  className={`${fieldClass} ${focusRing}`}
                  required
                >
                  <option value="">Select fuel type</option>
                  <option value="Petrol">Petrol</option>
                  <option value="Diesel">Diesel</option>
                  <option value="Electric">Electric</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="CNG">CNG</option>
                </select>
              </div>

              <div>
                <label htmlFor="add-transmission" className={labelClass}>
                  Transmission
                </label>
                <select
                  id="add-transmission"
                  value={formData.transmission}
                  onChange={(e) =>
                    setFormData({ ...formData, transmission: e.target.value })
                  }
                  className={`${fieldClass} ${focusRing}`}
                  required
                >
                  <option value="">Select transmission</option>
                  <option value="Manual">Manual</option>
                  <option value="Automatic">Automatic</option>
                </select>
              </div>
            </div>

            {/* OWNERSHIP, RTO & INSURANCE VERIFICATION */}
            <div className="rounded-2xl border border-white/10 bg-[#102238]/60 p-4 sm:p-6">
              <div className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-white">
                <ShieldCheck size={16} className="text-[#2DD4BF]" />
                <span>Registration &amp; History</span>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
                <div>
                  <label htmlFor="add-owner" className={labelClass}>
                    Ownership Number
                  </label>
                  <select
                    id="add-owner"
                    value={formData.owner_number}
                    onChange={(e) =>
                      setFormData({ ...formData, owner_number: e.target.value })
                    }
                    className={`${fieldClass} ${focusRing}`}
                    required
                  >
                    <option value="1st Owner">1st Owner</option>
                    <option value="2nd Owner">2nd Owner</option>
                    <option value="3rd Owner">3rd Owner</option>
                    <option value="4th+ Owner">4th+ Owner</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="add-rto" className={labelClass}>
                    RTO Code
                  </label>
                  <input
                    id="add-rto"
                    type="text"
                    maxLength={8}
                    placeholder="e.g. GJ-01, GJ-23, MH-02"
                    value={formData.rto_code}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        rto_code: e.target.value.toUpperCase(),
                      })
                    }
                    style={mono}
                    className={`${fieldClass} uppercase ${focusRing}`}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="add-insurance-type" className={labelClass}>
                    Insurance Type
                  </label>
                  <select
                    id="add-insurance-type"
                    value={formData.insurance_type}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        insurance_type: e.target.value,
                      })
                    }
                    className={`${fieldClass} ${focusRing}`}
                  >
                    <option value="Comprehensive">
                      Comprehensive (Zero Dep / Standard)
                    </option>
                    <option value="Third-Party">Third-Party</option>
                    <option value="Expired">Expired</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="add-insurance-validity" className={labelClass}>
                    Insurance Valid Till
                  </label>
                  <input
                    id="add-insurance-validity"
                    type="date"
                    value={formData.insurance_validity}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        insurance_validity: e.target.value,
                      })
                    }
                    style={mono}
                    className={`${fieldClass} ${focusRing}`}
                    required={formData.insurance_type !== "Expired"}
                  />
                </div>
              </div>
            </div>

            {/* MEDIA UPLOADS */}
            <div className="rounded-2xl border border-white/10 bg-[#102238]/60 p-4 sm:p-6">
              <div className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-white">
                <ImageIcon size={15} className="text-[#2DD4BF]" />
                <span>Vehicle Photos</span>
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="add-cover-image" className={labelClass}>
                    Cover Image
                  </label>
                  <input
                    id="add-cover-image"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setCoverFile(e.target.files?.[0] || null)}
                    className={`${fileInputClass} ${focusRing}`}
                    required
                  />
                  {coverFile && (
                    <p
                      className="mt-2 truncate text-xs text-[#2DD4BF]"
                      style={mono}
                    >
                      Cover: {coverFile.name}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="add-gallery-images" className={labelClass}>
                    Gallery Images
                  </label>
                  <input
                    id="add-gallery-images"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => setFiles(Array.from(e.target.files || []))}
                    className={`${fileInputClass} ${focusRing}`}
                  />
                  {files.length > 0 && (
                    <p
                      className="mt-2 flex items-center gap-1.5 text-xs text-[#2DD4BF]"
                      style={mono}
                    >
                      <Upload size={13} />
                      <span>
                        {files.length} {files.length === 1 ? "photo" : "photos"}{" "}
                        selected
                      </span>
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* DESCRIPTION */}
            <div>
              <label htmlFor="add-description" className={labelClass}>
                Description
              </label>
              <textarea
                id="add-description"
                placeholder="Share service records, tire/battery condition, accident-free history, and key highlights..."
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className={`h-32 resize-y ${fieldClass} ${focusRing}`}
                required
              />
            </div>

            {/* SUBMIT */}
            <div className="border-t border-white/10 pt-6">
              <button
                type="submit"
                className={`inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#2DD4BF] px-6 py-4 text-sm font-semibold text-[#0A1628] transition-colors hover:bg-[#5EEAD4] sm:text-base ${focusRing}`}
              >
                <Plus size={20} />
                <span>Add to inventory</span>
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default AddVehicle;