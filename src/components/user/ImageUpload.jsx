import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Upload, X, RefreshCw } from "lucide-react";
import { focusRing } from "../../utils/theme";

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];

const formatSize = (bytes) =>
  bytes >= 1024 * 1024
    ? `${(bytes / (1024 * 1024)).toFixed(1)} MB`
    : `${Math.max(1, Math.round(bytes / 1024))} KB`;

export default function ImageUpload({
  onUpload,
  initialUrl = null,
  maxSizeMB = 5,
  label = "Vehicle presentation image",
}) {
  const reduceMotion = useReducedMotion();
  const inputRef = useRef(null);
  const objectUrlRef = useRef(null);

  const [preview, setPreview] = useState(initialUrl);
  const [fileInfo, setFileInfo] = useState(null);
  const [error, setError] = useState("");
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    return () => {
      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    };
  }, []);

  const releaseObjectUrl = () => {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }
  };

  const processFile = (file) => {
    if (!file) return;

    if (!ACCEPTED_TYPES.includes(file.type)) {
      setError("Use a JPG, PNG, or WebP image.");
      return;
    }
    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`Image must be ${maxSizeMB} MB or smaller.`);
      return;
    }

    releaseObjectUrl();
    const url = URL.createObjectURL(file);
    objectUrlRef.current = url;

    setPreview(url);
    setFileInfo({ name: file.name, size: file.size });
    setError("");
    onUpload?.(file);
  };

  const handleChange = (e) => {
    processFile(e.target.files?.[0]);
    e.target.value = "";
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    processFile(e.dataTransfer.files?.[0]);
  };

  const handleRemove = () => {
    releaseObjectUrl();
    setPreview(null);
    setFileInfo(null);
    setError("");
    if (inputRef.current) inputRef.current.value = "";
    onUpload?.(null);
  };

  const openPicker = () => inputRef.current?.click();

  return (
    <div className="w-full">
      <span className="mb-2 block text-sm font-medium text-white">{label}</span>

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_TYPES.join(",")}
        onChange={handleChange}
        className="hidden"
        aria-label={label}
      />

      <motion.div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        animate={{ scale: dragging && !reduceMotion ? 1.01 : 1 }}
        transition={{ duration: 0.15 }}
        className={`relative h-44 overflow-hidden rounded-2xl border-2 border-dashed transition-colors sm:h-56 ${
          dragging
            ? "border-[#2DD4BF] bg-[#2DD4BF]/10"
            : error
            ? "border-red-400 bg-[#0A1628]"
            : "border-white/20 bg-[#0A1628] hover:border-[#2DD4BF]/60"
        }`}
      >
        <AnimatePresence mode="wait" initial={false}>
          {preview ? (
            <motion.div
              key="preview"
              className="absolute inset-0"
              initial={reduceMotion ? false : { opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <img
                src={preview}
                alt="Selected vehicle preview"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-3 bg-gradient-to-t from-[#0A1628] to-transparent px-3 pb-3 pt-10">
                <p className="min-w-0 truncate text-sm text-white">
                  {fileInfo
                    ? `${fileInfo.name} · ${formatSize(fileInfo.size)}`
                    : "Current image"}
                </p>
                <div className="flex shrink-0 gap-2">
                  <button
                    type="button"
                    onClick={openPicker}
                    aria-label="Replace image"
                    className={`flex items-center gap-1.5 rounded-lg bg-white/15 px-3 py-1.5 text-sm text-white backdrop-blur transition-colors hover:bg-white/25 ${focusRing}`}
                  >
                    <RefreshCw size={14} />
                    Replace
                  </button>
                  <button
                    type="button"
                    onClick={handleRemove}
                    aria-label="Remove image"
                    className={`rounded-lg bg-red-500/90 p-1.5 text-white transition-colors hover:bg-red-500 ${focusRing}`}
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.button
              key="empty"
              type="button"
              onClick={openPicker}
              className={`absolute inset-0 flex flex-col items-center justify-center gap-2 px-4 text-center ${focusRing}`}
              initial={reduceMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <motion.span
                animate={
                  reduceMotion ? undefined : { y: dragging ? -6 : 0 }
                }
                transition={{ type: "spring", stiffness: 300, damping: 18 }}
              >
                <Upload
                  size={32}
                  className={dragging ? "text-[#2DD4BF]" : "text-[#8EA0B5]"}
                />
              </motion.span>
              <span className="text-sm font-medium text-white">
                {dragging ? "Drop the photo here" : "Click to upload or drag a photo here"}
              </span>
              <span className="text-sm text-[#8EA0B5]">
                JPG, PNG, or WebP, up to {maxSizeMB} MB
              </span>
            </motion.button>
          )}
        </AnimatePresence>
      </motion.div>

      <AnimatePresence>
        {error && (
          <motion.p
            role="alert"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden pt-1.5 text-sm text-red-400"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}