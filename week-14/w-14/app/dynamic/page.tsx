"use client";

import { useState } from "react";

export default function () {
  const [count, setCount] = useState(0);
  return (
    <>
      <div>this is a dynamic page</div>

      <button
        className="bg-gray-400 mt-2 p-2 rounded-lg"
        onClick={() => setCount(count + 1)}
      >
        count is {count}
      </button>
    </>
  );
}
