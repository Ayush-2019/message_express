import React, {forwardRef, useEffect, useRef, useState} from 'react';
import { Button } from 'react-bootstrap';
import WelcomeScreen from './WelcomeScreen';

const ChatZone = ({contact, socket, trigger}) => {

    const [text, setText] = useState('')
    const [messages, setMessages] = useState([]);
    const [id, setId] = useState('');
    const div = useRef(null);
    const sound = new Audio('/ping.wav');

    useEffect(() => {
        console.log("trigger changed");
        setId(JSON.parse(localStorage.getItem('user')).id);
        const messageArray = JSON.parse(JSON.parse(localStorage.getItem('user')).messages)['m'];
        setMessages(messageArray);
        console.log(messageArray);
        div.current?.scrollIntoView({ behavior: 'smooth' });
    }, [contact, trigger]);

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
        setText('');
        div.current?.scrollIntoView({ behavior: 'smooth' });
        sound.play();
    }
    return (
        <>
        {/* <audio id="audio" src="../resources/ping.wav" autostart="false" ref={sound}></audio> */}
        <div style={{fontWeight:"bold"}}>{contact.firstName} {contact.lastName}</div>
        
        {
            Object.keys(contact).length == 0 ? <WelcomeScreen/> :

            <div>
                {/* {id} and {contact.id} */}
        <div className='czone' style={{display:'block'}}>

            <div>
            {
                messages.map((message, index) => (
                    message.send == id && message.receive == contact.id ? <div className="mright">{message.message}</div> : message.send == contact.id  ? <div className="mleft">{message.message}</div> : null


                ))
            }
            </div>
            <div ref={div} className='scrollStyling'><hr/></div>
            {/* <div ref={div} style={{position:'relative'}}>area</div> */}
            
            {/* <div className="mright">text</div><br/>
            <div className="mleft">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</div>
            <div className="mleft">text</div>
            <div className="mright">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</div>
            
            <div className="mleft">text</div>
            <div className="mright">text</div> */}
        
         </div>
 
         <div className='sendarea'>
 
             <textarea className='form-control' placeholder='Type a message' style={{width:'50%', display:'inline'}}  value={text} onChange={(e) => setText(e.target.value)}></textarea> 
             <Button style={{display:'inline', marginBottom:'2%', marginLeft:'2%'}} onClick={sendMessage}>Send</Button>
             
         </div>

            </div>
        }

        </>
    );
};

export default ChatZone;