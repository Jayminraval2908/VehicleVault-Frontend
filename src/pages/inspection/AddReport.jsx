import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import inspectionService from "../../services/inspectionService";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import Loader from "../../components/common/Loader";
import Card from "../../components/common/Card";
import { ClipboardCheck, ShieldAlert, ArrowLeft } from "lucide-react";
import { toast } from "react-toastify";

const AddReport = () => {
  const { vehicleId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    engineStatus: "Excellent",
    transmission: "Smooth",
    interiorGrade: "A",
    exteriorGrade: "A",
    summary: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await inspectionService.createReport({
        vehicle_id: vehicleId,
        ...formData
      });
      toast.success("Inspection Report Certified & Saved!");
      navigate(`/vehicle/${vehicleId}`);
    } catch (err) {
      toast.error("Error saving report.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader fullScreen />;

  return (
    <div className="min-h-screen bg-[#0D0D0D] p-6 flex justify-center items-center">
      <Card className="max-w-3xl w-full border-[#D4AF37]/20 shadow-2xl p-8">
        <button onClick={() => navigate(-1)} className="text-gray-500 hover:text-[#D4AF37] mb-6 flex items-center gap-2 transition-all">
          <ArrowLeft size={18} /> Back
        </button>

        <header className="mb-8 border-b border-gray-800 pb-4">
          <h1 className="text-3xl font-bold text-white uppercase tracking-tighter">
            Vehicle <span className="text-[#D4AF37]">Certification</span>
          </h1>
          <p className="text-gray-500 text-sm">Create an official inspection report for Vehicle ID: {vehicleId?.slice(-6)}</p>
        </header>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-gray-400 uppercase">Engine Status</label>
            <select
              value={formData.engineStatus}
              onChange={(e) => setFormData({ ...formData, engineStatus: e.target.value })}
              className="bg-[#111111] border border-gray-800 text-white p-3 rounded-xl focus:border-[#D4AF37] outline-none transition"
              required
            >
              <option value="" disabled>Select Engine Status</option>
              <option value="Excellent">Excellent</option>
              <option value="Good">Good</option>
              <option value="Fair">Fair</option>
              <option value="Needs Repair">Needs Repair</option>
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Transmission
            </label>
            <select
              value={formData.transmission}
              onChange={(e) => setFormData({ ...formData, transmission: e.target.value })}
              className="bg-[#111111] border border-gray-800 text-white p-3 rounded-xl focus:border-[#D4AF37] outline-none transition cursor-pointer appearance-none hover:border-gray-600"
              required
            >
              <option value="" disabled>Select Transmission</option>
              <option value="Automatic">Automatic</option>
              <option value="Manual">Manual</option>
              <option value="Semi-Automatic">Semi-Automatic</option>
              <option value="CVT">CVT (Continuously Variable)</option>
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Interior Grade
            </label>
            <select
              value={formData.interiorGrade}
              onChange={(e) => setFormData({ ...formData, interiorGrade: e.target.value })}
              className="bg-[#111111] border border-gray-800 text-white p-3 rounded-xl focus:border-[#D4AF37] outline-none transition cursor-pointer hover:border-gray-600 appearance-none"
              required
            >
              <option value="" disabled>Select Grade</option>
              <option value="A+">A+ (Pristine/Like New)</option>
              <option value="A">A (Excellent Condition)</option>
              <option value="B">B (Good/Normal Wear)</option>
              <option value="C">C (Fair/Significant Wear)</option>
              <option value="D">D (Needs Restoration)</option>
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Exterior Grade
            </label>
            <select
              value={formData.exteriorGrade}
              onChange={(e) => setFormData({ ...formData, exteriorGrade: e.target.value })}
              className="bg-[#111111] border border-gray-800 text-white p-3 rounded-xl focus:border-[#D4AF37] outline-none transition cursor-pointer hover:border-gray-600 appearance-none"
              required
            >
              <option value="" disabled>Select Grade</option>
              <option value="A+">A+ (Showroom Quality)</option>
              <option value="A">A (Excellent / No Scratches)</option>
              <option value="B">B (Good / Minor Scratches)</option>
              <option value="C">C (Fair / Visible Dents)</option>
              <option value="D">D (Poor / Needs Paint)</option>
              <option value="R">R (Repaired/Accident History)</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <Input
              label="Professional Summary"
              placeholder="Detailed overview of vehicle health..."
              value={formData.summary}
              onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
              className="h-24"
              required
            />
          </div>

          <div className="md:col-span-2 flex items-center gap-3 bg-[#D4AF37]/5 p-4 rounded-xl border border-[#D4AF37]/20">
            <ShieldAlert className="text-[#D4AF37]" size={24} />
            <p className="text-xs text-gray-400">
              By submitting, you certify that this report is an accurate representation of the vehicle's current condition.
            </p>
          </div>

          <Button type="submit" className="md:col-span-2 py-4 flex items-center justify-center gap-2">
            <ClipboardCheck size={20} /> PUBLISH REPORT
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default AddReport;