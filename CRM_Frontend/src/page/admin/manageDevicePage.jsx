import { useEffect, useState, memo, useCallback } from "react";
import { collection, query, onSnapshot } from "firebase/firestore";
import { db } from "../../config/firebaseConfig";
import {
  doAddDevice,
  doDeleteDocument,
} from "../../controller/firestoreController";
import { formattedDate } from "../../controller/formattedDate";
import axiosInstance from "../../controller/axiosInstance";
import ModifyDeviceModal from "./modifyForm/modifyDeviceForm";
import { CiEdit } from "react-icons/ci";
import { RiDeleteBin4Line } from "react-icons/ri";

export default memo(function ManageDevicePage() {
  const [deviceInfo, setDeviceInfo] = useState({
    id: "",
    roomID: "",
    status: "Unknown",
  });

  const [deviceList, setDeviceList] = useState([]);
  const [roomList, setRoomList] = useState([]);
  const [postDataOfDate, setPostDataOfDate] = useState(
    formattedDate(new Date())
  );
  const [currentTimeForOnline, setCurrentTimeForOnline] = useState("");
  const [currentDeviceId, setCurrentDeviceId] = useState("");
  const [isModifyModalOpen, setIsModifyModalOpen] = useState(false);
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const openAddForm = () => {
    setIsAddFormOpen(true);
  };

  const closeAddForm = () => {
    setIsAddFormOpen(false);
  };

  const openDeleteModal = (deviceId) => {
    setCurrentDeviceId(deviceId);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  const openModifyModal = (deviceId) => {
    setCurrentDeviceId(deviceId);
    setIsModifyModalOpen(true);
  };

  const checkStatus = async () => {
    try {
      const response = await axiosInstance.post("/checkStatus");
      return response;
    } catch (err) {
      console.error(err);
      return err;
    }
  };

  const resetStatus = async () => {
    try {
      const response = await axiosInstance.post("/resetDeviceStatus");
      return response;
    } catch (err) {
      console.error(err);
      return err;
    }
  };

  const postDataDate = async (date, time) => {
    try {
      const response = await axiosInstance.post("/postDataOfDate", {
        date,
        time,
      });
      return response;
    } catch (err) {
      console.error(err);
      return err;
    }
  };

  const deviceWorkAuto = async (time) => {
    try {
      const response = await axiosInstance.post("/deviceWorkAuto", { time });
      return response;
    } catch (err) {
      console.error(err);
      return err;
    }
  };

  const handleAutoWork = useCallback(
    async (e) => {
      e.preventDefault();
      try {
        const result = await deviceWorkAuto(currentTimeForOnline);
        console.log(result);
        alert("Device work automatically successfully");
      } catch (error) {
        console.log(error);
        alert("Failed to work device automatically");
      }
    },
    [currentTimeForOnline]
  );

  const handlePostDataOfDate = useCallback(
    async (e) => {
      e.preventDefault();
      try {
        const allDeviceUnknown = deviceList.every(
          (device) => device.status === "Unknown"
        );
        if (allDeviceUnknown) {
          alert("All devices are unknown. Please check device status first");
          return;
        }
        const result = await postDataDate(postDataOfDate, currentTimeForOnline);
        console.log(result);
        alert("Post data of date successfully");
      } catch (error) {
        console.log(error);
        alert("Failed to post data of date");
      }
    },
    [deviceList, postDataOfDate, currentTimeForOnline]
  );

  const handleCheckStatus = useCallback(
    async (e) => {
      e.preventDefault();
      try {
        if (deviceList.length === 0) {
          alert("No device to reset status");
          return;
        }
        const result = await checkStatus();
        console.log(result);
        alert("Check device status successfully");
      } catch (error) {
        console.log(error);
        alert("Failed to check device status");
      }
    },
    [deviceList]
  );

  const handleResetStatus = useCallback(
    async (e) => {
      e.preventDefault();
      try {
        if (deviceList.length === 0) {
          alert("No device to reset status");
          return;
        }
        const result = await resetStatus();
        console.log(result);
        alert("Reset device status successfully");
      } catch (err) {
        console.error(err);
        if (err.message === "Network Error") {
          alert("Network error. Please check your connection and try again.");
        } else {
          alert("Failed to delete device");
        }
      }
    },
    [deviceList]
  );

  const handleDeviceSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      try {
        if (deviceInfo.id === "" || deviceInfo.roomID === "") {
          alert("Please fill in all fields");
          setDeviceInfo({ ...deviceInfo, id: "", roomID: "" });
          return;
        }
        if (!deviceInfo.id.match(/^[0-9]+$/)) {
          alert("Device ID must be a number");
          setDeviceInfo({ ...deviceInfo, id: "", roomID: "" });
          return;
        }
        if (deviceList.some((device) => device.id === deviceInfo.id)) {
          alert("Device ID already exists");
          setDeviceInfo({ ...deviceInfo, id: "", roomID: "" });
          return;
        }
        await doAddDevice(deviceInfo);
        alert("Device added successfully");
        setDeviceInfo({ ...deviceInfo, id: "", roomID: "" });
        closeAddForm();
      } catch (err) {
        console.error(err);
        alert("Failed to add device");
        setDeviceInfo({ ...deviceInfo, id: "", roomID: "" });
      }
    },
    [deviceInfo, deviceList]
  );

  const handleDeleteDevice = useCallback(async (e, deviceID) => {
    e.preventDefault();
    try {
      await doDeleteDocument("device", deviceID.toString());
      alert("Device deleted successfully");
      closeDeleteModal();
    } catch (err) {
      console.error(err);
      alert("Failed to delete device");
    }
  }, []);

  useEffect(() => {
    const deviceQuery = query(collection(db, "device"));
    const roomQuery = query(collection(db, "room"));

    const unsubscribeDevice = onSnapshot(deviceQuery, (snapshot) => {
      let deviceList = [];
      snapshot.forEach((doc) => {
        deviceList.push({ id: doc.id, ...doc.data() });
      });
      setDeviceList(deviceList);
    });
    const unsubscribeRoom = onSnapshot(roomQuery, (snapshot) => {
      let roomList = [];
      snapshot.forEach((doc) => {
        roomList.push(doc.id);
      });
      setRoomList(roomList);
    });

    return () => {
      unsubscribeDevice();
      unsubscribeRoom();
    };
  }, [deviceInfo]);

  return (
    <div className="container mx-auto p-4 text-uit">
      <div className="text-2xl font-bold mb-4">Danh sách thiết bị</div>
      <div className="flex space-x-8">
        <div className=" w-3/5">
          <table className="border-collapse border border-gray-400 w-full">
            <thead>
              <tr>
                <th className="border border-gray-400 px-4 py-2">Device ID</th>
                <th className="border border-gray-400 px-4 py-2">Room ID</th>
                <th className="border border-gray-400 px-4 py-2">Status</th>
                <th className="border border-gray-400 px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {deviceList.map((device) => (
                <tr key={device.id}>
                  <td className="border border-gray-400 px-4 py-2">
                    {device.id}
                  </td>
                  <td className="border border-gray-400 px-4 py-2">
                    {device.roomID}
                  </td>
                  <td className="border border-gray-400 px-4 py-2">
                    {device.status}
                  </td>
                  <td className="border border-gray-400 px-4 py-2 flex flex-row">
                    <CiEdit
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition mr-2"
                      onClick={() => openModifyModal(device.id)}
                      size={50}
                    />
                    <RiDeleteBin4Line
                      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700 transition"
                      onClick={() => openDeleteModal(device.id)}
                      size={50}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700 transition mt-4"
            onClick={openAddForm}
          >
            Add Device
          </button>
        </div>
        <div className="w-2/5 flex flex-col justify-start">
          <div className="flex flex-row justify-evenly">
            <button
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700 transition mb-4"
              onClick={(e) => handleCheckStatus(e)}
            >
              Check device
            </button>
            <button
              className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-700 transition mb-4"
              onClick={(e) => handleResetStatus(e)}
            >
              Reset device
            </button>
          </div>

          <input
            type="date"
            className="border border-gray-300 p-2 rounded mb-2"
            onChange={(e) =>
              setPostDataOfDate(formattedDate(new Date(e.target.value)))
            }
          />
          <input
            type="time"
            className="border border-gray-300 p-2 rounded mb-2"
            onChange={(e) => setCurrentTimeForOnline(e.target.value)}
          />
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            onClick={(e) => handlePostDataOfDate(e)}
          >
            Post data of date: {postDataOfDate}
          </button>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition mt-4"
            onClick={(e) => handleAutoWork(e)}
          >
            Automatically Mode
          </button>
        </div>
      </div>

      {isAddFormOpen && (
        <div className="bg-white p-4 rounded shadow-md mb-4">
          <h2 className="text-xl font-bold mb-4">Add Device</h2>
          <form onSubmit={handleDeviceSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700">Device ID:</label>
              <input
                type="text"
                name="id"
                value={deviceInfo.id}
                onChange={(e) =>
                  setDeviceInfo({ ...deviceInfo, id: e.target.value })
                }
                className="border border-gray-300 p-2 rounded w-full"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Room ID:</label>
              <select
                name="roomID"
                value={deviceInfo.roomID}
                onChange={(e) =>
                  setDeviceInfo({ ...deviceInfo, roomID: e.target.value })
                }
                className="border border-gray-300 p-2 rounded w-full"
              >
                <option value="">Select Room</option>
                {roomList.map((roomID) => {
                  return (
                    <option key={roomID} value={roomID}>
                      {roomID}
                    </option>
                  );
                })}
              </select>
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded mr-2 hover:bg-gray-400 transition"
                onClick={closeAddForm}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700 transition"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      )}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded shadow-md">
            <p className="text-lg font-medium mb-4">
              Xác nhận xóa thiết bị này
            </p>
            <div className="flex justify-end">
              <button
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded mr-2 hover:bg-gray-400 transition"
                onClick={closeDeleteModal}
              >
                Hủy
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700 transition"
                onClick={(e) => handleDeleteDevice(e, currentDeviceId)}
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}
      {isModifyModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <ModifyDeviceModal
            deviceId={currentDeviceId}
            deviceList={deviceList}
            closeModal={() => setIsModifyModalOpen(false)}
          />
        </div>
      )}
    </div>
  );
});
