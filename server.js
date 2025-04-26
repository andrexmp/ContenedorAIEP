import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import db from './js/database.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = 3000;

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Ruta base
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Rutas de autenticación
app.post('/api/register', async (req, res) => {
    const { name, email, password, role } = req.body;
    
    try {
        // Verificar si el usuario ya existe
        db.get('SELECT email, role FROM users WHERE email = ?', [email], async (err, user) => {
            if (err) {
                return res.status(500).json({ error: 'Error en el servidor' });
            }
            
            if (user) {
                return res.status(400).json({ 
                    error: 'Este correo electrónico ya está registrado'
                });
            }

            // Hash de la contraseña
            const hashedPassword = await bcrypt.hash(password, 10);
            
            // Insertar nuevo usuario
            db.run('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
                [name, email, hashedPassword, role],
                (err) => {
                    if (err) {
                        return res.status(500).json({ error: 'Error al registrar usuario' });
                    }
                    res.json({ 
                        success: true, 
                        message: 'Usuario registrado exitosamente',
                        role: role
                    });
                });
        });
    } catch (error) {
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

app.post('/api/login', async (req, res) => {
    const { email, password, role } = req.body;

    try {
        db.get('SELECT * FROM users WHERE email = ? AND role = ?', [email, role], async (err, user) => {
            if (err) {
                return res.status(500).json({ error: 'Error en el servidor' });
            }

            if (!user) {
                return res.status(401).json({ error: 'Usuario no encontrado' });
            }

            const validPassword = await bcrypt.compare(password, user.password);
            if (!validPassword) {
                return res.status(401).json({ error: 'Contraseña incorrecta' });
            }

            const token = jwt.sign(
                { userId: user.id, role: user.role },
                'your-secret-key',
                { expiresIn: '24h' }
            );

            res.json({
                success: true,
                token,
                role: user.role,
                name: user.name
            });
        });
    } catch (error) {
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

// Rutas de contenedores
app.post('/api/containers', async (req, res) => {
    const { containerId, type, weight, tripNumber } = req.body;
    
    try {
        db.run('INSERT INTO containers (container_number, type, weight, trip_id) VALUES (?, ?, ?, ?)',
            [containerId, type, weight, tripNumber],
            (err) => {
                if (err) {
                    console.error('Error al guardar contenedor:', err);
                    return res.status(500).json({ error: 'Error al guardar contenedor' });
                }
                res.json({ success: true, message: 'Contenedor guardado exitosamente' });
            }
        );
    } catch (error) {
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

// Obtener último número de contenedor
app.get('/api/containers/last-number', (req, res) => {
    db.get('SELECT MAX(container_number) as lastNumber FROM containers', [], (err, row) => {
        if (err) return res.status(500).json({ error: 'Error del servidor' });
        res.json({ lastNumber: row.lastNumber || 0 });
    });
});

// Obtener siguiente ID de contenedor
app.get('/api/containers/next-id', (req, res) => {
    db.get('SELECT MAX(container_number) as maxId FROM containers', [], (err, row) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Error del servidor' });
        }
        res.json({ nextId: (row.maxId || 0) + 1 });
    });
});

// Actualizar contenedor
app.put('/api/containers/:id', (req, res) => {
    const { type, weight } = req.body;
    
    db.run('UPDATE containers SET type = ?, weight = ? WHERE container_number = ?',
        [type, weight, req.params.id],
        (err) => {
            if (err) return res.status(500).json({ error: 'Error al actualizar contenedor' });
            res.json({ success: true });
        }
    );
});

// Eliminar contenedor
app.delete('/api/containers/:id', (req, res) => {
    db.run('DELETE FROM containers WHERE container_number = ?',
        [req.params.id],
        (err) => {
            if (err) return res.status(500).json({ error: 'Error al eliminar contenedor' });
            res.json({ success: true });
        }
    );
});

// Endpoint para finalizar viaje
app.post('/api/trips/finalize', async (req, res) => {
    const { totalContainers, totalWeight } = req.body;
    
    try {
        db.run(`
            INSERT INTO trips (total_weight, status, user_id)
            VALUES (?, 'finished', ?)`,
            [totalWeight, req.user.id],
            (err) => {
                if (err) {
                    return res.status(500).json({ error: 'Error al finalizar viaje' });
                }
                res.json({ success: true, message: 'Viaje finalizado exitosamente' });
            }
        );
    } catch (error) {
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

// Iniciar servidor
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});