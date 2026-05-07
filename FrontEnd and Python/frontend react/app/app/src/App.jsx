import { useState } from 'react'
import { Navigate, Route, Routes } from "react-router-dom"
import HomeRouter from './HomeRouter'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import AppRoutes from './routes/AppRoutes'

function App() {
  const [count, setCount] = useState(0)

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/student/home" replace />} />
      <Route path="/:type/*" element={<HomeRouter />} />
    </Routes>
    // <>
      // {/* <AppRoutes /> */}

    // {/* </> */}
  )
}

export default App
