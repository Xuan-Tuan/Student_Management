import { useState, useCallback, useMemo, memo } from "react";
import { NavLink } from "react-router-dom";
import Logo from "../../assets/LOGO.png";
import FCE from "../../assets/FCE.png";
import { RiParentLine } from "react-icons/ri";
import { PiStudent } from "react-icons/pi";
import { GiTeacher } from "react-icons/gi";
import { MdOutlineSubject } from "react-icons/md";
import { MdOutlineDevices } from "react-icons/md";
import { SiGoogleclassroom } from "react-icons/si";

export default memo(function Navbar() {
  const [activeItem, setActiveItem] = useState("");

  const handleItemClick = useCallback((item) => {
    setActiveItem(item);
  }, []);

  const listNavbarItem = useMemo(
    () => [
      {
        id: 1,
        title: "Giảng viên",
        link: "/admin/manageLecturer",
        icon: <GiTeacher size={30} />,
      },
      {
        id: 2,
        title: "Sinh viên",
        link: "/admin/manageStudent",
        icon: <PiStudent size={30} />,
      },
      {
        id: 3,
        title: "Phụ huynh",
        link: "/admin/manageParent",
        icon: <RiParentLine size={30} />,
      },
      {
        id: 4,
        title: "Môn học",
        link: "/admin/manageCourse",
        icon: <MdOutlineSubject size={30} />,
      },
      {
        id: 5,
        title: "Thiết bị",
        link: "/admin/manageDevice",
        icon: <MdOutlineDevices size={30} />,
      },
      {
        id: 6,
        title: "Phòng học",
        link: "/admin/manageRoom",
        icon: <SiGoogleclassroom size={30} />,
      },
    ],
    []
  );

  return (
    <div className="navbar_container fixed top-0 h-full font-poppins text-white bg-uit border-r-2 w-16 md:w-52 flex flex-col justify-between">
      <div className="navbar_title flex justify-center items-center w-full h-auto font-bold text-lg">
        <div className="w-10 md:w-16 py-4 h-16 md:h-20">
          <NavLink to="/admin">
            <img src={Logo} alt="LOGO" />
          </NavLink>
        </div>
      </div>
      <div className="flex-grow">
        {listNavbarItem.map((item) => (
          <NavLink
            to={item.link}
            key={item.id}
            onClick={() => handleItemClick(item.id)}
            className={`navbar_item flex items-center h-16 text-sm font-bold ${
              activeItem === item.id
                ? "active bg-white text-red-500 border-2 rounded-md border-uit"
                : "hover:bg-white hover:text-red-500 border-8 rounded-md border-uit"
            }`}
          >
            <div className="flex items-center space-x-4 w-full px-2 ">
              <div>{item.icon}</div>
              <div className="hidden md:block">{item.title}</div>
            </div>
          </NavLink>
        ))}
      </div>
      <div className="flex items-center justify-center p-8">
        <NavLink to="/admin">
          <img
            src={FCE}
            alt="FCE"
            className=" w-16 h-10 lg:w-auto lg:h-auto object-contain"
          />
        </NavLink>
      </div>
    </div>
  );
});
