import React, { useState } from "react";
import { store } from "../../stores/RootStore";
import { v4 as uuidv4 } from "uuid";
import moment from "moment";
import { observer } from "mobx-react-lite";

const CreatePatientAndPrescription = observer(() => {
  const [newPatientName, setNewPatientName] = useState("");
  const [selectedPatientId, setSelectedPatientId] = useState("");

  const handleAddPatient = () => {
    const newPatient = {
      id: uuidv4(),
      name: newPatientName || "Unnamed Patient",
    };
    store.patientStore.addPatient(newPatient);
    setNewPatientName("");
  };

  const handleAddPrescription = () => {
    if (!selectedPatientId) return alert("Select a patient first.");
    const newRx = {
      id: uuidv4(),
      medicineName: "Paracetamol",
      dosage: "500mg",
      date: new Date().toISOString(),
      patientId: selectedPatientId,
    };
    store.prescriptionStore.addPrescription(newRx);
  };

  const handleRemovePrescription = (id: string) => {
    store.prescriptionStore.removePrescription(id);
  };

  return (
    <div className="min-h-screen bg-white text-gray-800 p-8 space-y-10 font-sans">
      <h1 className="text-3xl font-bold flex items-center gap-2">
        👨‍⚕️ <span>Patient Manager</span>
      </h1>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              value={newPatientName}
              onChange={(e) => setNewPatientName(e.target.value)}
              placeholder="Enter patient name"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleAddPatient}
              className="bg-blue-600 text-white px-5 py-2 rounded-md font-semibold hover:bg-blue-700 transition"
            >
              ➕ Add Patient
            </button>
          </div>

          <select
            value={selectedPatientId}
            onChange={(e) => setSelectedPatientId(e.target.value)}
            className="w-2/4 px-4 py-2 border border-gray-800 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">-- Select Patient --</option>
            {store.patientStore.patients.map((p) => {
              const count = store.prescriptionStore.prescriptions.filter(
                (rx) => rx.patient?.id === p.id
              ).length;

              return (
                <option key={p.id} value={p.id}>
                  {p.name} {count > 0 ? `(${count} prescriptions)` : ""}
                </option>
              );
            })}
          </select>
        </div>

        <div className="space-y-2">
          <button
            onClick={handleAddPrescription}
            className="w-full bg-green-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-green-700 transition"
          >
            ➕ Add Prescription
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold flex items-center gap-2">
          📋 <span>Prescriptions</span>
        </h2>

        <ul className="space-y-4">
          {store.prescriptionStore.prescriptions.map((p) => (
            <li
              key={p.id}
              className="border border-gray-200 rounded-lg p-4 bg-gray-50 shadow-sm flex flex-col md:flex-row md:justify-between md:items-center"
            >
              <div className="space-y-1">
                <div className="text-lg font-medium text-gray-900">
                  💊 {p.medicineName} — {p.dosage}
                </div>
                <div className="text-sm text-gray-500">🕒 {moment(p.date).format("LLLL")}</div>
                <div className="text-sm">
                  👤 Patient:{" "}
                  {p.patient ? (
                    <span className="font-semibold text-gray-800">{p.patient.name}</span>
                  ) : (
                    <span className="text-red-600 font-medium">
                      ⚠️ Patient not found — record may be corrupted or deleted
                    </span>
                  )}
                </div>
              </div>

              <button
                onClick={() => handleRemovePrescription(p.id)}
                className="mt-3 md:mt-0 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
              >
                🗑️ Remove
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
});

export default CreatePatientAndPrescription;
