export default function adminMiddleware(req, res, next) {
    // L'authentification est déjà faite par authMiddleware
    if (!req.user) {
        return res.status(401).json({ error: 'Non authentifié' });
    }

    if (req.user.role !== 'admin' && req.user.role !== 'superadmin') {
        return res.status(403).json({ error: 'Accès refusé. Droits d\'administrateur requis.' });
    }
    next();
}