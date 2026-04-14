import { useState } from 'react'
import AppRoutes from './router/AppRoutes'
import { Slide, ToastContainer } from 'react-toastify'
import axios from 'axios';
import { GoogleOAuthProvider } from '@react-oauth/google'; // 1. Import the Provider

function App() {
  const [count, setCount] = useState(0)
  
  // Set the base URL for all axios requests
  axios.defaults.baseURL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  return (
    // 2. Wrap everything in the GoogleOAuthProvider
    // Replace the string below with your actual Client ID or use an env variable
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <>
        <AppRoutes />
        <ToastContainer
          position="top-center"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick={false}
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
          transition={Slide}
        />
      </>
    </GoogleOAuthProvider>
  )
}

export default App