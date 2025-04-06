document.addEventListener("DOMContentLoaded", () => {
    const fechaElement = document.getElementById("fecha");
    const extraContainer = document.getElementById("extras");
    const agregarCampoBtn = document.getElementById("agregarCampo");
    const generarReporteBtn = document.getElementById("generarReporte");
    const todoOkBtn = document.getElementById("todoOk");
    const reporteTextarea = document.getElementById("reporte");
    const copiarReporteBtn = document.getElementById("copiarReporte");
    const addDetailButtons = document.querySelectorAll(".add-detail");
    const checkboxes = document.querySelectorAll(".chk");
    const iconos = ["🔍", "🔎", "🔍", "🔎", "🔍"]; // Iconos alternativos
    let comentarioCount = 0; // Contador de comentarios

    // Mostrar la fecha actual con formato día/mes/año
    const fechaActual = new Date();
    const formatoFecha = fechaActual.toLocaleDateString('es-ES');
    fechaElement.textContent = formatoFecha;

    // Agregar detalles adicionales al presionar "+" con icono indicador
    addDetailButtons.forEach((button, index) => {
        button.addEventListener("click", () => {
            if (comentarioCount < 15) { // Limitar a 15 comentarios
                const textoBase = checkboxes[index].dataset.text;
                let detalle = prompt(`Agregar detalle a "${textoBase}" (dejar vacío si no hay cambios):`);
                if (detalle) {
                    // Asegurarse de que dataset.details sea un array
                    if (!checkboxes[index].dataset.details) {
                        checkboxes[index].dataset.details = JSON.stringify([]);
                    }
                    let detallesArray = JSON.parse(checkboxes[index].dataset.details);
                    detallesArray.push(detalle);
                    checkboxes[index].dataset.details = JSON.stringify(detallesArray);
                    // Crear icono indicador si no existe
                    let icono = button.parentElement.querySelector(".detalle-icono");
                    if (!icono) {
                        icono = document.createElement("span");
                        icono.className = "detalle-icono";
                        icono.textContent = iconos[comentarioCount % iconos.length]; // Cambiar icono
                        icono.style.cursor = "pointer";
                        icono.title = detalle;
                        button.parentElement.appendChild(icono);
                        // Mostrar detalle al hacer clic en el icono
                        icono.addEventListener("click", () => {
                            alert(`STATUS SYSTEM: Detalles de "${textoBase}": ${JSON.parse(checkboxes[index].dataset.details).join(", ")}`);
                        });
                    } else {
                        icono.title = JSON.parse(checkboxes[index].dataset.details).join(", "); // Actualizar tooltip si ya existe
                    }
                    comentarioCount++; // Incrementar contador de comentarios
                }
            } else {
                alert("STATUS SYSTEM: Se ha alcanzado el límite de 5 comentarios.");
            }
        });
    });

    // Agregar actividades extras (máximo 10)
    let extraCount = 0;
    agregarCampoBtn.addEventListener("click", () => {
        if (extraCount < 10) {
            const input = document.createElement("input");
            input.type = "text";
            input.className = "extraActividad";
            input.placeholder = "Nueva actividad...";
            extraContainer.appendChild(input);
            extraCount++;
        }
    });

    // Función para obtener el turno según la hora
    function obtenerTurno() {
        /* cambia de turno */
        let hora = new Date().getHours();
        if (hora >= 6 && hora < 16) return "1er turno";
        if (hora >= 16 && hora < 24) return "2do turno";
        return "3er turno"; // De 24:00 a 6:00 am
        /* fin de cambio de turno */
    }

    // Generar reporte sin solicitar observaciones
    generarReporteBtn.addEventListener("click", () => {
        let reporte = `Status ${fechaElement.textContent} ${obtenerTurno()}:\n\n`;
        checkboxes.forEach(chk => {
            if (chk.checked) {
                let texto = chk.dataset.text;
                let detalles = chk.dataset.details ? `, ${JSON.parse(chk.dataset.details).join(", ")}` : "";
                reporte += `* ${texto}${detalles}: OK ✅\n\n`;
            }
        });
        document.querySelectorAll(".extraActividad").forEach(extra => {
            if (extra.value.trim()) {
                reporte += `* ${extra.value.trim()} ✅\n\n`;
            }
        });
        let pendienteIndex = 1;
        document.querySelectorAll(".pendienteActividad").forEach(pendiente => {
            if (pendiente.value.trim()) {
                reporte += `* Pendiente ${pendienteIndex}: ${pendiente.value.trim()} ❗\n\n`;
                pendienteIndex++;
            }
        });
        reporteTextarea.value = reporte;
        almacenarReporte(reporte); // Almacenar el reporte en otro archivo HTML
    });

    // Generar reporte con "Todo OK"
    todoOkBtn.addEventListener("click", () => {
        let reporte = `Status ${fechaElement.textContent} ${obtenerTurno()}:\n\n`;
        checkboxes.forEach(chk => {
            reporte += `* ${chk.dataset.text}: OK ✅\n\n`;
        });
        let pendienteIndex = 1;
        document.querySelectorAll(".pendienteActividad").forEach(pendiente => {
            if (pendiente.value.trim()) {
                reporte += `* Pendiente ${pendienteIndex}: ${pendiente.value.trim()} ❗\n\n`;
                pendienteIndex++;
            }
        });
        reporteTextarea.value = reporte;
        almacenarReporte(reporte); // Almacenar el reporte en otro archivo HTML
    });

    // Copiar reporte al portapapeles
    copiarReporteBtn.addEventListener("click", () => {
        reporteTextarea.select();
        document.execCommand("copy");
        alert("STATUS SYSTEM: Reporte copiado al portapapeles");
    });

    // Actualizar reloj dinámicamente
    function actualizarReloj() {
        let ahora = new Date();
        let horas = ahora.getHours().toString().padStart(2, '0');
        let minutos = ahora.getMinutes().toString().padStart(2, '0');
        let segundos = ahora.getSeconds().toString().padStart(2, '0');
        document.getElementById("reloj").textContent = `${horas}:${minutos}:${segundos}`;
    }
    setInterval(actualizarReloj, 1000);
    actualizarReloj();
});

// Función para almacenar el reporte en otro archivo HTML
function almacenarReporte(reporte) {
    const historialContainer = document.getElementById("historial");
    const reporteElement = document.createElement("div");
    reporteElement.className = "reporte-historial";
    reporteElement.textContent = reporte;
    historialContainer.appendChild(reporteElement);
}

// Agregar pendientes (máximo 10)
let pendienteCount = 0;
const pendientesContainer = document.getElementById("pendientes");
const agregarPendienteBtn = document.getElementById("agregarPendiente");

if (agregarPendienteBtn) {
    agregarPendienteBtn.addEventListener("click", () => {
        if (pendienteCount < 10) {
            const input = document.createElement("input");
            input.type = "text";
            input.className = "pendienteActividad";
            input.placeholder = "Nuevo pendiente...";
            pendientesContainer.appendChild(input);
            pendienteCount++;
        }
    });
}

// Función para corregir ortografía (ejemplo de uso comentado)
async function corregirOrtografia(texto) {
    const response = await fetch("https://api.spellchecker.com/check", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-rapidapi-host": "spellchecker.com",
            "x-rapidapi-key": "YOUR_RAPIDAPI_KEY"
        },
        body: JSON.stringify({ text: texto })
    });
    const data = await response.json();
    return data.correctedText;
}

// Ejemplo de uso (comentado para evitar ejecución automática)
// const textoCorregido = await corregirOrtografia("Texto con errores ortográficos");
// console.log(textoCorregido);

//Acceso
window.onload = () => {
    const acceso = sessionStorage.getItem("accesoPermitido");
    const expira = sessionStorage.getItem("expira");
    const ahora = Date.now();

    if (acceso !== "true" || !expira || ahora > expira) {
        sessionStorage.clear();
        alert("Tu sesión ha expirado o no has iniciado sesión.");
        window.location.href = "index.html";
    }
};

function cerrarSesion() {
    sessionStorage.clear();
    window.location.href = "index.html";
}
