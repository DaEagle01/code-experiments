import { types, type Instance } from "mobx-state-tree";

export const Patient = types.model("Patient", {
  id: types.identifier,
  name: types.string,
});

export type IPatient = Instance<typeof Patient>;
