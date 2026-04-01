import React, { useState } from "react";
import { Upload, X } from "lucide-react";

const ImageUpload = ({ onUpload }) => {
  const [preview, setPreview] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      onUpload(file); // Pass the file up to the parent form
    }
  };

  return (
    <div className="w-full">
      <label className="block text-sm text-gray-400 mb-2">Vehicle Presentation Image</label>
      <div className="relative border-2 border-dashed border-gray-800 rounded-2xl h-48 flex flex-col items-center justify-center hover:border-[#D4AF37]/50 transition-all cursor-pointer bg-[#0D0D0D]">
        {preview ? (
          <>
            <img src={preview} className="h-full w-full object-cover rounded-2xl" alt="Preview" />
            <button
              onClick={() => setPreview(null)}
              className="absolute top-2 right-2 bg-red-600 p-1 rounded-full text-white"
            >
              <X size={16} />
            </button>
          </>
        ) : (
          <div className="text-center">
            <Upload className="mx-auto text-gray-600 mb-2" size={32} />
            <p className="text-xs text-gray-500">Click or drag luxury vehicle photo</p>
            <input
              type="file"
              className="absolute inset-0 opacity-0 cursor-pointer"
              onChange={handleImageChange}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUpload;