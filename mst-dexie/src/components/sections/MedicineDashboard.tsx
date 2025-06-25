import React, { useEffect, useState } from "react";
import type { Medicine } from "../../models/Medicine";
import { MedicineStore } from "../../stores/MedicineStore";
import Dashboard from "../Dashboard";
import SearchBar from "../SearchBar";
import MedicineList from "../MedicineList";
import MedicineForm from "../MedicineForm";

const MedicineDashboard: React.FC = () => {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [editing, setEditing] = useState<Medicine | null | undefined>(undefined);
  const [searchTerm, setSearchTerm] = useState("");

  const loadMedicines = async () => {
    const all = searchTerm
      ? await MedicineStore.searchByName(searchTerm)
      : await MedicineStore.getAll();
    setMedicines(all);
  };

  useEffect(() => {
    loadMedicines();
  }, [searchTerm]);

  const handleAdd = async (med: Medicine) => {
    await MedicineStore.add(med);
    setEditing(undefined);
    loadMedicines();
  };

  const handleUpdate = async (med: Medicine) => {
    await MedicineStore.update(med);
    setEditing(undefined);
    loadMedicines();
  };

  const handleDelete = async (id: string) => {
    await MedicineStore.delete(id);
    loadMedicines();
  };

  const handleEdit = (med: Medicine) => {
    setEditing(med);
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6 relative">
      <h1 className="text-2xl font-bold text-center text-blue-700">Medicine Tracker (IndexedDB)</h1>

      {/* Stats */}
      <Dashboard medicines={medicines} />

      {/* Search */}
      <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      {/* Add button */}
      <div className="flex justify-end">
        <button
          onClick={() => setEditing(null)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          + Add Medicine
        </button>
      </div>

      {/* List */}
      <div className="rounded-md border border-gray-200 overflow-hidden shadow-sm">
        <MedicineList medicines={medicines} onEdit={handleEdit} onDelete={handleDelete} />
      </div>

      {/* Modal */}
      {editing !== undefined && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center">
          <div className="bg-white w-full max-w-md p-6 rounded-md shadow-lg relative">
            <button
              onClick={() => setEditing(undefined)}
              className="absolute top-2 right-3 text-gray-400 hover:text-gray-600 text-xl"
            >
              &times;
            </button>

            <h2 className="text-lg font-semibold mb-4">
              {editing ? "Edit Medicine" : "Add New Medicine"}
            </h2>

            <MedicineForm
              key={editing?.id || "new"}
              medicine={editing}
              onCancel={() => setEditing(undefined)}
              onSave={editing ? handleUpdate : handleAdd}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicineDashboard;
