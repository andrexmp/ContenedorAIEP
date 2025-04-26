const express = require('express');
const db = require('./js/database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static('public'));

// Middleware de autenticación
const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.sendStatus(401);

    jwt.verify(token, 'your-secret-key', (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

// Auth endpoints
app.post('/api/login', (req, res) => {
    const { email, password, role } = req.body;
    db.get('SELECT * FROM users WHERE email = ? AND role = ?', [email, role], async (err, user) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!user) return res.status(401).json({ error: 'Usuario no encontrado' });

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) return res.status(401).json({ error: 'Contraseña incorrecta' });

        const token = jwt.sign({ id: user.id, role: user.role }, 'your-secret-key');
        res.json({ token, role: user.role });
    });
});

app.post('/api/register', async (req, res) => {
    const { name, email, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    db.run('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
        [name, email, hashedPassword, role],
        (err) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: 'Usuario registrado exitosamente' });
        });
});

// CRUD endpoints para contenedores
app.post('/api/containers', authenticateToken, (req, res) => {
    const { container_id, type, weight, trip_id } = req.body;
    db.run('INSERT INTO containers (container_id, type, weight, trip_id) VALUES (?, ?, ?, ?)',
        [container_id, type, weight, trip_id],
        (err) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: 'Contenedor agregado exitosamente' });
        });
});

// Get dashboard stats
app.get('/api/stats', (req, res) => {
    db.get(`
        SELECT 
            COUNT(*) as total_containers,
            COUNT(DISTINCT trip_id) as total_trips,
            COUNT(DISTINCT c.id) as total_clients,
            AVG(t.total_weight) as avg_weight
        FROM containers 
        LEFT JOIN trips t ON containers.trip_id = t.id
        LEFT JOIN clients c ON 1=1
    `, (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(row);
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});