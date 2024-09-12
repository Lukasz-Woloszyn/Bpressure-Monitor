import React from "react";
import "./index.scss";
import Logo from "../../../assets/logo.png";
import { FaCalendarPlus, FaCalendarAlt, FaUserCog } from "react-icons/fa";
import { FaChartColumn } from "react-icons/fa6";
import { BiLogOut, BiHelpCircle } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import { Logout } from "../../../API/AuthAPI";

export default function Bar() {
  let navigate = useNavigate();
  const goToRoute = (route) => {
    navigate(route);
  };
  return (
    <div className="bar-main">
      <img
        className="logo-bar"
        src={Logo}
        alt="BPMLogo"
        onClick={() => goToRoute("/home")}
      />
      <div className="icons-bar">
        <FaCalendarPlus
          size={60}
          className="react-icons"
          onClick={() => goToRoute("/home")}
        />
        <FaCalendarAlt
          size={60}
          className="react-icons"
          onClick={() => goToRoute("/history")}
        />
        <FaChartColumn
          size={60}
          className="react-icons"
          onClick={() => goToRoute("/stats")}
        />
      </div>
      <div className="icons-settings-bar">
        <BiHelpCircle
          size={60}
          className="react-settings-icons"
          onClick={() => goToRoute("/help")}
        />
        <FaUserCog
          size={55}
          className="react-settings-icons"
          onClick={() => goToRoute("/user")}
        />
        <BiLogOut size={55} className="react-settings-icons" onClick={Logout} />
      </div>
    </div>
  );
}
