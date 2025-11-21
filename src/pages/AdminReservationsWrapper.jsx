import React, { useState } from "react";
import AdminLogin from "../pages/AdminLogin";
import AdminReservations from "./AdminReservations";

const AdminReservationsWrapper = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return isLoggedIn ? (
    <AdminReservations />
  ) : (
    <AdminLogin onLogin={() => setIsLoggedIn(true)} />
  );
};

export default AdminReservationsWrapper;
