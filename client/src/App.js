import logo from './logo.svg';
import './App.css';
import {io} from 'socket.io-client';
import React, { useEffect, useState } from "react";
import {Routes, Route, BrowserRouter} from 'react-router-dom';
import Login from './Login/login';
import 'bootstrap/dist/css/bootstrap.min.css';
import Chat from './Chat/chat';
import Signup from './Login/Signup';

function App() {


  return (
    <BrowserRouter>
    
      <Routes>

      <Route path='/' element={<Login/>}/>
      <Route path='/signup' element={<Signup/>}/>
      <Route path='/chats' element={<Chat/>}/>
      </Routes>
    
    </BrowserRouter>
  )

  
}

export default App;
