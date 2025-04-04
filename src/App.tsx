import { QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router } from "react-router-dom";
import { AppContextProvider } from "./data/hooks/AppContext";
import { queryClient } from "./data/lib/queryClient";
import { AppRoutes } from "./layouts/AppRoutes";
import ResponsiveLayout from "./layouts/ResponsiveLayout";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContextProvider>
        <Router>
          <ResponsiveLayout>
            <AppRoutes />
          </ResponsiveLayout>
        </Router>
      </AppContextProvider>
    </QueryClientProvider>
  );
}

export default App;
