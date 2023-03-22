import React from 'react';
import { Websocket, ServerEvents } from './components'

function App() {

    async function handleStart() {
        await fetch('http://localhost:3000/start', { method: 'POST' })
    }

    return (
        <div className='w-full flex justify-center items-center flex-col'>
            <button 
                className='rounded-xl my-8 py-2.5 px-4 text-sm font-medium text-blue-700 border-solid border-2 border-blue-700 hover:bg-blue-700 hover:text-white'
                onClick={handleStart}
            >
                Start
            </button>
            <div className="w-full max-w-screen-xl px-2 py-8 flex justify-between">
                <Websocket />
                <ServerEvents />
            </div>
        </div>
    );
}

export default App;
