import React, { useState } from "react";
import { useLocation } from "react-router-dom";

const ValuesPage = () => {
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const projectId = queryParams.get("projectId");
  const parentId = queryParams.get("parentId");
  const username = queryParams.get("username");
  const projectname = queryParams.get("projectname");
  const add = queryParams.get("add");

  const [rows, setRows] = useState([{ value: "", satisfaction: "" }]);

  const handleAddRow = () => {
    setRows([...rows, { value: "", satisfaction: "" }]);
  };

  const handleChange = (e, index, type) => {
    const newRows = [...rows];
    newRows[index][type] = e.target.value;
    setRows(newRows);
  };

  const handleSubmit = () => {
    let isValid = true;
    for (let i = 1; i < rows.length; i++) {
      if (parseInt(rows[i].value) <= parseInt(rows[i - 1].value)) {
        isValid = false;
        break;
      }
    }

    if (isValid) {
      console.log("Form submitted successfully:", rows);
    } else {
      alert("Please enter the values in ascending order.");
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Values Page</h1>
      <p>Project ID: {projectId}</p>
      <p>Parent ID: {parentId}</p>
      <p>Username: {username}</p>
      <p>Project Name: {projectname}</p>
      <p>Additional Param: {add}</p>

      <div className="my-6">
        <hr className="border-t-2 border-gray-300 mb-4" />
        <p className="text-lg mb-4">Fill the values and satisfaction</p>
        <p className="text-sm text-gray-500 mb-6">
          Please enter the values in ascending order, satisfaction can be any
          value.
        </p>

        <table className="table-auto w-full border-collapse bg-white shadow-lg rounded-lg">
          <thead>
            <tr className="bg-green-500 text-white">
              <th className="px-4 py-2 border border-gray-300">Values</th>
              <th className="px-4 py-2 border border-gray-300">Satisfaction</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={index} className="hover:bg-gray-100">
                <td className="px-4 py-2 border border-gray-300">
                  <input
                    type="number"
                    value={row.value}
                    onChange={(e) => handleChange(e, index, "value")}
                    className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Enter value"
                  />
                </td>
                <td className="px-4 py-2 border border-gray-300">
                  <input
                    type="text"
                    value={row.satisfaction}
                    onChange={(e) => handleChange(e, index, "satisfaction")}
                    className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Enter satisfaction"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-between mt-4">
          <button
            onClick={handleAddRow}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none"
          >
            Add Row
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default ValuesPage;
