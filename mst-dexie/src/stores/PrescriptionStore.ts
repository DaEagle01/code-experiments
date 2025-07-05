import { types, flow, type Instance, getSnapshot, addDisposer } from "mobx-state-tree";
import { db, type PrescriptionDBSchema } from "../db";
import { reaction } from "mobx";
import { Prescription, type IPrescription } from "../models/PrescriptionModel";
import { store } from "./RootStore";

export type NewPrescriptionInput = {
  id: string;
  medicineName: string;
  dosage: string;
  date: string;
  patientId: string;
};

export const PrescriptionStore = types
  .model("PrescriptionStore", {
    prescriptions: types.array(Prescription),
  })
  .views((self) => ({
    get latestPrescription() {
      return self.prescriptions[self.prescriptions.length - 1];
    },
  }))
  .actions((self) => ({
    addPrescription: ({ id, medicineName, dosage, date, patientId }: NewPrescriptionInput) => {
      const newRx = {
        id,
        medicineName,
        dosage,
        date,
        patient: patientId,
      };
      self.prescriptions.push(newRx);
    },

    removePrescription: (id: string) => {
      self.prescriptions.replace(self.prescriptions.filter((p) => p.id !== id));
    },

    loadFromDexie: flow(function* () {
      try {
        // Ensure patient store is hydrated before using MST references
        const all: IPrescription[] = yield db.prescriptions.toArray();

        const validPrescriptions = all
          // Only keep prescriptions that point to existing patients
          .filter((prescription) =>
            store.patientStore.patients.some(
              (patient) => patient.id === String(prescription.patient)
            )
          )
          // Convert Dexie objects to MST-compatible snapshots
          .map((prescription) => ({
            id: prescription.id,
            medicineName: prescription.medicineName,
            dosage: prescription.dosage,
            date: prescription.date,
            patient: prescription.patient, // MST will resolve this as a reference
          }));

        self.prescriptions.replace(validPrescriptions);
      } catch (err) {
        console.error("❌ Failed to load prescriptions from Dexie", err);
      }
    }),
  }))
  // 🔁 Auto save to Dexie when prescriptions change
  .actions((self) => ({
    afterCreate() {
      let previousIds: string[] = [];

      const disposer = reaction(
        () => self.prescriptions.map((p) => getSnapshot(p)),
        (snapshotArray) => {
          const currentIds = snapshotArray.map((p) => p.id);
          const deletedIds = previousIds.filter((id) => !currentIds.includes(id));
          previousIds = currentIds;

          if (deletedIds.length) {
            db.prescriptions.bulkDelete(deletedIds);
            console.log("🗑 Deleted prescriptions from Dexie:", deletedIds);
          }

          db.prescriptions.bulkPut(
            snapshotArray.filter((p) => p.patient !== undefined) as PrescriptionDBSchema[]
          );
          console.log("💾 Auto-saved prescriptions to Dexie");
        },
        { fireImmediately: true }
      );

      addDisposer(self, disposer);
    },
  }));

export type IPrescriptionStore = Instance<typeof PrescriptionStore>;
