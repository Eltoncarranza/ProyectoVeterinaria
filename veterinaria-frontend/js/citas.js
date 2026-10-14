const token = verificarSesion();
configurarCerrarSesion();

const URL_CITAS = "http://localhost:8080/api/citas";

document.addEventListener("DOMContentLoaded", cargarCitas);

document.getElementById("formCita").addEventListener("submit", (e) => {
    e.preventDefault();
    const cita = {
        mascotaId: document.getElementById("mascotaId").value,
        fecha: document.getElementById("fechaCita").value,
        motivo: document.getElementById("motivo").value
    };

    fetch(URL_CITAS, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        },
        body: JSON.stringify(cita)
    })
    .then(res => {
        if (res.ok) {
            document.getElementById("formCita").reset();
            cargarCitas();
            alert("Cita agendada con éxito (Notificación enviada por RabbitMQ)");
        } else {
            alert("Error: Verifique si el ID de la mascota existe.");
        }
    });
});

function cargarCitas() {
    fetch(URL_CITAS, {
        method: "GET",
        headers: { "Authorization": "Bearer " + token }
    })
    .then(res => res.json())
    .then(data => {
        const tbody = document.getElementById("tablaCitas");
        tbody.innerHTML = "";
        data.forEach(c => {
            tbody.innerHTML += `
                <tr>
                    <td>${c.id}</td>
                    <td>${c.mascotaId}</td>
                    <td>${c.fecha}</td>
                    <td>${c.motivo}</td>
                </tr>
            `;
        });
    });
}