import Dexie, { type Table } from "dexie";

export interface PatientDBSchema {
  id: string;
  name: string;
}

export interface PrescriptionDBSchema {
  id: string;
  medicineName: string;
  dosage: string;
  date: string;
  patient: string; // 🔗 just patient ID
}

class RxDatabase extends Dexie {
  prescriptions!: Table<PrescriptionDBSchema, string>;
  patients!: Table<PatientDBSchema, string>;

  constructor() {
    super("RxPrescriptions");
    this.version(1).stores({
      prescriptions: "id, medicineName, dosage, date, patient",
      patients: "id, name",
    });
  }
}

export const db = new RxDatabase();
