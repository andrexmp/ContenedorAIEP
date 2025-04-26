const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Crear conexión a la base de datos
const db = new sqlite3.Database(path.join(__dirname, '../database.sqlite'), (err) => {
    if (err) {
        console.error('Error connecting to database:', err);
    } else {
        console.log('Connected to database successfully');
        
        // Crear tabla de usuarios si no existe
        db.run(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            role TEXT NOT NULL
        )`);

        // Crear tabla de contenedores si no existe
        db.run(`CREATE TABLE IF NOT EXISTS containers (
            container_number INTEGER PRIMARY KEY,
            type TEXT NOT NULL,
            weight INTEGER NOT NULL,
            trip_id INTEGER
        )`);

        // Crear tabla de viajes si no existe
        db.run(`CREATE TABLE IF NOT EXISTS trips (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            total_weight INTEGER,
            status TEXT,
            user_id INTEGER,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);
    }
});

module.exports = db;