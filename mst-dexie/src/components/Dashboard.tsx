import React from "react";
import type { Medicine } from "../models/Medicine";

interface Props {
  medicines: Medicine[];
}

const Dashboard: React.FC<Props> = ({ medicines }) => {
  const total = medicines.length;
  const expired = medicines.filter((m) => new Date(m.expiryDate) < new Date()).length;
  const taken = medicines.filter((m) => m.taken).length;

  return (
    <div className="mb-6 text-sm text-gray-700">
      <span className="font-semibold">Total Medicines:</span> {total}{" "}
      <span className="mx-2">|</span>
      <span className="font-semibold">Expired:</span> {expired} <span className="mx-2">|</span>
      <span className="font-semibold">Taken:</span> {taken}
    </div>
  );
};

export default Dashboard;
