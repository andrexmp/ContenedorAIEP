CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL
);

CREATE TABLE containers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    container_id TEXT UNIQUE NOT NULL,
    type TEXT NOT NULL,
    weight REAL NOT NULL,
    trip_id INTEGER,
    FOREIGN KEY (trip_id) REFERENCES trips(id)
);

CREATE TABLE trips (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    creation_date TEXT NOT NULL,
    status TEXT NOT NULL,
    total_weight REAL NOT NULL,
    total_containers INTEGER NOT NULL
);

CREATE TABLE clients (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    registration_date TEXT NOT NULL
);