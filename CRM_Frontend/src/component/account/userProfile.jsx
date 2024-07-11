import { useState, useEffect, useCallback, memo } from "react";
import { RiAccountCircleFill } from "react-icons/ri";
import { FaAngleDown } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { doSignOut } from "../../controller/authController";
import { useAuth } from "../../controller/authController";

export default memo(function UserProfile() {
  const { currentUser } = useAuth();

  const navigator = useNavigate();

  const [name, setName] = useState("");
  const [isLogoutVisible, setIsLogoutVisible] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.displayName);
    }
  }, [currentUser]);

  const handleLogOut = useCallback(
    async (e) => {
      e.preventDefault();
      try {
        await doSignOut();
        navigator("/login");
      } catch (error) {
        console.log(error);
      }
    },
    [navigator]
  );

  return (
    <div className="flex items-center space-x-4 relative">
      <p className="text-lg font-semibold">{name}</p>
      <div className="h-[70px] relative flex items-center justify-between space-x-4">
        <RiAccountCircleFill size={56} />
        <FaAngleDown
          size={24}
          className="text-gray-500 cursor-pointer"
          onClick={() => setIsLogoutVisible(!isLogoutVisible)}
        />
        {isLogoutVisible && (
          <div className="absolute right-0 top-[65px] bg-white shadow-md rounded-lg p-2 min-h-10 min-w-[150px]">
            <button
              onClick={(e) => {
                handleLogOut(e);
              }}
              className="text-center py-2 px-2 text-uit hover:text-red-600 hover:font-medium transition duration-200"
            >
              Đăng xuất
            </button>
          </div>
        )}
      </div>
    </div>
  );
});
