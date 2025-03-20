let zonaUsuario = null;

async function detectarZonaHoraria() {
    try {
        const response = await fetch("https://ipapi.co/json/");
        const data = await response.json();
        zonaUsuario = data.utc_offset / 100;
        document.querySelector(".loading").innerText = "Tu ubicación: " + data.country_name + " (GMT" + (zonaUsuario >= 0 ? "+" : "") + zonaUsuario + ")";
    } catch (error) {
        document.querySelector(".loading").innerText = "No se pudo detectar la ubicación.";
        zonaUsuario = new Date().getTimezoneOffset() / -60;
    }
}

function actualizarRangoHora() {
    let isFormato24h = document.getElementById("switchFormato").checked;
    let horaInput = document.getElementById("hora");

    if (isFormato24h) {
        horaInput.min = "0";
        horaInput.max = "23";
    } else {
        horaInput.min = "1";
        horaInput.max = "12";
    }
}

function convertirHora() {
    let horaIngresada = parseInt(document.getElementById("hora").value);
    let zonaOrigen = parseInt(document.getElementById("zona").value);
    let esFormato24h = document.getElementById("switchFormato").checked;
    
    if (zonaUsuario === null) {
        alert("Error al detectar tu zona horaria. Intenta nuevamente.");
        return;
    }

    if (isNaN(horaIngresada) || horaIngresada < (esFormato24h ? 0 : 1) || horaIngresada > (esFormato24h ? 23 : 12)) {
        alert(`Por favor, ingresa una hora válida (${esFormato24h ? "0-23" : "1-12"}).`);
        return;
    }

    let hora24 = esFormato24h ? horaIngresada : (horaIngresada % 12) + 12;
    let diferencia = zonaUsuario - zonaOrigen;
    let horaConvertida = (hora24 + diferencia) % 24;
    if (horaConvertida < 0) horaConvertida += 24;

    let hora12 = horaConvertida % 12 || 12;
    let ampm = horaConvertida >= 12 ? "PM" : "AM";

    document.getElementById("resultado24").innerText = `${horaConvertida}:00`;
    document.getElementById("resultado12").innerText = `${hora12}:00 ${ampm}`;
    document.querySelectorAll(".resultado").forEach(el => el.style.display = "block");
}

function limpiarCampos() {
    document.getElementById("hora").value = "";
    document.querySelectorAll(".resultado").forEach(el => el.style.display = "none");
}

detectarZonaHoraria();
