const token = verificarSesion();
configurarCerrarSesion();

// Nota: Asegúrate de que la ruta en tu Gateway para medicamentos sea /api/medicamentos
const URL_MED = "http://localhost:8080/api/medicamentos";

document.addEventListener("DOMContentLoaded", cargarMedicamentos);

document.getElementById("formMedicamento").addEventListener("submit", (e) => {
    e.preventDefault();
    const medicamento = {
        nombre: document.getElementById("nombreMed").value,
        stock: document.getElementById("stockMed").value,
        precio: document.getElementById("precioMed").value
    };

    fetch(URL_MED, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        },
        body: JSON.stringify(medicamento)
    })
    .then(res => {
        if (res.ok) {
            document.getElementById("formMedicamento").reset();
            cargarMedicamentos();
        } else {
            alert("Error al registrar medicamento");
        }
    });
});

function cargarMedicamentos() {
    fetch(URL_MED, {
        method: "GET",
        headers: { "Authorization": "Bearer " + token }
    })
    .then(res => res.json())
    .then(data => {
        const tbody = document.getElementById("tablaMedicamentos");
        tbody.innerHTML = "";
        data.forEach(m => {
            tbody.innerHTML += `
                <tr>
                    <td>${m.id}</td>
                    <td>${m.nombre}</td>
                    <td>${m.stock}</td>
                    <td>$${m.precio}</td>
                </tr>
            `;
        });
    });
}