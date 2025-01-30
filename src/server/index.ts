import express, { Request, Response } from 'express';

const server = express();
const PORT = 3000;

server.get('/', (req: Request, res: Response) => {
    res.send('Hello World!');
});

server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});