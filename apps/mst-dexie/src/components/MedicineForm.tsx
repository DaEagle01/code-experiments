import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import type { Medicine } from "../models/Medicine";

interface Props {
  medicine: Medicine | null;
  onSave: (med: Medicine) => void;
  onCancel: () => void;
}

const categories = ["antibiotic", "painkiller", "antiviral", "vitamin"] as const;
const types = ["tablet", "syrup", "injection"] as const;

const MedicineForm: React.FC<Props> = ({ medicine, onSave, onCancel }) => {
  const [form, setForm] = useState<Medicine>(
    medicine || {
      id: "",
      name: "",
      category: "antibiotic",
      type: "tablet",
      company: "",
      expiryDate: new Date().toISOString().slice(0, 10),
      bought: false,
      taken: false,
    }
  );

  useEffect(() => {
    if (medicine) setForm(medicine);
  }, [medicine]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const target = e.target as HTMLInputElement | HTMLSelectElement;
    const { name, value, type } = target;
    const checked = (target as HTMLInputElement).checked;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.id) form.id = uuidv4();
    onSave(form);
    setForm({
      id: "",
      name: "",
      category: "antibiotic",
      type: "tablet",
      company: "",
      expiryDate: new Date().toISOString().slice(0, 10),
      bought: false,
      taken: false,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto mt-6 space-y-4 bg-white p-6 rounded-lg shadow-md"
    >
      <div>
        <label className="block mb-1 font-medium text-gray-700">Name</label>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          required
          autoFocus
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
        />
      </div>

      <div>
        <label className="block mb-1 font-medium text-gray-700">Category</label>
        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
        >
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block mb-1 font-medium text-gray-700">Type</label>
        <select
          name="type"
          value={form.type}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
        >
          {types.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block mb-1 font-medium text-gray-700">Company</label>
        <input
          name="company"
          value={form.company}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
        />
      </div>

      <div>
        <label className="block mb-1 font-medium text-gray-700">Expiry Date</label>
        <input
          type="date"
          name="expiryDate"
          value={form.expiryDate.slice(0, 10)}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
        />
      </div>

      <div className="flex items-center space-x-4">
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="bought"
            checked={form.bought}
            onChange={handleChange}
            className="h-4 w-4"
          />
          <span>Bought</span>
        </label>

        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="taken"
            checked={form.taken}
            onChange={handleChange}
            className="h-4 w-4"
          />
          <span>Taken</span>
        </label>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Save
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default MedicineForm;
