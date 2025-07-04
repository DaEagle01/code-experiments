import { types, type Instance } from "mobx-state-tree";
import { MedicineCatalog } from "../models/MedicineCatalogModel";

export const MedicineCatalogStore = types.model("MedicineCatalogStore", {
  medicines: types.array(MedicineCatalog),
});

export type IMedicineCatalogStore = Instance<typeof MedicineCatalogStore>;
