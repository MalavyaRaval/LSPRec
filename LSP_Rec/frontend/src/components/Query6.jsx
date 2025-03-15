import React, { useState } from "react";

const Query6 = () => {
  const [values, setValues] = useState({ lower: "", middle: "", upper: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const lower = parseFloat(values.lower);
    const middle = parseFloat(values.middle);
    const upper = parseFloat(values.upper);
    if (isNaN(lower) || isNaN(middle) || isNaN(upper)) {
      setError("Please enter valid numbers in all fields.");
      return;
    }
    if (!(lower < middle && middle < upper)) {
      setError("Ensure that lower < middle < upper.");
      return;
    }
    setError("");
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-2">
        Query 6: I prefer a specific range of values
      </h1>
      <p className="mb-4">
        Please answer the following questions. Your values must create a
        strictly increasing sequence.
      </p>
      <p className="mb-2 font-semibold">Your Choice: [Analyzed Item]</p>
      <table className="min-w-full border-collapse border border-gray-400 mb-4">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-400 p-2">Description</th>
            <th className="border border-gray-400 p-2">Value</th>
          </tr>
        </thead>
        <tbody>
          <tr className="hover:bg-gray-100">
            <td className="border border-gray-400 p-2">
              It is unacceptable if the value is less than
            </td>
            <td className="border border-gray-400 p-2">
              <input
                type="number"
                name="lower"
                value={values.lower}
                onChange={handleChange}
                onBlur={validate}
                className="w-full border rounded px-2 py-1"
              />
            </td>
          </tr>
          <tr className="hover:bg-gray-100">
            <td className="border border-gray-400 p-2">
              I am fully satisfied if the offered value is between the following
              two values
            </td>
            <td className="border border-gray-400 p-2">
              <input
                type="number"
                name="middle"
                value={values.middle}
                onChange={handleChange}
                onBlur={validate}
                className="w-full border rounded px-2 py-1"
              />
            </td>
          </tr>
          <tr className="hover:bg-gray-100">
            <td className="border border-gray-400 p-2">
              It is unacceptable if the value is greater than
            </td>
            <td className="border border-gray-400 p-2">
              <input
                type="number"
                name="upper"
                value={values.upper}
                onChange={handleChange}
                onBlur={validate}
                className="w-full border rounded px-2 py-1"
              />
            </td>
          </tr>
        </tbody>
      </table>
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
};

export default Query6;
