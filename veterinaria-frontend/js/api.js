const GATEWAY_URL = "http://localhost:8080";

function verificarSesion() {
    const token = localStorage.getItem('tokenJWT');
    
    // Si no hay token Y NO ESTAMOS en la página de login o registro, patear al login
    const paginaActual = window.location.pathname;
    const esAuthPage = paginaActual.includes('login.html') || paginaActual.includes('registro.html');

    if (!token && !esAuthPage) {
        window.location.href = 'login.html';
        return null;
    }
    return token;
}

// Ejecutar la verificación inmediatamente al cargar cualquier script
verificarSesion();

async function peticionSegura(endpoint, opciones = {}) {
    const token = localStorage.getItem('tokenJWT');

    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    opciones.headers = {
        ...opciones.headers,
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json'
    };

    try {
        const respuesta = await fetch(GATEWAY_URL + endpoint, opciones);

        if (respuesta.status === 401) {
            localStorage.removeItem('tokenJWT');
            alert("Tu sesión ha expirado o no estás autorizado.");
            window.location.href = 'login.html';
            return;
        }

        return respuesta;
    } catch (error) {
        console.error("Error de red:", error);
        throw error;
    }
}
// ==========================================
// UTILIDADES DE CONTROL DE ROLES (ADMIN / USER)
// ==========================================

// Decodifica el Token JWT para extraer información (como el rol o el username)
function obtenerPayloadJWT() {
    const token = localStorage.getItem('tokenJWT');
    if (!token) return null;
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    } catch (e) {
        console.error("Error al leer el token:", e);
        return null;
    }
}

// Devuelve el rol del usuario ('ADMIN' o 'USER')
function obtenerRolUsuario() {
    const payload = obtenerPayloadJWT();
    // Si tu token guarda el rol en una propiedad llamada 'rol', 'role' o 'authorities', cámbiala aquí:
    return payload ? (payload.rol || payload.role || 'USER') : 'USER';
}

// Valida si el usuario actual es Administrador
function esAdmin() {
    const rol = obtenerRolUsuario();
    return rol.toUpperCase() === 'ADMIN';
}
function configurarCerrarSesion() {
    const btnLogout = document.getElementById('btnCerrarSesion');
    if (btnLogout) {
        btnLogout.addEventListener('click', () => {
            localStorage.removeItem('tokenJWT');
            window.location.href = 'login.html';
        });
    }
}