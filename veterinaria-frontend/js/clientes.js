const token = verificarSesion();
configurarCerrarSesion();

const URL_CLIENTES = "http://localhost:8080/api/clientes";

document.addEventListener("DOMContentLoaded", cargarClientes);

document.getElementById("formCliente").addEventListener("submit", (e) => {
    e.preventDefault();
    const cliente = {
        nombre: document.getElementById("nombreCliente").value,
        telefono: document.getElementById("telefonoCliente").value,
        email: document.getElementById("emailCliente").value
    };

    fetch(URL_CLIENTES, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        },
        body: JSON.stringify(cliente)
    })
    .then(res => {
        if (res.ok) {
            document.getElementById("formCliente").reset();
            cargarClientes();
        } else {
            alert("Error al registrar cliente");
        }
    });
});

function cargarClientes() {
    fetch(URL_CLIENTES, {
        method: "GET",
        headers: { "Authorization": "Bearer " + token }
    })
    .then(res => res.json())
    .then(data => {
        const tbody = document.getElementById("tablaClientes");
        tbody.innerHTML = "";
        data.forEach(c => {
            tbody.innerHTML += `
                <tr>
                    <td>${c.id}</td>
                    <td>${c.nombre}</td>
                    <td>${c.telefono}</td>
                    <td>${c.email}</td>
                </tr>
            `;
        });
    });
}