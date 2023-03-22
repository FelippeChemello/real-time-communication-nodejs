import express, { Request, Response } from 'express';
import cors from 'cors';
// import Redis from 'ioredis';
import expressWs from 'express-ws';

const app = express();
expressWs(app);

app.use(cors());
app.use(express.json());

const wsClientsConnected: Set<WebSocket> = new Set();
const serverEventsClientsConnected: Response[] = [];

// const redis = new Redis({
//     host: process.env.REDIS_HOST,
//     port: Number(process.env.REDIS_PORT),
// });

app.post('/start', async (req: Request, res: Response) => {
    const response = await fetch(`${process.env.THIRD_PARTY_URL}/start`, {
        method: 'POST',
    });

    res.status(response.status).send();
});

app.post('/hook', async (req: Request, res: Response) => {
    console.log('Received hook');
    const { timeSent, value }: { timeSent: number, value: number } = req.body;

    // redis.publish('my-data', JSON.stringify({
    //     timeSent,
    //     value,
    // }));

    const message = JSON.stringify({
        timeSent,
        value,
    });

    console.log('serverEventsClientsConnected', serverEventsClientsConnected.length);
    serverEventsClientsConnected.forEach((resClient) => {
        resClient.write('event: message\n');
        resClient.write(`data: ${message}\n\n`);
    });

    console.log('wsClientsConnected', wsClientsConnected.size);
    wsClientsConnected.forEach((ws) => {
        ws.send(message);
    });

    res.status(204).send();
});

// @ts-expect-error express-ws types are wrong
app.ws('/', (ws) => {
    console.log('Client WS connected');
    wsClientsConnected.add(ws);

    ws.on('close', () => {
        console.log('Client WS disconnected');
        wsClientsConnected.delete(ws);
    });
});

app.get('/sse', (req: Request, res: Response) => {
    console.log('Client SSE connected');

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    serverEventsClientsConnected.push(res);

    req.on('close', () => {
        console.log('Client SSE disconnected');
        serverEventsClientsConnected.splice(serverEventsClientsConnected.indexOf(res), 1);
    });
});

app.get('/', (req: Request, res: Response) => {
    res.status(200).send({
        status: 'ok',
    });
});

app.listen(3000, () => {
    // eslint-disable-next-line no-console
    console.log('Server is running on port 3000');
});
