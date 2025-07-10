import { Navigate } from "react-router-dom";

// Correction 1: Utiliser la destructuration pour récupérer 'children'
export default function PrivateRoute({ children }) {
    const token = localStorage.getItem('token');
    
    if (!token) {
        return <Navigate to="/login" />;
    }
    
    // Correction 2: Retourner 'children' directement
    return children;
}