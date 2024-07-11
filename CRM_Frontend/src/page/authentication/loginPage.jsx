import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  doSignInWithEmailAndPassword,
  doSignOut,
} from "../../controller/authController";
import Logo from "../../assets/LOGO.png";

export default function LoginPage() {
  const navigate = useNavigate();
  const [userCredentials, setUserCredentials] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    doSignOut();
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    try {
      doSignInWithEmailAndPassword(
        userCredentials.email,
        userCredentials.password
      )
        .then((userCredential) => {
          const user = userCredential.user;
          console.log("LoginPage: ", user);
          user.getIdTokenResult().then((idTokenResult) => {
            const { role } = idTokenResult.claims;
            console.log("LoginPage: ", user.uid, role);
            navigate(`/${role}`);
          });
        })
        .catch((error) => {
          alert(
            "Thông tin đăng nhập không đúng. Vui lòng nhập đúng thông tin tài khoản."
          );
          console.error(error);
        });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="container h-auto lg:w-2/6 lg:auto my-8 mx-auto px-12 py-12 flex flex-col justify-center border-4 rounded-3xl  bg-white shadow-md">
        <div className=" flex justify-evenly item-center sm:mx-auto sm:w-full sm:max-w-sm">
          <div>
            <img className="mt-2 w-20" src={Logo} alt="LOGO" />
          </div>
          <h2 className=" mt-2 text-center text-lg lg:text-2xl font-bold leading-9 tracking-tight text-blue-900">
            HỆ THỐNG <br />
            QUẢN LÝ SINH VIÊN
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" onSubmit={(e) => handleLogin(e)}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Email
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  onChange={(e) =>
                    setUserCredentials({
                      ...userCredentials,
                      email: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Mật khẩu
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  onChange={(e) =>
                    setUserCredentials({
                      ...userCredentials,
                      password: e.target.value,
                    })
                  }
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                onClick={handleLogin}
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Đăng nhập
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
