import "../watch/Header.css";
import { useState } from "react";
import { MyContext } from "../context/Context";
import ActivationModal from "./ActivationModal";
import { IoMenu } from "react-icons/io5";
import { Link } from "react-router-dom";

function Header() {
  const { loggedUser } = MyContext();
  const [isActivationModalOpen, setIsActivationModalOpen] = useState(false);
  const [modal, setModal] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("loggedUser");
    window.location.href = "/";
  };

  function openModal() {
    setModal(!modal);
  }

  const openActivationModal = () => {
    setIsActivationModalOpen(true);
  };
  const closeActivationModal = () => {
    setIsActivationModalOpen(false);
  };

  return (
    <div className="header-wraper">
      <div>
        {loggedUser?.user?.accountStatus !== "activated" && (
          <div className="activation-reminder">
            Please activate your account.
            <button
              style={{
                border: "none",
                backgroundColor: "#fee60c",
                marginLeft: ".5rem",
              }}
              onClick={openActivationModal}
            >
              <Link> Activate Now to start earning money</Link>
            </button>
          </div>
        )}

        <div className="header-textt">
          <div className="headerpart1" style={{ display: "flex" }}>
            <div
              className="logohead"
              style={{ display: "flex", marginLeft: "-7rem" }}
            >
              <h1>
                BT
                <span style={{ color: "#fee60c" }}>Net</span>
              </h1>
              <IoMenu className="menu-icon" style={{ marginLeft: "3.1rem" }} />
            </div>
          </div>

          <div className="header-text2">
            <button
              className="header-button"
              style={{ border: "none", marginRight: "-3rem" }}
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {isActivationModalOpen && (
        <ActivationModal onClose={closeActivationModal} />
      )}
    </div>
  );
}

export default Header;
