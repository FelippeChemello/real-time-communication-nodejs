import express, { Request, Response } from 'express';
import cors from 'cors';
import { faker } from '@faker-js/faker';

const app = express();

app.use(cors());
app.use(express.json());

let status: 'waiting' | 'running' = 'waiting';
let startedAt: number | null = null;

function setIntervalWithLimit(
    interval: number,
    limit: number,
    callback: () => void,
) {
    let counter = 0;
    const intervalId = setInterval(() => {
        if (counter >= limit) {
            clearInterval(intervalId);

            status = 'waiting';
            startedAt = null;

            return;
        }

        callback();
        counter += 1;
    }, interval);
}

app.post('/start', (req: Request, res: Response) => {
    if (status !== 'waiting') {
        res.status(400).send({
            error: 'Already running',
        });

        return;
    }

    status = 'running';
    startedAt = Date.now();

    setIntervalWithLimit(1000, 300, async () => {
        await fetch(`${process.env.BACKEND_URL}/hook`, {
            body: JSON.stringify({
                timeSent: Date.now(),
                value: faker.datatype.number(),
            }),
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });
    });

    res.status(204).send();
});

app.get('/status', (req: Request, res: Response) => {
    res.status(200).send({
        status,
        runningFor: startedAt ? Date.now() - startedAt : null,
    });
});

app.get('/', (req: Request, res: Response) => {
    res.status(200).send({
        status: 'ok',
    });
});

app.listen(3001, () => {
    // eslint-disable-next-line no-console
    console.log('Server is running on port 3001');
});
