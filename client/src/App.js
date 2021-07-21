import './App.css';
import { Provider } from 'react-redux'
import store from './store'


import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Landing from './components/layout/Landing';
import { BrowserRouter as Router, Route } from 'react-router-dom'
import Login from './components/auth/Login';
import Register from './components/auth/Register';


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
              </div>
            <Footer/> 
          </div>
        </Router>
    </Provider>
  );
}

export default App;
