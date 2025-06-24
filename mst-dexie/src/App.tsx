import { observer } from "mobx-react-lite";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import moment from "moment";
import { store } from "./models/RootStore";
import { getSnapshot } from "mobx-state-tree";

const App = observer(() => {
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

  console.log(getSnapshot(store).prescriptionStore);
  return (
    <div style={{ padding: 20 }}>
      <h1>👨‍⚕️ Patients</h1>
      <div
        style={{
          display: "flex",
          gap: "16px",
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <input
          value={newPatientName}
          onChange={(e) => setNewPatientName(e.target.value)}
          placeholder="Enter patient name"
          style={{
            padding: "12px",
            border: "1px solid white",
            borderRadius: "4px",
            marginRight: 12,
          }}
        />
        <button onClick={handleAddPatient}>➕ Add Patient</button>

        <select
          value={selectedPatientId}
          onChange={(e) => setSelectedPatientId(e.target.value)}
          style={{
            padding: "10px",
            borderRadius: "5px",
            border: "1px solid #ccc",
            boxShadow: "2px 2px 5px rgba(0,0,0,0.1)",
          }}
        >
          <option value="">-- Select Patient --</option>
          {store.patientStore.patients.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>

      <h2>📋 Prescriptions</h2>
      <button onClick={handleAddPrescription}>➕ Add Prescription</button>
      <ul>
        {store.prescriptionStore.prescriptions.map((p) => (
          <li key={p.id}>
            {p.medicineName} - {p.dosage} ({moment(p.date).format("LT")})<br />
            Patient: {p.patient ? <strong>{p.patient.name}</strong> : <em>❌ Unknown</em>}
            <button onClick={() => handleRemovePrescription(p.id)} style={{ marginLeft: "12px" }}>
              ❌
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
});

export default App;
