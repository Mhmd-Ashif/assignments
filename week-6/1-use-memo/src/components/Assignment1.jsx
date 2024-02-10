import { useEffect, useMemo, useState } from "react";

// In this assignment, your task is to create a component that performs an expensive calculation (finding the factorial) based on a user input.
// Use useMemo to ensure that the calculation is only recomputed when the input changes, not on every render.

export function Assignment1() {
  const [input, setInput] = useState(0);
  // Your solution starts here
  let fact = 1;
  const expensiveValue = useMemo(() => {
    for (let i = input; i > 0; i--) {
      fact = i * fact;
    }
    return fact;
  }, [input]);
  // Your solution ends here
  return (
    <div>
      <div>Re renderabel component after every 5 seconds</div>
      <input
        type="number"
        value={input}
        onChange={(e) => setInput(Number(e.target.value))}
      />
      <p>Calculated Value: {expensiveValue}</p>
    </div>
  );
}
