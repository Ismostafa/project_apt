import Login from "./Login.js";
// import Home from "../pages/Home";
// import SelectUsername from "../components/SelectUsername.js";
import { useParams } from "react-router-dom";
import Nav from "./Nav.js";
import SignupPage from "./SignupPage.js";
import Header from "./Header.js";
import TextEditor from "./TextEditor.js";
import Snow from "./Snow.js";
const routes = {
  //   "/": () => <Home />,
  //   "/home": () => <Home />,
  "/login": () => <Login />,
  "/signup": () => <SignupPage />,
  "/textediter": () => <Nav />,
  "/editor/:id" : () => <TextEditor/>,
  "/": () => <Header />,
"/ss": () => <Snow />,
};
export default routes;
