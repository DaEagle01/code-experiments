import { types, type Instance } from "mobx-state-tree";
import { Patient } from "./PatientModel";

export const Prescription = types.model("Prescription", {
  id: types.identifier,
  medicineName: types.string,
  dosage: types.string,
  date: types.string,
  patient: types.safeReference(types.late(() => Patient)), // 🔗 Reference to a patient
});

export type IPrescription = Instance<typeof Prescription>;
