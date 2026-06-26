import { Routes, Route } from 'react-router-dom'
import Dashboard from './pages/Dashboard.jsx'
import Create from './pages/Create.jsx'
import Preview from './pages/Preview.jsx'
import Download from './pages/Download.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/create" element={<Create />} />
      <Route path="/preview" element={<Preview />} />
      <Route path="/download" element={<Download />} />
    </Routes>
  )
}
