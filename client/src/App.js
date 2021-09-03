import './App.css';
import { Provider } from 'react-redux'
import store from './store'
import jwt_decode from 'jwt-decode';
import setAuthToken from './utils/setAuthToken';
import { logoutUser, setCurrentUser } from './actions/authActions';

import PrivateRoute from './components/common/PrivateRoute';

import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Landing from './components/layout/Landing';
import { BrowserRouter as Router, Route } from 'react-router-dom'
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './components/dashboard/Dashboard';
import { clearCurrentProfile } from './actions/profileActions';

//Check for token
if(localStorage.jwtToken) {
  //Set auth token header auth
  setAuthToken(localStorage.jwtToken);
  // Decode token and get user info and expiration
  const decoded = jwt_decode(localStorage.jwtToken);
  //Set user and isAuthenticated
  store.dispatch(setCurrentUser(decoded));

  //Check for expired token
  const currentTime = Date.now() / 1000;
  if (decoded.exp < currentTime) 
  {
    //Logout User
    store.dispatch(logoutUser());
    //Clear current Profile
    store.dispatch(clearCurrentProfile);
    //Redirect to login
    window.location.href = '/login';
  }
}

function App() {
  return (
    <Provider store = { store } >
        <Router>
          <div className="App">
            <Navbar/>
              <Route exact path="/" component={ Landing } />
              <div className="container">
                <Route exact path = "/register" component = {Register}/>
                <Route exact path = "/login" component = {Login}/>
                <Route exact path = "/dashboard" component = {Dashboard}/>
              </div>
            <Footer/> 
          </div>
        </Router>
    </Provider>
  );
}

export default App;
