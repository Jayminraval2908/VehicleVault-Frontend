import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { Plus, Car, Trash2, Edit3, ExternalLink } from "lucide-react";
import Loader from "../../components/common/Loader";
import { display, body, mono, focusRing } from "../../utils/theme";
import { toast } from "react-toastify";

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: (index) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      delay: Math.min(index * 0.06, 0.3),
      ease: "easeOut",
    },
  }),
};

const MyGarage = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    fetchMyVehicles();
  }, []);

  const fetchMyVehicles = async () => {
    try {
      const token = localStorage.getItem("token");
      // Important: This route must be filtered by seller_id on the backend
      const res = await axios.get("/vehicles/my-garage", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setVehicles(res.data.data || res.data || []);
    } catch (err) {
      toast.error("Failed to load your garage.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (
      window.confirm(
        "Are you sure you want to delist this vehicle from the Vault?"
      )
    ) {
      try {
        await axios.delete(`/vehicles/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setVehicles((prev) => prev.filter((v) => v._id !== id));
        toast.success("Vehicle removed from inventory.");
      } catch (err) {
        toast.error("Delete failed.");
      }
    }
  };

  if (loading) return <Loader fullScreen />;

  return (
    <div
      className="relative min-h-screen overflow-x-clip bg-[#0A1628] px-4 py-6 text-[#C8D3E0] sm:px-6 lg:px-10 lg:py-10"
      style={body}
    >
      {/* Subtle Ambient Accent Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 top-0 h-80 w-80 rounded-full bg-[#2DD4BF]/10 blur-3xl"
      />

      <div className="relative mx-auto max-w-6xl">
        {/* HEADER SECTION */}
        <motion.header
          initial={reduceMotion ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="mb-8 flex flex-col justify-between gap-4 border-b border-white/10 pb-6 sm:mb-10 sm:flex-row sm:items-end"
        >
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-[#2DD4BF]">
              Seller Collection
            </p>
            <h1
              className="mt-1 text-3xl font-bold tracking-tight text-white sm:text-4xl"
              style={display}
            >
              My <span className="text-[#2DD4BF]">Garage</span>
            </h1>
            <p className="mt-1.5 text-sm text-[#8EA0B5]">
              Manage your active listings, edit specs, and keep your vault
              updated.
            </p>
          </div>

          <Link
            to="/seller/add-vehicle"
            className={`inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#2DD4BF] px-5 py-3 text-sm font-semibold text-[#0A1628] transition-colors hover:bg-[#5EEAD4] sm:w-auto ${focusRing}`}
          >
            <Plus size={18} />
            <span>Add vehicle</span>
          </Link>
        </motion.header>

        {/* EMPTY STATE */}
        {vehicles.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/15 bg-[#0D1D33]/70 px-6 py-20 text-center">
            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-[#2DD4BF]/25 bg-[#2DD4BF]/10 text-[#2DD4BF]">
              <Car size={32} />
            </div>
            <h2
              className="text-xl font-bold text-white sm:text-2xl"
              style={display}
            >
              Your garage is empty
            </h2>
            <p className="mb-7 mt-2 max-w-sm text-sm text-[#8EA0B5]">
              You haven&apos;t listed any vehicles in the vault yet. Create your
              first listing to start receiving buyer inquiries.
            </p>
            <Link
              to="/seller/add-vehicle"
              className={`inline-flex items-center justify-center gap-2 rounded-xl border border-[#2DD4BF]/40 bg-[#2DD4BF]/10 px-6 py-3 text-xs font-semibold uppercase tracking-wider text-[#2DD4BF] transition-colors hover:bg-[#2DD4BF] hover:text-[#0A1628] sm:text-sm ${focusRing}`}
            >
              <Plus size={16} />
              <span>List your first vehicle</span>
            </Link>
          </div>
        ) : (
          /* GRID VIEW FOR EXISTING VEHICLES */
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-7">
            {vehicles.map((car, index) => (
              <motion.article
                key={car._id}
                custom={index}
                variants={cardVariants}
                initial={reduceMotion ? false : "hidden"}
                animate="visible"
                whileHover={reduceMotion ? undefined : { y: -4 }}
                transition={{ duration: 0.2 }}
                className="group flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0D1D33] transition-colors duration-300 hover:border-[#2DD4BF]/40 hover:bg-[#102238]"
              >
                {/* IMAGE CONTAINER */}
                <div className="relative aspect-[16/10] overflow-hidden bg-[#0A1628]">
                  <img
                    src={
                      car.images?.[0] ||
                      "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=800&q=80"
                    }
                    alt={`${car.make} ${car.model}`}
                    className="h-full w-full object-cover opacity-85 transition-transform duration-500 group-hover:scale-105 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0D1D33] via-transparent to-transparent" />

                  <div className="absolute left-3.5 top-3.5 rounded-lg border border-[#2DD4BF]/30 bg-[#0A1628]/85 px-3 py-1 backdrop-blur">
                    <span
                      className="text-xs font-bold text-[#2DD4BF] sm:text-sm"
                      style={mono}
                    >
                      ₹{car.price?.toLocaleString("en-IN") || "0"}
                    </span>
                  </div>
                </div>

                {/* CONTENT */}
                <div className="flex flex-1 flex-col justify-between p-5 sm:p-6">
                  <div>
                    <h3
                      className="truncate text-lg font-bold text-white transition-colors group-hover:text-[#2DD4BF]"
                      style={display}
                    >
                      {car.make} {car.model}
                    </h3>

                    <div className="mb-5 mt-3 flex flex-wrap gap-2">
                      {car.year && (
                        <span
                          className="rounded-md border border-white/10 bg-[#0A1628] px-2.5 py-1 text-xs text-[#C8D3E0]"
                          style={mono}
                        >
                          {car.year}
                        </span>
                      )}
                      {(car.fuel_type || car.fuelType) && (
                        <span className="rounded-md border border-white/10 bg-[#0A1628] px-2.5 py-1 text-xs text-[#8EA0B5]">
                          {car.fuel_type || car.fuelType}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* ACTIONS */}
                  <div className="flex items-center justify-between border-t border-white/10 pt-4">
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => navigate(`/seller/edit-vehicle/${car._id}`)}
                        aria-label={`Edit ${car.make} ${car.model}`}
                        className={`rounded-lg p-2 text-[#8EA0B5] transition-colors hover:bg-white/5 hover:text-[#2DD4BF] ${focusRing}`}
                      >
                        <Edit3 size={17} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(car._id)}
                        aria-label={`Delete ${car.make} ${car.model}`}
                        className={`rounded-lg p-2 text-[#8EA0B5] transition-colors hover:bg-white/5 hover:text-rose-400 ${focusRing}`}
                      >
                        <Trash2 size={17} />
                      </button>
                    </div>

                    <Link
                      to={`/vehicle/${car._id}`}
                      className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-[#C8D3E0] transition-colors hover:bg-white/5 hover:text-[#2DD4BF] ${focusRing}`}
                    >
                      <span>View public</span>
                      <ExternalLink size={13} />
                    </Link>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyGarage;