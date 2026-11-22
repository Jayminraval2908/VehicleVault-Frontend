import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowLeft,
  ChevronDown,
  ClipboardCheck,
  ShieldCheck,
  Activity,
  PenTool,
  Loader2,
} from "lucide-react";
import { toast } from "react-toastify";
import inspectionService from "../../services/inspectionService";
import FormField, { inputClass } from "../../components/common/FormField";
import { display, focusRing } from "../../utils/theme";

const CORE_FIELDS = [
  {
    name: "engineStatus",
    label: "Engine",
    options: ["Excellent", "Good", "Fair", "Needs Repair"],
  },
  {
    name: "transmission",
    label: "Transmission",
    options: ["Automatic", "Manual", "Semi-Auto", "CVT"],
  },
  {
    name: "interiorGrade",
    label: "Interior",
    options: ["A+", "A", "B", "C", "D"],
  },
  {
    name: "exteriorGrade",
    label: "Exterior",
    options: ["A+", "A", "B", "C", "D"],
  },
];

const TECH_FIELDS = [
  {
    name: "suspension",
    label: "Suspension",
    options: ["Excellent", "Good", "Weak", "Leaking"],
  },
  {
    name: "brakeCondition",
    label: "Brakes",
    options: ["Excellent", "Good", "Fair", "Replace Soon"],
  },
  {
    name: "tireLife",
    label: "Tires",
    options: ["New", "Great (70-90%)", "Good", "Average", "Worn"],
  },
  {
    name: "acPerformance",
    label: "Air conditioning",
    options: ["Chilling", "Good", "Weak", "Not Working"],
  },
  {
    name: "accidentHistory",
    label: "Accident history",
    options: ["None", "Minor", "Major"],
  },
  {
    name: "serviceHistory",
    label: "Service history",
    options: ["Full Service History", "Partial", "None"],
  },
];

const ALL_FIELDS = [...CORE_FIELDS, ...TECH_FIELDS];

const MIN_SUMMARY = 10;
const MAX_SUMMARY = 1000;

const initialValues = {
  ...Object.fromEntries(ALL_FIELDS.map((f) => [f.name, ""])),
  summary: "",
};

function SelectField({ field, value, error, onChange }) {
  const id = `report-${field.name}`;

  return (
    <FormField id={id} label={field.label} error={error}>
      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(field.name, e.target.value)}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          className={`${inputClass(error)} appearance-none pr-10 [color-scheme:dark] ${
            value ? "" : "text-[#8EA0B5]"
          }`}
        >
          <option value="">Select</option>
          {field.options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <ChevronDown
          size={16}
          aria-hidden="true"
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#8EA0B5]"
        />
      </div>
    </FormField>
  );
}

export default function AddReport() {
  const params = useParams();
  const vehicleId = params.vehicleId || params.id;
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();

  const [values, setValues] = useState(initialValues);
  const [certified, setCertified] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const completed = ALL_FIELDS.filter((f) => values[f.name]).length;
  const progress = completed / ALL_FIELDS.length;

  const setField = (name, value) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const validate = () => {
    const next = {};

    ALL_FIELDS.forEach((f) => {
      if (!values[f.name]) {
        next[f.name] = { message: `Choose a rating for ${f.label.toLowerCase()}` };
      }
    });

    const summary = values.summary.trim();
    if (summary.length < MIN_SUMMARY) {
      next.summary = {
        message: `Write a summary of at least ${MIN_SUMMARY} characters`,
      };
    }

    if (!certified) {
      next.certified = { message: "Confirm that the report is accurate" };
    }

    return next;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    if (!vehicleId) {
      toast.error("This vehicle could not be found.");
      return;
    }

    const found = validate();
    setErrors(found);

    const firstKey = Object.keys(found)[0];
    if (firstKey) {
      const targetId =
        firstKey === "summary"
          ? "report-summary"
          : firstKey === "certified"
          ? "report-certified"
          : `report-${firstKey}`;
      document.getElementById(targetId)?.focus();
      return;
    }

    setLoading(true);
    try {
      await inspectionService.createReport({
        vehicle_id: vehicleId,
        ...values,
        summary: values.summary.trim(),
      });
      toast.success("Inspection report published");
      navigate("/seller/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not save the report.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-start justify-center bg-[#0A1628] p-4 text-[#C8D3E0] sm:p-6 lg:p-12">
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-5xl rounded-2xl border border-white/10 bg-[#0D1D33] p-5 shadow-2xl sm:p-8"
      >
        <button
          type="button"
          onClick={() => navigate(-1)}
          className={`group mb-6 flex items-center gap-2 text-sm text-[#8EA0B5] transition-colors hover:text-white ${focusRing}`}
        >
          <ArrowLeft
            size={16}
            className="transition-transform duration-200 group-hover:-translate-x-1"
          />
          Back
        </button>

        <header className="mb-8 border-b border-white/10 pb-6">
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
            <div className="rounded-xl border border-[#2DD4BF]/30 bg-[#2DD4BF]/10 p-3">
              <ShieldCheck className="text-[#2DD4BF]" size={26} aria-hidden="true" />
            </div>
            <div>
              <h1
                className="text-2xl font-bold text-white sm:text-3xl md:text-4xl"
                style={display}
              >
                Inspection report
              </h1>
              {vehicleId && (
                <p className="mt-1 text-sm text-[#8EA0B5]">
                  Vehicle #{vehicleId.slice(-6)}
                </p>
              )}
            </div>
          </div>

          <div className="mt-6">
            <div className="mb-2 flex justify-between text-sm text-[#8EA0B5]">
              <span>Ratings completed</span>
              <span className="tabular-nums">
                {completed} of {ALL_FIELDS.length}
              </span>
            </div>
            <div
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={ALL_FIELDS.length}
              aria-valuenow={completed}
              aria-label="Ratings completed"
              className="h-1.5 overflow-hidden rounded-full bg-white/10"
            >
              <motion.div
                className="h-full rounded-full bg-[#2DD4BF]"
                initial={false}
                animate={{ width: `${progress * 100}%` }}
                transition={{ duration: reduceMotion ? 0 : 0.35, ease: "easeOut" }}
              />
            </div>
          </div>
        </header>

        <form onSubmit={handleSubmit} noValidate className="space-y-10">
          <fieldset>
            <legend
              className="mb-4 flex items-center gap-2 text-lg font-semibold text-white"
              style={display}
            >
              <Activity size={18} className="text-[#2DD4BF]" aria-hidden="true" />
              Core components
            </legend>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {CORE_FIELDS.map((field) => (
                <SelectField
                  key={field.name}
                  field={field}
                  value={values[field.name]}
                  error={errors[field.name]}
                  onChange={setField}
                />
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend
              className="mb-4 flex items-center gap-2 text-lg font-semibold text-white"
              style={display}
            >
              <PenTool size={18} className="text-[#2DD4BF]" aria-hidden="true" />
              Technical details
            </legend>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {TECH_FIELDS.map((field) => (
                <SelectField
                  key={field.name}
                  field={field}
                  value={values[field.name]}
                  error={errors[field.name]}
                  onChange={setField}
                />
              ))}
            </div>
          </fieldset>

          <FormField id="report-summary" label="Summary" error={errors.summary}>
            <textarea
              id="report-summary"
              rows={5}
              maxLength={MAX_SUMMARY}
              value={values.summary}
              onChange={(e) => setField("summary", e.target.value)}
              placeholder="Describe the overall condition and anything a buyer should know."
              aria-invalid={!!errors.summary}
              aria-describedby={errors.summary ? "report-summary-error" : undefined}
              className={`${inputClass(errors.summary)} resize-y`}
            />
            <p className="pt-1.5 text-right text-sm tabular-nums text-[#8EA0B5]">
              {values.summary.length}/{MAX_SUMMARY}
            </p>
          </FormField>

          <div>
            <label
              htmlFor="report-certified"
              className="flex cursor-pointer items-start gap-3 rounded-xl border border-amber-300/25 bg-amber-300/5 p-4"
            >
              <input
                id="report-certified"
                type="checkbox"
                checked={certified}
                onChange={(e) => {
                  setCertified(e.target.checked);
                  if (errors.certified)
                    setErrors((prev) => ({ ...prev, certified: undefined }));
                }}
                className="mt-1 h-4 w-4 shrink-0 accent-[#2DD4BF]"
              />
              <span className="text-sm leading-relaxed text-[#C8D3E0]">
                I certify that this report is accurate. False information may
                lead to account suspension.
              </span>
            </label>
            {errors.certified && (
              <p role="alert" className="pt-1.5 text-sm text-red-400">
                {errors.certified.message}
              </p>
            )}
          </div>

          <motion.button
            type="submit"
            disabled={loading}
            whileHover={reduceMotion || loading ? undefined : { y: -2 }}
            whileTap={reduceMotion || loading ? undefined : { scale: 0.98 }}
            className={`flex w-full items-center justify-center gap-2 rounded-lg bg-[#2DD4BF] px-6 py-3.5 font-semibold text-[#0A1628] shadow-[0_8px_24px_-8px_rgba(45,212,191,0.55)] transition-colors hover:bg-[#5EEAD4] disabled:cursor-not-allowed disabled:opacity-60 ${focusRing}`}
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Publishing...
              </>
            ) : (
              <>
                <ClipboardCheck size={18} />
                Publish report
              </>
            )}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}