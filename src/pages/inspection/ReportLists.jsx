// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import inspectionService from "../../services/inspectionService";
// import Loader from "../../components/common/Loader";
// import Card from "../../components/common/Card";
// import { ShieldCheck, ChevronLeft, Gauge, Activity, Sparkles, AlertCircle } from "lucide-react";

// const ReportsList = () => {
//   const { vehicleId } = useParams();
//   const navigate = useNavigate();
//   const [reports, setReports] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchReports = async () => {
//       try {
//         // 🚩 Ensure this hits your populated vehicle data
//         const res = await inspectionService.getReportsByVehicle(vehicleId);
//         console.log("Inspection Data:", res);
//         // Handle both { data: [] } and direct array responses
//         const reportArray = res.data || res || [];
//         setReports(Array.isArray(reportArray) ? reportArray : []);
//         // setReports(res.data || res || []);
//       } catch (err) {
//         console.error("Error fetching reports", err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchReports();
//   }, [vehicleId]);

//   if (loading) return <Loader fullScreen />;

//   return (
//     <div className="p-8 bg-[#0D0D0D] min-h-screen text-white">
//       <div className="max-w-4xl mx-auto">

//         {/* Header */}
//         <div className="flex items-center justify-between mb-12">
//           <button 
//             onClick={() => navigate(-1)} 
//             className="text-gray-500 hover:text-[#D4AF37] flex items-center gap-2 transition-all"
//           >
//             <ChevronLeft size={20} /> Back
//           </button>
//           <div className="flex items-center gap-3 bg-[#D4AF37]/10 px-4 py-2 rounded-full border border-[#D4AF37]/30">
//             <ShieldCheck className="text-[#D4AF37]" size={18} />
//             <span className="text-[#D4AF37] text-xs font-bold uppercase tracking-widest">Certified Inspections</span>
//           </div>
//         </div>

//         <h1 className="text-4xl font-bold mb-2">Inspection <span className="text-[#D4AF37]">History</span></h1>
//         <p className="text-gray-500 mb-10 text-sm">Detailed technical analysis and grading for Vehicle ID: <span className="text-gray-300 font-mono">#{vehicleId?.slice(-6) || "N/A"}</span></p>

//         {reports.length === 0 ? (
//           <div className="text-center py-24 bg-[#111111]/30 border border-dashed border-gray-800 rounded-3xl">
//             <AlertCircle className="mx-auto text-gray-700 mb-4" size={48} />
//             <p className="text-gray-600 italic">No inspection reports found for this vehicle.</p>
//           </div>
//         ) : (
//           <div className="space-y-8">
//             {reports.map((report) => (
//               <Card key={report._id} className="relative overflow-hidden group border-gray-800 bg-[#111111]/50">
//                 {/* Visual Grading Badge */}
//                 <div className="absolute top-0 right-0 bg-[#D4AF37] text-black px-6 py-2 font-black text-xl rounded-bl-2xl shadow-lg">
//                   GRADE {report.interiorGrade || 'A'}
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">

//                   {/* Technical Stats */}
//                   <div className="space-y-4">
//                     <div className="flex items-center gap-4 text-gray-300">
//                       <Gauge className="text-[#D4AF37]" size={20} />
//                       <div>
//                         <p className="text-[10px] uppercase text-gray-500 font-bold">Engine Status</p>
//                         <p className="font-semibold">{report.engineStatus}</p>
//                       </div>
//                     </div>

//                     <div className="flex items-center gap-4 text-gray-300">
//                       <Activity className="text-[#D4AF37]" size={20} />
//                       <div>
//                         <p className="text-[10px] uppercase text-gray-500 font-bold">Transmission</p>
//                         <p className="font-semibold">{report.transmission}</p>
//                       </div>
//                     </div>

//                     <div className="flex items-center gap-4 text-gray-300">
//                       <Sparkles className="text-[#D4AF37]" size={20} />
//                       <div>
//                         <p className="text-[10px] uppercase text-gray-500 font-bold">Exterior Grade</p>
//                         <p className="font-semibold">{report.exteriorGrade}</p>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Summary Box */}
//                   <div className="bg-[#0D0D0D] p-5 rounded-2xl border border-gray-800">
//                     <p className="text-[10px] uppercase text-[#D4AF37] font-bold mb-2">Inspector Summary</p>
//                     <p className="text-sm text-gray-400 leading-relaxed italic">
//                       "{report.summary || "No professional summary provided."}"
//                     </p>
//                     <div className="mt-4 pt-4 border-t border-gray-800 text-[10px] text-gray-600 uppercase flex justify-between">
//                       <span>Verified: {new Date(report.createdAt).toLocaleDateString()}</span>
//                       <span>Ref: {report._id?.slice(-4)}</span>
//                     </div>
//                   </div>
//                 </div>
//               </Card>
//             ))}
//           </div>
//         )}

//         <div className="mt-12 text-center">
//           <p className="text-gray-600 text-[10px] max-w-lg mx-auto leading-relaxed uppercase tracking-tighter">
//             All reports are generated by certified luxury vehicle inspectors. Vehicle Vault is not liable for changes in vehicle condition post-inspection date.
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ReportsList;




import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import inspectionService from "../../services/inspectionService";
import Loader from "../../components/common/Loader";
import Card from "../../components/common/Card";
import {
  ShieldCheck,
  ChevronLeft,
  Gauge,
  Activity,
  Sparkles,
  AlertCircle,
  Settings,
  Disc,
  Wind,
  History,
  LifeBuoy
} from "lucide-react";

const ReportsList = () => {
  const { vehicleId } = useParams();
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await inspectionService.getReportsByVehicle(vehicleId);
        const reportArray = res.data || res || [];
        setReports(Array.isArray(reportArray) ? reportArray : []);
      } catch (err) {
        console.error("Error fetching reports", err);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, [vehicleId]);

  if (loading) return <Loader fullScreen />;

  return (
    <div className="p-8 bg-[#0D0D0D] min-h-screen text-white">
      <div className="max-w-5xl mx-auto">

        {/* Header Navigation */}
        <div className="flex items-center justify-between mb-12">
          <button
            onClick={() => navigate(-1)}
            className="text-gray-500 hover:text-[#D4AF37] flex items-center gap-2 transition-all group"
          >
            <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-xs font-bold uppercase tracking-widest">Back to Vehicle</span>
          </button>
          <div className="flex items-center gap-3 bg-[#D4AF37]/10 px-4 py-2 rounded-full border border-[#D4AF37]/30">
            <ShieldCheck className="text-[#D4AF37]" size={18} />
            <span className="text-[#D4AF37] text-[10px] font-black uppercase tracking-widest">Vault Certified Asset</span>
          </div>
        </div>

        <header className="mb-12">
          <h1 className="text-5xl font-black mb-2 uppercase tracking-tighter">Inspection <span className="text-[#D4AF37]">History</span></h1>
          <p className="text-gray-500 text-sm uppercase tracking-widest font-medium">Technical analysis for ID: <span className="text-gray-300 font-mono">#{vehicleId?.slice(-6) || "N/A"}</span></p>
        </header>

        {reports.length === 0 ? (
          <div className="text-center py-24 bg-[#111111]/30 border border-dashed border-gray-800 rounded-3xl">
            <AlertCircle className="mx-auto text-gray-700 mb-4" size={48} />
            <p className="text-gray-600 italic uppercase tracking-widest text-xs">No certified records found for this asset.</p>
          </div>
        ) : (
          <div className="space-y-10">
            {reports.map((report) => (
              <Card key={report._id} className="relative overflow-hidden group border-gray-800 bg-[#111111]/80 backdrop-blur-md p-0">

                {/* Visual Grading Header */}
                <div className="bg-gradient-to-r from-[#111] to-[#1a1a1a] p-6 border-b border-gray-800 flex justify-between items-center">
                  <div>
                    <span className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em] block mb-1">Certification Date</span>
                    <span className="text-sm font-bold text-gray-200">{new Date(report.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-[10px] text-[#D4AF37] font-black uppercase tracking-[0.2em] mb-1">Condition Score</span>
                    <div className="bg-[#D4AF37] text-black px-4 py-1 font-black text-xl rounded-lg shadow-lg">
                      {report.interiorGrade || 'A'}
                    </div>
                  </div>
                </div>

                <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-10">

                  {/* Column 1: Core Performance */}
                  <div className="space-y-6">
                    <h4 className="text-[10px] text-gray-600 font-black uppercase tracking-widest border-l-2 border-[#D4AF37] pl-3">Core Performance</h4>
                    <ReportItem icon={<Gauge />} label="Engine Health" value={report.engineStatus} />
                    <ReportItem icon={<Settings />} label="Transmission" value={report.transmission} />
                    <ReportItem icon={<Wind />} label="AC Performance" value={report.acPerformance} />
                    <ReportItem icon={<History />} label="Service History" value={report.serviceHistory} />
                  </div>

                  {/* Column 2: Mechanical Health */}
                  <div className="space-y-6">
                    <h4 className="text-[10px] text-gray-600 font-black uppercase tracking-widest border-l-2 border-[#D4AF37] pl-3">Mechanical Health</h4>
                    <ReportItem icon={<Activity />} label="Suspension" value={report.suspension} />
                    <ReportItem icon={<Disc />} label="Brake Condition" value={report.brakeCondition} />
                    <ReportItem icon={<LifeBuoy />} label="Tire Life" value={report.tireLife} />
                    <ReportItem icon={<AlertCircle />} label="Accidents" value={report.accidentHistory} />
                  </div>

                  {/* Column 3: Grades & Summary */}
                  {/* Column 3: Grades & Summary */}
                  <div className="flex flex-col space-y-6 h-full"> {/* 🚩 Added h-full and flex-col */}
                    <h4 className="text-[10px] text-gray-600 font-black uppercase tracking-widest border-l-2 border-[#D4AF37] pl-3">
                      Aesthetic & Notes
                    </h4>

                    <div className="flex gap-4">
                      <div className="flex-1 bg-white/5 p-3 rounded-xl border border-gray-800">
                        <p className="text-[9px] text-gray-500 uppercase font-bold mb-1">Exterior</p>
                        <p className="text-lg font-black text-white">{report.exteriorGrade}</p>
                      </div>
                      <div className="flex-1 bg-white/5 p-3 rounded-xl border border-gray-800">
                        <p className="text-[9px] text-gray-500 uppercase font-bold mb-1">Interior</p>
                        <p className="text-lg font-black text-white">{report.interiorGrade}</p>
                      </div>
                    </div>

                    {/* 🚩 UPDATED SUMMARY BOX */}
                    <div className="bg-[#0D0D0D] p-5 rounded-2xl border border-gray-800 flex-1 flex flex-col min-h-[150px]">
                      <p className="text-[10px] uppercase text-[#D4AF37] font-black mb-3 tracking-widest">
                        Inspector Summary
                      </p>
                      <p className="text-xs text-gray-400 leading-relaxed italic font-medium flex-1 overflow-y-auto">
                        "{report.summary || "This asset has been verified against Vault standards."}"
                      </p>
                    </div>
                  </div>

                </div>
              </Card>
            ))}
          </div>
        )}

        <footer className="mt-20 pt-10 border-t border-gray-900 text-center">
          <p className="text-gray-600 text-[9px] max-w-xl mx-auto leading-relaxed uppercase tracking-[0.2em] font-bold">
            Inspection reports are snapshots of vehicle condition at the time of certification. Vehicle Vault does not guarantee condition post-record date.
          </p>
        </footer>
      </div>
    </div>
  );
};

// Helper Component for consistency
const ReportItem = ({ icon, label, value }) => (
  <div className="flex items-center gap-4 group">
    <div className="p-2 bg-white/5 rounded-lg text-[#D4AF37] group-hover:bg-[#D4AF37] group-hover:text-black transition-all">
      {React.cloneElement(icon, { size: 18 })}
    </div>
    <div>
      <p className="text-[9px] uppercase text-gray-600 font-black tracking-widest">{label}</p>
      <p className="text-sm font-bold text-gray-200">{value}</p>
    </div>
  </div>
);

export default ReportsList;