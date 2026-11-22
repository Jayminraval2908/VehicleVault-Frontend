import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import vehicleService from "../../services/vehicleService";
import inquiryService from "../../services/inquiryService";
import Loader from "../../components/common/Loader";
import { toast } from "react-toastify";
import {
  Plus,
  Edit3,
  Trash2,
  MessageCircle,
  Eye,
  BarChart3,
  Car,
  ClipboardCheck,
  Send,
} from "lucide-react";
import { display, body, mono, focusRing } from "../../utils/theme";

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: "easeOut" },
  },
};

const SellerDashboard = () => {
  const reduceMotion = useReducedMotion();
  const [vehicles, setVehicles] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSellerData = async () => {
      try {
        const vehiclesData = await vehicleService.getSellerVehicles();
        setVehicles(vehiclesData.data || []);

        const inquiryPromises = (vehiclesData.data || []).map((v) =>
          inquiryService.getInquiriesByVehicle(v._id)
        );

        const inquiryResults = await Promise.all(inquiryPromises);
        const allInquiries = inquiryResults
          .map((res) => res.data || [])
          .flat();

        setInquiries(allInquiries);
      } catch (err) {
        console.error("Seller Data Error", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSellerData();
    const interval = setInterval(fetchSellerData, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to remove this listing?")) {
      await vehicleService.deleteVehicle(id);
      setVehicles((prev) => prev.filter((v) => v._id !== id));
    }
  };

  const handlePublish = async (id) => {
    try {
      await vehicleService.publishVehicle(id);
      toast.success("Vehicle sent to admin for approval");
      setVehicles((prev) =>
        prev.map((v) => (v._id === id ? { ...v, status: "Pending" } : v))
      );
    } catch (err) {
      console.error(err);
      toast.error("Failed to publish vehicle");
    }
  };

  if (loading) return <Loader fullScreen />;

  return (
    <div className="min-h-full text-[#C8D3E0]" style={body}>
      <motion.div
        className="mx-auto max-w-6xl"
        variants={containerVariants}
        initial={reduceMotion ? false : "hidden"}
        animate="visible"
      >
        {/* HEADER */}
        <motion.div
          variants={itemVariants}
          className="mb-10 flex flex-col items-start justify-between gap-6 border-b border-white/10 pb-8 md:flex-row md:items-center"
        >
          <div>
            <h1
              className="text-3xl font-bold tracking-tight text-white sm:text-4xl"
              style={display}
            >
              Seller <span className="text-[#2DD4BF]">Console</span>
            </h1>
            <p className="mt-1.5 text-sm text-[#8EA0B5]">
              Manage your curated inventory, inspection reports, and incoming buyer leads.
            </p>
          </div>

          <Link
            to="/seller/add-vehicle"
            className={`inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#2DD4BF] px-5 py-3 text-sm font-semibold text-[#0A1628] transition-colors hover:bg-[#5EEAD4] sm:w-auto ${focusRing}`}
          >
            <Plus size={18} />
            List a vehicle
          </Link>
        </motion.div>

        {/* STATS */}
        <motion.div
          variants={itemVariants}
          className="mb-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          <StatBox icon={<Car />} label="Live Listings" count={vehicles.length} />
          <StatBox
            icon={<MessageCircle />}
            label="Total Inquiries"
            count={inquiries.length}
          />
          <StatBox
            icon={<BarChart3 />}
            label="Avg. Engagement"
            count={`${
              vehicles.length > 0
                ? (inquiries.length / vehicles.length).toFixed(1)
                : 0
            }x`}
          />
        </motion.div>

        {/* TABLE */}
        <motion.div
          variants={itemVariants}
          className="overflow-hidden rounded-2xl border border-white/10 bg-[#0D1D33]"
        >
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 bg-[#102238] px-6 py-5">
            <h3
              className="text-xl font-semibold text-white"
              style={display}
            >
              Active inventory
            </h3>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-[#0A1628] px-3 py-1 text-xs font-medium text-[#8EA0B5]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#2DD4BF]" />
              Live sync
            </span>
          </div>

          <div className="w-full overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-white/10 bg-[#0A1628]/70 text-xs font-medium uppercase tracking-wider text-[#8EA0B5]">
                  <th className="whitespace-nowrap px-6 py-4">Vehicle Details</th>
                  <th className="whitespace-nowrap px-6 py-4">Price</th>
                  <th className="whitespace-nowrap px-6 py-4">Status</th>
                  <th className="whitespace-nowrap px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-white/10">
                {vehicles.map((car) => (
                  <tr
                    key={car._id}
                    className="group transition-colors hover:bg-[#102238]/70"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-16 shrink-0 overflow-hidden rounded-lg border border-white/10 bg-[#0A1628]">
                          <img
                            src={car.images?.[0]}
                            alt={car.model}
                            className="h-full w-full object-cover opacity-85 transition-transform duration-300 group-hover:scale-105 group-hover:opacity-100"
                          />
                        </div>
                        <div>
                          <p
                            className="text-sm font-semibold text-white"
                            style={display}
                          >
                            {car.make} {car.model}
                          </p>
                          <p
                            className="mt-0.5 text-xs text-[#8EA0B5]"
                            style={mono}
                          >
                            #{car._id.slice(-6)}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td
                      className="whitespace-nowrap px-6 py-4 text-sm font-semibold text-[#2DD4BF]"
                      style={mono}
                    >
                      ₹{car.price?.toLocaleString()}
                    </td>

                    <td className="whitespace-nowrap px-6 py-4">
                      <span
                        className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${
                          car.status === "Pending"
                            ? "border-amber-400/20 bg-amber-400/10 text-amber-300"
                            : car.status === "Approved"
                            ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-300"
                            : car.status === "Rejected"
                            ? "border-rose-400/20 bg-rose-400/10 text-rose-300"
                            : car.status === "Sold"
                            ? "border-sky-400/20 bg-sky-400/10 text-sky-300"
                            : "border-white/10 bg-white/5 text-[#C8D3E0]"
                        }`}
                      >
                        {car.status}
                      </span>
                    </td>

                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          to={`/seller/add-inspection/${car._id}`}
                          title="Add Inspection Report"
                          className={`rounded-lg p-2 text-[#8EA0B5] transition-colors hover:bg-white/5 hover:text-sky-400 ${focusRing}`}
                        >
                          <ClipboardCheck size={17} />
                        </Link>

                        <Link
                          to={`/vehicle/${car._id}`}
                          title="View Listing"
                          className={`rounded-lg p-2 text-[#8EA0B5] transition-colors hover:bg-white/5 hover:text-white ${focusRing}`}
                        >
                          <Eye size={17} />
                        </Link>

                        <Link
                          to={`/seller/edit-vehicle/${car._id}`}
                          title="Edit Vehicle"
                          className={`rounded-lg p-2 text-[#8EA0B5] transition-colors hover:bg-white/5 hover:text-[#2DD4BF] ${focusRing}`}
                        >
                          <Edit3 size={17} />
                        </Link>

                        {car.status === "Draft" && (
                          <button
                            type="button"
                            onClick={() => handlePublish(car._id)}
                            title="Submit for Approval"
                            className={`rounded-lg p-2 text-[#8EA0B5] transition-colors hover:bg-white/5 hover:text-emerald-400 ${focusRing}`}
                          >
                            <Send size={17} />
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => handleDelete(car._id)}
                          title="Delete Listing"
                          className={`rounded-lg p-2 text-[#8EA0B5] transition-colors hover:bg-white/5 hover:text-rose-400 ${focusRing}`}
                        >
                          <Trash2 size={17} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {vehicles.length === 0 && (
              <div className="p-12 text-center sm:p-16">
                <p className="text-sm text-[#8EA0B5]">
                  No vehicles listed yet. Click{" "}
                  <span className="font-medium text-white">List a vehicle</span>{" "}
                  to create your first listing.
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

const StatBox = ({ icon, label, count }) => (
  <motion.div
    whileHover={{ y: -3 }}
    transition={{ duration: 0.2 }}
    className="group flex items-center justify-between rounded-2xl border border-white/10 bg-[#0D1D33] p-6 transition-colors hover:border-[#2DD4BF]/40 hover:bg-[#102238]"
  >
    <div>
      <p className="text-xs font-medium uppercase tracking-wider text-[#8EA0B5]">
        {label}
      </p>
      <p className="mt-2 text-3xl font-bold text-white" style={display}>
        {count}
      </p>
    </div>
    <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#2DD4BF]/20 bg-[#2DD4BF]/10 text-[#2DD4BF] transition-transform duration-300 group-hover:scale-110">
      {React.cloneElement(icon, { size: 22 })}
    </div>
  </motion.div>
);

export default SellerDashboard;