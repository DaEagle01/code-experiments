import { types, flow, getSnapshot, addDisposer } from "mobx-state-tree";
import { reaction } from "mobx";
import { Patient, type IPatient } from "./PatientModel";
import { db } from "../db";

export const PatientStore = types
  .model("PatientStore", {
    patients: types.array(Patient),
  })

  .actions((self) => ({
    addPatient(patient: IPatient) {
      self.patients.push(patient);
    },

    removePatient(id: string) {
      self.patients.replace(self.patients.filter((p) => p.id !== id));
    },

    loadFromDexie: flow(function* () {
      try {
        const all = yield db.patients.toArray();
        self.patients = all;
      } catch (err) {
        console.error("❌ Dexie load failed", err);
      }
    }),
  }))

  .actions((self) => ({
    afterCreate() {
      const disposer = reaction(
        () => self.patients.map((p) => getSnapshot(p)),
        (snapshotArray) => {
          db.patients.bulkPut(snapshotArray);
          console.log("💾 Patients auto-saved");
        }
      );
      addDisposer(self, disposer);
    },
  }));
