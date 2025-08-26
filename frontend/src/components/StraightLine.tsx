import React from "react";

interface StraightLineProps {
  className?: string;
  thickness?: string;
  color?: string;
}

export default function StraightLine({
  className = "",
  thickness = "h-[2px]",
  color = "bg-gradient-to-r from-white/0 via-white/30 to-white/0",
}: StraightLineProps) {
  return (
    <div className={`w-full my-8 flex justify-center ${className}`}>
      <div
        className={`w-full max-w-7xl ${thickness} ${color} rounded-full`}
      ></div>
    </div>
  );
}
