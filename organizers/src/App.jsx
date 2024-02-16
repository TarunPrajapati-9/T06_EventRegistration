import { Toaster } from "react-hot-toast";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import LoginPage from "./app/LoginPage";
import HomePage from "./app/HomePage";
import CreateEvent from "./app/CreateEvent";
import NavBar from "./components/NavBar";

import "./index.css";

function App() {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: { queries: { refetchOnWindowFocus: false } },
      })
  );
  return (
    <Router>
      <QueryClientProvider client={queryClient}>
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              borderRadius: "10px",
              background: "#333",
              color: "#fff",
            },
          }}
          reverseOrder={false}
        />
        <AppContent />
      </QueryClientProvider>
    </Router>
  );
}

function AppContent() {
  const location = useLocation();
  const hideNavbar = location.pathname === "/signin";
  const authenticated = true;
  return (
    <>
      {!hideNavbar && <NavBar />}
      {authenticated ? (
        <Routes>
          <Route exact path="/" element={<HomePage />} />
          <Route exact path="/CreateEvent" element={<CreateEvent />} />
          <Route exact path="/signin" element={<LoginPage />} />
        </Routes>
      ) : (
        <Routes>
          <Route exact path="/signin" element={<LoginPage />} />
        </Routes>
      )}
    </>
  );
}

export default App;
