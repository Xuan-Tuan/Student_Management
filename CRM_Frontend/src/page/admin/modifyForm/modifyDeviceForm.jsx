import { useState, useEffect, useCallback, memo } from "react";
import PropTypes from "prop-types";
import {
  doGetDeviceData,
  updateDeviceData,
} from "../../../controller/firestoreController";
import { db } from "../../../config/firebaseConfig";
import { collection, query, onSnapshot } from "firebase/firestore";

const ModifyDeviceModal = memo(function ModifyDeviceModal({
  deviceId,
  closeModal,
}) {
  const [deviceData, setDeviceData] = useState({
    id: "",
    roomID: "",
    status: "",
  });
  const [roomList, setRoomList] = useState([]);

  // Fetch the current data of the device when the component mounts
  useEffect(() => {
    // Replace this with your actual data fetching logic
    doGetDeviceData(deviceId).then((data) => {
      setDeviceData(data);
    });
    const roomQuery = query(collection(db, "room"));
    const unsubscribeRoom = onSnapshot(roomQuery, (snapshot) => {
      let roomList = [];
      snapshot.forEach((doc) => {
        roomList.push(doc.id);
      });
      setRoomList(roomList);
    });
    return () => {
      unsubscribeRoom();
    };
  }, [deviceId]);

  const handleInputChange = (event) => {
    setDeviceData({
      ...deviceData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = useCallback(
    (event) => {
      event.preventDefault();
      if (deviceData.roomID === "") {
        alert("Please select a room");
        return;
      }
      // Replace this with your actual update logic
      updateDeviceData(deviceId, deviceData).then(() => {
        closeModal();
      });
    },
    [deviceData, deviceId, closeModal]
  );

  return (
    <div className="bg-white p-8 rounded shadow-md">
      <h2 className="text-xl font-bold mb-4">Modify Device</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700">ID:</label>
          <input
            type="text"
            name="id"
            value={deviceData.id}
            onChange={handleInputChange}
            className="border border-gray-300 p-2 rounded w-full"
            disabled
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Room ID:</label>
          <select
            name="roomID"
            value={deviceData.roomID}
            onChange={handleInputChange}
            className="border border-gray-300 p-2 rounded w-full"
          >
            <option value="">Select Room</option>
            <option value="Online">Online</option>
            {roomList.map((roomID) => (
              <option key={roomID} value={roomID}>
                {roomID}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Status:</label>
          <input
            type="text"
            name="status"
            value={deviceData.status}
            onChange={handleInputChange}
            className="border border-gray-300 p-2 rounded w-full"
            disabled
          />
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition mr-2"
          >
            Xác nhận
          </button>
          <button
            type="button"
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition"
            onClick={closeModal}
          >
            Hủy
          </button>
        </div>
      </form>
    </div>
  );
});

ModifyDeviceModal.propTypes = {
  deviceId: PropTypes.string.isRequired,
  closeModal: PropTypes.func.isRequired,
};

export default ModifyDeviceModal;
