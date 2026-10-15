document.addEventListener("DOMContentLoaded", async () => {
    if (typeof configurarCerrarSesion === 'function') configurarCerrarSesion();

    // Oculta las columnas y botones de administración a los usuarios normales
    if (!esAdmin()) {
        document.querySelectorAll('.solo-admin').forEach(el => el.style.display = 'none');
    }

    const especieSelect = document.getElementById("especieSelect");
    const especieOtro = document.getElementById("especieOtro");

    especieSelect.addEventListener("change", (e) => {
        if (e.target.value === "Otros") {
            especieOtro.style.display = "block";
            especieOtro.required = true;
        } else {
            especieOtro.style.display = "none";
            especieOtro.required = false;
        }
    });

    await cargarClientes();
    await cargarMascotas();
});

let nombresDuenos = {};

function escapar(valor) {
    return String(valor ?? "").replace(/[&<>"']/g, c => ({
        "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    }[c]));
}

async function cargarClientes() {
    try {
        const respuesta = await peticionSegura("/api/clientes", { method: "GET" });
        if (!respuesta || !respuesta.ok) return;

        const clientes = await respuesta.json();
        let opciones = '<option value="">Seleccione un dueño...</option>';

        nombresDuenos = {};
        clientes.forEach(c => {
            nombresDuenos[c.id] = `${c.nombre} ${c.apellidos}`;
            opciones += `<option value="${c.id}">${escapar(c.nombre)} ${escapar(c.apellidos)} (DNI/Tel: ${escapar(c.telefono)})</option>`;
        });

        document.getElementById("clienteId").innerHTML = opciones;
    } catch (error) {
        console.error("Error al cargar clientes:", error);
    }
}

async function cargarMascotas() {
    try {
        const respuesta = await peticionSegura("/api/mascotas", { method: "GET" });
        if (!respuesta || !respuesta.ok) return;

        const mascotas = await respuesta.json();
        const puedeEliminar = esAdmin();

        document.getElementById("tablaMascotas").innerHTML = mascotas.map(m => {
            const dueno = nombresDuenos[m.clienteId] || "Dueño no encontrado";
            const accion = puedeEliminar
                ? `<td><button class="btn-danger" onclick="eliminarMascota(${m.id})">Eliminar</button></td>`
                : "";

            return `
                <tr>
                    <td>${m.id}</td>
                    <td>${escapar(m.nombre)}</td>
                    <td>${escapar(m.especie)}</td>
                    <td>${escapar(m.raza)}</td>
                    <td>${escapar(dueno)}</td>
                    ${accion}
                </tr>
            `;
        }).join("");
    } catch (error) {
        console.error("Error al cargar mascotas:", error);
    }
}

document.getElementById("formMascota").addEventListener("submit", async (e) => {
    e.preventDefault();

    const especieSelect = document.getElementById("especieSelect").value;
    const especieFinal = especieSelect === "Otros" ? document.getElementById("especieOtro").value : especieSelect;

    const mascota = {
        nombre: document.getElementById("nombre").value,
        especie: especieFinal,
        raza: document.getElementById("raza").value,
        edad: parseInt(document.getElementById("edad").value),
        clienteId: parseInt(document.getElementById("clienteId").value)
    };

    const respuesta = await peticionSegura("/api/mascotas", {
        method: "POST",
        body: JSON.stringify(mascota)
    });

    if (respuesta && respuesta.ok) {
        document.getElementById("formMascota").reset();
        document.getElementById("especieOtro").style.display = "none";
        alert("Mascota registrada correctamente");
        cargarMascotas();
    } else {
        alert("Error al registrar la mascota. Verifica que el cliente exista.");
    }
});

async function eliminarMascota(id) {
    if (!confirm("¿Seguro que deseas eliminar esta mascota?")) return;

    try {
        const respuesta = await peticionSegura(`/api/mascotas/${id}`, { method: "DELETE" });

        if (respuesta && respuesta.ok) {
            alert("Mascota eliminada correctamente.");
            cargarMascotas();
        } else if (respuesta && respuesta.status === 403) {
            alert("No tienes permisos para eliminar mascotas.");
        } else {
            alert("No se pudo eliminar la mascota.");
        }
    } catch (error) {
        alert("Error de conexión al eliminar la mascota.");
    }
}