if (typeof verificarSesion === 'function') verificarSesion();
if (typeof configurarCerrarSesion === 'function') configurarCerrarSesion();

let diccionarioMascotas = {}; 
let todasLasCitas = []; // Guardamos las citas globalmente para los filtros

document.addEventListener("DOMContentLoaded", async () => {
    configurarFechaMinima();
    await cargarMascotasDropdown();
    await cargarCitas();
});

function configurarFechaMinima() {
    const inputFecha = document.getElementById("fecha");
    if (inputFecha) {
        const ahora = new Date();
        ahora.setMinutes(ahora.getMinutes() - ahora.getTimezoneOffset());
        inputFecha.min = ahora.toISOString().slice(0, 16);
    }
}

async function cargarMascotasDropdown() {
    try {
        const respuesta = await peticionSegura("/api/mascotas", { method: "GET" });
        if (respuesta && respuesta.ok) {
            const mascotas = await respuesta.json();
            const select = document.getElementById("mascotaId");
            select.innerHTML = '<option value="">Seleccione una mascota...</option>';
            
            mascotas.forEach(m => {
                diccionarioMascotas[m.id] = m.nombre; 
                select.innerHTML += `<option value="${m.id}">${m.nombre} (${m.especie || 'Mascota'})</option>`;
            });
        }
    } catch (error) {
        console.error("Error al cargar mascotas:", error);
    }
}

// 1. AGENDAR CITA
document.getElementById("formCita").addEventListener("submit", async (e) => {
    e.preventDefault();
    
    let rawDate = document.getElementById("fecha").value;
    if(rawDate.length === 16) { 
        rawDate += ":00"; 
    }

    const cita = {
        mascotaId: parseInt(document.getElementById("mascotaId").value),
        fechaHora: rawDate, 
        motivo: document.getElementById("motivo").value,
        estado: "PENDIENTE"
    };

    try {
        const respuesta = await peticionSegura("/api/citas", {
            method: "POST",
            body: JSON.stringify(cita)
        });

        if (respuesta && respuesta.ok) {
            document.getElementById("formCita").reset();
            alert("¡Cita agendada con éxito!");
            await cargarCitas();
        } else {
            alert("Error al agendar la cita en el servidor.");
        }
    } catch (err) {
        console.error("Error de red:", err);
        alert("Error de conexión al guardar la cita.");
    }
});

// 2. CAMBIAR ESTADO DE LA CITA
async function cambiarEstadoCita(idCita, nuevoEstado) {
    try {
        const respuesta = await peticionSegura(`/api/citas/${idCita}`, {
            method: "PUT",
            body: JSON.stringify({ estado: nuevoEstado })
        });

        if (respuesta && respuesta.ok) {
            await cargarCitas(); 
        } else {
            alert("No se pudo actualizar el estado de la cita.");
        }
    } catch (e) {
        console.error("Error al cambiar estado:", e);
    }
}

// Función auxiliar para obtener el inicio de la semana (Lunes)
function obtenerInicioSemana(fecha) {
    const d = new Date(fecha);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Ajustar si es domingo
    return new Date(d.setDate(diff));
}

async function cargarCitas() {
    try {
        const respuesta = await peticionSegura("/api/citas", { method: "GET" });

        if (respuesta && respuesta.ok) {
            todasLasCitas = await respuesta.json();
            renderizarAgenda(todasLasCitas);
        }
    } catch (e) {
        console.error("Error al cargar la agenda de citas:", e);
    }
}

// 3. RENDERIZAR AGENDA ORGANIZADA POR SEMANA
function renderizarAgenda(citas) {
    const contenedor = document.getElementById("agendaContenedor");
    contenedor.innerHTML = "";
    
    if (!citas || citas.length === 0) {
        contenedor.innerHTML = '<p style="color: #666; grid-column: 1/-1; text-align: center; padding: 20px;">No hay citas programadas.</p>';
        return;
    }

    // Ordenar de más antigua a más reciente
    citas.sort((a, b) => new Date(a.fechaHora) - new Date(b.fechaHora));

    // Agrupar por semanas
    const semanasMap = {};

    citas.forEach(c => {
        let rawFecha = c.fechaHora;
        let claveSemana = "Sin Fecha Programada";
        let etiquetaSemana = "📅 Citas Sin Fecha";

        if (rawFecha) {
            const dateObj = new Date(rawFecha);
            if (!isNaN(dateObj.getTime())) {
                const inicioSemana = obtenerInicioSemana(dateObj);
                const finSemana = new Date(inicioSemana);
                finSemana.setDate(inicioSemana.getDate() + 6);

                const opcionesFecha = { day: 'numeric', month: 'short' };
                claveSemana = inicioSemana.toISOString().slice(0, 10);
                etiquetaSemana = `🗓️ Semana del ${inicioSemana.toLocaleDateString('es-PE', opcionesFecha)} al ${finSemana.toLocaleDateString('es-PE', opcionesFecha)} de ${finSemana.getFullYear()}`;
            }
        }

        if (!semanasMap[claveSemana]) {
            semanasMap[claveSemana] = {
                titulo: etiquetaSemana,
                citas: []
            };
        }
        semanasMap[claveSemana].citas.push(c);
    });

    // Dibujar los bloques semanales en el HTML
    Object.keys(semanasMap).sort().forEach(clave => {
        const grupo = semanasMap[clave];
        
        // Cabecera de la semana
        const seccionSemana = document.createElement("div");
        seccionSemana.style.gridColumn = "1 / -1";
        seccionSemana.innerHTML = `
            <h4 style="margin-top: 25px; margin-bottom: 10px; color: #2b8a3e; border-bottom: 2px solid #20c997; padding-bottom: 5px; font-size: 1.1em;">
                ${grupo.titulo}
            </h4>
        `;
        contenedor.appendChild(seccionSemana);

        // Grid interno para las tarjetas de esa semana específica
        const gridSemana = document.createElement("div");
        gridSemana.style.cssText = "display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 15px; width: 100%; grid-column: 1 / -1;";

        grupo.citas.forEach(c => {
            const nombreMascota = diccionarioMascotas[c.mascotaId] || `Mascota ID: ${c.mascotaId}`;
            
            let mes = "CITA";
            let dia = "--";
            let diaSemana = "Fecha pendiente";
            let hora = "--:--";

            if (c.fechaHora) {
                const dateObj = new Date(c.fechaHora);
                if (!isNaN(dateObj.getTime())) {
                    mes = dateObj.toLocaleDateString('es-PE', { month: 'short' }).toUpperCase();
                    dia = dateObj.toLocaleDateString('es-PE', { day: '2-digit' });
                    hora = dateObj.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' });
                    diaSemana = dateObj.toLocaleDateString('es-PE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
                }
            }

            const esCumplida = c.estado === "CUMPLIDA" || c.estado === "COMPLETADA";
            const colorBorde = esCumplida ? "#adb5bd" : "#20c997";
            const badgeEstado = esCumplida 
                ? '<span style="background: #e9ecef; color: #2b8a3e; padding: 4px 10px; border-radius: 6px; font-size: 0.8em; font-weight: bold;">CUMPLIDA ✔</span>'
                : '<span style="background: #fff9db; color: #f59f00; padding: 4px 10px; border-radius: 6px; font-size: 0.8em; font-weight: bold;">PENDIENTE ⏳</span>';

            const tarjeta = document.createElement("div");
            tarjeta.style.cssText = `background: #ffffff; border-left: 5px solid ${colorBorde}; border-radius: 8px; padding: 15px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); display: flex; flex-direction: column; justify-content: space-between; opacity: ${esCumplida ? '0.75' : '1'};`;
            
            tarjeta.innerHTML = `
                <div>
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                        <div style="background: #e6fcf5; color: #0ca678; padding: 4px 8px; border-radius: 6px; font-weight: bold; font-size: 0.85em;">
                            ID: #${c.id}
                        </div>
                        <div>${badgeEstado}</div>
                    </div>
                    
                    <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 15px;">
                        <div style="background: ${esCumplida ? '#868e96' : '#20c997'}; color: white; padding: 8px 12px; border-radius: 8px; text-align: center; min-width: 50px;">
                            <div style="font-size: 0.75em; line-height: 1;">${mes}</div>
                            <div style="font-size: 1.3em; font-weight: bold; line-height: 1.1;">${dia}</div>
                        </div>
                        <div>
                            <div style="font-size: 0.85em; color: #868e96; text-transform: capitalize;">${diaSemana} - <strong>${hora}</strong></div>
                            <div style="font-size: 1.1em; font-weight: bold; color: #343a40;">🐾 ${nombreMascota}</div>
                        </div>
                    </div>

                    <p style="margin: 0 0 15px 0; font-size: 0.95em; color: #495057; background: #f8f9fa; padding: 10px; border-radius: 6px;">
                        <strong>Motivo:</strong> ${c.motivo}
                    </p>
                </div>

                <div>
                    ${!esCumplida ? `
                        <button onclick="cambiarEstadoCita(${c.id}, 'CUMPLIDA')" style="width: 100%; background: #2b8a3e; color: white; border: none; padding: 9px; border-radius: 6px; cursor: pointer; font-weight: bold;">
                            Dar por Terminada / Cumplida ✔
                        </button>
                    ` : `
                        <button onclick="cambiarEstadoCita(${c.id}, 'PENDIENTE')" style="width: 100%; background: #ced4da; color: #495057; border: none; padding: 7px; border-radius: 6px; cursor: pointer; font-size: 0.9em; font-weight: bold;">
                            Marcar como Pendiente ↺
                        </button>
                    `}
                </div>
            `;
            gridSemana.appendChild(tarjeta);
        });

        contenedor.appendChild(gridSemana);
    });
}