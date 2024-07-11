import { useAuth } from "../controller/authController";
import { PropTypes } from "prop-types";
import { Navigate } from "react-router-dom"; // Add this line

ProtectedAdminPage.propTypes = {
  children: PropTypes.node,
};

export default function ProtectedAdminPage({ children }) {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <Navigate to="/login" replace={true} />;
  }

  currentUser.getIdTokenResult().then((idTokenResult) => {
    const { role } = idTokenResult.claims;
    if (role !== "admin") {
      return <Navigate to="/error" replace={true} />;
    }
  });

  return children;
}
