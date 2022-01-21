import { useState } from "react";
import Login from "./Login";
import Signup from "./Signup";

export default function Auth() {
  const [signIn, setSignIn] = useState<boolean>(true);

  return signIn ? (
    <>
      <div style={{ marginBottom: "100px" }}>
        <button className="btn" onClick={() => setSignIn(!signIn)}>
          {signIn ? "Switch to My SignUp" : "Switch to Default SignUp/Login"}
        </button>
      </div>
      <Login />
    </>
  ) : (
    <>
      <div style={{ marginBottom: "100px" }}>
        <button className="btn" onClick={() => setSignIn(!signIn)}>
          {signIn ? "Switch to My SignUp" : "Switch to Default SignUp/Login"}
        </button>
      </div>
      <Signup />
    </>
  );
}
