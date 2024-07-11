import { useState, useEffect, useCallback, memo } from "react";
import PropTypes from "prop-types";
import { doDeleteStudent } from "../../controller/firestoreController";
import axiosInstance from "../../controller/axiosInstance";
import ModifyStudentForm from "./modifyForm/modifyStudentForm";

const StudentListComponent = memo(function StudentListComponent({
  students,
  parents,
}) {
  const [studentList, setStudentList] = useState([]);
  const [parentList, setParentList] = useState([]);

  const [currentStudentId, setCurrentStudentId] = useState("");
  const [isModifyFormOpen, setIsModifyFormOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [deleteStudentId, setDeleteStudentId] = useState(null);
  const [deleteParentId, setDeleteParentId] = useState(null);

  const deleteStudent = async (id) => {
    const response = await axiosInstance.post("/deleteStudent", { id });
    return response;
  };

  const handleModifyStudent = (e, id) => {
    e.preventDefault();
    setCurrentStudentId(id);
    setIsModifyFormOpen(true);
  };

  const handleDeleteStudent = useCallback(async () => {
    try {
      await doDeleteStudent(deleteStudentId, deleteParentId);
      const result = await deleteStudent(deleteStudentId);
      console.log(result);
      alert("Student deleted successfully");
      setIsDeleteConfirmOpen(false);
    } catch (error) {
      console.log(error);
      alert("Failed to delete student");
    }
  }, [deleteStudentId, deleteParentId]);

  const openDeleteConfirm = useCallback((e, id, parentID) => {
    e.preventDefault();
    setDeleteStudentId(id);
    setDeleteParentId(parentID);
    setIsDeleteConfirmOpen(true);
  }, []);

  const closeDeleteConfirm = () => {
    setIsDeleteConfirmOpen(false);
    setDeleteStudentId(null);
    setDeleteParentId(null);
  };

  useEffect(() => {
    setStudentList(students);
    setParentList(parents);
  }, [students, parents]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-xl font-bold mb-4 text-center text-uit">
        Danh sách sinh viên
      </h1>
      <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
        <thead>
          <tr className="bg-gray-200  text-lg font-semibold">
            <th className="py-3 px-4">STT</th>
            <th className="py-3 px-4">Họ tên</th>
            <th className="py-3 px-4">Phụ huynh</th>
            <th className="py-3 px-4">Địa chỉ</th>
            <th className="py-3 px-4">Số điện</th>
            <th className="py-3 px-4">RFID</th>
            <th className="py-3 px-4">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {studentList.map((student, index) => (
            <tr key={student.id} className="hover:bg-gray-100 text-center">
              <td className="py-3 px-4 border-b">{index + 1}</td>
              <td className="py-3 px-4 border-b">{student.name}</td>
              <td className="py-3 px-4 border-b">
                {
                  parentList.find((parent) => parent.id === student.parentID)
                    ?.name
                }
              </td>
              <td className="py-3 px-4 border-b">{student.address}</td>
              <td className="py-3 px-4 border-b">{student.phoneNumber}</td>
              <td className="py-3 px-4 border-b">{student.RFID}</td>
              <td className="py-3 px-4 border-b">
                <button
                  onClick={(e) => handleModifyStudent(e, student.id)}
                  className="bg-yellow-500 text-white px-4 py-2 rounded mr-2 shadow-md hover:bg-yellow-600 transition duration-300"
                >
                  Sửa
                </button>
                <button
                  onClick={(e) =>
                    openDeleteConfirm(e, student.id, student.parentID)
                  }
                  className="bg-red-500 text-white px-4 py-2 rounded shadow-md hover:bg-red-600 transition duration-300"
                >
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isModifyFormOpen && (
        <ModifyStudentForm
          studentId={currentStudentId}
          parents={parentList}
          closeForm={() => setIsModifyFormOpen(false)}
        />
      )}

      {isDeleteConfirmOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white p-8 rounded shadow-md w-full max-w-lg">
            <h2 className="text-2xl font-bold mb-4">Xác nhận xóa sinh viên</h2>
            <p className="mb-4">
              Bạn có chắc chắn muốn xóa sinh viên này không?
            </p>
            <div className="flex justify-end">
              <button
                onClick={closeDeleteConfirm}
                className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
              >
                Hủy
              </button>
              <button
                onClick={handleDeleteStudent}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

StudentListComponent.propTypes = {
  students: PropTypes.array,
  parents: PropTypes.array,
};

export default StudentListComponent;
