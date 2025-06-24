import {
  types,
  flow,
  type Instance,
  getSnapshot,
  addDisposer,
} from "mobx-state-tree";
import { Prescription } from "./PrescriptionModel";
import { db, type PrescriptionDBSchema } from "../db";
import { reaction } from "mobx";

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
    addPrescription: ({
      id,
      medicineName,
      dosage,
      date,
      patientId,
    }: NewPrescriptionInput) => {
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
        const all = yield db.prescriptions.toArray();
        self.prescriptions = all;
      } catch (err) {
        console.error("Dexie load failed", err);
      }
    }),
  }))
  // 🔁 Auto save to Dexie when prescriptions change
  .actions((self) => ({
    afterCreate() {
      const disposer = reaction(
        () => self.prescriptions.map((p) => getSnapshot(p)),
        (snapshotArray) => {
          db.prescriptions.bulkPut(
            snapshotArray.filter(
              (p) => p.patient !== undefined
            ) as PrescriptionDBSchema[]
          );
          console.log("💾 Auto-saved prescriptions to Dexie");
        }
      );
      addDisposer(self, disposer);
    },
  }));

export type IPrescriptionStore = Instance<typeof PrescriptionStore>;
