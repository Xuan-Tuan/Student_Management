import { useEffect, useState, useCallback, memo } from "react";
import { db } from "../../config/firebaseConfig";
import { onSnapshot, collection, query } from "firebase/firestore";
import { doDeleteLecturer } from "../../controller/firestoreController";
import axiosInstance from "../../controller/axiosInstance";
import ModifyLecturerForm from "./modifyForm/modifyLecturerForm";
import { AiOutlineUserDelete } from "react-icons/ai";
import { TbUserEdit } from "react-icons/tb";

export default memo(function ManageLecturerPage() {
  const [lecturers, setLecturers] = useState([]);
  const [authLec, setAuthLec] = useState({
    email: "",
    password: "",
    role: "lecturer",
  });
  const [lecInfo, setLecInfo] = useState({
    name: "",
    address: "",
    phoneNumber: "",
  });
  const [currentLecturerId, setCurrentLecturerId] = useState("");
  const [isModifyFormOpen, setIsModifyFormOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [lecturerToDelete, setLecturerToDelete] = useState(null);
  const [isAddLecturerFormOpen, setIsAddLecturerFormOpen] = useState(false);

  const addLecturer = async (data) => {
    const response = await axiosInstance.post("/addLecturer", data);
    return response;
  };

  const deleteLecturer = async (id) => {
    const response = await axiosInstance.post("/deleteLecturer", { id });
    return response;
  };

  const handleModifyLecturer = (e, lecturerId) => {
    e.preventDefault();
    setIsModifyFormOpen(true);
    setCurrentLecturerId(lecturerId);
  };

  const handleDeleteLecturer = (e, id) => {
    e.preventDefault();
    setLecturerToDelete(id);
    setIsConfirmModalOpen(true);
  };

  const confirmDeleteLecturer = useCallback(async () => {
    try {
      await doDeleteLecturer(lecturerToDelete);
      const result = await deleteLecturer(lecturerToDelete);
      console.log(result);
      alert("Lecturer deleted successfully");
    } catch (error) {
      console.log(error);
      alert("Failed to delete lecturer");
    } finally {
      setIsConfirmModalOpen(false);
      setLecturerToDelete(null);
    }
  }, [lecturerToDelete]);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      try {
        if (
          !authLec.email ||
          !authLec.password ||
          !lecInfo.name ||
          !lecInfo.address ||
          !lecInfo.phoneNumber
        ) {
          alert("Please fill in all fields");
          setAuthLec({ email: "", password: "", role: "lecturer" });
          setLecInfo({ name: "", address: "", phoneNumber: "" });
          return;
        }
        if (authLec.password.length < 6) {
          alert("Password must be at least 6 characters");
          setAuthLec({ ...authLec, password: "" });
          return;
        }
        if (lecInfo.phoneNumber.length < 10) {
          alert("Phone number must be at least 10 characters");
          setLecInfo({ ...lecInfo, phoneNumber: "" });
          return;
        }
        if (lecInfo.phoneNumber.length > 15) {
          alert("Phone number must be at most 15 characters");
          setLecInfo({ ...lecInfo, phoneNumber: "" });
          return;
        }
        if (authLec.email.length < 6) {
          alert("Email must be at least 6 characters");
          setAuthLec({ ...authLec, email: "" });
          return;
        }
        if (authLec.email.length > 50) {
          alert("Email must be at most 50 characters");
          setAuthLec({ ...authLec, email: "" });
          return;
        }
        if (lecInfo.name.length < 3) {
          alert("Name must be at least 3 characters");
          setLecInfo({ ...lecInfo, name: "" });
          return;
        }
        const result = await addLecturer({
          email: authLec.email,
          password: authLec.password,
          role: authLec.role,
          name: lecInfo.name,
          address: lecInfo.address,
          phoneNumber: lecInfo.phoneNumber,
        });
        console.log(result);
        alert("Lecturer added successfully");
        setAuthLec({ email: "", password: "", role: "lecturer" });
        setLecInfo({ name: "", address: "", phoneNumber: "" });
      } catch (error) {
        console.log(error);
        alert("Failed to add lecturer");
      }
    },
    [authLec, lecInfo]
  );

  useEffect(() => {
    const queryLecturer = query(collection(db, "lecturer"));
    const unsubscribe = onSnapshot(
      queryLecturer,
      (snapShot) => {
        let list = [];
        snapShot.docs.forEach((doc) => {
          list.push({ id: doc.id, ...doc.data() });
        });
        setLecturers(list);
      },
      (error) => {
        console.log(error);
      }
    );
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <div className="container mx-auto">
      <div className="flex flex-row justify-between items-center mb-8">
        <div className="flex flex-col justify-between items-center text-uit">
          <div className="font-semibold p-4 text-2xl">Quản lý giảng viên</div>
          <div>{lecturers.length} giảng viên</div>
        </div>
        <button
          className="bg-blue-500 text-white font-semibold px-4 py-2 rounded cursor-pointer transform transition-transform duration-300 hover:scale-110 hover:text-red-500 hover:bg-white hover:shadow-md"
          onClick={() => setIsAddLecturerFormOpen(true)}
        >
          Thêm giảng viên
        </button>
      </div>

      <div className="flex justify-center my-8">
        {lecturers.length > 0 ? (
          <div className="w-full max-h-96 overflow-y-auto">
            <table className="min-w-full table-auto shadow-lg rounded-lg overflow-hidden">
              <thead className="bg-gray-200">
                <tr>
                  <th className="px-4 py-2">STT</th>
                  <th className="px-4 py-2">Họ tên</th>
                  <th className="px-4 py-2">Email</th>
                  <th className="px-4 py-2">Địa chỉ</th>
                  <th className="px-4 py-2">Số điện thoại</th>
                  <th className="px-4 py-2">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {lecturers.map((lecturer, index) => (
                  <tr
                    key={lecturer.id}
                    className="bg-white hover:bg-gray-100 transition-colors"
                  >
                    <td className="border px-4 py-2">{index + 1}</td>
                    <td className="border px-4 py-2">{lecturer.name}</td>
                    <td className="border px-4 py-2">{lecturer.email}</td>
                    <td className="border px-4 py-2">{lecturer.address}</td>
                    <td className="border px-4 py-2">{lecturer.phoneNumber}</td>
                    <td className="border px-4 py-2 flex justify-around items-center">
                      <TbUserEdit
                        className="bg-yellow-500 text-white px-2 py-1 rounded  cursor-pointer transform transition-transform duration-300 hover:scale-110"
                        onClick={(e) => handleModifyLecturer(e, lecturer.id)}
                        size={40}
                      />
                      <AiOutlineUserDelete
                        className="bg-red-500 text-white px-2 py-1 rounded  cursor-pointer transform transition-transform duration-300 hover:scale-110"
                        onClick={(e) => handleDeleteLecturer(e, lecturer.id)}
                        size={40}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>Không tìm thấy giáo viên nào</p>
        )}
      </div>

      {isModifyFormOpen && (
        <ModifyLecturerForm
          lecturerId={currentLecturerId}
          closeForm={() => setIsModifyFormOpen(false)}
        />
      )}

      {isConfirmModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded shadow-lg">
            <h2 className="text-xl font-bold mb-4">Xác nhận xóa giảng viên</h2>
            <p className="mb-4">
              Bạn có chắc chắn muốn xóa giảng viên này không?
            </p>
            <div className="flex justify-end">
              <button
                className="bg-red-500 text-white px-4 py-2 rounded mr-2 hover:bg-red-600"
                onClick={confirmDeleteLecturer}
              >
                Xóa
              </button>
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                onClick={() => setIsConfirmModalOpen(false)}
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}

      {isAddLecturerFormOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg transform transition-all duration-300 scale-100 lg:w-1/3 w-1/2">
            <h2 className="text-2xl font-semibold mb-4">Thêm giảng viên</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex flex-col">
                <label className="font-medium">Email</label>
                <input
                  type="text"
                  value={authLec.email}
                  onChange={(e) =>
                    setAuthLec({ ...authLec, email: e.target.value })
                  }
                  className="border rounded p-2"
                />
              </div>
              <div className="flex flex-col">
                <label className="font-medium">Password</label>
                <input
                  type="password"
                  value={authLec.password}
                  onChange={(e) =>
                    setAuthLec({ ...authLec, password: e.target.value })
                  }
                  className="border rounded p-2"
                />
              </div>
              <div className="flex flex-col">
                <label className="font-medium">Name</label>
                <input
                  type="text"
                  value={lecInfo.name}
                  onChange={(e) =>
                    setLecInfo({ ...lecInfo, name: e.target.value })
                  }
                  className="border rounded p-2"
                />
              </div>
              <div className="flex flex-col">
                <label className="font-medium">Address</label>
                <input
                  type="text"
                  value={lecInfo.address}
                  onChange={(e) =>
                    setLecInfo({ ...lecInfo, address: e.target.value })
                  }
                  className="border rounded p-2"
                />
              </div>
              <div className="flex flex-col">
                <label className="font-medium">Phone Number</label>
                <input
                  type="text"
                  value={lecInfo.phoneNumber}
                  onChange={(e) =>
                    setLecInfo({ ...lecInfo, phoneNumber: e.target.value })
                  }
                  className="border rounded p-2"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                  onClick={() => setIsAddLecturerFormOpen(false)}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Thêm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
});
