import './App.css';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import './i18n';
import Login from './Login';
import Navbare from './Navbare';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import Dashboard from './Dashboard';
import AddOffer from './AddOffer';

function App() {
  return (
    <div className='h-screen overflow-y-auto w-screen'>
      <BrowserRouter>
       
        <Routes>
       
          <Route path="/login" element={<Login />} />
          
         
          <Route 
            path="/dashboard" 
            element={
              <PrivateRoute>
                <Dashboard />
                
              </PrivateRoute>
            } 
          />
          
          
          <Route path="/" element={<Navigate to="/login" replace />} />
          
        
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;