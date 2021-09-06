import "./App.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Login } from "./components/Login/Login";
import { Register } from "./components/Register/Register";
import { AllUsers } from "./components/AllUsers/AllUsers";
import { EditUser } from "./components/EditUser/EditUser";
import { AllCredentials } from "./components/AllCredentials/AllCredentials";
import { EditCredential } from "./components/EditCredential/EditCredential";
import { AddCredential } from "./components/AddCredential/AddCredential";

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
              <EditUser id="6131cdaa9c61d2203abae9b2" />
            </Route>
            <Route path="/users">
              <AllUsers />
            </Route>
            <Route path="/credentials/edit">
              <EditCredential id="61339be91ad2b41debf23ba8" />
            </Route>
            <Route path="/credentials/add">
              <AddCredential id="61339be91ad2b41debf23ba8" />
            </Route>
            <Route path="/credentials">
              <AllCredentials org_unit="News management" division="Marketing" />
            </Route>
          </Switch>
        </Router>
      </header>
    </div>
  );
}

export default App;
