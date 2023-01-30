import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongodb from 'mongodb';
import https from 'https';
import path from 'path';
import fs from 'fs';

import MasterRoute from './api/MasterRoute.js';

import MessagesDAO from './dao/MessagesDAO.js';
import MessageDAO from './dao/MessageDAO.js';

class index {
    static app = express();

    static router = express.Router();

    static options ={
        key:fs.readFileSync(path.join(process.cwd(),'./cert/key.pem')),
        cert:fs.readFileSync(path.join(process.cwd(),'./cert/cert.pem')) 
    };
    static sslserver = https.createServer(index.options, index.app);

    static main() {
        dotenv.config();
        index.setUpServer();
        index.setUpDatabase();
    }

    static async setUpDatabase() {
        const client = new mongodb.MongoClient(process.env.MDB_DB_URI);
        const port = process.env.PORT || 443;
        try {
            await client.connect();

            await MessagesDAO.injectDB(client);
            await MessageDAO.injectDB(client);
            
            index.sslserver.listen(port,()=>{console.log(`Secure Server is listening on port ${port}`)});
        } catch (e) {
            console.error(e);
            process.exit(1);
        }
    }

    static setUpServer() {
        index.app.use(cors());
        index.app.use(express.json());
        index.app.use('/api', MasterRoute.configRoutes(index.router));
        index.app.use('*', (req, res) => {
            res.status(404).json({error: 'not found'});
        });
    }
}

index.main();