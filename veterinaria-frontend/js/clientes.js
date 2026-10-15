if (typeof verificarSesion === 'function') verificarSesion();
if (typeof configurarCerrarSesion === 'function') configurarCerrarSesion();

document.addEventListener("DOMContentLoaded", () => {
    cargarClientes();
});

// 1. CONSUMO API RENIEC CON FALLBACK
document.getElementById('btnBuscarDni')?.addEventListener('click', async () => {
    const dni = document.getElementById('dniCliente').value;
    const btnBuscar = document.getElementById('btnBuscarDni');

    if (dni.length !== 8) {
        alert("El DNI debe tener exactamente 8 dígitos.");
        return;
    }

    btnBuscar.textContent = "Buscando...";
    btnBuscar.disabled = true;

    try {
        const response = await fetch(`https://api.apis.net.pe/v2/reniec/dni?numero=${dni}`, {
            method: 'GET',
            headers: { 'Authorization': 'Bearer apis-token-1.aTSI1U7KEuT-6rSRteRWc4FEariwTz' }
        });

        if (response.ok) {
            const data = await response.json();
            document.getElementById('nombreCliente').value = data.nombres;
            document.getElementById('apellidosCliente').value = `${data.apellidoPaterno} ${data.apellidoMaterno}`;
        } else {
            throw new Error("API Falló"); 
        }
    } catch (error) {
        console.warn("Usando datos simulados debido a fallo en API:", error);
        document.getElementById('nombreCliente').value = "Elton Joel";
        document.getElementById('apellidosCliente').value = "Carranza Escobedo";
        alert("Modo Demo: Se insertaron datos de prueba (API RENIEC no disponible).");
    } finally {
        btnBuscar.textContent = "🔍 Buscar RENIEC";
        btnBuscar.disabled = false;
    }
});

// 2. GUARDAR EL CLIENTE
document.getElementById("formCliente").addEventListener("submit", async (e) => {
    e.preventDefault();
    
    const cliente = {
        dni: document.getElementById("dniCliente").value, 
        nombre: document.getElementById("nombreCliente").value,
        apellidos: document.getElementById("apellidosCliente").value, 
        telefono: document.getElementById("telefonoCliente").value,
        email: document.getElementById("emailCliente").value
    };

    const respuesta = await peticionSegura("/api/clientes", {
        method: "POST",
        body: JSON.stringify(cliente)
    });

    if (respuesta && respuesta.ok) {
        document.getElementById("formCliente").reset();
        alert("Cliente registrado exitosamente.");
        cargarClientes();
    } else {
        alert("Error al registrar cliente en el sistema.");
    }
});

// 3. CARGAR LA TABLA DE CLIENTES
async function cargarClientes() {
    const respuesta = await peticionSegura("/api/clientes", { method: "GET" });

    if (respuesta && respuesta.ok) {
        const data = await respuesta.json();
        const tbody = document.getElementById("tablaClientes");
        tbody.innerHTML = "";
        
        data.forEach(c => {
            tbody.innerHTML += `
                <tr>
                    <td>${c.id}</td>
                    <td>${c.dni || 'S/N'}</td>
                    <td>${c.nombre}</td>
                    <td>${c.apellidos || ''}</td>
                    <td>${c.telefono || ''}</td>
                    <td>${c.email || ''}</td>
                </tr>
            `;
        });
    }
}document.addEventListener("DOMContentLoaded", () => {
    if (typeof configurarCerrarSesion === 'function') configurarCerrarSesion();
    cargarClientes();

    // ==========================================
    // APLICAR RESTRICCIÓN DE ROLES EN LA VISTA
    // ==========================================
    if (!esAdmin()) {
        // Oculta automáticamente cualquier elemento que tenga la clase ".solo-admin"
        document.querySelectorAll('.solo-admin').forEach(elemento => {
            elemento.style.display = 'none';
        });
        console.warn("Modo Usuario regular: Acciones de administración restringidas.");
    }
});