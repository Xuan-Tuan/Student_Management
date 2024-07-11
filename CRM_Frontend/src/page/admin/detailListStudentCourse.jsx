import PropTypes from "prop-types";
import { useEffect, useState, memo, useCallback } from "react";
import { doGetStudentInfoLecturer } from "../../controller/firestoreController";

const DetailListStudentCourse = memo(function DetailListStudentCourse({
  studentList,
  courseCode,
}) {
  const [studentInfo, setStudentInfo] = useState([]);

  const studentName = useCallback(async () => {
    console.log("studentList: ", studentList);
    const studentListName = await doGetStudentInfoLecturer(
      studentList,
      courseCode
    );
    // console.log(studentListName);
    setStudentInfo(studentListName);
  }, [studentList, courseCode]);

  useEffect(() => {
    studentName();
  }, [studentName]);

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-xl text-uit font-bold mb-4">Danh sách sinh viên</h1>
      {studentInfo.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead className="bg-gray-200 text-gray-600">
              <tr>
                <th className="w-1/12 px-4 py-2 text-left">STT</th>
                <th className="w-6/12 px-4 py-2 text-left">Tên</th>
                <th className="w-5/12 px-4 py-2 text-center">
                  Trạng thái điểm danh
                </th>
              </tr>
            </thead>
            <tbody>
              {studentInfo.map((student, index) => (
                <tr key={student.id} className="hover:bg-gray-100">
                  <td className="border-t px-4 py-2">{index + 1}</td>
                  <td className="border-t px-4 py-2">{student.name}</td>
                  <td className="border-t px-4 py-2  text-center">
                    {student.attended}/{student.total}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-red-500">Không có sinh viên nào</p>
      )}
    </div>
  );
});

DetailListStudentCourse.propTypes = {
  studentList: PropTypes.array.isRequired,
  courseCode: PropTypes.string.isRequired,
};

export default DetailListStudentCourse;
