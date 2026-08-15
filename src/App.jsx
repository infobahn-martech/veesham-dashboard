import AppRoutes from "./routes/AppRoutes";
import { JobsDataProvider } from "./context/JobsDataContext";
import { ToastProvider } from "./context/ToastContext";

function App() {
  return (
    <JobsDataProvider>
      <ToastProvider>
        <AppRoutes />
      </ToastProvider>
    </JobsDataProvider>
  );
}

export default App;
