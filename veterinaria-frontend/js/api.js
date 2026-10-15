const GATEWAY_URL = "http://localhost:8080";

function verificarSesion() {
    const token = localStorage.getItem('tokenJWT');
    const paginaActual = window.location.pathname;
    const esAuthPage = paginaActual.includes('login.html') || paginaActual.includes('registro.html');

    if (!token && !esAuthPage) {
        window.location.href = 'login.html';
        return null;
    }
    return token;
}

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

function obtenerRolUsuario() {
    const payload = obtenerPayloadJWT();

    return payload ? (payload.rol || payload.role || 'USER') : 'USER';
}

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