import { useEffect, useState, useContext, useCallback, memo } from "react";
import { doGetStudentInfoLecturer } from "../../controller/firestoreController";
import { LecturerContext } from "./lecturerDetailCoursePage";

export default memo(function LecListStudentPage() {
  const { studentList, courseCode } = useContext(LecturerContext);

  const [studentInfo, setStudentInfo] = useState([]);

  const studentName = useCallback(async () => {
    try {
      const studentListName = await doGetStudentInfoLecturer(
        studentList,
        courseCode
      );
      setStudentInfo(studentListName);
    } catch (error) {
      console.error("Error getting student info: ", error);
    }
  }, [studentList, courseCode]);

  useEffect(() => {
    studentName();
  }, [studentName]);

  return (
    <div className="flex justify-center my-8">
      {studentInfo && studentInfo.length !== 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full md:w-3/4 table-auto shadow-lg rounded-lg overflow-scroll">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-4 py-2">STT</th>
                <th className="px-4 py-2">Họ tên</th>

                <th className="px-4 py-2">Điểm Danh</th>
              </tr>
            </thead>
            <tbody>
              {studentInfo.map((student, index) => (
                <tr
                  key={student.id}
                  className="bg-white hover:bg-gray-100 transition-colors"
                >
                  <td className="border px-4 py-2">{index + 1}</td>
                  <td className="border px-4 py-2">{student.name}</td>

                  <td className="border px-4 py-2">
                    {student.attended}/{student.total}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>Không tìm thấy sinh viên nào</p>
      )}
    </div>
  );
});
