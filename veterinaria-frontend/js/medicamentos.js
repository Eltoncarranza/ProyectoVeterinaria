document.addEventListener('DOMContentLoaded', () => {
    if (typeof configurarCerrarSesion === 'function') {
        configurarCerrarSesion();
    }

    if (typeof esAdmin === 'function' && !esAdmin()) {
        document.querySelectorAll('.solo-admin').forEach(elemento => {
            elemento.style.display = 'none';
        });
    }

    const formMedicamento = document.getElementById('formMedicamento');
    const tablaMedicamentos = document.getElementById('tablaMedicamentos');

    let medicamentosDB = JSON.parse(localStorage.getItem('medicamentosMockDB')) || [];

    function renderizarTabla() {
        if (!tablaMedicamentos) return;
        tablaMedicamentos.innerHTML = '';
        
        if (medicamentosDB.length === 0) {
            tablaMedicamentos.innerHTML = '<tr><td colspan="4" style="text-align:center;">No hay medicamentos en stock</td></tr>';
            return;
        }

        medicamentosDB.forEach((med, index) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>M-${index + 1000}</td>
                <td>${med.nombre}</td>
                <td>${med.stock}</td>
                <td>$ ${parseFloat(med.precio).toFixed(2)}</td>
            `;
            tablaMedicamentos.appendChild(tr);
        });
    }

    if (formMedicamento) {
        formMedicamento.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const nuevoMedicamento = {
                nombre: document.getElementById('nombreMed').value,
                stock: document.getElementById('stockMed').value,
                precio: document.getElementById('precioMed').value
            };

            medicamentosDB.push(nuevoMedicamento);
            localStorage.setItem('medicamentosMockDB', JSON.stringify(medicamentosDB));
            
            formMedicamento.reset();
            renderizarTabla();
            
            alert("Medicamento registrado con éxito en el inventario.");
        });
    }

    renderizarTabla();

    const btnGenerarReceta = document.getElementById("btnGenerarReceta");

    if (btnGenerarReceta) {
        btnGenerarReceta.addEventListener("click", () => {
            const inputDoctor = document.getElementById("recetaDoctor");
            const inputDueno = document.getElementById("recetaDueno");
            const inputPaciente = document.getElementById("recetaPaciente");
            const inputDosis = document.getElementById("recetaDosis");
            const inputRecomendaciones = document.getElementById("recetaRecomendaciones");

            if (!inputDoctor.value || !inputDueno.value || !inputPaciente.value || !inputDosis.value) {
                alert("Por favor completa los campos obligatorios de la prescripción.");
                return;
            }

            const ahora = new Date();
            
            document.getElementById("outDoctor").textContent = inputDoctor.value.toUpperCase();
            document.getElementById("outDueno").textContent = inputDueno.value;
            document.getElementById("outPaciente").textContent = inputPaciente.value;
            document.getElementById("outDosis").textContent = inputDosis.value;
            document.getElementById("outRecomendaciones").textContent = inputRecomendaciones.value || 'Ninguna indicación adicional.';
            
            document.getElementById("outFecha").textContent = ahora.toLocaleDateString();
            document.getElementById("outHora").textContent = ahora.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

            document.querySelector(".card.no-print").style.display = "none";
            document.getElementById("voucherImprimible").style.display = "block";
            
            window.print();

            setTimeout(() => {
                document.querySelector(".card.no-print").style.display = "block";
                document.getElementById("voucherImprimible").style.display = "none";
                document.getElementById("formReceta").reset();
            }, 1000);
        });
    }
});