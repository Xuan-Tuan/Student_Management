import { useState } from "react";
import PropTypes from "prop-types";
import Navbar from "../../component/header/navBar";
import ToolBar from "../../component/header/toolBar";

AdminPage.propTypes = {
  children: PropTypes.object,
};

export default function AdminPage({ children }) {
  const [isNavbarVisible, setNavbarVisible] = useState(true);

  const toggleNavbar = () => {
    setNavbarVisible(!isNavbarVisible);
  };

  return (
    <>
      <ToolBar toggleNavbar={toggleNavbar} isNavbarVisible={isNavbarVisible} />
      {isNavbarVisible && <Navbar />}
      <div
        className={`mt-20 ${
          isNavbarVisible ? "ml-16 md:ml-52" : "ml-0"
        } p-4 transition-all duration-300`}
      >
        {children}
      </div>
    </>
  );
}
