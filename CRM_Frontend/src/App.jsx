import AuthProvider from "./component/authContext";
import { browserRouter } from "./route";
import { RouterProvider } from "react-router-dom";

function App() {
  return (
    <>
      <AuthProvider>
        <RouterProvider router={browserRouter} />
      </AuthProvider>
    </>
  );
}

export default App;
