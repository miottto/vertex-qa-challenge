import 'dotenv/config'; 
import express from 'express';
import { Client } from 'pg';
import cors from 'cors';
import bodyParser from 'body-parser';

console.log("⚡ Starting server...");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

const dbConfig = {
    user: process.env.DB_USER || 'admin',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'vertex_db',
    password: process.env.DB_PASS || 'password123',
    port: parseInt(process.env.DB_PORT || '5432'),
};

const initDB = async () => {
    const client = new Client(dbConfig);
    try {
        await client.connect();
        await client.query(`
            CREATE TABLE IF NOT EXISTS transactions (
                id VARCHAR(50) PRIMARY KEY,
                key VARCHAR(100),
                amount DECIMAL(10, 2),
                status VARCHAR(20),
                description TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log('Table "transactions" is ready!');
    } catch (err) {
        console.error('Database Error:', err);
    } finally {
        await client.end();
    }
};

// --- PIX TRANSACTION ROUTE ---
app.post('/pix/transactions', async (req, res) => {
    const { key, amount, description } = req.body;

    if (!amount || !key) {
        return res.status(400).json({ error: 'Invalid Payload: Key and Amount are required' });
    }

    const transactionId = `tx_${Math.floor(Math.random() * 1000000)}`;
    const status = 'COMPLETED';

    const client = new Client(dbConfig);

    try {
        await client.connect();
        
        const query = `
            INSERT INTO transactions (id, key, amount, status, description) 
            VALUES ($1, $2, $3, $4, $5) 
            RETURNING *;
        `;
        
        await client.query(query, [transactionId, key, amount, status, description]);
        
        console.log(`PIX ${amount} processed! ID: ${transactionId}`);

        res.status(201).json({
            transactionId: transactionId,
            status: status,
            amount: amount,
            message: "Transaction successful"
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        await client.end();
    }
});

// --- ACCOUNT BALANCE ROUTE ---
app.get('/account/balance', (req, res) => {
    res.status(200).json({
        balance: 10000.00,
        currency: "BRL"
    });
});

// Start the Server
app.listen(PORT, async () => {
    await initDB(); 
    console.log(`Vertex Real API running at http://localhost:${PORT}`);
});