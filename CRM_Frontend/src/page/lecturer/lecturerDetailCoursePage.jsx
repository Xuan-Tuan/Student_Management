import { useEffect, useState, createContext, memo, useCallback } from "react";
import { useParams } from "react-router-dom";
import { db } from "../../config/firebaseConfig";
import { onSnapshot, collection, where, query, doc } from "firebase/firestore";
import {
  doUpdateCourseOnlineLink,
  doGetScheduleListFromCourseID,
  getStudentCount,
} from "../../controller/firestoreController";
import LecListStudentPage from "./lecturerListStudent";
import LecturerDetailAttendanceDatePage from "./lecturerDetailAttendanceDate";
import { formattedDate } from "../../controller/formattedDate";
import { FiEdit } from "react-icons/fi";
import PropTypes from "prop-types";

export const LecturerContext = createContext();

const CourseInfo = memo(function CourseInfo({ course, handleAddLinkOnline }) {
  return (
    <div className="flex items-center justify-between border border-uit bg-white rounded-lg shadow-lg px-8 py-6 lg:w-96 ">
      <div className="flex flex-col space-y-4 text-uit text-lg  rounded-lg p-4">
        <div className="flex justify-between ">
          <span className="font-semibold mr-6">Mã môn học:</span>
          <span className="text-blue-700">{course.code}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-semibold mr-6">Ngày bắt đầu:</span>
          <span className="text-blue-700">{course.startDay}</span>
        </div>
        <div className="flex flex-col justify-between items-center">
          <div className="flex justify-between text-gray-500">
            <span className="font-semibold mr-4">Từ:</span>
            <span className="text-blue-700">{course.startTime}</span>
          </div>
          <div className="flex justify-between text-gray-500">
            <span className="font-semibold mr-4">Đến:</span>
            <span className="text-blue-700">{course.endTime}</span>
          </div>
        </div>
        <div className="flex justify-between">
          <span className="font-semibold mr-6">Tuần học:</span>
          <span className="text-blue-700">{course.week} Tuần</span>
        </div>
        <div className="flex justify-between">
          <span className="font-semibold mr-6">Phòng học:</span>
          <span className="text-blue-700">{course.roomID}</span>
        </div>

        <div className="flex justify-between space-x-4">
          <span className="font-semibold">Online URL:</span>
          <span className="text-blue-700">{course.onlineURL}</span>
          <FiEdit
            className="border-2 rounded-md text-uit cursor-pointer transform transition-transform duration-300 hover:scale-110"
            size={30}
            onClick={(e) => handleAddLinkOnline(e)}
          />
        </div>
      </div>
    </div>
  );
});

CourseInfo.propTypes = {
  course: PropTypes.object,
  handleAddLinkOnline: PropTypes.func,
};

const ScheduleInfo = memo(function ScheduleInfo({
  currentDay,
  setCurrentDay,
  scheduleDate,
  attendanceStatsOfClass,
}) {
  return (
    <div className="flex flex-col justify-start items-center space-y-6 mt-8">
      {/* <h2 className="text-xl text-uit font-semibold text-center">
        Thông tin lịch dạy hôm nay: {currentDay}
      </h2> */}

      <div className="flex items-center justify-center border border-uit bg-white rounded-lg shadow-lg px-8 py-6 w-full">
        <div className="flex flex-col space-y-4 text-uit">
          <div className="flex flex-row justify-between items-center">
            <select
              value={currentDay}
              onChange={(e) => setCurrentDay(e.target.value)}
              className="text-center shadow-lg p-4"
            >
              <option value="">Chọn ngày</option>
              <option value={formattedDate(new Date())}>Hôm nay</option>
              {scheduleDate.length === 0 ? (
                <option disabled>Không có lịch dạy</option>
              ) : (
                scheduleDate.map((date, index) => (
                  <option key={index} value={date}>
                    {date}
                  </option>
                ))
              )}
            </select>

            <div className="flex justify-between  shadow-lg p-4 font-semibold ">
              <span>Trạng thái điểm danh:</span>
              <span className="font-semibold">
                <span className="text-green-500">
                  {attendanceStatsOfClass.attended}
                </span>
                <span>/</span>
                <span className="text-red-500">
                  {attendanceStatsOfClass.total}
                </span>
              </span>
            </div>
          </div>
          <LecturerDetailAttendanceDatePage />
        </div>
      </div>
    </div>
  );
});

ScheduleInfo.propTypes = {
  currentDay: PropTypes.string,
  setCurrentDay: PropTypes.func,
  scheduleDate: PropTypes.array,
  attendanceStatsOfClass: PropTypes.object,
};

const StudentList = memo(function StudentList({
  courseCode,
  course,
  studentList,
}) {
  return (
    <>
      <div
        className="bg-white p-6 rounded-lg shadow-2xl border-2 border-gray-300 w-auto text-uit"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-xl font-bold mb-4 text-center">
          {`Danh sách sinh viên học lớp ${courseCode}`}
        </div>
        {course ? (
          <LecListStudentPage
            studentList={studentList}
            courseCode={courseCode}
          />
        ) : (
          <div>Loading...</div>
        )}
      </div>
    </>
  );
});

StudentList.propTypes = {
  courseCode: PropTypes.string,
  course: PropTypes.object,
  studentList: PropTypes.array,
};

export default memo(function LecturerDetailCoursePage() {
  const { courseCode } = useParams();
  const [course, setCourse] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [onlineURL, setOnlineURL] = useState("");
  const [studentList, setStudentList] = useState([]);
  const [scheduleDate, setScheduleDate] = useState([""]);
  const [attendanceStatsOfClass, setAttendanceStatsOfClass] = useState({
    attended: 0,
    total: 0,
  });
  const [currentDay, setCurrentDay] = useState(formattedDate(new Date()));
  const [activeTab, setActiveTab] = useState(1);

  const handleOnlineLinkSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      try {
        await doUpdateCourseOnlineLink(courseCode, onlineURL);
        console.log("Add online link success");
        setShowModal(false);
      } catch (error) {
        console.log(error);
      }
    },
    [courseCode, onlineURL]
  );

  const handleAddLinkOnline = useCallback((e) => {
    e.preventDefault();
    setShowModal(true);
  }, []);

  const GetScheduleList = useCallback(async () => {
    const scheduleList = await doGetScheduleListFromCourseID(courseCode);
    const scheduleDate = scheduleList.map((schedule) => schedule.date);
    setScheduleDate(scheduleDate);
  }, [courseCode]);

  const getClassSchedule = useCallback(async () => {
    try {
      const total = await getStudentCount(courseCode);
      setAttendanceStatsOfClass((prev) => ({ ...prev, total }));
    } catch (error) {
      console.error("Failed to get class schedule: ", error);
    }
  }, [courseCode]);

  useEffect(() => {
    const queryCourse = query(doc(db, "course", courseCode));

    const unsubscribeCourse = onSnapshot(queryCourse, (snapshot) => {
      // console.log(snapshot.data());
      setCourse(snapshot.data());
    });

    const queryCourseStudent = query(
      collection(db, "courseStudent"),
      where("courseID", "==", courseCode)
    );

    const unsubscribeCourseStudent = onSnapshot(
      queryCourseStudent,
      (snapshot) => {
        let studentList = [];
        snapshot.docs.forEach((doc) => {
          studentList.push(doc.data().studentID);
        });
        // console.log(studentList);
        setStudentList(studentList);
      }
    );

    const querySchedule = query(
      collection(db, "schedule"),
      where("courseID", "==", courseCode),
      where("date", "==", currentDay)
    );

    const unsubscribeSchedule = onSnapshot(querySchedule, (snapshot) => {
      if (snapshot.empty) {
        console.log("No matching documents.");
        return;
      }
      const scheduleID = snapshot.docs[0].id;
      const queryAttendance = query(
        collection(db, "attendance"),
        where("scheduleID", "==", scheduleID),
        where("attended", "==", "Present")
      );
      onSnapshot(queryAttendance, (snapshot) => {
        let attended = 0;
        snapshot.docs.forEach(() => {
          attended++;
        });
        setAttendanceStatsOfClass((prev) => ({ ...prev, attended }));
      });
    });

    GetScheduleList();

    getClassSchedule();

    return () => {
      unsubscribeCourse();
      unsubscribeCourseStudent();
      unsubscribeSchedule();
    };
  }, [courseCode, currentDay, GetScheduleList, getClassSchedule]);

  const values = {
    studentList,
    courseCode,
    currentDay,
    startDay: course ? course.startDay : null,
  };

  return (
    <LecturerContext.Provider value={values}>
      <div className="flex flex-col justify-start items-center space-y-6 mt-8">
        <h1 className="text-2xl text-uit font-bold">Chi tiết môn học</h1>
        <div className="flex">
          <button
            onClick={() => setActiveTab(1)}
            className={`mr-4 py-2 px-6 rounded ${
              activeTab === 1 ? "bg-uit text-white" : "bg-gray-200"
            }`}
          >
            Thông tin môn học
          </button>
          <button
            onClick={() => setActiveTab(2)}
            className={`mr-4 py-2 px-6 rounded ${
              activeTab === 2 ? "bg-uit text-white" : "bg-gray-200"
            }`}
          >
            Thông tin lịch dạy
          </button>
          <button
            onClick={() => setActiveTab(3)}
            className={`py-2 px-6 rounded ${
              activeTab === 3 ? "bg-uit text-white" : "bg-gray-200"
            }`}
          >
            Danh sách sinh viên
          </button>
        </div>
        {activeTab === 1 && (
          <CourseInfo
            course={course}
            handleAddLinkOnline={handleAddLinkOnline}
          />
        )}
        {activeTab === 2 && (
          <ScheduleInfo
            currentDay={currentDay}
            setCurrentDay={setCurrentDay}
            scheduleDate={scheduleDate}
            course={course}
            attendanceStatsOfClass={attendanceStatsOfClass}
          />
        )}
        {activeTab === 3 && (
          <StudentList
            courseCode={courseCode}
            course={course}
            studentList={studentList}
          />
        )}
      </div>
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-2xl border-2 border-gray-300 w-auto text-uit">
            <div className="text-xl font-bold mb-4">Thêm link học Online</div>
            <form onSubmit={handleOnlineLinkSubmit}>
              <div className="mb-4">
                <label
                  htmlFor="onlineLink"
                  className="block font-semibold mb-2"
                >
                  Link học Online:
                </label>
                <input
                  id="onlineLink"
                  type="text"
                  value={onlineURL}
                  onChange={(e) => setOnlineURL(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="mr-4 py-2 px-4 bg-red-500 text-white rounded-lg"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="py-2 px-4 bg-uit text-white rounded-lg"
                >
                  Thêm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </LecturerContext.Provider>
  );
});
