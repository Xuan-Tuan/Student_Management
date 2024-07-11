import {
  useState,
  useEffect,
  useContext,
  memo,
  useCallback,
  useMemo,
} from "react";
import { LecturerContext } from "./lecturerDetailCoursePage";
import { convertDateFormat } from "../../controller/formattedDate";
import { db } from "../../config/firebaseConfig";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import {
  doGetStudentInfoListLecturer,
  doGetScheduleIDLecturer,
} from "../../controller/firestoreController";

export default memo(function LecturerDetailAttendanceDatePage() {
  const { studentList, courseCode, currentDay, startDay } =
    useContext(LecturerContext);

  const [attendedList, setAttendedList] = useState([
    { name: "", attended: "" },
  ]);
  const [studentInfoList, setStudentInfoList] = useState([]);
  const [scheduleID, setScheduleID] = useState("");

  const getStudentAttendanceList = useCallback(async () => {
    const result = await doGetStudentInfoListLecturer(studentList);
    setStudentInfoList(result);
  }, [studentList]);

  const getScheduleID = useCallback(async () => {
    const result = await doGetScheduleIDLecturer(courseCode, currentDay);
    setScheduleID(result);
  }, [courseCode, currentDay]);

  useEffect(() => {
    const fetchData = async () => {
      await getScheduleID();
      await getStudentAttendanceList();
    };
    fetchData();
  }, [getScheduleID, getStudentAttendanceList]);

  useEffect(() => {
    if (!scheduleID) {
      console.log("scheduleID is null");
      return;
    }
    if (studentInfoList.length === 0) {
      console.log("studentInfoList is null");
      return;
    }
    const queryAttendance = query(
      collection(db, "attendance"),
      where("scheduleID", "==", scheduleID),
      where("courseID", "==", courseCode),
      where(
        "studentID",
        "in",
        studentInfoList.map((student) => student.id)
      )
    );
    const unsubscribe = onSnapshot(queryAttendance, (snapshot) => {
      const attendedList = snapshot.docs.map((doc) => {
        return {
          name: studentInfoList.find(
            (student) => student.id === doc.data().studentID
          ).name,
          attended: doc.data().attended,
        };
      });
      setAttendedList(attendedList);
    });
    return () => unsubscribe();
  }, [courseCode, scheduleID, studentInfoList]);

  const sortedAttendedList = useMemo(() => {
    return [...attendedList].sort((a, b) => a.name.localeCompare(b.name));
  }, [attendedList]);

  return (
    <div className="container mx-auto mt-8 overflow-scroll">
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Số thứ tự</th>
              <th className="py-2 px-4 border-b">Tên</th>
              <th className="py-2 px-4 border-b">Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {new Date(convertDateFormat(currentDay)) >=
              new Date(convertDateFormat(startDay)) &&
            currentDay &&
            sortedAttendedList ? (
              sortedAttendedList.map((student, index) => (
                <tr key={index}>
                  <td className="py-2 px-4 border-b text-center">
                    {index + 1}
                  </td>
                  <td className="py-2 px-4 border-b">{student.name}</td>
                  <td className="py-2 px-4 border-b">
                    <span
                      className={
                        student.attended === "Present"
                          ? "text-green-500"
                          : student.attended === "Absent"
                          ? "text-red-500"
                          : "text-blue-500"
                      }
                    >
                      {student.attended === "Present"
                        ? "Đã điểm danh"
                        : student.attended === "Absent"
                        ? "Vắng mặt"
                        : "Theo dõi"}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="py-4 text-center">
                  Không có sinh viên nào
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
});
