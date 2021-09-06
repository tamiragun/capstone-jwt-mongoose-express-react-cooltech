import "./App.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Login } from "./components/Login/Login";
import { Register } from "./components/Register/Register";
import { AllUsers } from "./components/AllUsers/AllUsers";
import { EditUser } from "./components/EditUser/EditUser";
import { AllCredentials } from "./components/AllCredentials/AllCredentials";
import { EditCredential } from "./components/EditCredential/EditCredential";
import { AddCredential } from "./components/AddCredential/AddCredential";
import { HomePage } from "./components/HomePage/HomePage";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Router>
          <Switch>
            <Route path="/login">
              <Login />
            </Route>
            <Route path="/register">
              <Register />
            </Route>
            <Route path="/users/edit">
              <EditUser />
            </Route>
            <Route path="/users">
              <AllUsers />
            </Route>
            <Route path="/credentials/add">
              <AddCredential />
            </Route>
            <Route path="/credentials">
              <AllCredentials org_unit="News management" division="Marketing" />
            </Route>
            <Route path="/">
              <HomePage />
            </Route>
          </Switch>
        </Router>
      </header>
    </div>
  );
}

export default App;
