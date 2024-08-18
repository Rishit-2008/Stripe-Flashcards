const express = require('express');
const mysql = require('mysql2/promise');
const app = express();

app.use(express.json());

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root', // or your MySQL username
  password: 'MySQLRoot@2', // your MySQL password
  database: 'flashcards',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Root route
app.get('/', (req, res) => {
  res.send('Welcome to the Flashcard Tool API');
});

// API routes
app.get('/api/flashcards', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM flashcards');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching flashcards' });
  }
});

app.post('/api/flashcards', async (req, res) => {
  const { question, answer } = req.body;
  try {
    await pool.query('INSERT INTO flashcards (question, answer) VALUES (?, ?)', [question, answer]);
    res.status(201).json({ message: 'Flashcard added successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error adding flashcard' });
  }
});

app.put('/api/flashcards/:id', async (req, res) => {
  const { id } = req.params;
  const { question, answer } = req.body;
  try {
    await pool.query('UPDATE flashcards SET question = ?, answer = ? WHERE id = ?', [question, answer, id]);
    res.json({ message: 'Flashcard updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error updating flashcard' });
  }
});

app.delete('/api/flashcards/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM flashcards WHERE id = ?', [id]);
    res.json({ message: 'Flashcard deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting flashcard' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
