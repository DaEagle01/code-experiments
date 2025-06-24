import { types, type Instance } from "mobx-state-tree";

export const MedicineCatalog = types.model("MedicineCatalog", {
  id: types.identifier,
  name: types.string,
  type: types.string,
  strength: types.string,
  generic: types.string,
  manufacturer: types.string,
});

export type IMedicineCatalog = Instance<typeof MedicineCatalog>;
