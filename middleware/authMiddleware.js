// authMiddleware.js
function ensureAuthenticated(req, res, next) {
    console.log("Verificación de autenticación iniciada...");
    if (req.isAuthenticated()) {
        console.log("Autenticación confirmada para el usuario:", req.user);
        return next();
    } else {
        console.log("Fallo en la autenticación. Usuario no autorizado.");
        res.status(401).send('Usuario no autenticado. No autorizado.');
    }
}

export default ensureAuthenticated;
