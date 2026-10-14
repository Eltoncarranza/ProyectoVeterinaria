// La URL de tu Aduana Central (Gateway)
const URL_GATEWAY = "http://localhost:8080/api/mascotas";

// Pega aquí tu Token JWT válido que sacaste de Postman
const TOKEN_JWT = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJqb2VsYWRtaW4iLCJyb2wiOiJBRE1JTiIsImlkIjoyLCJpYXQiOjE3OTE5MzQ2ODEsImV4cCI6MTc5MTkzODI4MX0.DbWw2TZe_1Y1y9l4ycjflgYCfPxn_MsBEEM-rigHyxs"; 

// Cuando la página carga, listar las mascotas
document.addEventListener("DOMContentLoaded", cargarMascotas);

// Evento para guardar una mascota nueva
document.getElementById("formularioMascota").addEventListener("submit", function(event) {
    event.preventDefault(); // Evita que la página se recargue

    const mascota = {
        nombre: document.getElementById("nombreMascota").value,
        raza: document.getElementById("razaMascota").value
    };

    guardarMascota(mascota);
});

// Función para llamar al Backend (GET)
function cargarMascotas() {
    fetch(URL_GATEWAY, {
        method: "GET",
        headers: {
            "Authorization": "Bearer " + TOKEN_JWT
        }
    })
    .then(response => response.json())
    .then(datos => {
        const listaHTML = document.getElementById("listaMascotas");
        listaHTML.innerHTML = ""; // Limpiar lista

        datos.forEach(mascota => {
            const li = document.createElement("li");
            li.textContent = `ID: ${mascota.id} - Nombre: ${mascota.nombre} - Raza: ${mascota.raza}`;
            listaHTML.appendChild(li);
        });
    })
    .catch(error => console.error("Error al cargar:", error));
}

// Función para enviar al Backend (POST)
function guardarMascota(mascota) {
    fetch(URL_GATEWAY, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + TOKEN_JWT
        },
        body: JSON.stringify(mascota)
    })
    .then(response => {
        if(response.ok) {
            alert("Mascota guardada con éxito");
            document.getElementById("formularioMascota").reset();
            cargarMascotas(); // Recargar la lista
        } else {
            alert("Error al guardar la mascota");
        }
    })
    .catch(error => console.error("Error:", error));
}