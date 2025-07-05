import React from "react";
import type { Medicine } from "../models/Medicine";

interface Props {
  medicines: Medicine[];
  onEdit: (med: Medicine) => void;
  onDelete: (id: string) => void;
}

const MedicineList: React.FC<Props> = ({ medicines, onEdit, onDelete }) => {
  return (
    <>
      {medicines.length === 0 ? (
        <p className="text-center text-gray-500 py-4">No medicines found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 text-sm text-left">
            <thead className="bg-gray-100 text-gray-700 uppercase">
              <tr>
                <th className="px-4 py-2 border">Name</th>
                <th className="px-4 py-2 border">Category</th>
                <th className="px-4 py-2 border">Type</th>
                <th className="px-4 py-2 border">Company</th>
                <th className="px-4 py-2 border">Expiry Date</th>
                <th className="px-4 py-2 border">Bought</th>
                <th className="px-4 py-2 border">Taken</th>
                <th className="px-4 py-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {medicines.map((med) => (
                <tr key={med.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border">{med.name}</td>
                  <td className="px-4 py-2 border">{med.category}</td>
                  <td className="px-4 py-2 border">{med.type}</td>
                  <td className="px-4 py-2 border">{med.company}</td>
                  <td className="px-4 py-2 border">
                    {new Date(med.expiryDate).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2 border">{med.bought ? "Yes" : "No"}</td>
                  <td className="px-4 py-2 border">{med.taken ? "Yes" : "No"}</td>
                  <td className="px-4 py-2 border">
                    <button
                      onClick={() => onEdit(med)}
                      className="text-blue-600 hover:underline mr-3"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(med.id)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
};

export default MedicineList;
