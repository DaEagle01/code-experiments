import React, { useEffect, useRef, useState } from "react";
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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [page, setPage] = useState(0);
  const PER_PAGE = 3;

  const loadMedicines = async () => {
    const all = searchTerm
      ? await MedicineStore.searchByName(searchTerm)
      : await MedicineStore.getPaginated(page * PER_PAGE, PER_PAGE);
    setMedicines(all);
  };

  useEffect(() => {
    loadMedicines();
  }, [searchTerm, page]);

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

  const handleExport = async () => {
    const blob = await MedicineStore.exportAll();
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "medicines_backup.json";
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    try {
      const count = await MedicineStore.importFromJSON(text);
      alert(`Imported ${count} medicines.`);
      loadMedicines();
    } catch (err) {
      console.log(err);
      alert("Failed to import JSON.");
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6 relative">
      <h1 className="text-2xl font-bold text-center text-blue-700">Medicine Tracker (IndexedDB)</h1>

      {/* Stats */}
      <Dashboard medicines={medicines} />

      {/* Search */}
      <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      {/* Add button */}
      <div className="flex justify-end gap-2">
        <>
          <button
            onClick={handleClick}
            className="px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-700 transition"
          >
            📩 Import Medicine
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleImport}
            className="hidden"
          />
        </>
        <button
          onClick={handleExport}
          className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700 transition"
        >
          📤 Export Backup (JSON)
        </button>
        <button
          onClick={async () => {
            confirm(`Are you sure you want to delete all expired medicine(s).`);
            await MedicineStore.deleteExpired();
            loadMedicines();
          }}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
        >
          🗑️ Delete Expired Medicines
        </button>

        <button
          onClick={() => setEditing(null)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          + Add Medicine
        </button>
      </div>

      {/* List */}
      <div className="overflow-hidden shadow-sm">
        <MedicineList medicines={medicines} onEdit={handleEdit} onDelete={handleDelete} />

        <div className="flex items-center justify-center gap-4 my-4">
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 0))}
            className="px-3 py-1.5 rounded bg-zinc-600 text-white hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={page === 0}
          >
            Prev
          </button>

          <span className="text-sm font-medium text-zinc-800 ">Page {page + 1}</span>

          <button
            onClick={() => setPage((p) => p + 1)}
            className="px-3 py-1.5 rounded bg-zinc-600 text-white hover:bg-zinc-700"
          >
            Next
          </button>
        </div>
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
