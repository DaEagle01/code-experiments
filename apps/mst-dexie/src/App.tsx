import { observer } from "mobx-react-lite";
import CreatePatientAndPrescription from "./components/sections/CreatePatientAndPrescription";
import MedicineDashboard from "./components/sections/MedicineDashboard";

const App = observer(() => {
  return (
    <div className="min-h-screen">
      {/* Uses MST + Dexie */}
      <CreatePatientAndPrescription />

      {/* Uses MST + plain IndexedDB */}
      {/* <MedicineDashboard /> */}
    </div>
  );
});

export default App;
