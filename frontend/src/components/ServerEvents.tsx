import React, { useState, useEffect } from 'react';

function ServerEvents() {
const [messages, setMessages] = useState<number[]>([]);

    useEffect(() => {
        const eventSource = new EventSource('http://localhost:3000/sse');

        eventSource.onmessage = (event) => {
            console.log(event)

            const message = JSON.parse(event.data)
            const timeTaken = Date.now() - message.timeSent;

            setMessages((prevMessages) => [...prevMessages, timeTaken]);
        }

        return () => {
            eventSource.close();
        }
    }, []);

    return (
        <div className='flex flex-1 flex-col'>
            <h1>Server Events - Average {(messages.reduce((acc, current) => acc + current, 0) / messages.length) || 0}ms</h1>
            <br />

            <ul>
                {messages.map((message, index) => (
                    <li key={index}>Took {message}ms to be received by the client from the third-party</li>
                ))}
            </ul>          
        </div>
    );
}

export default ServerEvents;