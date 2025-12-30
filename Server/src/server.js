import express from 'express'
import cors from 'cors'

const app = express()
const PORT = 5000

// Middleware
app.use(cors())
app.use(express.json())

// In-memory storage
let palettes = []

// Routes
app.get('/api/data', (req, res) => {
  res.json([])
})

app.get('/api/palettes', (req, res) => {
  res.json(palettes)
})

app.post('/api/palettes', (req, res) => {
  const palette = { id: Date.now(), ...req.body }
  palettes.push(palette)
  res.json(palette)
})

app.delete('/api/palettes/:id', (req, res) => {
  palettes = palettes.filter(p => p.id !== parseInt(req.params.id))
  res.json({ message: 'Deleted' })
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
