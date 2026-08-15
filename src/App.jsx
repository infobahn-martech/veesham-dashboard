import AppRoutes from "./routes/AppRoutes";
import { JobsDataProvider } from "./context/JobsDataContext";
import { UsersDataProvider } from "./context/UsersDataContext";
import { ToastProvider } from "./context/ToastContext";

function App() {
  return (
    <JobsDataProvider>
      <UsersDataProvider>
        <ToastProvider>
          <AppRoutes />
        </ToastProvider>
      </UsersDataProvider>
    </JobsDataProvider>
  );
}

export default App;
