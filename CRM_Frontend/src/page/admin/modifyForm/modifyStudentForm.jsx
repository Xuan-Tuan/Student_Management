import { useState, useEffect, memo, useCallback } from "react";
import PropTypes from "prop-types";
import {
  doGetStudentData,
  doUpdateStudentData,
} from "../../../controller/firestoreController";

const ModifyStudentForm = memo(function ModifyStudentForm({
  studentId,
  parents,
  closeForm,
}) {
  const [studentData, setStudentData] = useState({
    name: "",
    parentID: "",
    address: "",
    phoneNumber: "",
    RFID: "",
  });

  const [parentID, setParentID] = useState("");

  // Fetch the current data of the parent when the component mounts
  useEffect(() => {
    // Replace this with your actual data fetching logic
    doGetStudentData(studentId).then((data) => {
      setStudentData(data);
      setParentID(data.parentID);
    });
  }, [studentId]);

  const handleInputChange = (event) => {
    setStudentData({
      ...studentData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = useCallback(
    (event) => {
      event.preventDefault();
      if (
        !studentData.name ||
        !studentData.address ||
        !studentData.phoneNumber ||
        !studentData.parentID ||
        !studentData.RFID
      ) {
        alert("Please fill in all fields");
        setStudentData({ name: "", address: "", phoneNumber: "" });
        return;
      }
      if (studentData.phoneNumber.length < 10) {
        alert("Phone number must be at least 10 characters");
        setStudentData({ ...studentData, phoneNumber: "" });
        return;
      }
      const isPhoneNumberValid = /^\d+$/.test(studentData.phoneNumber);
      if (!isPhoneNumberValid) {
        alert("Phone number must be numeric");
        setStudentData({ ...studentData, phoneNumber: "" });
        return;
      }
      if (studentData.name.length < 3) {
        alert("Name must be at least 3 characters");
        setStudentData({ ...studentData, name: "" });
        return;
      }
      if (studentData.phoneNumber.length > 15) {
        alert("Phone number must be at most 15 characters");
        setStudentData({ ...studentData, phoneNumber: "" });
        return;
      }
      if (studentData.name.length > 50) {
        alert("Name must be at most 50 characters");
        setStudentData({ ...studentData, name: "" });
        return;
      }
      // Replace this with your actual update logic
      doUpdateStudentData(studentId, studentData, parentID).then(() => {
        closeForm();
      });
    },
    [studentData, studentId, closeForm, parentID]
  );

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow-md w-full max-w-lg"
      >
        <h2 className="text-2xl font-bold mb-4">Chỉnh sửa sinh viên</h2>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-1">Tên</label>
          <input
            type="text"
            name="name"
            className="border rounded w-full py-2 px-3 mt-1"
            value={studentData.name}
            onChange={handleInputChange}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-1">
            Phụ huynh
          </label>
          <select
            className="border rounded w-full py-2 px-3 mt-1"
            value={studentData.parentID}
            onChange={(e) =>
              setStudentData({ ...studentData, parentID: e.target.value })
            }
          >
            <option value="">Chọn phụ huynh</option>
            <option value={parentID}>
              {parents.find((parent) => parent.id === parentID)?.name}
            </option>
            {parents
              .filter((parent) => parent.hasChild === false)
              .map((parent) => (
                <option key={parent.id} value={parent.id}>
                  {parent.name}
                </option>
              ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-1">Địa chỉ</label>
          <input
            type="text"
            name="address"
            className="border rounded w-full py-2 px-3 mt-1"
            value={studentData.address}
            onChange={handleInputChange}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-1">
            Số điện thoại
          </label>
          <input
            type="text"
            name="phoneNumber"
            className="border rounded w-full py-2 px-3 mt-1"
            value={studentData.phoneNumber}
            onChange={handleInputChange}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-1">RFID</label>
          <input
            type="text"
            name="RFID"
            className="border rounded w-full py-2 px-3 mt-1"
            value={studentData.RFID || ""}
            onChange={handleInputChange}
          />
        </div>
        <div className="flex justify-end">
          <button
            type="button"
            onClick={closeForm}
            className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
          >
            Hủy
          </button>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Lưu
          </button>
        </div>
      </form>
    </div>
  );
});

ModifyStudentForm.propTypes = {
  studentId: PropTypes.string.isRequired,
  parents: PropTypes.array.isRequired,
  closeForm: PropTypes.func.isRequired,
};

export default ModifyStudentForm;
