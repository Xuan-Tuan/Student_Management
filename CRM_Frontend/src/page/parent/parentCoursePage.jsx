import { useEffect, useState, useCallback, memo } from "react";
import { IoArrowForwardCircleOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../controller/authController";
import {
  doGetStudentFromParent,
  doGetCourseFromStudentID,
} from "../../controller/firestoreController";

export default memo(function ParentCoursePage() {
  const navigate = useNavigate();

  const { currentUser } = useAuth();

  const [studentListInfo, setStudentListInfo] = useState([]);
  const [courseListInfo, setCourseListInfo] = useState([]);

  const handleClickCourse = useCallback(
    (e, courseID) => {
      e.preventDefault();
      try {
        navigate(`/parent/course/${courseID}`);
      } catch (error) {
        console.log("error: ", error);
      }
    },
    [navigate]
  );

  const getCourseList = useCallback(async (studentId) => {
    const courseList = await doGetCourseFromStudentID(studentId);
    console.log("courseList: ", courseList);
    setCourseListInfo(courseList);
  }, []);

  const getStudentList = useCallback(async () => {
    const studentList = await doGetStudentFromParent(currentUser.uid);
    console.log("studentList: ", studentList);
    setStudentListInfo(studentList);
    if (studentList === null) {
      return;
    }
    if (studentList.length > 0) {
      getCourseList(studentList[0].id);
    }
  }, [currentUser.uid, getCourseList]);

  useEffect(() => {
    if (currentUser) {
      getStudentList();
    }
  }, [currentUser, getStudentList]);

  return (
    <div className="h-[calc(100vh-70px-50px)]">
      <div className="text-base p-4 font-bold text-left pl-10 text-blue-700">
        <div>
          <p>
            Danh sách môn học của sinh viên:{" "}
            {studentListInfo
              ? studentListInfo.length > 0
                ? studentListInfo[0].name
                : "Loading..."
              : "Không có sinh viên"}
          </p>
        </div>
      </div>
      <div className="h-[calc(100vh-70px-50px-80px)]  md:w-3/5  w-full lg:mr-20 lg:ml-20 shadow-lg flex flex-col gap-5 p-5 overflow-y-scroll will-change-scroll scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-gray-400 hover:scrollbar-thumb-gray-500">
        {courseListInfo.length === 0 ? (
          <p className="text-center text-blue-700 text-base">
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
