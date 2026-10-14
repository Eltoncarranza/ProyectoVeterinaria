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

function configurarCerrarSesion() {
    const btnLogout = document.getElementById('btnCerrarSesion');
    if (btnLogout) {
        btnLogout.addEventListener('click', () => {
            localStorage.removeItem('tokenJWT');
            window.location.href = 'login.html';
        });
    }
}