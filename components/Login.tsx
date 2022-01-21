import { useState } from "react";
import { supabase } from "../utils/supabaseClient";
import { Auth } from "@supabase/ui";

export default function Login() {
  const [loading, setLoading] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleLogIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signIn({ email, password });
      if (error) throw error;
    } catch (error) {
      // @ts-ignore
      alert(error.error_description || error.message);
    } finally {
      setLoading(false);
    }
  };

  return <Auth providers={["google"]} supabaseClient={supabase} />;
}

//<div className="row flex flex-center">
//   <div className="col-6 form-widget">
//     <h1 className="header">Log in form</h1>
//     <p className="description">Log in with your email below</p>
//     <div>
//       <input
//         className="inputField"
//         type="email"
//         placeholder="Your email"
//         value={email}
//         onChange={(e) => setEmail(e.target.value)}
//       />
//       <input
//         className="inputField"
//         type="password"
//         placeholder="Your password"
//         value={password}
//         onChange={(e) => setPassword(e.target.value)}
//       />
//     </div>
//     <div>
//       <button
//         onClick={(e) => {
//           e.preventDefault();
//           handleLogIn(email, password);
//         }}
//         className="button block"
//         disabled={loading}
//       >
//         <span>{loading ? "Loading" : "Login"}</span>
//       </button>
//     </div>
//   </div>
// </div>
