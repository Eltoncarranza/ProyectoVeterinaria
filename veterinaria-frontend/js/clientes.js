document.addEventListener("DOMContentLoaded", () => {
    if (typeof configurarCerrarSesion === 'function') configurarCerrarSesion();

    // Los usuarios normales no ven los elementos de administración
    if (!esAdmin()) {
        document.querySelectorAll('.solo-admin').forEach(el => el.style.display = 'none');
    }

    cargarClientes();
});

function escapar(valor) {
    return String(valor ?? "").replace(/[&<>"']/g, c => ({
        "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    }[c]));
}

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
        bloquearIngresoManual();
        alert("Cliente registrado exitosamente.");
        cargarClientes();
    } else {
        alert("Error al registrar cliente en el sistema.");
    }
});

async function cargarClientes() {
    try {
        const respuesta = await peticionSegura("/api/clientes", { method: "GET" });
        if (!respuesta || !respuesta.ok) return;

        const clientes = await respuesta.json();
        const tbody = document.getElementById("tablaClientes");
        if (!tbody) return;

        const puedeEliminar = esAdmin();

        tbody.innerHTML = clientes.map(c => {
            const accion = puedeEliminar
                ? `<td><button class="btn-danger" onclick="eliminarCliente(${c.id})">Eliminar 🗑️</button></td>`
                : "";

            return `
                <tr>
                    <td>${c.id}</td>
                    <td>${escapar(c.dni || "S/N")}</td>
                    <td>${escapar(c.nombre)}</td>
                    <td>${escapar(c.apellidos || "")}</td>
                    <td>${escapar(c.telefono || "")}</td>
                    <td>${escapar(c.email || "")}</td>
                    ${accion}
                </tr>
            `;
        }).join("");
    } catch (error) {
        console.error("Error al cargar clientes:", error);
    }
}

async function eliminarCliente(id) {
    if (!confirm("¿Estás seguro de que deseas eliminar este cliente?")) return;

    try {
        const respuesta = await peticionSegura(`/api/clientes/${id}`, { method: "DELETE" });

        if (respuesta && respuesta.ok) {
            alert("Cliente eliminado con éxito.");
            cargarClientes();
        } else if (respuesta && respuesta.status === 403) {
            alert("No tienes permisos para eliminar clientes.");
        } else {
            alert("Error al eliminar el cliente.");
        }
    } catch (error) {
        alert("Error de conexión al eliminar el cliente.");
    }
}

// Búsqueda en RENIEC: la consulta la hace el backend, el token no sale del servidor
document.getElementById("btnBuscarDni")?.addEventListener("click", async () => {
    const dni = document.getElementById("dniCliente").value.trim();
    const btnBuscar = document.getElementById("btnBuscarDni");
    const inputNombres = document.getElementById("nombreCliente");
    const inputApellidos = document.getElementById("apellidosCliente");

    if (!/^\d{8}$/.test(dni)) {
        alert("El DNI debe tener exactamente 8 dígitos.");
        return;
    }

    btnBuscar.textContent = "Buscando...";
    btnBuscar.disabled = true;

    try {
        const respuesta = await peticionSegura(`/api/clientes/reniec/${dni}`, { method: "GET" });
        if (!respuesta) return;

        if (respuesta.ok) {
            const data = await respuesta.json();
            inputNombres.value = data.nombres;
            inputApellidos.value = `${data.apellidoPaterno} ${data.apellidoMaterno}`;
        } else if (respuesta.status === 404) {
            alert("No se encontró ningún DNI con ese número. Puedes ingresar los datos manualmente.");
            habilitarIngresoManual();
        } else {
            alert("RENIEC no está disponible en este momento. Puedes ingresar los datos manualmente.");
            habilitarIngresoManual();
        }
    } catch (error) {
        console.error("Error al consultar RENIEC:", error);
        alert("No se pudo conectar con el servidor. Puedes ingresar los datos manualmente.");
        habilitarIngresoManual();
    } finally {
        btnBuscar.textContent = "🔍 Buscar RENIEC";
        btnBuscar.disabled = false;
    }
});

// Si RENIEC falla, el usuario escribe los nombres a mano
function habilitarIngresoManual() {
    const inputNombres = document.getElementById("nombreCliente");
    const inputApellidos = document.getElementById("apellidosCliente");

    inputNombres.readOnly = false;
    inputApellidos.readOnly = false;
    inputNombres.placeholder = "Ingrese los nombres";
    inputApellidos.placeholder = "Ingrese los apellidos";
}

function bloquearIngresoManual() {
    const inputNombres = document.getElementById("nombreCliente");
    const inputApellidos = document.getElementById("apellidosCliente");

    inputNombres.readOnly = true;
    inputApellidos.readOnly = true;
    inputNombres.placeholder = "Se autocompletará";
    inputApellidos.placeholder = "Se autocompletará";
}