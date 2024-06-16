import React, {useEffect, useState} from 'react';
import { Button } from 'react-bootstrap';
import WelcomeScreen from './WelcomeScreen';

const ChatZone = ({contact, socket}) => {

    const [text, setText] = useState('')
    const [messages, setMessages] = useState([]);
    const [id, setId] = useState('');

    useEffect(() => {
        setId(JSON.parse(localStorage.getItem('user')).id);
        const messageArray = JSON.parse(JSON.parse(localStorage.getItem('user')).messages)['m'];
        setMessages(messageArray);
    });

    const sendMessage = (e) => {

        e.preventDefault();
        const receiver = contact.id;
        const sender = JSON.parse(localStorage.getItem('user')).id;

        const parties = {
            send: sender,
            receive: receiver,
            message: text, 
            time: new Date()
        }
        console.log(parties);

        const newarray = JSON.parse(JSON.parse(localStorage.getItem('user')).messages)['m'];
        newarray.push(parties);
        const user = JSON.parse(localStorage.getItem('user'));
        user.messages = JSON.stringify({"m": newarray});
        console.log(JSON.parse(JSON.parse(localStorage.getItem('user')).messages)['m']);
        localStorage.setItem('user', JSON.stringify(user));
        setMessages(newarray);
        socket.emit("message", parties);
    }
    return (
        <>
        <div>{contact.firstName}</div>
        
        {
            Object.keys(contact).length == 0 ? <WelcomeScreen/> :

            <div>

        <div className='czone' style={{display:'block'}}>

            {
                messages.map((message, index) => (
                    message.send == contact.id ? <div className="mright">{message.message}</div> : message.receive == id ? <div className="mleft">{message.message}</div> : null


                ))
            }
            
            {/* <div className="mright">text</div><br/>
            <div className="mleft">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</div>
            <div className="mleft">text</div>
            <div className="mright">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</div>
            
            <div className="mleft">text</div>
            <div className="mright">text</div> */}
 
         </div>
 
         <div className='sendarea'>
 
             <textarea className='form-control' placeholder='Type a message' style={{width:'50%', display:'inline'}} onChange={(e) => setText(e.target.value)}></textarea> 
             <Button style={{display:'inline', marginBottom:'2%', marginLeft:'2%'}} onClick={sendMessage}>Send</Button>
             
         </div>

            </div>
        }

        </>
    );
};

export default ChatZone;