export type Medicine = {
  id: string;
  name: string;
  category: "antibiotic" | "painkiller" | "antiviral" | "vitamin";
  type: "tablet" | "syrup" | "injection";
  company: string;
  expiryDate: string; // ISO string
  bought: boolean;
  taken: boolean;
  dosage?: string;
  notes?: string;
};
