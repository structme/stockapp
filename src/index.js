import { render } from "react-dom";
import { AuthProvider } from './AuthContext';

import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";

import Login from './Login';
import Main from "./Main";
import Hisse from "./hisse";
import Portfoy from './Portfoy';
import Islemgecmisi from "./Islemgecmisi";


const rootElement = document.getElementById("root");
render(
  <AuthProvider>
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="main" element={<Main />} />
      <Route path="main/hisse" element={<Hisse />} />
      <Route path="main/portfoy" element={<Portfoy />} />
      <Route path="main/islemgecmisi" element={<Islemgecmisi />} />
      </Routes>
  </BrowserRouter>
  </AuthProvider>,
  rootElement
);