# Real-time communication with 3 services

This exercise is about real-time communication with 3 services. The services are:

- **frontend**: 
    - A web application that starts the process.
    - It should show a list of all the messages received from the other services.
    - It does not communicate with the third-party services.
- **backend**: 
    - It should be a middleman between the frontend and the third-party services.
    - A service that receives messages from the third-party services and forwards them to the frontend, also receives messages from the frontend and forwards them to the third-party services.
- **third-party services**: 
    - A service that sends messages to the backend and receives messages from the backend.
    - After starting the process, it will send a message to the backend every second during X seconds.


## Results

I implemented the solution using the following techniques:
- WebSockets
- Server Sent Events

Both solutions are very similar in implementation and performance. However the Server Sent Events is native, while websocket needs a library, during the implementation I've tested Socket.io and WS and WS was the best option, since it's faster and does not have any fallback to long polling as Socket.io does.

In a no-throttling scenario, the websocket solution is faster than the Server Sent Events solution, but in a throttling scenario, the Server Sent Events solution is faster than the websocket solution as shown in the following video:

<details>
    <summary>With Redis</summary>

### No Throttling

</details>

<details>
    <summary><a href="https://github.com/FelippeChemello/real-time-communication-nodejs/tree/92b8162259c902ff0dce791b081ce20f1e2ce325">Without Redis (Older version)</a></summary>

### No Throttling
https://user-images.githubusercontent.com/29099474/227036516-ff3d8b9e-aa9c-4498-9df2-f7bd72c7bbd1.mp4

### Slow 3G
https://user-images.githubusercontent.com/29099474/227036809-2c7fcedc-5b38-455b-a41d-a44e3b51f50c.mp4
</details>





This can be explained by the fact that Websocket protocol uses a constant connection, which may result in congestion in the network, while Server Sent Events uses a single request/response, which is more efficient in a throttling scenario.

## How to run

Simply run `yarn` on the root folder to install all the dependencies and then run `docker-compose up` to start the services.

- Frontend is running on port 8080
- Backend is running on port 3000
- Third-party services are running on port 3001.

Just open the browser, go to `http://localhost:8080` and start the process, each time you click on the button, a new process will be started for 300 seconds, and you can see the messages received in the frontend. While the process is running, you can't start a new one. 
