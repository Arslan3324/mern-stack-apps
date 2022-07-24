import React, { useState } from 'react';
import { BrowserRouter, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import ExercisesList from "./components/ExercisesList";
import EditExercise from "./components/EditExercise";
import CreateExercise from "./components/CreateExercise";
import CreateUser from "./components/CreateUser";
import Homepage from "./components/homepage/homepage"
import Login from "./components/login/login"
import Register from "./components/register/register"

function App() {
  const [ user, setLoginUser] = useState({})
  return (
    <BrowserRouter>
    
      <br />
      <Route exact path="/">
            {
              user && user._id ? <ExercisesList /> : <Login setLoginUser={setLoginUser}/>
              
            }
          </Route>
          <Route path="/login">
            <Login setLoginUser={setLoginUser}/>
          </Route>
          <Route path="/register">
            <Register />
          </Route>
      <Route  path="/exe" component={ExercisesList} />
      <Route path="/edit/:id" component={EditExercise} />
      <Route path="/create" component={CreateExercise} />
      <Route path="/user" component={CreateUser} />
    </BrowserRouter>
  );
}

export default App;
