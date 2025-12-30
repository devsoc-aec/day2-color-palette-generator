import { useState, useEffect } from 'react'

function App() {
  const [palette, setPalette] = useState([])
  const [savedPalettes, setSavedPalettes] = useState([])

  useEffect(() => {
    fetchSavedPalettes()
    generatePalette()
  }, [])

  const fetchSavedPalettes = async () => {
    try {
      const response = await fetch('/api/palettes').then(res => res.json())
      setSavedPalettes(response.data)
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const generatePalette = () => {
    const colors = Array(5).fill(0).map(() =>
      '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')
    )
    setPalette(colors)
  }

  const savePalette = async () => {
    try {
      await fetch('/api/palettes', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ colors: palette, name: `Palette ${savedPalettes.length + 1}` }) }).then(res => res.json())
      fetchSavedPalettes()
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const deletePalette = async (id) => {
    try {
      await fetch(`/api/palettes/${id}`, { method: 'DELETE' })
      fetchSavedPalettes()
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const copyColor = (color) => {
    navigator.clipboard.writeText(color)
    alert(`Copied ${color} to clipboard!`)
  }

  return (
    <div className="container">
      <h1 style={{ textAlign: 'center', margin: '20px 0' }}>🎨 Color Palette Generator</h1>

      <div className="card">
        <h2>Current Palette</h2>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          {palette.map((color, i) => (
            <div key={i} style={{ flex: 1, textAlign: 'center' }}>
              <div
                style={{
                  height: '150px',
                  backgroundColor: color,
                  borderRadius: '8px',
                  cursor: 'pointer',
                  border: '2px solid #ddd'
                }}
                onClick={() => copyColor(color)}
              />
              <p style={{ margin: '10px 0', fontFamily: 'monospace', fontWeight: 'bold' }}>
                {color}
              </p>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={generatePalette} style={{ flex: 1 }}>🔄 Generate New</button>
          <button onClick={savePalette} style={{ flex: 1, backgroundColor: '#28a745' }}>💾 Save Palette</button>
        </div>
      </div>

      {savedPalettes.length > 0 && (
        <div className="card">
          <h2>Saved Palettes ({savedPalettes.length})</h2>
          {savedPalettes.map(p => (
            <div key={p.id} style={{ marginBottom: '15px', padding: '15px', background: '#f8f9fa', borderRadius: '8px' }}>
              <div style={{ display: 'flex', gap: '5px', marginBottom: '10px' }}>
                {p.colors.map((color, i) => (
                  <div
                    key={i}
                    style={{
                      flex: 1,
                      height: '60px',
                      backgroundColor: color,
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                    onClick={() => copyColor(color)}
                  />
                ))}
              </div>
              <button onClick={() => deletePalette(p.id)} style={{ backgroundColor: '#dc3545', width: '100%' }}>
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default App
