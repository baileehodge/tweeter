import { useContext } from "react";
import { UserInfoContext } from "./UserInfoProvider"

const useUserInfoHook = () => useContext(UserInfoContext);

export default useUserInfoHook;

// import useUserInfoHook from "./userInfoHook"
// useUserInfoHook();