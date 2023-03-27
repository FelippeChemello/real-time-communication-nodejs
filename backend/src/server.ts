import express, { Request, Response } from 'express';
import cors from 'cors';
import Redis from 'ioredis';
import expressWs from 'express-ws';

const app = express();
expressWs(app);

app.use(cors());
app.use(express.json());

const pubRedis = new Redis({
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
});

const subRedis = new Redis({
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
});

subRedis.subscribe('my-data', (err, count) => {
    if (err) {
        console.error(err);
    }

    console.log(`Subscribed to ${count} channels`);
});

app.post('/start', async (req: Request, res: Response) => {
    const response = await fetch(`${process.env.THIRD_PARTY_URL}/start`, {
        method: 'POST',
    });

    res.status(response.status).send();
});

app.post('/hook', async (req: Request, res: Response) => {
    console.log('Received hook');
    const { timeSent, value }: { timeSent: number, value: number } = req.body;

    pubRedis.publish('my-data', JSON.stringify({
        timeSent,
        value,
    }));

    res.status(204).send();
});

// @ts-expect-error express-ws types are wrong
app.ws('/', (ws) => {
    console.log('Client WS connected');

    subRedis.on('message', (channel, message) => {
        console.log(`Received message on WS from channel ${channel}`);

        ws.send(message);
    });

    ws.on('close', () => {
        console.log('Client WS disconnected');
    });
});

app.get('/sse', (req: Request, res: Response) => {
    console.log('Client SSE connected');

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    subRedis.on('message', (channel, message) => {
        console.log(`Received message on SSE from channel ${channel}`);

        res.write('event: message\n');
        res.write(`data: ${message}\n\n`);
    });

    req.on('close', () => {
        console.log('Client SSE disconnected');
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
