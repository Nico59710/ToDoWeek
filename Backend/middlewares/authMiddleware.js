import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();

export function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;
    
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Token manquant ou invalide' });
    }
    const token = authHeader.substring(7); // Retire 'Bearer '
    

    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decodedToken;
        next();
    } catch (error) {
        console.error('JWT verification failed:', error.message);
        return res.status(401).json({ error: 'Token invalide' });
    }
}