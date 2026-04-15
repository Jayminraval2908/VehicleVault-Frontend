import { useState } from 'react';
import AppRoutes from './router/AppRoutes';
import { Slide, ToastContainer } from 'react-toastify';
import axios from 'axios';
import { GoogleOAuthProvider } from '@react-oauth/google';

function App() {
  const [count, setCount] = useState(0);

  // ✅ Set base URL properly (env first, fallback for local)
  axios.defaults.baseURL =
    import.meta.env.VITE_API_URL || "http://localhost:5000";

  return (
    <GoogleOAuthProvider
      clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}
    >
      <>
        <AppRoutes />

        <ToastContainer
          position="top-center"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
          transition={Slide}
        />
      </>
    </GoogleOAuthProvider>
  );
}

export default App;