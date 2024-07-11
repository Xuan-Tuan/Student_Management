import LoginPage from "../page/authentication/loginPage";
import ErrorPage from "../component/errorPage";
import ProtectedAdminPage from "../component/protectedAdminPage";
import ProtectedClientPage from "../component/protectedClientPage";

import ManageDevicePage from "../page/admin/manageDevicePage";
import ManageRoomPage from "../page/admin/manageRoomPage";
import ManageCoursePage from "../page/admin/manageCoursePage";
import DetailCoursePage from "../page/admin/detailCoursePage";

import LecturerCoursePage from "../page/lecturer/lecturerCoursePage";
import LecturerDetailCoursePage from "../page/lecturer/lecturerDetailCoursePage";
import LecturerNotification from "../page/lecturer/lecturerNotification";
import StudentCoursePage from "../page/student/studentCoursePage";
import StudentDetailCoursePage from "../page/student/studentDetailCoursePage";
import ParentCoursePage from "../page/parent/parentCoursePage";
import ParentDetailCoursePage from "../page/parent/parentDetailCoursePage";

import AccountInfor from "../component/account/accountInfor";
import AdminPage from "../page/admin/adminPage";
import StudentPage from "../page/student/studentPage";
import ParentPage from "../page/parent/parentPage";
import LecturerPage from "../page/lecturer/lecturerPage";

import {
  createBrowserRouter,
  Route,
  createRoutesFromElements,
} from "react-router-dom";

import ManageLecturerPage from "../page/admin/manageLecturerPage";
import ManageParentPage from "../page/admin/manageParentPage";
import ManageStudentPage from "../page/admin/manageStudentPage";

export const browserRouter = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route path="/" element={<LoginPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/error" element={<ErrorPage />} />
      <Route
        path="/admin"
        element={
          <ProtectedAdminPage>
            <AdminPage>
              <AccountInfor />
            </AdminPage>
          </ProtectedAdminPage>
        }
      />
      <Route
        path="/admin/manageDevice"
        element={
          <ProtectedAdminPage>
            <AdminPage>
              <ManageDevicePage />
            </AdminPage>
          </ProtectedAdminPage>
        }
      />
      <Route
        path="/admin/manageLecturer"
        element={
          <ProtectedAdminPage>
            <AdminPage>
              <ManageLecturerPage />
            </AdminPage>
          </ProtectedAdminPage>
        }
      />
      <Route
        path="/admin/manageParent"
        element={
          <ProtectedAdminPage>
            <AdminPage>
              <ManageParentPage />
            </AdminPage>
          </ProtectedAdminPage>
        }
      />
      <Route
        path="/admin/manageStudent"
        element={
          <ProtectedAdminPage>
            <AdminPage>
              <ManageStudentPage />
            </AdminPage>
          </ProtectedAdminPage>
        }
      />
      <Route
        path="/admin/manageRoom"
        element={
          <ProtectedAdminPage>
            <AdminPage>
              <ManageRoomPage />
            </AdminPage>
          </ProtectedAdminPage>
        }
      />
      <Route
        path="/admin/manageCourse"
        element={
          <ProtectedAdminPage>
            <AdminPage>
              <ManageCoursePage />
            </AdminPage>
          </ProtectedAdminPage>
        }
      />
      <Route
        path="/admin/detailCourse/:courseCode"
        element={
          <ProtectedAdminPage>
            <AdminPage>
              <DetailCoursePage />
            </AdminPage>
          </ProtectedAdminPage>
        }
      />
      <Route
        path="/student"
        element={
          <ProtectedClientPage>
            <StudentPage>
              <AccountInfor />
            </StudentPage>
          </ProtectedClientPage>
        }
      />
      <Route
        path="/student/account"
        element={
          <ProtectedClientPage>
            <StudentPage>
              <AccountInfor />
            </StudentPage>
          </ProtectedClientPage>
        }
      />
      <Route
        path="/student/course"
        element={
          <ProtectedClientPage>
            <StudentPage>
              <StudentCoursePage />
            </StudentPage>
          </ProtectedClientPage>
        }
      />
      <Route
        path="/student/course/:courseCode"
        element={
          <ProtectedClientPage>
            <StudentPage>
              <StudentDetailCoursePage />
            </StudentPage>
          </ProtectedClientPage>
        }
      />
      <Route
        path="/parent"
        element={
          <ProtectedClientPage>
            <ParentPage>
              <AccountInfor />
            </ParentPage>
          </ProtectedClientPage>
        }
      />
      <Route
        path="/parent/account"
        element={
          <ProtectedClientPage>
            <StudentPage>
              <AccountInfor />
            </StudentPage>
          </ProtectedClientPage>
        }
      />
      <Route
        path="/parent/course"
        element={
          <ProtectedClientPage>
            <ParentPage>
              <ParentCoursePage />
            </ParentPage>
          </ProtectedClientPage>
        }
      />
      <Route
        path="/parent/course/:courseCode"
        element={
          <ProtectedClientPage>
            <ParentPage>
              <ParentDetailCoursePage />
            </ParentPage>
          </ProtectedClientPage>
        }
      />
      <Route
        path="/lecturer"
        element={
          <ProtectedClientPage>
            <LecturerPage>
              <AccountInfor />
            </LecturerPage>
          </ProtectedClientPage>
        }
      />
      <Route
        path="/lecturer/account"
        element={
          <ProtectedClientPage>
            <StudentPage>
              <AccountInfor />
            </StudentPage>
          </ProtectedClientPage>
        }
      />
      <Route
        path="/lecturer/course"
        element={
          <ProtectedClientPage>
            <LecturerPage>
              <LecturerCoursePage />
            </LecturerPage>
          </ProtectedClientPage>
        }
      />
      <Route
        path="/lecturer/course/:courseCode"
        element={
          <ProtectedClientPage>
            <LecturerPage>
              <LecturerDetailCoursePage />
            </LecturerPage>
          </ProtectedClientPage>
        }
      />
      <Route
        path="/lecturer/course/:courseCode/notification"
        element={
          <ProtectedClientPage>
            <LecturerPage>
              <LecturerNotification />
            </LecturerPage>
          </ProtectedClientPage>
        }
      />
    </Route>
  )
);
