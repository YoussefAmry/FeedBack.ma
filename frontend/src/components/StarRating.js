import { useState } from "react";

export default function StarRating({ value, onChange }) {
  const [hover, setHover] = useState(0);

  return (
    <div className="flex flex-row gap-1">
      {[1,2,3,4,5].map((star) => (
        <button
          key={star}
          type="button"
          className={`text-3xl ${star <= (hover || value) ? "text-yellow-400" : "text-gray-300"}`}
          onClick={() => onChange(star)}
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
        >★</button>
      ))}
    </div>
  );
} 