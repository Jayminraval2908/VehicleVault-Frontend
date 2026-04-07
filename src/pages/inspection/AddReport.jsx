// import React, { useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import inspectionService from "../../services/inspectionService";
// import Button from "../../components/common/Button";
// import Input from "../../components/common/Input";
// import Loader from "../../components/common/Loader";
// import Card from "../../components/common/Card";
// import { ClipboardCheck, ShieldAlert, ArrowLeft } from "lucide-react";
// import { toast } from "react-toastify";

// const AddReport = () => {
//   const { vehicleId } = useParams();
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(false);

//   const [formData, setFormData] = useState({
//     engineStatus: "Excellent",
//     transmission: "Automatic",
//     interiorGrade: "A",
//     exteriorGrade: "A",
//     suspension: "Excellent",
//     brakeCondition: "Excellent",
//     tireLife: "80%",
//     accidentHistory: "None",
//     acPerformance: "Chilling",
//     lastServiceDate: "",
//     summary: ""
//   });

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       await inspectionService.createReport({
//         vehicle_id: vehicleId,
//         ...formData
//       });
//       toast.success("Inspection Report Certified & Saved!");
//       // 🚩 Redirect back to seller dashboard or vehicle view
//       navigate(`/seller/dashboard`);
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Error saving report.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading) return <Loader fullScreen />;

//   return (
//     <div className="min-h-screen bg-[#0D0D0D] p-6 flex justify-center items-center">
//       <Card className="max-w-3xl w-full border-[#D4AF37]/20 shadow-2xl p-8 bg-[#111111]">
//         <button onClick={() => navigate(-1)} className="text-gray-500 hover:text-[#D4AF37] mb-6 flex items-center gap-2 transition-all">
//           <ArrowLeft size={18} /> Back
//         </button>

//         <header className="mb-8 border-b border-gray-800 pb-4">
//           <h1 className="text-3xl font-bold text-white uppercase tracking-tighter">
//             Vehicle <span className="text-[#D4AF37]">Certification</span>
//           </h1>
//           <p className="text-gray-500 text-xs mt-1 uppercase tracking-widest">Generating Official Record for: #{vehicleId?.slice(-6)}</p>
//         </header>

//         <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <div className="flex flex-col gap-2">
//             <label className="text-[10px] font-black text-[#D4AF37] uppercase tracking-widest">Engine Status</label>
//             <select
//               value={formData.engineStatus}
//               onChange={(e) => setFormData({ ...formData, engineStatus: e.target.value })}
//               className="bg-[#0D0D0D] border border-gray-800 text-white p-3 rounded-xl focus:border-[#D4AF37] outline-none transition text-sm"
//               required
//             >
//               <option value="Excellent">Excellent</option>
//               <option value="Good">Good</option>
//               <option value="Fair">Fair</option>
//               <option value="Needs Repair">Needs Repair</option>
//             </select>
//           </div>

//           <div className="flex flex-col gap-2">
//             <label className="text-[10px] font-black text-[#D4AF37] uppercase tracking-widest">Transmission</label>
//             <select
//               value={formData.transmission}
//               onChange={(e) => setFormData({ ...formData, transmission: e.target.value })}
//               className="bg-[#0D0D0D] border border-gray-800 text-white p-3 rounded-xl focus:border-[#D4AF37] outline-none transition text-sm"
//               required
//             >
//               <option value="Automatic">Automatic</option>
//               <option value="Manual">Manual</option>
//               <option value="Semi-Automatic">Semi-Automatic</option>
//               <option value="CVT">CVT (Continuously Variable)</option>
//             </select>
//           </div>

//           <div className="flex flex-col gap-2">
//             <label className="text-[10px] font-black text-[#D4AF37] uppercase tracking-widest">Interior Grade</label>
//             <select
//               value={formData.interiorGrade}
//               onChange={(e) => setFormData({ ...formData, interiorGrade: e.target.value })}
//               className="bg-[#0D0D0D] border border-gray-800 text-white p-3 rounded-xl focus:border-[#D4AF37] outline-none transition text-sm"
//               required
//             >
//               <option value="A+">A+ (Pristine/Like New)</option>
//               <option value="A">A (Excellent Condition)</option>
//               <option value="B">B (Good/Normal Wear)</option>
//               <option value="C">C (Fair/Significant Wear)</option>
//               <option value="D">D (Needs Restoration)</option>
//             </select>
//           </div>

//           <div className="flex flex-col gap-2">
//             <label className="text-[10px] font-black text-[#D4AF37] uppercase tracking-widest">Exterior Grade</label>
//             <select
//               value={formData.exteriorGrade}
//               onChange={(e) => setFormData({ ...formData, exteriorGrade: e.target.value })}
//               className="bg-[#0D0D0D] border border-gray-800 text-white p-3 rounded-xl focus:border-[#D4AF37] outline-none transition text-sm"
//               required
//             >
//               <option value="A+">A+ (Showroom Quality)</option>
//               <option value="A">A (Excellent / No Scratches)</option>
//               <option value="B">B (Good / Minor Scratches)</option>
//               <option value="C">C (Fair / Visible Dents)</option>
//               <option value="D">D (Poor / Needs Paint)</option>
//             </select>
//           </div>

//           <div className="md:col-span-2">
//             <Input
//               label="Professional Summary"
//               placeholder="Provide a detailed overview of the vehicle's health..."
//               value={formData.summary}
//               onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
//               className="h-24"
//               required
//             />
//           </div>

//           <div className="md:col-span-2 flex items-center gap-3 bg-[#D4AF37]/5 p-4 rounded-xl border border-[#D4AF37]/20">
//             <ShieldAlert className="text-[#D4AF37]" size={24} />
//             <p className="text-[10px] text-gray-500 leading-tight uppercase">
//               By submitting, you certify that this report is an accurate representation of the vehicle's current condition. Misrepresentation can lead to account suspension.
//             </p>
//           </div>

//           <Button type="submit" className="md:col-span-2 py-4 flex items-center justify-center gap-2 font-black tracking-widest uppercase">
//             <ClipboardCheck size={20} /> PUBLISH CERTIFIED REPORT
//           </Button>
//         </form>
//       </Card>
//     </div>
//   );
// };

// export default AddReport;




import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import inspectionService from "../../services/inspectionService";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input"; // 🚩 Using your custom Input
import Loader from "../../components/common/Loader";
import Card from "../../components/common/Card";
import { ClipboardCheck, ShieldAlert, ArrowLeft, ChevronDown, Activity, PenTool, ShieldCheck } from "lucide-react";
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
    <div className="min-h-screen bg-[#0D0D0D] p-6 lg:p-12 flex justify-center items-center">
      <Card className="max-w-4xl w-full border-[#D4AF37]/20 shadow-2xl p-8 bg-[#111111]">
        <button onClick={() => navigate(-1)} className="text-gray-500 hover:text-[#D4AF37] mb-6 flex items-center gap-2 transition-all group">
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> 
          <span className="text-xs font-bold uppercase tracking-widest">Back to Vehicle</span>
        </button>

        <header className="mb-10 border-b border-gray-800 pb-6">
          <div className="flex items-center gap-4 mb-2">
            <div className="bg-[#D4AF37]/10 p-3 rounded-2xl border border-[#D4AF37]/20">
                <ShieldCheck className="text-[#D4AF37]" size={28} />
            </div>
            <div>
                <h1 className="text-4xl font-black text-white uppercase tracking-tighter leading-none">
                    Professional <span className="text-[#D4AF37]">Certification</span>
                </h1>
                <p className="text-gray-500 text-[10px] mt-2 uppercase tracking-[0.3em] font-bold">
                    Official Appraisal for Vault Asset: #{vehicleId?.slice(-6)}
                </p>
            </div>
          </div>
        </header>

        <form onSubmit={handleSubmit} className="space-y-10">
          
          {/* SECTION 1: PRIMARY GRADES */}
          <section>
            <h3 className="text-[#D4AF37] text-[10px] font-black uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                <Activity size={14} /> Core Components & Cosmetics
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <FormSelect label="Engine Status" value={formData.engineStatus} options={["Excellent", "Good", "Fair", "Needs Repair"]} onChange={(val) => setFormData({...formData, engineStatus: val})} />
                <FormSelect label="Transmission" value={formData.transmission} options={["Automatic", "Manual", "Semi-Auto", "CVT"]} onChange={(val) => setFormData({...formData, transmission: val})} />
                <FormSelect label="Interior Grade" value={formData.interiorGrade} options={["A+", "A", "B", "C", "D"]} onChange={(val) => setFormData({...formData, interiorGrade: val})} />
                <FormSelect label="Exterior Grade" value={formData.exteriorGrade} options={["A+", "A", "B", "C", "D"]} onChange={(val) => setFormData({...formData, exteriorGrade: val})} />
            </div>
          </section>

          {/* SECTION 2: MECHANICAL TECHNICALS */}
          <section>
            <h3 className="text-[#D4AF37] text-[10px] font-black uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                <PenTool size={14} /> Under-the-Hood Technicals
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <FormSelect label="Suspension" value={formData.suspension} options={["Excellent", "Good", "Weak", "Leaking"]} onChange={(val) => setFormData({...formData, suspension: val})} />
                <FormSelect label="Brake Condition" value={formData.brakeCondition} options={["Excellent", "Good", "Fair", "Replace Soon"]} onChange={(val) => setFormData({...formData, brakeCondition: val})} />
                <FormSelect label="Tire Life" value={formData.tireLife} options={["Brand New (90-100%)", "Great (70-90%)", "Good (50-70%)", "Fair (30-50%)", "Worn (Below 30%)"]} onChange={(val) => setFormData({...formData, tireLife: val})} />
                <FormSelect label="AC Performance" value={formData.acPerformance} options={["Chilling", "Good", "Weak", "Not Working"]} onChange={(val) => setFormData({...formData, acPerformance: val})} />
                <FormSelect label="Accident History" value={formData.accidentHistory} options={["None", "Minor Scratches", "Panel Repaint", "Major Accident"]} onChange={(val) => setFormData({...formData, accidentHistory: val})} />
                <FormSelect label="Service History" value={formData.serviceHistory} options={["Full Service History", "Partial History", "No Records", "Just Serviced"]} onChange={(val) => setFormData({...formData, serviceHistory: val})} />
            </div>
          </section>

          <div className="space-y-4">
            {/* 🚩 Using your custom Input component for the summary */}
            <Input
              label="Professional Summary & Observations"
              placeholder="Describe specific nuances, aftermarket upgrades, or minor flaws..."
              value={formData.summary}
              onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
              className="min-h-[120px]" 
              required
            />
          </div>

          <div className="flex items-center gap-4 bg-amber-500/5 p-5 rounded-2xl border border-amber-500/20">
            <ShieldAlert className="text-amber-500 shrink-0" size={24} />
            <p className="text-[10px] text-gray-500 leading-relaxed uppercase font-medium">
              Legal Disclaimer: By publishing this report to the Vault, you take full responsibility for the data provided. Inaccurate mechanical reporting can lead to account blacklisting.
            </p>
          </div>

          <Button type="submit" className="w-full py-5 flex items-center justify-center gap-3 font-black tracking-[0.2em] uppercase text-xs shadow-2xl shadow-[#D4AF37]/10">
            <ClipboardCheck size={20} /> Certify & Publish to Marketplace
          </Button>
        </form>
      </Card>
    </div>
  );
};

// --- FormSelect updated to match your Input component's styling ---
const FormSelect = ({ label, value, options, onChange }) => (
  <div className="flex flex-col gap-1 w-full group">
    {label && (
      <label className="text-sm text-gray-400 font-medium group-focus-within:text-[#D4AF37] transition-colors">
        {label}
      </label>
    )}
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-2 rounded-xl bg-[#0D0D0D] border border-gray-700 text-gray-200 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all duration-300 appearance-none cursor-pointer pr-10 text-sm"
        required
      >
        {options.map(opt => (
          <option key={opt} value={opt} className="bg-[#0D0D0D] text-white">
            {opt}
          </option>
        ))}
      </select>
      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 group-focus-within:text-[#D4AF37]">
        <ChevronDown size={16} />
      </div>
    </div>
  </div>
);

export default AddReport;
