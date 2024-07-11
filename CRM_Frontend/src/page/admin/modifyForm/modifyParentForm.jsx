import { useState, useEffect, useCallback, memo } from "react";
import PropTypes from "prop-types";
import {
  doGetParentData,
  doUpdateParentData,
} from "../../../controller/firestoreController";

const ModifyParentForm = memo(function ModifyParentForm({
  parentId,
  closeForm,
}) {
  const [parentData, setParentData] = useState({
    name: "",
    address: "",
    phoneNumber: "",
  });

  // Fetch the current data of the parent when the component mounts
  useEffect(() => {
    // Replace this with your actual data fetching logic
    doGetParentData(parentId).then((data) => {
      setParentData(data);
    });
  }, [parentId]);

  const handleInputChange = (event) => {
    setParentData({
      ...parentData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = useCallback(
    (event) => {
      event.preventDefault();
      if (!parentData.name || !parentData.address || !parentData.phoneNumber) {
        alert("Please fill in all fields");
        setParentData({ name: "", address: "", phoneNumber: "" });
        return;
      }
      if (parentData.phoneNumber.length < 10) {
        alert("Phone number must be at least 10 characters");
        setParentData({ ...parentData, phoneNumber: "" });
        return;
      }
      const isPhoneNumberValid = /^\d+$/.test(parentData.phoneNumber);
      if (!isPhoneNumberValid) {
        alert("Phone number must be numeric");
        setParentData({ ...parentData, phoneNumber: "" });
        return;
      }
      if (parentData.name.length < 3) {
        alert("Name must be at least 3 characters");
        setParentData({ ...parentData, name: "" });
        return;
      }
      if (parentData.phoneNumber.length > 15) {
        alert("Phone number must be at most 15 characters");
        setParentData({ ...parentData, phoneNumber: "" });
        return;
      }
      if (parentData.name.length > 50) {
        alert("Name must be at most 50 characters");
        setParentData({ ...parentData, name: "" });
        return;
      }
      // Replace this with your actual update logic
      doUpdateParentData(parentId, parentData).then(() => {
        closeForm();
      });
    },
    [parentData, parentId, closeForm]
  );

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded shadow-md w-96">
        <h2 className="text-xl font-bold mb-4">Chỉnh sửa phụ huynh</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Tên
            </label>
            <input
              type="text"
              name="name"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={parentData.name}
              onChange={handleInputChange}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Địa chỉ
            </label>
            <input
              type="text"
              name="address"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={parentData.address}
              onChange={handleInputChange}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Số điện thoại
            </label>
            <input
              type="text"
              name="phoneNumber"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={parentData.phoneNumber}
              onChange={handleInputChange}
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-blue-500 text-white font-semibold px-4 py-2 rounded cursor-pointer transform transition-transform duration-300 hover:scale-110"
            >
              Cập nhật
            </button>
            <button
              type="button"
              className="bg-gray-300 font-semibold px-4 py-2 rounded cursor-pointer transform transition-transform duration-300 hover:scale-110"
              onClick={closeForm}
            >
              Hủy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
});

ModifyParentForm.propTypes = {
  parentId: PropTypes.string.isRequired,
  closeForm: PropTypes.func.isRequired,
};

export default ModifyParentForm;
