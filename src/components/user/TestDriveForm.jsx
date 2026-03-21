import React, { useState } from "react";
import Input from "../common/Input";
import Button from "../common/Button";
import { CalendarCheck } from "lucide-react";

export default function TestDriveForm({ onSubmit, loading }) {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ date, time });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <Input 
          label="Preferred Date" 
          type="date"
          min={new Date().toISOString().split("T")[0]} 
          value={date} 
          onChange={(e) => setDate(e.target.value)} 
          required 
        />
        <Input 
          label="Preferred Time" 
          type="time" 
          value={time} 
          onChange={(e) => setTime(e.target.value)} 
          required 
        />
      </div>
      <div className="bg-[#0D0D0D] p-3 rounded-xl border border-gray-800">
        <p className="text-[10px] text-gray-500 leading-tight">
          * Driver's license verification required upon arrival.
        </p>
      </div>
      <Button type="submit" className="w-full flex justify-center gap-2" disabled={loading}>
        <CalendarCheck size={18} /> CONFIRM SESSION
      </Button>
    </form>
  );
}