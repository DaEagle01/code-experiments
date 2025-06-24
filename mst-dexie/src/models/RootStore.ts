import { flow, types, type Instance } from "mobx-state-tree";
import { PatientStore } from "./PatientStore";
import { PrescriptionStore } from "./PrescriptionStore";
import { MedicineCatalogStore } from "./MedicineCatalogStore";

export const RootStore = types
  .model("RootStore", {
    patientStore: PatientStore,
    prescriptionStore: PrescriptionStore,
    medicineCatalogStore: MedicineCatalogStore,
  })
  .actions((self) => ({
    loadAllFromDexie: flow(function* () {
      yield self.patientStore.loadFromDexie();
      yield self.prescriptionStore.loadFromDexie();
    }),
    afterCreate: () => {
      // console.log("Created model", getSnapshot(self));
    },
  }));

// ✅ Initialize with defaults
export const store = RootStore.create({
  patientStore: { patients: [] },
  prescriptionStore: { prescriptions: [] },
  medicineCatalogStore: { medicines: [] },
});

async function bootstrapStore() {
  try {
    await store.loadAllFromDexie();
  } catch (e) {
    console.error("Store bootstrap failed", e);
  }
}

bootstrapStore();

// onSnapshot(store, (s) => console.log("📸 Snapshot", s));
// onAction(store, (a) => console.log("🎬 Action", a));
// onPatch(store, (p) => console.log("🩹 Patch", p));

export type IRootStore = Instance<typeof RootStore>;
