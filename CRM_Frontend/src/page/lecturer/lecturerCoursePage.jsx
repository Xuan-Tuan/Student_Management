import { useEffect, useState, memo, useCallback } from "react";
import { useAuth } from "../../controller/authController";
import { doGetCourseLecturer } from "../../controller/firestoreController";
import { useNavigate } from "react-router-dom";
import { IoArrowForwardCircleOutline } from "react-icons/io5";
import { IoIosNotificationsOutline } from "react-icons/io";

export default memo(function LecturerCoursePage() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [courseLec, setCourseLec] = useState([]);

  const handleClickCourse = useCallback(
    (e, courseID) => {
      e.preventDefault();
      try {
        navigate(`/lecturer/course/${courseID}`);
      } catch (error) {
        console.log("error: ", error);
      }
    },
    [navigate]
  );

  const handleClickNotification = useCallback(
    (e, courseID) => {
      e.preventDefault();
      try {
        navigate(`/lecturer/course/${courseID}/notification`);
      } catch (error) {
        console.log("error: ", error);
      }
    },
    [navigate]
  );

  const fetchCourseLec = useCallback(async () => {
    try {
      const result = await doGetCourseLecturer(currentUser.uid);
      setCourseLec(result);
    } catch (error) {
      console.log(error);
    }
  }, [currentUser]);

  useEffect(() => {
    fetchCourseLec();
  }, [fetchCourseLec]);

  return (
    <div className="h-[calc(100vh-70px-50px)]">
      <div className="text-base p-4 font-bold text-left pl-10 text-blue-700">
        <div>
          <p>Danh sách môn học đang giảng dạy: </p>
        </div>
      </div>
      <div className="h-[calc(100vh-70px-50px-80px)]  md:w-3/5  w-full lg:mr-20 lg:ml-20 shadow-lg flex flex-col gap-5 p-5 overflow-y-scroll will-change-scroll scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-gray-400 hover:scrollbar-thumb-gray-500">
        {courseLec ? (
          courseLec.map((course, index) => (
            <div
              key={index}
              className="flex flex-row justify-between items-center px-8 py-4 my-5 bg-white rounded-lg shadow-md hover:shadow-2xl transition-shadow duration-300 border border-gray-200"
            >
              <div className="flex flex-col text-start text-uit text-base font-bold">
                <p className="mb-2">Môn học: {course.name}</p>
                <p className="mb-2">Mã môn học: {course.code}</p>
                <p className="mb-2">Thời gian bắt đầu: {course.startDay}</p>
              </div>
              <div className="flex flex-row justify-between">
                <div
                  onClick={(e) => handleClickNotification(e, course.id)}
                  className="cursor-pointer transform transition-transform duration-300 hover:scale-110"
                >
                  <IoIosNotificationsOutline className="text-uit" size={50} />
                </div>
                <div
                  onClick={(e) => handleClickCourse(e, course.id)}
                  className="cursor-pointer transform transition-transform duration-300 hover:scale-110"
                >
                  <IoArrowForwardCircleOutline className="text-uit" size={50} />
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="flex justify-center item-center border border-uit text-uit font-semibold bg-white rounded-lg shadow-lg p-4">
            Bạn chưa giảng dạy môn học nào
          </div>
        )}
      </div>
    </div>
  );
});
