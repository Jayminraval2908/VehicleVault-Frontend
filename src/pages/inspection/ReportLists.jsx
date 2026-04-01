import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import inspectionService from "../../services/inspectionService";
import Loader from "../../components/common/Loader";
import Card from "../../components/common/Card";
import { ShieldCheck, ChevronLeft, Gauge, Activity, Sparkles, AlertCircle } from "lucide-react";

const ReportsList = () => {
  const { vehicleId } = useParams();
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        // 🚩 Ensure this hits your populated vehicle data
        const res = await inspectionService.getReportsByVehicle(vehicleId);
        console.log("Inspection Data:", res);
        // Handle both { data: [] } and direct array responses
        const reportArray = res.data || res || [];
        setReports(Array.isArray(reportArray) ? reportArray : []);
        // setReports(res.data || res || []);
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
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <button 
            onClick={() => navigate(-1)} 
            className="text-gray-500 hover:text-[#D4AF37] flex items-center gap-2 transition-all"
          >
            <ChevronLeft size={20} /> Back
          </button>
          <div className="flex items-center gap-3 bg-[#D4AF37]/10 px-4 py-2 rounded-full border border-[#D4AF37]/30">
            <ShieldCheck className="text-[#D4AF37]" size={18} />
            <span className="text-[#D4AF37] text-xs font-bold uppercase tracking-widest">Certified Inspections</span>
          </div>
        </div>

        <h1 className="text-4xl font-bold mb-2">Inspection <span className="text-[#D4AF37]">History</span></h1>
        <p className="text-gray-500 mb-10 text-sm">Detailed technical analysis and grading for Vehicle ID: <span className="text-gray-300 font-mono">#{vehicleId?.slice(-6) || "N/A"}</span></p>

        {reports.length === 0 ? (
          <div className="text-center py-24 bg-[#111111]/30 border border-dashed border-gray-800 rounded-3xl">
            <AlertCircle className="mx-auto text-gray-700 mb-4" size={48} />
            <p className="text-gray-600 italic">No inspection reports found for this vehicle.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {reports.map((report) => (
              <Card key={report._id} className="relative overflow-hidden group border-gray-800 bg-[#111111]/50">
                {/* Visual Grading Badge */}
                <div className="absolute top-0 right-0 bg-[#D4AF37] text-black px-6 py-2 font-black text-xl rounded-bl-2xl shadow-lg">
                  GRADE {report.interiorGrade || 'A'}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
                  
                  {/* Technical Stats */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 text-gray-300">
                      <Gauge className="text-[#D4AF37]" size={20} />
                      <div>
                        <p className="text-[10px] uppercase text-gray-500 font-bold">Engine Status</p>
                        <p className="font-semibold">{report.engineStatus}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-gray-300">
                      <Activity className="text-[#D4AF37]" size={20} />
                      <div>
                        <p className="text-[10px] uppercase text-gray-500 font-bold">Transmission</p>
                        <p className="font-semibold">{report.transmission}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-gray-300">
                      <Sparkles className="text-[#D4AF37]" size={20} />
                      <div>
                        <p className="text-[10px] uppercase text-gray-500 font-bold">Exterior Grade</p>
                        <p className="font-semibold">{report.exteriorGrade}</p>
                      </div>
                    </div>
                  </div>

                  {/* Summary Box */}
                  <div className="bg-[#0D0D0D] p-5 rounded-2xl border border-gray-800">
                    <p className="text-[10px] uppercase text-[#D4AF37] font-bold mb-2">Inspector Summary</p>
                    <p className="text-sm text-gray-400 leading-relaxed italic">
                      "{report.summary || "No professional summary provided."}"
                    </p>
                    <div className="mt-4 pt-4 border-t border-gray-800 text-[10px] text-gray-600 uppercase flex justify-between">
                      <span>Verified: {new Date(report.createdAt).toLocaleDateString()}</span>
                      <span>Ref: {report._id?.slice(-4)}</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
        
        <div className="mt-12 text-center">
          <p className="text-gray-600 text-[10px] max-w-lg mx-auto leading-relaxed uppercase tracking-tighter">
            All reports are generated by certified luxury vehicle inspectors. Vehicle Vault is not liable for changes in vehicle condition post-inspection date.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReportsList;