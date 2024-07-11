import { useState, useEffect, useCallback, memo } from "react";
import PropTypes from "prop-types";
import {
  doGetLecturerData,
  doUpdateLecturerData,
} from "../../../controller/firestoreController";

const ModifyLecturerForm = memo(function ModifyLecturerForm({
  lecturerId,
  closeForm,
}) {
  const [lecturerData, setLecturerData] = useState({
    name: "",
    address: "",
    phoneNumber: "",
  });

  // Fetch the current data of the lecturer when the component mounts
  useEffect(() => {
    // Replace this with your actual data fetching logic
    doGetLecturerData(lecturerId).then((data) => {
      setLecturerData(data);
    });
  }, [lecturerId]);

  const handleInputChange = (event) => {
    setLecturerData({
      ...lecturerData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = useCallback(
    (event) => {
      event.preventDefault();
      if (
        !lecturerData.name ||
        !lecturerData.address ||
        !lecturerData.phoneNumber
      ) {
        alert("Please fill in all fields");
        setLecturerData({ name: "", address: "", phoneNumber: "" });
        return;
      }
      const isPhoneNumberValid = /^\d+$/.test(lecturerData.phoneNumber);
      if (!isPhoneNumberValid) {
        alert("Phone number must contain only numbers");
        setLecturerData({ ...lecturerData, phoneNumber: "" });
        return;
      }
      if (lecturerData.phoneNumber.length < 10) {
        alert("Phone number must be at least 10 characters");
        setLecturerData({ ...lecturerData, phoneNumber: "" });
        return;
      }
      if (lecturerData.phoneNumber.length > 15) {
        alert("Phone number must be at most 15 characters");
        setLecturerData({ ...lecturerData, phoneNumber: "" });
        return;
      }
      if (lecturerData.name.length < 3) {
        alert("Name must be at least 3 characters");
        setLecturerData({ ...lecturerData, name: "" });
        return;
      }
      // Replace this with your actual update logic
      doUpdateLecturerData(lecturerId, lecturerData).then(() => {
        closeForm();
      });
    },
    [lecturerData, lecturerId, closeForm]
  );

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-4">Modify Lecturer</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Name:
            </label>
            <input
              type="text"
              name="name"
              value={lecturerData.name}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Address:
            </label>
            <input
              type="text"
              name="address"
              value={lecturerData.address}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Phone Number:
            </label>
            <input
              type="text"
              name="phoneNumber"
              value={lecturerData.phoneNumber}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Submit
            </button>
            <button
              type="button"
              onClick={closeForm}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
});

ModifyLecturerForm.propTypes = {
  lecturerId: PropTypes.string.isRequired,
  closeForm: PropTypes.func.isRequired,
};

export default ModifyLecturerForm;
