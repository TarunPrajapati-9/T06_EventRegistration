import Login from "./components/Login";
import HomePage from "./components/HomePage";
import { useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import React from "react";
import "./index.css";
import NavBar from "./components/NavBar";
import SignUp from "./components/SignUp";
import Events from "./components/Events";
import Contact from "./components/Contact";
import EventDetails from "./components/EventDetails";
import Footer from "./components/Footer";
import Registration from "./components/EventRegistaration";
import About from "./components/About";
import { Toaster } from "react-hot-toast";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import YourEvents from "./components/YourEvents";

function App() {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <Router>
      <QueryClientProvider client={queryClient}>
        <Toaster
          containerStyle={{
            position: "relative",
            width: "100%",
          }}
          toastOptions={{
            className: "bg-base-300 text-white",
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
  const hideNavbar =
    location.pathname === "/signIn" || location.pathname === "/signUp";

  const [openContactModal, setOpenContactModal] = React.useState(false);
  const navigate = useNavigate();

  React.useEffect(() => {
    setOpenContactModal(location.pathname === "/contact");
  }, [location.pathname]);

  const handleCloseContactModal = () => {
    setOpenContactModal(false);
    navigate("/");
  };

  return (
    <>
      {!hideNavbar && <NavBar />}
      <Routes>
        <Route exact path="/" element={<HomePage />} />
        <Route path="/about" element={<About />} />
        <Route
          exact
          path="/contact"
          element={
            <Contact
              open={openContactModal}
              handleClose={handleCloseContactModal}
            />
          }
        />
        <Route exact path="/events" element={<Events />} />
        <Route path="/events/:eventId" element={<EventDetails />} />
        <Route path="/registration/:eventId" element={<Registration />} />
        <Route path="/yourEvents" element={<YourEvents />} />
        <Route exact path="/signIn" element={<Login />} />
        <Route exact path="/signUp" element={<SignUp />} />
      </Routes>
      {!hideNavbar && <Footer />}
    </>
  );
}

export default App;
