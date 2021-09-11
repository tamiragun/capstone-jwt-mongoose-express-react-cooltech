import "./App.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Login } from "./components/Login/Login";
import { Register } from "./components/Register/Register";
import { AllUsers } from "./components/AllUsers/AllUsers";
import { AllCredentials } from "./components/AllCredentials/AllCredentials";
import { AddCredential } from "./components/AddCredential/AddCredential";
import { HomePage } from "./components/HomePage/HomePage";
import banner from "./assets/banner.jpg";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={banner} alt="Banner" />
        <h1>Cool Tech</h1>
      </header>
      <body>
        <Router>
          <Switch>
            <Route path="/login">
              <Login />
            </Route>
            <Route path="/register">
              <Register />
            </Route>
            <Route path="/users">
              <AllUsers />
            </Route>
            <Route path="/credentials/add">
              <AddCredential />
            </Route>
            <Route path="/credentials">
              <AllCredentials />
            </Route>
            <Route path="/">
              <HomePage />
            </Route>
          </Switch>
        </Router>
      </body>
    </div>
  );
}

export default App;
