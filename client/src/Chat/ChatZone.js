import React from 'react';
import { Button } from 'react-bootstrap';

const ChatZone = () => {
    return (
        <>
        
        <div className='czone' style={{display:'block'}}>
            
           <div className="mright">text</div><br/>
           <div className="mleft">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</div>
           <div className="mleft">text</div>
           <div className="mright">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</div>
           
           <div className="mleft">text</div>
           <div className="mright">text</div>

        </div>

        <div>

            <textarea className='form-control' placeholder='Type a message' style={{width:'50%', display:'inline'}}></textarea> <Button style={{display:'inline', marginBottom:'2%', marginLeft:'2%'}}>Send</Button>
            
        </div>

        </>
    );
};

export default ChatZone;