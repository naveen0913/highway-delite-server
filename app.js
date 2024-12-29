import express from 'express';
import dotenv from 'dotenv'
import cors from 'cors';
import mysql from 'mysql2/promise'; // MySQL library for async/await support
import userRoutes from './routes/userRoutes.js'
import notesRoutes from './routes/notesRoutes.js'

dotenv.config();
const app = express();

app.use(cors({
    origin: 'http://localhost:3000'
}));

app.use(express.json());

let mySQLDb;

(async () => {
    try {
        mySQLDb = await mysql.createConnection({
            port: process.env.MYSQL_PORT,
            host: process.env.MYSQL_HOST,
            user: process.env.MYSQL_USER,
            password: process.env.MYSQL_PASSWORD,
            database: process.env.MYSQL_DATABASE,
        });
        console.log('Connected to MySQL');
    } catch (error) {
        console.error('Error connecting to MySQL:', error.message);
    }
})();
app.use((req, res, next) => {
    req.mySQLDb = mySQLDb; // Attach DB connection to the request object
    next();
});



app.use('/users', userRoutes);
app.use('/notes',notesRoutes)
app.listen(process.env.PORT, () => {})
