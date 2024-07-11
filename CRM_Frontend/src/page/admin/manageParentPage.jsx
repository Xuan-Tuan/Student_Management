import { useEffect, useState, useCallback, memo } from "react";
import axiosInstance from "../../controller/axiosInstance";
import { db } from "../../config/firebaseConfig";
import { onSnapshot, collection, query } from "firebase/firestore";
import {
  doDeleteDocument,
  doDeleteParentOfStudent,
} from "../../controller/firestoreController";
import ModifyParentForm from "./modifyForm/modifyParentForm";
import { AiOutlineUserDelete } from "react-icons/ai";
import { TbUserEdit } from "react-icons/tb";

export default memo(function ManageParentPage() {
  const [parents, setParents] = useState([]);
  const [authPar, setAuthPar] = useState({
    email: "",
    password: "",
    role: "parent",
  });
  const [parInfo, setParInfo] = useState({
    name: "",
    address: "",
    phoneNumber: "",
  });
  const [currentParentId, setCurrentParentId] = useState("");
  const [isModifyFormOpen, setIsModifyFormOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [parentToDelete, setParentToDelete] = useState(null);
  const [isAddParentFormOpen, setIsAddParentFormOpen] = useState(false);

  const addParent = async (data) => {
    const response = await axiosInstance.post("/addParent", data);
    return response;
  };

  const deleteParent = async (id) => {
    const response = await axiosInstance.post("/deleteParent", { id });
    return response;
  };

  const handleModifyParent = (e, parentId) => {
    e.preventDefault();
    setIsModifyFormOpen(true);
    setCurrentParentId(parentId);
  };

  const handleDeleteParent = (e, id) => {
    e.preventDefault();
    setParentToDelete(id);
    setIsConfirmModalOpen(true);
  };

  const confirmDeleteParent = useCallback(async () => {
    try {
      await doDeleteDocument("parent", parentToDelete);
      await doDeleteDocument("authentication", parentToDelete);
      await doDeleteParentOfStudent(parentToDelete);
      const result = await deleteParent(parentToDelete);
      console.log(result);
      alert("Parent deleted successfully");
    } catch (error) {
      console.log(error);
      alert("Failed to delete parent");
    } finally {
      setIsConfirmModalOpen(false);
      setParentToDelete(null);
    }
  }, [parentToDelete]);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      try {
        if (
          !authPar.email ||
          !authPar.password ||
          !parInfo.name ||
          !parInfo.address ||
          !parInfo.phoneNumber
        ) {
          alert("Please fill in all fields");
          setAuthPar({ email: "", password: "", role: "parent" });
          setParInfo({ name: "", address: "", phoneNumber: "" });
          return;
        }
        if (authPar.password.length < 6) {
          alert("Password must be at least 6 characters");
          setAuthPar({ ...authPar, password: "" });
          return;
        }
        if (parInfo.phoneNumber.length < 10) {
          alert("Phone number must be at least 10 characters");
          setParInfo({ ...parInfo, phoneNumber: "" });
          return;
        }
        const isPhoneNumberValid = /^\d+$/.test(parInfo.phoneNumber);
        if (!isPhoneNumberValid) {
          alert("Phone number must be numeric");
          setParInfo({ ...parInfo, phoneNumber: "" });
          return;
        }
        if (parInfo.name.length < 3) {
          alert("Name must be at least 3 characters");
          setParInfo({ ...parInfo, name: "" });
          return;
        }
        if (parInfo.phoneNumber.length > 15) {
          alert("Phone number must be at most 15 characters");
          setParInfo({ ...parInfo, phoneNumber: "" });
          return;
        }
        if (authPar.email.length < 6) {
          alert("Email must be at least 6 characters");
          setAuthPar({ ...authPar, email: "" });
          return;
        }
        if (authPar.email.length > 50) {
          alert("Email must be at most 50 characters");
          setAuthPar({ ...authPar, email: "" });
          return;
        }
        if (parInfo.name.length > 50) {
          alert("Name must be at most 50 characters");
          setParInfo({ ...parInfo, name: "" });
          return;
        }

        const result = await addParent({
          email: authPar.email,
          password: authPar.password,
          role: authPar.role,
          name: parInfo.name,
          address: parInfo.address,
          phoneNumber: parInfo.phoneNumber,
        });
        console.log(result);
        alert("Parent added successfully");
        setAuthPar({ email: "", password: "", role: "parent" });
        setParInfo({ name: "", address: "", phoneNumber: "" });
        setIsConfirmModalOpen(false);
      } catch (error) {
        console.log(error);
        alert("Failed to add parent");
      }
    },
    [authPar, parInfo]
  );

  useEffect(() => {
    const queryParent = query(collection(db, "parent"));

    const unsubscribe = onSnapshot(
      queryParent,
      (snapShot) => {
        let list = [];
        snapShot.docs.forEach((doc) => {
          list.push({ id: doc.id, ...doc.data() });
        });
        setParents(list);
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
    <div className="container mx-auto ">
      <div className="flex flex-row justify-between items-center mb-8">
        <div className="flex flex-col justify-between items-center text-uit">
          <div className="font-semibold p-4 text-2xl">Quản lý phụ huynh</div>
          <div>{parents.length} phụ huynh</div>
        </div>
        <button
          className="bg-blue-500 text-white font-semibold px-4 py-2 rounded cursor-pointer transform transition-transform duration-300 hover:scale-110 hover:text-red-500 hover:bg-white hover:shadow-md"
          onClick={() => setIsAddParentFormOpen(true)}
        >
          Thêm phụ huynh
        </button>
      </div>

      <div className="flex justify-center my-8">
        {parents.length > 0 ? (
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
                {parents.map((parent, index) => (
                  <tr
                    key={parent.id}
                    className="bg-white hover:bg-gray-100 transition-colors"
                  >
                    <td className="border px-4 py-2">{index + 1}</td>
                    <td className="border px-4 py-2">{parent.name}</td>
                    <td className="border px-4 py-2">{parent.email}</td>
                    <td className="border px-4 py-2">{parent.address}</td>
                    <td className="border px-4 py-2">{parent.phoneNumber}</td>
                    <td className="border px-4 py-2 flex justify-around items-center">
                      <TbUserEdit
                        className="bg-yellow-500 text-white px-2 py-1 rounded  cursor-pointer transform transition-transform duration-300 hover:scale-110"
                        onClick={(e) => handleModifyParent(e, parent.id)}
                        size={40}
                      />
                      <AiOutlineUserDelete
                        className="bg-red-500 text-white px-2 py-1 rounded  cursor-pointer transform transition-transform duration-300 hover:scale-110"
                        onClick={(e) => handleDeleteParent(e, parent.id)}
                        size={40}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>Không tìm thấy phụ huynh nào</p>
        )}
      </div>

      {isModifyFormOpen && (
        <ModifyParentForm
          parentId={currentParentId}
          closeForm={() => setIsModifyFormOpen(false)}
        />
      )}

      {isConfirmModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded shadow-md">
            <h2 className="text-xl font-bold mb-4">Xác nhận xóa</h2>
            <p>Bạn có chắc chắn muốn xóa phụ huynh này?</p>
            <div className="mt-6 flex justify-around">
              <button
                className="bg-red-500 text-white font-semibold px-4 py-2 rounded cursor-pointer transform transition-transform duration-300 hover:scale-110"
                onClick={confirmDeleteParent}
              >
                Xóa
              </button>
              <button
                className="bg-gray-300 font-semibold px-4 py-2 rounded cursor-pointer transform transition-transform duration-300 hover:scale-110"
                onClick={() => setIsConfirmModalOpen(false)}
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}

      {isAddParentFormOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50 ">
          <div className="bg-white p-6 rounded-lg shadow-md lg:w-96 w-full">
            <h2 className="text-xl font-bold mb-4">Thêm phụ huynh</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Email
                </label>
                <input
                  type="email"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={authPar.email}
                  onChange={(e) =>
                    setAuthPar({ ...authPar, email: e.target.value })
                  }
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Mật khẩu
                </label>
                <input
                  type="password"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={authPar.password}
                  onChange={(e) =>
                    setAuthPar({ ...authPar, password: e.target.value })
                  }
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Họ tên
                </label>
                <input
                  type="text"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={parInfo.name}
                  onChange={(e) =>
                    setParInfo({ ...parInfo, name: e.target.value })
                  }
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Địa chỉ
                </label>
                <input
                  type="text"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={parInfo.address}
                  onChange={(e) =>
                    setParInfo({ ...parInfo, address: e.target.value })
                  }
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Số điện thoại
                </label>
                <input
                  type="text"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={parInfo.phoneNumber}
                  onChange={(e) =>
                    setParInfo({ ...parInfo, phoneNumber: e.target.value })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <button
                  type="submit"
                  className="bg-blue-500 text-white font-semibold px-4 py-2 rounded cursor-pointer transform transition-transform duration-300 hover:scale-110"
                >
                  Thêm phụ huynh
                </button>
                <button
                  type="button"
                  className="bg-gray-300 font-semibold px-4 py-2 rounded cursor-pointer transform transition-transform duration-300 hover:scale-110"
                  onClick={() => setIsAddParentFormOpen(false)}
                >
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
});
