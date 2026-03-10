import { useState } from 'react'
import AppRoutes from './router/AppRoutes'
import { Slide, ToastContainer } from 'react-toastify'
import axios from 'axios';


function App() {
  const [count, setCount] = useState(0)
  axios.defaults.baseURL="http://localhost:3000"

  return (
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
  )
}

export default App
