document.addEventListener("DOMContentLoaded", async () => {
    if (typeof configurarCerrarSesion === 'function') configurarCerrarSesion();
    
    // Lógica para mostrar/ocultar el input de "Otras" especies
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

    await cargarClientesDropdown();
    await cargarMascotas();
});

async function cargarClientesDropdown() {
    try {
        const respuesta = await peticionSegura("/api/clientes", { method: "GET" });
        if (respuesta && respuesta.ok) {
            const clientes = await respuesta.json();
            const select = document.getElementById("clienteId");
            select.innerHTML = '<option value="">Seleccione un dueño...</option>';
            
            clientes.forEach(c => {
                select.innerHTML += `<option value="${c.id}">${c.nombre} ${c.apellidos} (DNI/Tel: ${c.telefono})</option>`;
            });
        }
    } catch (error) {
        console.error("Error al cargar clientes:", error);
    }
}

document.getElementById("formMascota").addEventListener("submit", async (e) => {
    e.preventDefault();
    
    // Determinar la especie final
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

async function cargarMascotas() {
    const respuesta = await peticionSegura("/api/mascotas", { method: "GET" });

    if (respuesta && respuesta.ok) {
        const data = await respuesta.json();
        const tbody = document.getElementById("tablaMascotas");
        tbody.innerHTML = "";
        
        data.forEach(m => {
            tbody.innerHTML += `
                <tr>
                    <td>${m.id}</td>
                    <td>${m.nombre}</td>
                    <td>${m.especie}</td>
                    <td>${m.raza}</td>
                    <td>Cliente ID: ${m.clienteId}</td>
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