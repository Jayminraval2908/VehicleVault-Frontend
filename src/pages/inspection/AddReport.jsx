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
    transmission: "Automatic",
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
      // 🚩 Redirect back to seller dashboard or vehicle view
      navigate(`/seller/dashboard`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Error saving report.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader fullScreen />;

  return (
    <div className="min-h-screen bg-[#0D0D0D] p-6 flex justify-center items-center">
      <Card className="max-w-3xl w-full border-[#D4AF37]/20 shadow-2xl p-8 bg-[#111111]">
        <button onClick={() => navigate(-1)} className="text-gray-500 hover:text-[#D4AF37] mb-6 flex items-center gap-2 transition-all">
          <ArrowLeft size={18} /> Back
        </button>

        <header className="mb-8 border-b border-gray-800 pb-4">
          <h1 className="text-3xl font-bold text-white uppercase tracking-tighter">
            Vehicle <span className="text-[#D4AF37]">Certification</span>
          </h1>
          <p className="text-gray-500 text-xs mt-1 uppercase tracking-widest">Generating Official Record for: #{vehicleId?.slice(-6)}</p>
        </header>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black text-[#D4AF37] uppercase tracking-widest">Engine Status</label>
            <select
              value={formData.engineStatus}
              onChange={(e) => setFormData({ ...formData, engineStatus: e.target.value })}
              className="bg-[#0D0D0D] border border-gray-800 text-white p-3 rounded-xl focus:border-[#D4AF37] outline-none transition text-sm"
              required
            >
              <option value="Excellent">Excellent</option>
              <option value="Good">Good</option>
              <option value="Fair">Fair</option>
              <option value="Needs Repair">Needs Repair</option>
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black text-[#D4AF37] uppercase tracking-widest">Transmission</label>
            <select
              value={formData.transmission}
              onChange={(e) => setFormData({ ...formData, transmission: e.target.value })}
              className="bg-[#0D0D0D] border border-gray-800 text-white p-3 rounded-xl focus:border-[#D4AF37] outline-none transition text-sm"
              required
            >
              <option value="Automatic">Automatic</option>
              <option value="Manual">Manual</option>
              <option value="Semi-Automatic">Semi-Automatic</option>
              <option value="CVT">CVT (Continuously Variable)</option>
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black text-[#D4AF37] uppercase tracking-widest">Interior Grade</label>
            <select
              value={formData.interiorGrade}
              onChange={(e) => setFormData({ ...formData, interiorGrade: e.target.value })}
              className="bg-[#0D0D0D] border border-gray-800 text-white p-3 rounded-xl focus:border-[#D4AF37] outline-none transition text-sm"
              required
            >
              <option value="A+">A+ (Pristine/Like New)</option>
              <option value="A">A (Excellent Condition)</option>
              <option value="B">B (Good/Normal Wear)</option>
              <option value="C">C (Fair/Significant Wear)</option>
              <option value="D">D (Needs Restoration)</option>
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black text-[#D4AF37] uppercase tracking-widest">Exterior Grade</label>
            <select
              value={formData.exteriorGrade}
              onChange={(e) => setFormData({ ...formData, exteriorGrade: e.target.value })}
              className="bg-[#0D0D0D] border border-gray-800 text-white p-3 rounded-xl focus:border-[#D4AF37] outline-none transition text-sm"
              required
            >
              <option value="A+">A+ (Showroom Quality)</option>
              <option value="A">A (Excellent / No Scratches)</option>
              <option value="B">B (Good / Minor Scratches)</option>
              <option value="C">C (Fair / Visible Dents)</option>
              <option value="D">D (Poor / Needs Paint)</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <Input
              label="Professional Summary"
              placeholder="Provide a detailed overview of the vehicle's health..."
              value={formData.summary}
              onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
              className="h-24"
              required
            />
          </div>

          <div className="md:col-span-2 flex items-center gap-3 bg-[#D4AF37]/5 p-4 rounded-xl border border-[#D4AF37]/20">
            <ShieldAlert className="text-[#D4AF37]" size={24} />
            <p className="text-[10px] text-gray-500 leading-tight uppercase">
              By submitting, you certify that this report is an accurate representation of the vehicle's current condition. Misrepresentation can lead to account suspension.
            </p>
          </div>

          <Button type="submit" className="md:col-span-2 py-4 flex items-center justify-center gap-2 font-black tracking-widest uppercase">
            <ClipboardCheck size={20} /> PUBLISH CERTIFIED REPORT
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default AddReport;