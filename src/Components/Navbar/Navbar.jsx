import React from "react";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase";
import { useNavigate } from "react-router-dom";
import "./Navbar.css";
import { PiSignOutBold } from "react-icons/pi";

const Navbar = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    signOut(auth).then(() => {
      navigate("/");
    });
  };
  return (
    <div className="navbar">
      <div>
        <h2>Cloud Drive</h2>
      </div>
      <div>
        <button className="logout-button" onClick={handleLogout}>
          Signout
          <PiSignOutBold />
        </button>
      </div>
    </div>
  );
};

export default Navbar;
