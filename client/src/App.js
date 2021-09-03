import "./App.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Login } from "./components/Login/Login";
import { Register } from "./components/Register/Register";
import { AllUsers } from "./components/AllUsers/AllUsers";
import { EditUser } from "./components/EditUser/EditUser";

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
          </Switch>
        </Router>
      </header>
    </div>
  );
}

export default App;
