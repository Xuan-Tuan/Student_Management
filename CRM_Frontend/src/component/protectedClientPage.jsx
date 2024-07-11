import { useAuth } from "../controller/authController";
import { PropTypes } from "prop-types";
import { Navigate } from "react-router-dom"; // Add this line

ProtectedClientPage.propTypes = {
  children: PropTypes.node,
};

export default function ProtectedClientPage({ children }) {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <Navigate to="/login" replace={true} />;
  }

  currentUser.getIdTokenResult().then((idTokenResult) => {
    const { role } = idTokenResult.claims;
    if (role !== "lecturer" && role !== "parent" && role !== "student") {
      return <Navigate to="/error" replace={true} />;
    }
  });

  return children;
}
