import { memo } from "react";
import { NavLink } from "react-router-dom";
import { RiAdminLine } from "react-icons/ri";
import { CgMenu } from "react-icons/cg";
import PropTypes from "prop-types";

const ToolBar = memo(function ToolBar({ toggleNavbar, isNavbarVisible }) {
  return (
    <header
      className={`bg-uitLight text-uit shadow-md flex items-center justify-between p-2 fixed top-0 ${
        isNavbarVisible ? "right-0 md:left-52 left-16" : "right-0 left-0"
      } w-auto border-l-2 border-white`}
    >
      <div className="cursor-pointer" onClick={toggleNavbar}>
        <CgMenu size={40} />
      </div>

      <div className="flex-grow mx-4">
        <input
          type="text"
          placeholder="Tìm kiếm..."
          className="w-full px-4 py-2 border border-gray-300 rounded-md"
        />
      </div>
      <div className="lg:flex lg:flex-col hidden text-base lg:text-xl text-center font-bold uppercase mr-2">
        Hệ thống quản
        <br />
        lý Sinh viên
      </div>
      <div className="mr-4 flex items-center">
        <NavLink to="/admin">
          <div className="flex flex-row items-center justify-between">
            <div className="flex font-bold text-base mr-5">ADMIN</div>
            <RiAdminLine size={50} />
          </div>
        </NavLink>
      </div>
    </header>
  );
});

ToolBar.propTypes = {
  toggleNavbar: PropTypes.func.isRequired,
  isNavbarVisible: PropTypes.bool.isRequired,
};

export default ToolBar;
