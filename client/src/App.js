// import logo from './logo.svg';
// import './App.css';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import Settings from "./pages/settings/Settings";
import Single from "./pages/single/Single";
import Write from "./pages/write/Write";
import TopBar from "./components/topbar/TopBar";
import { useContext } from "react";
import { Context } from "./context/Context";

function App() {
  const { user } = useContext(Context);
  return (
    <>
      <Router>
        <TopBar />
        <Switch>
          <Route path="/" exact>
            <Home />
          </Route>
          <Route path="/register" exact>
            {user ? <Home /> : <Register />}
          </Route>
          <Route path="/login" exact>
            {user ? <Home /> : <Login />}
          </Route>
          <Route path="/write" exact>
            {user ? <Write /> : <Login />}
          </Route>
          <Route path="/settings" exact>
            {user ? <Settings /> : <Login />}
          </Route>
          <Route path="/post/:postId" exact>
            <Single />
          </Route>
        </Switch>
      </Router>
    </>
  );
}

export default App;
