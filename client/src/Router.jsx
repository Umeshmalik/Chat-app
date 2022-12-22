import { lazy, Suspense } from 'react'
import { NextUIProvider } from "@nextui-org/react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppNavbar from './components/Navbar';
import UserContext from "./context/userContext";

const Loading = lazy(() => import('../lib/Loading'));
const App = lazy(() => import("./App"));
const Signup = lazy(() => import('./components/Signup'));
const Signin = lazy(() => import("./components/Signin"));
const Chat = lazy(()=> import("./components/Chat"));

const Router = () => {
  return <NextUIProvider>
    <BrowserRouter>
      <UserContext>
        <AppNavbar />
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route path="/" element={<App />} />
            <Route path="/user/signup" element={<Signup />} />
            <Route path="/user/signin" element={<Signin />} />
            <Route path="/chat/:userId" element={<Chat />} />
          </Routes>
        </Suspense>
      </UserContext>
    </BrowserRouter>
  </NextUIProvider>
}

export default Router;
