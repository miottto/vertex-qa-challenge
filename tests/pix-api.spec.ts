import {test, expect} from '@playwright/test'
import { DatabaseHelper } from '../utils/db-helper';


test.describe('Vertex financial API - PIX Tests', () => {

    const BASE_URL = 'http://localhost:3000'

    test('Should sucessfully get account balance', async ({request}) =>{
        const response = await request.get(`${BASE_URL}/account/balance`);

        expect(response.status()).toBe(200);

        const responseBody = await response.json();

        expect(responseBody.balance).toBe(50000);

        console.log('Account Balance: ', responseBody.balance)
    });

    test('Should sucessfully complete a PIX transaction', async ({ request }) => {

        const payload = {
        key: "email@example.com.br",
        amount: 1500.50,
        description: "Payment - IT Services"
        };

        const response = await request.post(`${BASE_URL}/pix/transactions`, {
        data: payload
        });

        expect(response.status()).toBe(201);

        const responseBody = await response.json();

        expect(responseBody.transactionId).toBeTruthy();
        expect(responseBody.status).toBe('COMPLETED');
        
        console.log('PIX Completed ID:', responseBody.transactionId);

        // --- DB CHECK ---
        
        const db = new DatabaseHelper();
        
        const dbRecord = await db.getTransactionById(responseBody.transactionId);

        expect(dbRecord).toBeDefined();
        expect(dbRecord?.status).toBe('COMPLETED');
        expect(dbRecord?.amount).toBe(1500.50);

        console.log('Database Integrity Check: PASSED');
        // -----------------------------------------------
    });

    test('Should refuse PIX transaction without amount value (Invalid Payload)', async ({ request }) => {
        
        const badPayload = {
        key: "hacker@vertex.com",
        description: "Trying to bug the system"
        };

        const response = await request.post(`${BASE_URL}/pix/transactions`, {
        data: badPayload
        });

        console.log(`Returned fail status: ${response.status()}`);
        
        expect(response.ok()).toBeFalsy(); 
        
        expect([400, 422]).toContain(response.status());

        const responseBody = await response.json();
        
        console.log('PIX Completed ID:', responseBody.transactionId);
  
    });
});


