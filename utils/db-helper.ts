import 'dotenv/config';
import { Client } from 'pg';

export class DatabaseHelper {
    private dbConfig: any;

    constructor() {
        this.dbConfig = {
            user: process.env.DB_USER || 'admin',
            host: process.env.DB_HOST || 'localhost',
            database: process.env.DB_NAME || 'vertex_db',
            password: process.env.DB_PASS || 'password123',
            port: parseInt(process.env.DB_PORT || '5432'),
        };
    }

    async getTransactionById(transactionId: string) {
        const client = new Client(this.dbConfig);
        try {
            await client.connect();
            console.log(`[DB-Helper] Querying SQL for ID: ${transactionId}...`);
            
            const result = await client.query(
                'SELECT * FROM transactions WHERE id = $1', 
                [transactionId]
            );
            
            const row = result.rows[0];

            if (row) {
                return {
                    ...row,
                    amount: parseFloat(row.amount) 
                };
            }
            return null;

        } catch (error) {
            console.error('[DB-Helper] Query Error:', error);
            throw error;
        } finally {
            await client.end();
        }
    }
}