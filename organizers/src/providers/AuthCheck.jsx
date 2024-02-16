// import { useEffect } from "react";
// import { useNavigate } from "react-router-dom";

// import { isValidUser } from "../utils/dataGetter";

// eslint-disable-next-line react/prop-types
const AuthCheck = ({ children }) => {
  // const navigate = useNavigate();
  // useEffect(() => {
  //   (async () => {
  //     const flg = await isValidUser();
  //     if (flg) {
  //       navigate("/");
  //     } else {
  //       navigate("/signin");
  //     }
  //   })();
  // }, [navigate]);

  return <>{children}</>;
};

export default AuthCheck;
