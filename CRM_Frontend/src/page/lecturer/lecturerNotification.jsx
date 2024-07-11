import { useEffect, useState, useCallback, memo } from "react";
import { useParams } from "react-router-dom";
import { db } from "../../config/firebaseConfig";
import { onSnapshot, collection, query } from "firebase/firestore";
import {
  doAddCourseInfo,
  doDeleteDocument,
} from "../../controller/firestoreController";

import { MdOutlineNotificationAdd } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";

export default memo(function LecturerNotification() {
  const [info, setInFo] = useState({ title: "", content: "" });
  const [infoList, setInfoList] = useState([{}]);
  const [showModal, setShowModal] = useState(false);
  const { courseCode } = useParams();

  const handleInfoSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      console.log(info);
      try {
        await doAddCourseInfo(courseCode, info);
        console.log("Add info success");
        setShowModal(false);
        setInFo("");
      } catch (error) {
        console.log(error);
      }
    },
    [info, courseCode]
  );

  const handleDeleteInfo = useCallback(async (e, id) => {
    e.preventDefault();
    try {
      await doDeleteDocument("info", id);
      console.log("Delete info success");
    } catch (error) {
      console.log(error);
    }
  }, []);

  const handleClickAddNotice = useCallback((e) => {
    e.preventDefault();
    setShowModal(true);
  }, []);

  useEffect(() => {
    const queryInfo = query(collection(db, "info"));

    const unsubscribeInfo = onSnapshot(
      queryInfo,
      (snapshot) => {
        let infoList = [];
        snapshot.docs.forEach((doc) => {
          if (doc.data().courseCode === courseCode) {
            infoList.push({ id: doc.id, ...doc.data() });
          }
        });
        setInfoList(infoList);
      },
      (error) => {
        console.log(error);
      }
    );

    return () => {
      unsubscribeInfo();
    };
  }, [courseCode]);

  return (
    <div className="h-[calc(100vh-70px-50px)]">
      <div className="text-base p-4 font-bold text-left pl-10 text-blue-700">
        <div className="flex justify-between items-center">
          <p>Danh sách thông báo của bạn</p>
        </div>
      </div>
      <div className="h-[calc(100vh-70px-50px-80px)] md:w-3/5 w-full lg:mr-20 lg:ml-20 shadow-lg flex flex-col gap-5 p-5 overflow-y-scroll will-change-scroll scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-gray-400 hover:scrollbar-thumb-gray-500">
        <div>
          {infoList.length > 0 ? (
            infoList.map((info, index) => (
              <div
                key={index}
                className="flex flex-row justify-between items-center px-8 py-4 my-5 bg-white rounded-lg shadow-md hover:shadow-2xl transition-shadow duration-300 border border-gray-200"
              >
                <div className="flex flex-col text-start text-uit text-lg font-bold">
                  <p className="mb-4 text-center">{info.title}</p>
                  <p className="mb-4">Môn học: {courseCode}</p>
                  <p className="mb-2">Nội dung: {info.content}</p>
                </div>
                <div className="flex flex-row justify-between">
                  <div
                    className="border-2 rounded-md text-uit cursor-pointer transform transition-transform duration-300 hover:scale-110"
                    onClick={(e) => handleDeleteInfo(e, info.id)}
                  >
                    <RiDeleteBin6Line className="text-uit" size={50} />
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="flex items-center justify-center shadow-lg p-4 rounded-md text-uit font-semibold text-xl">
              Bạn hiện không có thông báo nào
            </div>
          )}
        </div>
        <div
          onClick={(e) => handleClickAddNotice(e)}
          className="cursor-pointer transform transition-transform duration-300 hover:scale-110 flex items-center justify-center"
        >
          <MdOutlineNotificationAdd className="text-uit" size={50} />
        </div>
      </div>

      {/* Thêm thông báo */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-2xl border-2 border-gray-300 w-96 text-uit">
            <h2 className="text-xl font-bold mb-4">Thêm Thông Báo</h2>
            <form onSubmit={(e) => handleInfoSubmit(e)}>
              <label className="block mb-2 font-semibold">Tiêu đề</label>
              <input
                type="text"
                onChange={(e) => setInFo({ ...info, title: e.target.value })}
                value={info.title}
                className="border border-gray-300 p-2 w-full rounded mb-4 shadow-sm"
              />
              <label className="block mb-2 font-semibold">Nội dung</label>
              <textarea
                onChange={(e) => setInFo({ ...info, content: e.target.value })}
                value={info.content}
                className="border border-gray-300 p-2 w-full rounded mb-4 shadow-sm"
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded-md shadow hover:bg-blue-600"
                >
                  Thêm thông báo
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="ml-2 bg-red-500 text-white px-4 py-2 rounded-md shadow hover:bg-red-600"
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
