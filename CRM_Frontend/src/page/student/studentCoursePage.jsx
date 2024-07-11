import { useEffect, useState, useCallback, memo } from "react";
import { IoArrowForwardCircleOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../controller/authController";
import { doGetCourseFromStudentID } from "../../controller/firestoreController";

export default memo(function StudentCoursePage() {
  const navigate = useNavigate();

  const { currentUser } = useAuth();

  const [courseListInfo, setCourseListInfo] = useState([]);

  const handleClickCourse = useCallback(
    (e, courseID) => {
      e.preventDefault();
      try {
        navigate(`/student/course/${courseID}`);
      } catch (error) {
        console.log("error: ", error);
      }
    },
    [navigate]
  );

  useEffect(() => {
    const getCourseList = async () => {
      const courseList = await doGetCourseFromStudentID(currentUser.uid);
      // console.log("courseList: ", courseList);
      setCourseListInfo(courseList);
    };

    if (currentUser) {
      getCourseList();
    }
  }, [currentUser]);

  return (
    <div className="h-[calc(100vh-70px-50px)]">
      <div className="text-base text-uit p-4 font-bold text-left pl-10 ">
        <div>
          <p>Danh sách môn học của bạn</p>
        </div>
      </div>
      <div className="h-[calc(100vh-70px-50px-80px)]  md:w-3/5  w-full lg:mr-20 lg:ml-20 shadow-lg flex flex-col gap-5 p-5 overflow-y-scroll will-change-scroll scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-gray-400 hover:scrollbar-thumb-gray-500">
        {courseListInfo.length === 0 ? (
          <p className="text-center text-blue-700 text-lg">
            Sinh viên hiện tại chưa có môn học nào.
          </p>
        ) : (
          courseListInfo.map((course, index) => (
            <div
              key={index}
              className="flex flex-row justify-between items-center px-8 py-4 my-5 bg-white rounded-lg shadow-md hover:shadow-2xl transition-shadow duration-300 border border-gray-200"
            >
              <div className="flex flex-col text-start text-uit text-base font-bold">
                <p className="mb-2">Môn học: {course.name}</p>
                <p className="mb-2">Giảng viên: {course.lecturerName}</p>
                <p className="mb-2">Thời gian: {course.startDay}</p>
              </div>
              <div>
                <div
                  onClick={(e) => handleClickCourse(e, course.id)}
                  className="cursor-pointer transform transition-transform duration-300 hover:scale-110"
                >
                  <IoArrowForwardCircleOutline className="text-uit" size={50} />
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
});
