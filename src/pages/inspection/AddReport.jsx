import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import inspectionService from "../../services/inspectionService";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import Loader from "../../components/common/Loader";
import Card from "../../components/common/Card";
import {
  ClipboardCheck,
  ShieldAlert,
  ArrowLeft,
  ChevronDown,
  Activity,
  PenTool,
  ShieldCheck
} from "lucide-react";
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
    suspension: "Excellent",
    brakeCondition: "Excellent",
    tireLife: "Great (70-90%)",
    acPerformance: "Chilling",
    accidentHistory: "None",
    serviceHistory: "Full Service History",
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
      toast.success("Professional Certification Published!");
      navigate(`/seller/dashboard`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Error saving report.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader fullScreen />;

  return (
    <div className="min-h-screen bg-[#0D0D0D] p-4 sm:p-6 lg:p-12 flex justify-center items-start">
      <Card className="w-full max-w-5xl border-[#D4AF37]/20 shadow-2xl p-4 sm:p-6 md:p-8 bg-[#111111]">

        {/* BACK BUTTON */}
        <button
          onClick={() => navigate(-1)}
          className="text-gray-500 hover:text-[#D4AF37] mb-4 sm:mb-6 flex items-center gap-2 text-xs sm:text-sm"
        >
          <ArrowLeft size={18} />
          Back
        </button>

        {/* HEADER */}
        <header className="mb-8 sm:mb-10 border-b border-gray-800 pb-4 sm:pb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            
            <div className="bg-[#D4AF37]/10 p-3 rounded-xl border border-[#D4AF37]/20">
              <ShieldCheck className="text-[#D4AF37]" size={26} />
            </div>

            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white leading-tight">
                Professional <span className="text-[#D4AF37]">Certification</span>
              </h1>

              <p className="text-gray-500 text-[10px] mt-1 uppercase tracking-widest">
                Vehicle ID: #{vehicleId?.slice(-6)}
              </p>
            </div>
          </div>
        </header>

        <form onSubmit={handleSubmit} className="space-y-8">

          {/* SECTION 1 */}
          <section>
            <h3 className="text-[#D4AF37] text-xs font-bold mb-4 flex items-center gap-2">
              <Activity size={14} /> Core Components
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <FormSelect label="Engine" value={formData.engineStatus} options={["Excellent","Good","Fair","Needs Repair"]} onChange={(v)=>setFormData({...formData,engineStatus:v})}/>
              <FormSelect label="Transmission" value={formData.transmission} options={["Automatic","Manual","Semi-Auto","CVT"]} onChange={(v)=>setFormData({...formData,transmission:v})}/>
              <FormSelect label="Interior" value={formData.interiorGrade} options={["A+","A","B","C","D"]} onChange={(v)=>setFormData({...formData,interiorGrade:v})}/>
              <FormSelect label="Exterior" value={formData.exteriorGrade} options={["A+","A","B","C","D"]} onChange={(v)=>setFormData({...formData,exteriorGrade:v})}/>
            </div>
          </section>

          {/* SECTION 2 */}
          <section>
            <h3 className="text-[#D4AF37] text-xs font-bold mb-4 flex items-center gap-2">
              <PenTool size={14} /> Technical Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <FormSelect label="Suspension" value={formData.suspension} options={["Excellent","Good","Weak","Leaking"]} onChange={(v)=>setFormData({...formData,suspension:v})}/>
              <FormSelect label="Brakes" value={formData.brakeCondition} options={["Excellent","Good","Fair","Replace Soon"]} onChange={(v)=>setFormData({...formData,brakeCondition:v})}/>
              <FormSelect label="Tires" value={formData.tireLife} options={["New","Good","Average","Worn"]} onChange={(v)=>setFormData({...formData,tireLife:v})}/>
              <FormSelect label="AC" value={formData.acPerformance} options={["Chilling","Good","Weak","Not Working"]} onChange={(v)=>setFormData({...formData,acPerformance:v})}/>
              <FormSelect label="Accident" value={formData.accidentHistory} options={["None","Minor","Major"]} onChange={(v)=>setFormData({...formData,accidentHistory:v})}/>
              <FormSelect label="Service" value={formData.serviceHistory} options={["Full","Partial","None"]} onChange={(v)=>setFormData({...formData,serviceHistory:v})}/>
            </div>
          </section>

          {/* SUMMARY */}
          <Input
            label="Summary"
            value={formData.summary}
            onChange={(e)=>setFormData({...formData,summary:e.target.value})}
            className="min-h-[100px]"
          />

          {/* DISCLAIMER */}
          <div className="flex items-start gap-3 bg-amber-500/5 p-4 rounded-xl border border-amber-500/20">
            <ShieldAlert className="text-amber-500" size={20} />
            <p className="text-[11px] text-gray-500">
              You certify this report is accurate. False data may lead to account suspension.
            </p>
          </div>

          {/* BUTTON */}
          <Button type="submit" className="w-full py-4 flex items-center justify-center gap-2 text-sm">
            <ClipboardCheck size={18} />
            Publish Report
          </Button>

        </form>
      </Card>
    </div>
  );
};

/* SELECT COMPONENT */
const FormSelect = ({ label, value, options, onChange }) => (
  <div className="w-full">
    <label className="text-xs text-gray-400 mb-1 block">{label}</label>
    <div className="relative">
      <select
        value={value}
        onChange={(e)=>onChange(e.target.value)}
        className="w-full px-3 py-2 bg-[#0D0D0D] border border-gray-700 rounded-lg text-white text-sm appearance-none"
      >
        {options.map(o => <option key={o}>{o}</option>)}
      </select>
      <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500" size={14}/>
    </div>
  </div>
);

export default AddReport;