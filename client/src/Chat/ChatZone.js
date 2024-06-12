import React from 'react';
import { Button } from 'react-bootstrap';

const ChatZone = () => {
    return (
        <>
        
        <div className='czone'>
            
            Content here

        </div>

        <div>

            <textarea className='form-control' placeholder='Type a message' style={{width:'50%', display:'inline'}}></textarea> <Button style={{display:'inline', marginBottom:'2%', marginLeft:'2%'}}>Send</Button>
            
        </div>

        </>
    );
};

export default ChatZone;