const { Client } = require('pg');

class Database {
    constructor() {
        this.client = new Client({
            user: 'postgres',
            host: 'localhost',
            database: 'webtech2',
            password: 'japierdole',
            port: 5432,
        });
    }
    async connect(options) {
        try {
            if (!this.client || !this.client._connected) {
                this.client = new Client({
                    user: 'postgres',
                    host: 'localhost',
                    database: 'project_2',
                    password: 'japierdole',
                    port: 5432,
                });

                await this.client.connect();
                console.log('ЕСТЬ КОНТАК!!!');
            }
        } catch (err) {
            console.error('Error connecting to PostgresSQL:', err);
        }
    }
    async disconnect() {
        if (this.client) {
            await this.client.end();
        }
    }

    async getUser(userID) {
        const query = `select * from users where id = ${userID};`;

        const result = await this.client.query(query);
        return result.rows;
    }
}