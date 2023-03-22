import React, { useEffect, useState } from 'react';

function Websocket() {
    const [messages, setMessages] = useState<number[]>([]);

    useEffect(() => {
        const ws = new WebSocket('ws://localhost:3000/');

        ws.onopen = () => {
            console.log('connected');
        };

        ws.onmessage = (event) => {
            const message = JSON.parse(event.data)
            const timeTaken = Date.now() - message.timeSent;

            setMessages((prevMessages) => [...prevMessages, timeTaken]);
        }

        return () => {
            ws.close();
        }
    }, []);

    return (
        <div className='flex flex-1 flex-col'>
            <h1>Websocket - Average {(messages.reduce((acc, current) => acc + current, 0) / messages.length) || 0}ms</h1>
            <br />
            
            <ul>
                {messages.map((message, index) => (
                    <li key={index}>Took {message}ms to be received by the client from the third-party</li>
                ))}
            </ul>          
        </div>
    );
}

export default Websocket;