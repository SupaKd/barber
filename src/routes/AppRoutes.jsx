import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Reservation from "../components/Reservation";
import AdminReservationsWrapper from "../pages/AdminReservationsWrapper"; // wrapper avec login

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/reservations" element={<Reservation />} />
      <Route path="/admin-reservations" element={<AdminReservationsWrapper />} />
    </Routes>
  );
};

export default AppRoutes;
