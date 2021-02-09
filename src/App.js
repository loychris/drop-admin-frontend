import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './App.css';

import Auth from './components/Auth/Auth';
import UploadForm from './components/UploadForm/UploadForm';


let logoutTimer;

const App = () => {
    const [token, setToken] = useState(null); 
    const [user, setUser] = useState(null);
    const [authOpen, setAuthOpen] = useState(true);

    const t = localStorage.getItem('token');
    const u = localStorage.getItem('user');
    if(u && !user){
      setUser(JSON.parse(u));
    }
    if(t && !token){
      setToken(t);
      setAuthOpen(true); 
    }
   
    return (
      <div className="App">
        <div className='Background'></div>
        <UploadForm token={token} user={user}/>
        { authOpen ? <Auth setAuthOpen={setAuthOpen}/> : null}
      </div>
    );
}

export default App;
