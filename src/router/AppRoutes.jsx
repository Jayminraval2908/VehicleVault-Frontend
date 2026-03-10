import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Login from '../pages/Login';
import Signup from '../pages/SignUp';
import MainLayout from '../components/layout/MainLayout';
import { GetApiDemo } from '../components/user/GetApiDemo';
import {UseEffectDemo} from '../components/user/UseEffectDemo';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />
  },
  {
    path: "/signup",
    element: <Signup/>
  },
  {
    path: "/user",
    element: <MainLayout role="buyer" />,
    children:[
      {
        path:"getapidemo",
        element:<GetApiDemo/>,
        
      },
      {
        path:"useeffectdemo",
        element:<UseEffectDemo/>
      },
    ],

  },
]);

const AppRoutes = () => {
  return (
    <RouterProvider router={router} />
  );
}

export default AppRoutes;