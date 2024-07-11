import Logo from "../../assets/LOGO.png";
import { useEffect, useState, memo, useCallback } from "react";
import { NavLink } from "react-router-dom";
import UserProfile from "../account/userProfile";
import { useAuth } from "../../controller/authController";
import { MdOutlineManageAccounts } from "react-icons/md";
import { LiaHomeSolid } from "react-icons/lia";

export default memo(function HeaderUser() {
  const { currentUser } = useAuth();
  const navLinkClass = useCallback(
    ({ isActive }) => (isActive ? "text-red-500" : "text-white"),
    []
  );
  const [role, setRole] = useState();

  useEffect(() => {
    if (currentUser) {
      currentUser.getIdTokenResult().then((idTokenResult) => {
        const { role } = idTokenResult.claims;
        setRole(role);
      });
    }
  }, [currentUser]);

  return (
    <header className="bg-uit h-20 text-white flex items-center justify-between p-4 ">
      <div className="flex items-center">
        <NavLink to={`/${role}`} className="mr-4">
          <img src={Logo} alt="LOGO" className="h-12 w-auto" />
        </NavLink>
        <div className="flex flex-col text-xs text-center lg:text-base font-bold uppercase">
          <div className="text-lg hidden sm:block">
            Hệ thống <br />
            quản lý sinh viên
          </div>
          <div className="text-xs block sm:hidden">
            Hệ thống <br />
            quản lý sinh viên
          </div>
        </div>
      </div>
      <nav className="flex items-center justify-center flex-grow text-xs lg:text-base font-bold space-x-6">
        <NavLink to={`/${role}/course`} className={navLinkClass}>
          <span className="hidden sm:inline">Môn học</span>
          <LiaHomeSolid className="inline sm:hidden" size={30} />
        </NavLink>
        <NavLink to={`/${role}/account`} className={navLinkClass}>
          <span className="hidden sm:inline">Tài khoản</span>
          <MdOutlineManageAccounts className="inline sm:hidden" size={30} />
        </NavLink>
      </nav>
      <div className="flex items-center space-x-4">
        <div className="hidden sm:block">
          <input
            type="text"
            placeholder="Tìm kiếm"
            className="rounded-full pl-4 pr-8 py-1 text-black"
            aria-label="Tìm kiếm"
          />
        </div>
        <NavLink to={`/${role}`} className="hidden sm:block">
          <UserProfile />
        </NavLink>
      </div>
    </header>
  );
});
