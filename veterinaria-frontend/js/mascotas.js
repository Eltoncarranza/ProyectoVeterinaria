const token = verificarSesion();
configurarCerrarSesion();

const URL_API = "http://localhost:8080/api/mascotas";

document.addEventListener("DOMContentLoaded", cargarMascotas);

document.getElementById("formMascota").addEventListener("submit", (e) => {
    e.preventDefault();
    const mascota = {
        nombre: document.getElementById("nombre").value,
        raza: document.getElementById("raza").value
    };

    fetch(URL_API, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        },
        body: JSON.stringify(mascota)
    })
    .then(res => {
        if (res.ok) {
            document.getElementById("formMascota").reset();
            cargarMascotas();
        } else {
            alert("No autorizado o error al guardar");
        }
    });
});

function cargarMascotas() {
    fetch(URL_API, {
        method: "GET",
        headers: { "Authorization": "Bearer " + token }
    })
    .then(res => res.json())
    .then(data => {
        const tbody = document.getElementById("tablaMascotas");
        tbody.innerHTML = "";
        data.forEach(m => {
            tbody.innerHTML += `
                <tr>
                    <td>${m.id}</td>
                    <td>${m.nombre}</td>
                    <td>${m.raza}</td>
                </tr>
            `;
        });
    });
}
// Activar control de sesión y botón de salida
configurarCerrarSesion();

document.addEventListener("DOMContentLoaded", cargarMascotas);

// Guardar Mascota usando la petición segura
document.getElementById("formMascota").addEventListener("submit", async (e) => {
    e.preventDefault();
    const mascota = {
        nombre: document.getElementById("nombre").value,
        raza: document.getElementById("raza").value
    };

    const respuesta = await peticionSegura("/api/mascotas", {
        method: "POST",
        body: JSON.stringify(mascota)
    });

    if (respuesta && respuesta.ok) {
        document.getElementById("formMascota").reset();
        cargarMascotas();
    } else {
        alert("No se pudo registrar la mascota.");
    }
});

// Listar Mascotas adjuntando el token automáticamente
async function cargarMascotas() {
    const respuesta = await peticionSegura("/api/mascotas", {
        method: "GET"
    });

    if (respuesta && respuesta.ok) {
        const data = await respuesta.json();
        const tbody = document.getElementById("tablaMascotas");
        tbody.innerHTML = "";
        
        data.forEach(m => {
            tbody.innerHTML += `
                <tr>
                    <td>${m.id}</td>
                    <td>${m.nombre}</td>
                    <td>${m.raza}</td>
                </tr>
            `;
        });
    }
}