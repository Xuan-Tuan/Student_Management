import { useParams } from "react-router-dom";
import { useEffect, useState, useCallback, memo } from "react";
import {
  doGetCourseDetail,
  doGetScheduleFromCourseID,
  doGetStudentFromParent,
  doGetScheduleListFromCourseID,
  doGetAttendStatusFromStudentID,
} from "../../controller/firestoreController";
import { formattedDate } from "../../controller/formattedDate";
import { useAuth } from "../../controller/authController";
import { onSnapshot, query, collection, where } from "firebase/firestore";
import { db } from "../../config/firebaseConfig";

export default memo(function ParentDetailCoursePage() {
  const { courseCode } = useParams();
  const { currentUser } = useAuth();
  const [course, setCourse] = useState({});
  const [schedule, setSchedule] = useState([]);
  const [studentId, setStudentId] = useState("");
  const [attended, setAttended] = useState("Absent");
  const [attendanceStats, setAttendanceStats] = useState({
    attended: 0,
    total: 0,
  });
  const [currentDay, setCurrentDay] = useState(formattedDate(new Date()));
  const [scheduleList, setScheduleList] = useState([]);

  const getScheduleList = useCallback(async () => {
    const scheduleList = await doGetScheduleListFromCourseID(courseCode);
    console.log("Tất cả lịch học:", scheduleList);
    setScheduleList(scheduleList);
  }, [courseCode]);

  const getStudentList = useCallback(async () => {
    const studentListFC = await doGetStudentFromParent(currentUser.uid);
    if (studentListFC.length > 0) {
      setStudentId(studentListFC[0].id);
    }
  }, [currentUser.uid]);

  const getCourseDetail = useCallback(async () => {
    const courseDetail = await doGetCourseDetail(courseCode);
    setCourse(courseDetail);
  }, [courseCode]);

  const getSchedule = useCallback(async () => {
    const schedule = await doGetScheduleFromCourseID(courseCode, currentDay);
    setSchedule(schedule);
  }, [courseCode, currentDay]);

  //  hàm test
  async function getAllSchedule() {
    const attendanceTest = await doGetAttendStatusFromStudentID(
      studentId,
      courseCode
    );
  }

  useEffect(() => {
    getScheduleList();
    getStudentList();
    getCourseDetail();
    getSchedule();
    getAllSchedule();

    const querySchedule = query(
      collection(db, "schedule"),
      where("courseID", "==", courseCode),
      where("date", "==", currentDay)
    );

    const unsubscribeAttendance = onSnapshot(querySchedule, (snapshot) => {
      if (snapshot.empty) {
        console.log("No matching documents.");
        return;
      }

      const queryAttendance = query(
        collection(db, "attendance"),
        where("studentID", "==", studentId),
        where("scheduleID", "==", snapshot.docs[0].id),
        where("courseID", "==", courseCode)
      );

      onSnapshot(queryAttendance, (snapshot) => {
        if (snapshot.empty) {
          setAttended("Absent");
        } else {
          setAttended(snapshot.docs[0].data().attended);
        }
      });
    });

    const queryAttendance = query(
      collection(db, "attendance"),
      where("studentID", "==", studentId),
      where("courseID", "==", courseCode)
    );

    const unsubscribeAttendanceStats = onSnapshot(
      queryAttendance,
      (snapshot) => {
        const total = snapshot.docs.length;
        const attended = snapshot.docs.filter(
          (doc) => doc.data().attended === "Present"
        ).length;
        setAttendanceStats({ total, attended });
      }
    );

    return () => {
      unsubscribeAttendance();
      unsubscribeAttendanceStats();
    };
  }, [getScheduleList, getStudentList, getCourseDetail, getSchedule, currentDay, courseCode, currentUser.uid, studentId]);

  return (
    <div className="h-[calc(100vh-70px-50px)] flex flex-col lg:flex-row justify-evenly p-8 bg-gray-50">
      <div className="flex flex-col justify-start items-center space-y-6 mt-8">
        <h2 className="text-2xl text-uit font-semibold mr-4 text-center">
          Môn học: {course.name}
        </h2>
        <div className="flex items-center justify-center border border-uit bg-white rounded-lg shadow-lg px-8 py-6 w-full lg:w-96">
          <div className="flex flex-col space-y-4 text-uit text-lg">
            <div className="flex justify-between">
              <span className="font-semibold mr-4">Giáo viên:</span>
              <span className="text-blue-700">{course.lecturerName}</span>
            </div>
            <div className="flex justify-between flex-col">
              <div className="flex flex-row justify-between">
                <span className="font-semibold mr-4 ">Ngày bắt đầu:</span>
                <span className="text-blue-700">{course.startDay}</span>
              </div>
            </div>
            <div className="flex flex-col justify-between items-center">
              <div className="flex justify-between">
                <span className="font-semibold mr-4">Từ:</span>
                <span className="text-blue-700">{course.startTime}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold mr-4">Đến:</span>
                <span className="text-blue-700">{course.endTime}</span>
              </div>
            </div>

            <div className="flex justify-between">
              <span className="font-semibold mr-4">Tuần học:</span>
              <span className="text-blue-700">{course.week} Tuần</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold mr-4">Phòng học:</span>
              <span className="text-blue-700">{course.roomID}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col justify-start items-center space-y-6 mt-8">
        <h2 className="text-2xl text-uit font-semibold mr-4 text-center">
          Thông tin lịch học hôm nay: {currentDay}
        </h2>
        <div className="border border-uit bg-white rounded-lg shadow-lg p-4 font-bold text-base text-uit">
          <select
            value={currentDay}
            onChange={(e) => setCurrentDay(e.target.value)}
          >
            <option value="">Select date</option>
            <option value={formattedDate(new Date())}>Hôm nay</option>
            {scheduleList &&
              scheduleList.map((date) => (
                <option key={date.id} value={date.date}>
                  {date.date}
                </option>
              ))}
          </select>
        </div>
        <div className="flex items-center justify-center border border-uit bg-white rounded-lg shadow-lg px-8 py-6 w-full lg:w-96">
          <div className="flex flex-col space-y-4 text-uit text-lg">
            {schedule && schedule.length !== 0 ? (
              <div key={schedule[0].id}>
                <div className="flex justify-between">
                  <span className="font-semibold ">Online URL:</span>
                  <span className="text-blue-700">{course.onlineURL}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold mr-1">
                    Trạng thái điểm danh:
                  </span>
                  <span
                    className={
                      attended === "Watching"
                        ? "text-blue-500"
                        : attended === "Absent"
                        ? "text-red-500"
                        : "text-green-500"
                    }
                  >
                    {attended === "Watching"
                      ? "Theo dõi"
                      : attended === "Absent"
                      ? "Vắng mặt"
                      : "Đã điểm danh"}
                  </span>
                </div>
              </div>
            ) : (
              <div className=" flex justify-center items-center font-bold text-red-500 text-xl ">
                Không có lịch học
              </div>
            )}
            <div className="flex justify-between border border-uit bg-white rounded-lg shadow-lg p-4">
              <span className="font-semibold mr-4">Trạng thái điểm danh:</span>
              <span className="font-semibold mr-4">
                <span className="text-green-500">
                  {attendanceStats.attended}
                </span>
                {" / "}
                <span className="text-red-500">{attendanceStats.total}</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
