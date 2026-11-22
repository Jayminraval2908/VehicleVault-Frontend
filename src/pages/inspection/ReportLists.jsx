import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import {
  ShieldCheck,
  ChevronLeft,
  Gauge,
  Activity,
  AlertCircle,
  Settings,
  Disc,
  Wind,
  History,
  LifeBuoy,
  RefreshCw,
  FileText,
} from "lucide-react";
import inspectionService from "../../services/inspectionService";
import { display, focusRing } from "../../utils/theme";

const GRADE_TONES = {
  "A+": "good",
  A: "good",
  B: "warn",
  C: "warn",
  D: "bad",
};

const GROUPS = [
  {
    title: "Core performance",
    items: [
      {
        key: "engineStatus",
        label: "Engine",
        Icon: Gauge,
        tones: { Excellent: "good", Good: "good", Fair: "warn", "Needs Repair": "bad" },
      },
      { key: "transmission", label: "Transmission", Icon: Settings, tones: {} },
      {
        key: "acPerformance",
        label: "Air conditioning",
        Icon: Wind,
        tones: { Chilling: "good", Good: "good", Weak: "warn", "Not Working": "bad" },
      },
      {
        key: "serviceHistory",
        label: "Service history",
        Icon: History,
        tones: {
          "Full Service History": "good",
          Full: "good",
          Partial: "warn",
          None: "bad",
        },
      },
    ],
  },
  {
    title: "Mechanical health",
    items: [
      {
        key: "suspension",
        label: "Suspension",
        Icon: Activity,
        tones: { Excellent: "good", Good: "good", Weak: "warn", Leaking: "bad" },
      },
      {
        key: "brakeCondition",
        label: "Brakes",
        Icon: Disc,
        tones: { Excellent: "good", Good: "good", Fair: "warn", "Replace Soon": "bad" },
      },
      {
        key: "tireLife",
        label: "Tires",
        Icon: LifeBuoy,
        tones: {
          New: "good",
          "Great (70-90%)": "good",
          Good: "good",
          Average: "warn",
          Worn: "bad",
        },
      },
      {
        key: "accidentHistory",
        label: "Accident history",
        Icon: AlertCircle,
        tones: { None: "good", Minor: "warn", Major: "bad" },
      },
    ],
  },
];

const TONE_CLASSES = {
  good: { text: "text-[#2DD4BF]", dot: "bg-[#2DD4BF]" },
  warn: { text: "text-amber-300", dot: "bg-amber-300" },
  bad: { text: "text-red-400", dot: "bg-red-400" },
  neutral: { text: "text-white", dot: "bg-[#8EA0B5]" },
};

const normalizeList = (res) => {
  const data = res?.data?.data || res?.data || res;
  return Array.isArray(data) ? data : [];
};

const formatDate = (value) => {
  if (!value) return "Date not recorded";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Date not recorded";
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

function ReportItem({ Icon, label, value, tone = "neutral" }) {
  const classes = TONE_CLASSES[tone] || TONE_CLASSES.neutral;

  return (
    <div className="group flex items-center gap-4">
      <div className="shrink-0 rounded-lg bg-white/5 p-2.5 text-[#2DD4BF] transition-colors group-hover:bg-[#2DD4BF] group-hover:text-[#0A1628]">
        <Icon size={18} aria-hidden="true" />
      </div>
      <div className="min-w-0">
        <p className="text-sm text-[#8EA0B5]">{label}</p>
        <p className={`flex items-center gap-2 font-semibold ${classes.text}`}>
          <span
            aria-hidden="true"
            className={`h-2 w-2 shrink-0 rounded-full ${classes.dot}`}
          />
          {value || "—"}
        </p>
      </div>
    </div>
  );
}

function GradeBox({ label, value }) {
  const tone = TONE_CLASSES[GRADE_TONES[value] || "neutral"];

  return (
    <div className="flex-1 rounded-xl border border-white/10 bg-white/5 p-3">
      <p className="text-sm text-[#8EA0B5]">{label}</p>
      <p className={`text-xl font-bold ${tone.text}`} style={display}>
        {value || "—"}
      </p>
    </div>
  );
}

function ReportCard({ report, isLatest, index }) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.li
      initial={reduceMotion ? false : { opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: reduceMotion ? 0 : index * 0.1, ease: "easeOut" }}
      className="overflow-hidden rounded-2xl border border-white/10 bg-[#0D1D33]"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 bg-[#102238] p-5 sm:px-8">
        <div>
          <p className="text-sm text-[#8EA0B5]">Report date</p>
          <p className="font-semibold text-white">{formatDate(report.createdAt)}</p>
        </div>
        {isLatest && (
          <span className="rounded-full border border-[#2DD4BF]/40 bg-[#2DD4BF]/10 px-3 py-1 text-sm font-medium text-[#2DD4BF]">
            Latest report
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 gap-8 p-5 sm:p-8 lg:grid-cols-3 lg:gap-10">
        {GROUPS.map((group) => (
          <section key={group.title} className="space-y-5">
            <h3
              className="border-l-2 border-[#2DD4BF] pl-3 text-lg font-semibold text-white"
              style={display}
            >
              {group.title}
            </h3>
            {group.items.map(({ key, label, Icon, tones }) => (
              <ReportItem
                key={key}
                Icon={Icon}
                label={label}
                value={report[key]}
                tone={tones[report[key]] || "neutral"}
              />
            ))}
          </section>
        ))}

        <section className="flex flex-col gap-5">
          <h3
            className="border-l-2 border-[#2DD4BF] pl-3 text-lg font-semibold text-white"
            style={display}
          >
            Appearance and notes
          </h3>

          <div className="flex gap-3">
            <GradeBox label="Exterior" value={report.exteriorGrade} />
            <GradeBox label="Interior" value={report.interiorGrade} />
          </div>

          <div className="flex min-h-[150px] flex-1 flex-col rounded-2xl border border-white/10 bg-[#0A1628] p-5">
            <p className="mb-2 text-sm font-semibold text-[#2DD4BF]">
              Seller’s summary
            </p>
            <p className="flex-1 overflow-y-auto leading-relaxed text-[#C8D3E0]">
              {report.summary ? `“${report.summary}”` : "No summary was provided."}
            </p>
          </div>
        </section>
      </div>
    </motion.li>
  );
}

function SkeletonList() {
  return (
    <ul className="space-y-8" aria-busy="true" aria-label="Loading reports">
      {[0, 1].map((i) => (
        <li
          key={i}
          className="h-80 rounded-2xl border border-white/10 bg-[#0D1D33] motion-safe:animate-pulse"
        />
      ))}
    </ul>
  );
}

export default function ReportsList() {
  const params = useParams();
  const vehicleId = params.vehicleId || params.id;
  const navigate = useNavigate();

  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let active = true;

    const fetchReports = async () => {
      setLoading(true);
      setFailed(false);

      try {
        const res = await inspectionService.getReportsByVehicle(vehicleId);
        if (!active) return;

        const list = normalizeList(res);
        list.sort(
          (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
        );
        setReports(list);
      } catch (err) {
        if (!active) return;
        console.error("Error fetching reports", err);
        setFailed(true);
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchReports();
    return () => {
      active = false;
    };
  }, [vehicleId, reloadKey]);

  return (
    <div className="min-h-screen bg-[#0A1628] p-5 text-[#C8D3E0] sm:p-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className={`group flex items-center gap-2 text-[#8EA0B5] transition-colors hover:text-white ${focusRing}`}
          >
            <ChevronLeft
              size={20}
              className="transition-transform duration-200 group-hover:-translate-x-1"
            />
            Back to vehicle
          </button>

          <div className="flex items-center gap-2 rounded-full border border-[#2DD4BF]/30 bg-[#2DD4BF]/10 px-4 py-2 text-sm font-medium text-[#2DD4BF]">
            <ShieldCheck size={16} aria-hidden="true" />
            Submitted by the seller
          </div>
        </div>

        <header className="mb-10">
          <h1
            className="text-3xl font-bold text-white sm:text-4xl lg:text-5xl"
            style={display}
          >
            Inspection reports
          </h1>
          {vehicleId && (
            <p className="mt-3 text-[#8EA0B5]">Vehicle #{vehicleId.slice(-6)}</p>
          )}
        </header>

        {loading ? (
          <SkeletonList />
        ) : failed ? (
          <div
            role="alert"
            className="rounded-2xl border border-red-400/30 bg-red-400/5 p-10 text-center sm:p-16"
          >
            <p className="text-white">We couldn’t load the reports.</p>
            <button
              type="button"
              onClick={() => setReloadKey((k) => k + 1)}
              className={`mt-5 inline-flex items-center gap-2 rounded-lg border border-white/20 px-5 py-2.5 font-medium text-white transition-colors hover:border-[#2DD4BF] hover:text-[#2DD4BF] ${focusRing}`}
            >
              <RefreshCw size={16} />
              Try again
            </button>
          </div>
        ) : reports.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/20 p-10 text-center sm:p-20">
            <FileText
              className="mx-auto mb-4 text-[#8EA0B5]"
              size={44}
              aria-hidden="true"
            />
            <p className="text-lg text-white">No inspection reports yet.</p>
            <p className="mt-2 text-[#8EA0B5]">
              The seller hasn’t added a report for this vehicle.
            </p>
          </div>
        ) : (
          <ul className="space-y-8">
            {reports.map((report, index) => (
              <ReportCard
                key={report._id}
                report={report}
                isLatest={index === 0}
                index={index}
              />
            ))}
          </ul>
        )}

        <footer className="mt-16 border-t border-white/10 pt-8 text-center">
          <p className="mx-auto max-w-xl text-sm leading-relaxed text-[#8EA0B5]">
            Inspection reports are snapshots of a vehicle’s condition on the
            report date. Vehicle Vault does not guarantee its condition after
            that date.
          </p>
        </footer>
      </div>
    </div>
  );
}