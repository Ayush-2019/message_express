import React, {useState, useMemo, useEffect, useRef} from 'react';
import {Container, Row, Col} from 'react-bootstrap';
import {io} from 'socket.io-client';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ChatZone from './ChatZone';

const Chat = () => {
    const socket = useMemo(() => io("http://localhost:3001"), []);
    const [message, setMessage] = useState("");
    const [contacts, setContacts] = useState([]);
    const history = useNavigate();
    const [user, setUser] = useState({});
    const [currContact, setCurrContact] = useState({});
  
    const [roomc, setRoomc] = useState("");
    const [to, setTo] = useState("");
    const [id, setId] = useState("");
    const [messages, setMessages] = useState([]);
    const [trigger, setTrigger] = useState(1);
    const div = useRef(null);

    const updateChatZone = (contact) => {

      setCurrContact(contact);


    }
  
    useEffect(() => {
      setId(JSON.parse(localStorage.getItem('user')).id);
      socket.on("connect", async() => {
  

        // setId(socket.id);

        console.log("socket id " + socket.id);

        const current_user = JSON.parse(localStorage.getItem('user'));
        setUser(current_user);
        console.log("state user " + JSON.stringify(user));

        current_user.socket_id = localStorage.getItem('user')?socket.id:null;
        delete current_user['email'];
        delete current_user['id'];
        delete current_user['created_at'];
        delete current_user['updated_at'];

        // console.log(current_user);

        const userupdate = await axios.put('http://localhost:3001/v10/user/self', current_user, {
          headers: {
            'Authorization': 'Basic '+ localStorage.getItem('token'),
          }
        })
        .then((response)=>{
          console.log("response data put: "+response);
          if(response.status === 200){
            // toast.success('Welcome to Message Express '+ current_user.firstName);
            // toast.success('Your Socket ID is '+ response.data.socket_id);
            localStorage.setItem('user', JSON.stringify(response.data));
          }
        })
        .catch((error) => {
          console.log(error);
          localStorage.clear();
          history('/');
          toast.error('Error updating socket id');
        });

        const allUsers = await axios.get('http://localhost:3001/v10/user/all')
        .then((response) => {
            setContacts(response.data);
            console.log(response.data);
        })
  
      socket.on("welcome", (s) => {
        console.log(s)
      });
  
      socket.on("receive", (entry) => {
        console.log("received");
        console.log(entry);
        const newarray = JSON.parse(JSON.parse(localStorage.getItem('user')).messages)['m'];
        newarray.push(entry);
        const user = JSON.parse(localStorage.getItem('user'));
        user.messages = JSON.stringify({"m": newarray});
        console.log(JSON.parse(JSON.parse(localStorage.getItem('user')).messages)['m']);
        localStorage.setItem('user', JSON.stringify(user));
        setTrigger(prev => prev + 1);
        div.current?.scrollIntoView({ behavior: 'smooth' });
        
      });
  
      return () => {
        socket.disconnect();
      }
      
  
    })},[])
    return (
      
      <div className="App">

        <div className='chatzone'>

            <div className='container border border-dark mt-5'>

                <div className='row leftPanel'>
                    <div className='col-md-3 border border-dark clist'>
                        {
                          contacts.map((contact) => {

                            if(id != contact.id){
                            return <><div className='row contact' onClick={() => updateChatZone(contact)}>{contact.firstName + ' ' + contact.lastName}</div></>
}})
                        }

                    </div>
                    <div className='col-md-9 border border-dark panel'>
                        <div className='title'>{user.firstName + ' ' +user.lastName}</div>
                        <div className="messages">
                            <ChatZone contact = {currContact} socket = {socket} trigger = {trigger}/>
                        </div>
                        <div></div>
                    </div>
                </div>

            </div>

        </div>

        <ToastContainer
      position="bottom-right"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="dark"
/>
        
      </div>
    );
};

export default Chat;