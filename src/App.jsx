import AppRoutes from "./router/AppRoutes";
import { Slide, ToastContainer } from "react-toastify";
import axios from "axios";
import { GoogleOAuthProvider } from "@react-oauth/google";

axios.defaults.baseURL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

function App() {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <AppRoutes />
      <ToastContainer
        position="top-center"
        autoClose={5000}
        newestOnTop={false}
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        transition={Slide}
      />
    </GoogleOAuthProvider>
  );
}

export default App;