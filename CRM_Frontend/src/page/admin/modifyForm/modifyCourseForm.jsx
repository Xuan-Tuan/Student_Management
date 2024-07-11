import { useState, useEffect, useRef, useCallback, memo, useMemo } from "react";
import PropTypes from "prop-types";
import {
  doGetCourseFromCourseID,
  doGetStudentFromCourseID,
  doUpdateCourseData,
  doUpdateCourseStudentList,
} from "../../../controller/firestoreController";
import { convertDateFormat } from "../../../controller/formattedDate";

const ModifyCourseForm = memo(function ModifyCourseForm({
  courseID,
  closeForm,
  roomList,
  lecturerList,
  studentList,
}) {
  const [courseData, setCourseData] = useState({
    code: "",
    name: "",
    roomID: "",
    lecturerID: "",
    onlineURL: "",
    startTime: "",
    endTime: "",
  });
  const [courseStudents, setCourseStudents] = useState([]);

  const handleInputCourseChange = useCallback((event) => {
    const { name, value } = event.target;
    setCourseData((prevCourse) => ({
      ...prevCourse,
      [name]: value,
    }));
  }, []);

  const currentDate = useMemo(() => new Date(), []);
  let startDate = useRef(new Date());

  useEffect(() => {
    doGetCourseFromCourseID(courseID).then((course) => {
      setCourseData(course);
      startDate.current = new Date(convertDateFormat(course.startDay));
    });
    doGetStudentFromCourseID(courseID).then((students) => {
      setCourseStudents(students);
    });
  }, [courseID]);

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();
      try {
        if (
          courseData.roomID === "" ||
          courseData.lecturerID === "" ||
          courseData.code === "" ||
          courseData.name === "" ||
          courseData.startTime === "" ||
          courseData.endTime === ""
        ) {
          alert("Please fill all the fields");
          return;
        }
        if (courseStudents.length === 0) {
          alert("Please select at least one student");
          return;
        }
        if (courseData.startTime >= courseData.endTime) {
          alert("End time must be after start time");
          return;
        }
        if (courseData.week < 1 || courseData.week > 16) {
          alert("Week must be between 1 and 16");
          return;
        }
        if (startDate.current < currentDate) {
          alert("Start day must be in the future");
          return;
        }
        await doUpdateCourseData(courseID, courseData);
        await doUpdateCourseStudentList(courseID, courseStudents);
        alert("Course updated successfully");
        closeForm();
      } catch (error) {
        console.log(error);
        alert("Failed to update course");
      }
    },
    [courseData, courseStudents, courseID, closeForm, startDate, currentDate]
  );

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-8 w-3/4 md:w-1/2 h-4/5 overflow-y-auto rounded-lg shadow-lg">
        <h2 className="text-xl font-bold mb-6 text-center">Sửa môn học</h2>
        <form onSubmit={(e) => handleSubmit(e)}>
          <div className="mb-4">
            <label className="block mb-1 font-medium">Phòng học</label>
            <select
              name="roomID"
              value={courseData.roomID || ""}
              onChange={(e) => handleInputCourseChange(e)}
              className="block w-full p-2 border rounded"
            >
              <option value="">Chọn phòng</option>
              {roomList &&
                roomList.map((room) => (
                  <option key={room.id} value={room.id}>
                    {room.id}
                  </option>
                ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block mb-1 font-medium">Giảng viên</label>
            <select
              name="lecturerID"
              value={courseData.lecturerID || ""}
              onChange={(e) => handleInputCourseChange(e)}
              className="block w-full p-2 border rounded"
            >
              <option value="">Chọn giảng viên</option>
              {lecturerList &&
                lecturerList.map((lecturer) => (
                  <option key={lecturer.id} value={lecturer.id}>
                    {lecturer.name}
                  </option>
                ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block mb-1 font-medium">Mã môn học</label>
            <input
              type="text"
              name="code"
              value={courseData.code || ""}
              onChange={(e) => handleInputCourseChange(e)}
              disabled
              className="block w-full p-2 border rounded bg-gray-100"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1 font-medium">Tên môn học</label>
            <input
              type="text"
              name="name"
              value={courseData.name || ""}
              onChange={(e) => handleInputCourseChange(e)}
              className="block w-full p-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1 font-medium">URL học trực tuyến</label>
            <input
              type="text"
              name="onlineURL"
              value={courseData.onlineURL || ""}
              onChange={(e) => handleInputCourseChange(e)}
              className="block w-full p-2 border rounded"
            />
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block mb-1 font-medium">Ngày bắt đầu</label>
              <input
                type="date"
                name="startDay"
                value={convertDateFormat(courseData.startDay) || ""}
                disabled
                className="block w-full p-2 border rounded bg-gray-100"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">
                Thời gian bắt đầu
              </label>
              <input
                type="time"
                name="startTime"
                value={courseData.startTime || ""}
                onChange={(e) => handleInputCourseChange(e)}
                className="block w-full p-2 border rounded"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block mb-1 font-medium">
                Thời gian kết thúc
              </label>
              <input
                type="time"
                name="endTime"
                value={courseData.endTime || ""}
                onChange={(e) => handleInputCourseChange(e)}
                className="block w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">Tuần</label>
              <input
                type="number"
                name="week"
                value={courseData.week || 0}
                onChange={(e) => handleInputCourseChange(e)}
                disabled
                className="block w-full p-2 border rounded bg-gray-100"
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block mb-1 font-medium">Sinh viên</label>
            <select
              multiple={true}
              value={courseStudents || []}
              onChange={(e) => {
                const options = [...e.target.selectedOptions];
                const values = options.map((option) => option.value);
                setCourseStudents(values);
              }}
              className="block w-full p-2 border rounded"
            >
              {studentList &&
                studentList.map((student) => (
                  <option key={student.id} value={student.id}>
                    {student.name}
                  </option>
                ))}
            </select>
          </div>
          <div className="flex justify-end mt-6">
            <button
              type="button"
              className="px-4 py-2 bg-gray-600 text-white rounded mr-3 w-28 hover:bg-gray-700"
              onClick={closeForm}
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded w-28 hover:bg-blue-700"
            >
              Xác nhận
            </button>
          </div>
        </form>
      </div>
    </div>
  );
});

ModifyCourseForm.propTypes = {
  courseID: PropTypes.string.isRequired,
  closeForm: PropTypes.func.isRequired,
  roomList: PropTypes.array.isRequired,
  lecturerList: PropTypes.array.isRequired,
  studentList: PropTypes.array.isRequired,
};

export default ModifyCourseForm;
