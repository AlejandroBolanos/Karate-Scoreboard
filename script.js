let timerInterval = null;
let timerValue = 200; // 5 minutos en segundos
let blueScore = parseInt(localStorage.getItem('blueScore')) || 0;
let redScore = parseInt(localStorage.getItem('redScore')) || 0;

// Función para actualizar el marcador y almacenarlo en localStorage
function addPoint(side, points) {
    points = parseInt(points); // Asegurarse de que sea un número
    if (side === 'blue') {
        blueScore += points;
        localStorage.setItem('blueScore', blueScore);
        document.getElementById('blueScore').textContent = blueScore;
    } else if (side === 'red') {
        redScore += points;
        localStorage.setItem('redScore', redScore);
        document.getElementById('redScore').textContent = redScore;
    }
}

// Función para restar puntos y actualizar en localStorage
function subtractPoint(side) {
    if (side === 'blue' && blueScore > 0) {
        blueScore -= 1;
        localStorage.setItem('blueScore', blueScore);
        document.getElementById('blueScore').textContent = blueScore;
    } else if (side === 'red' && redScore > 0) {
        redScore -= 1;
        localStorage.setItem('redScore', redScore);
        document.getElementById('redScore').textContent = redScore;
    }
}


function updateTimerDisplay() {
    const minutes = Math.floor(timerValue / 60);
    const seconds = timerValue % 60;
    const timerElement = document.getElementById('timer');

    if (timerElement) {
        timerElement.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

        // Cambiar el color del temporizador cuando queden 10 segundos o menos
        if (timerValue <= 10) {
            timerElement.style.color = 'red';
        } else {
            timerElement.style.color = 'yellow';
        }
    }
}

// Configura un tiempo personalizado desde el input
function setCustomTime() {
    const timerInputMinutes = document.getElementById('timerInputMinutes');
    const timerInputSeconds = document.getElementById('timerInputSeconds');
    const customMinutes = parseInt(timerInputMinutes.value, 10);
    const customSeconds = parseInt(timerInputSeconds.value, 10);

    if (
        !isNaN(customMinutes) && customMinutes >= 0 &&
        !isNaN(customSeconds) && customSeconds >= 0 && customSeconds < 60
    ) {
        timerValue = customMinutes * 60 + customSeconds; // Convierte minutos y segundos a segundos totales
        updateTimerDisplay();
        syncTimer(); // Actualiza en localStorage
    } else {
        alert('Por favor, ingresa números válidos para minutos y segundos.');
    }
}


// Controla el temporizador
function toggleTimer() {
    const warningSound = document.getElementById('warningSound'); // Obtener el sonido de advertencia
    const timerInputMinutes = document.getElementById('timerInputMinutes'); // Input de minutos
    const timerInputSeconds = document.getElementById('timerInputSeconds'); // Input de segundos
    const timerButton = document.getElementById('timerButton'); // Botón para iniciar/pausar

    // Verifica si el temporizador ya está en marcha
    if (timerInterval) {
        // Detener el temporizador
        clearInterval(timerInterval);
        timerInterval = null;

        // Habilitar los inputs cuando el temporizador se detiene
        timerInputMinutes.disabled = false;
        timerInputSeconds.disabled = false;

        // Cambiar el texto del botón a "Iniciar"
        timerButton.textContent = "Iniciar";
    } else {
        // Iniciar el temporizador
        timerInterval = setInterval(() => {
            if (timerValue > 0) {
                timerValue--;
                updateTimerDisplay();

                // Reproducir el sonido cuando queden exactamente 10 segundos
                if (timerValue === 10 && warningSound) {
                    warningSound.play();
                }

                syncTimer();
            } else {
                clearInterval(timerInterval);
                timerInterval = null;
                alert('¡El tiempo se ha agotado!');

                // Habilitar los inputs cuando el tiempo se haya agotado
                timerInputMinutes.disabled = false;
                timerInputSeconds.disabled = false;

                // Cambiar el texto del botón a "Iniciar"
                timerButton.textContent = "Iniciar";
            }
        }, 1000);

        // Deshabilitar los inputs cuando el temporizador está corriendo
        timerInputMinutes.disabled = true;
        timerInputSeconds.disabled = true;

        // Cambiar el texto del botón a "Pausar"
        timerButton.textContent = "Pausar";
    }
}





// Resetea el temporizador
function resetTimer() {
    const timerInputMinutes = document.getElementById('timerInputMinutes');
    const timerInputSeconds = document.getElementById('timerInputSeconds');
    const customMinutes = parseInt(timerInputMinutes.value, 10);
    const customSeconds = parseInt(timerInputSeconds.value, 10);

    if (
        !isNaN(customMinutes) && customMinutes >= 0 &&
        !isNaN(customSeconds) && customSeconds >= 0 && customSeconds < 60
    ) {
        timerValue = customMinutes * 60 + customSeconds; // Restablece al tiempo personalizado
    } else {
        timerValue = 300; // Valor predeterminado (5 minutos)
    }
    updateTimerDisplay();
    syncTimer();
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = null;
}


// Sincroniza el temporizador con localStorage
function syncTimer() {
    localStorage.setItem('timerValue', timerValue);
}

function add10Seconds() {
    timerValue += 10; 
    updateTimerDisplay(); 
    syncTimer(); 
}

// Sincroniza puntajes con localStorage
function syncScore() {
    localStorage.setItem('blueScore', blueScore);
    localStorage.setItem('redScore', redScore);
}

// Recupera el estado de localStorage
function loadState() {
    const storedTimer = localStorage.getItem('timerValue');
    if (storedTimer !== null) timerValue = parseInt(storedTimer, 10);
    blueScore = parseInt(localStorage.getItem('blueScore')) || 0;
    redScore = parseInt(localStorage.getItem('redScore')) || 0;
    updateTimerDisplay();
    document.getElementById('blueScore').textContent = blueScore;
    document.getElementById('redScore').textContent = redScore;
}


// Resetea puntajes y temporizador
function resetScoreboard() {
    Swal.fire({
        title: '¿Estás seguro?',
        text: 'Se perderán todos los datos actuales de la pelea.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, reiniciar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            // Restablece las puntuaciones
            blueScore = 0;
            redScore = 0;
            syncScore();
            document.getElementById('blueScore').textContent = blueScore;
            document.getElementById('redScore').textContent = redScore;

            // Restablece el temporizador
            resetTimer();

            // Restablece los checkboxes y sincroniza su estado
            resetAllCheckboxes();

            // Sincroniza el estado de los checkboxes en el localStorage
            localStorage.removeItem('senshuBlueState');
            localStorage.removeItem('senshuRedState');

            // Desmarca los checkboxes y oculta los divs
            document.getElementById('senshuBlue').checked = false;
            document.getElementById('senshuRed').checked = false;
            document.getElementById('divSenshuBlue').classList.add('hidden');
            document.getElementById('divSenshuRed').classList.add('hidden');

            // Actualiza el localStorage para reflejar los cambios
            localStorage.setItem('senshuBlueState', 'false');
            localStorage.setItem('senshuRedState', 'false');

            Swal.fire({
                title: 'Reiniciado',
                text: 'El marcador ha sido reiniciado con éxito.',
                icon: 'success',
                timer: 2000,
                showConfirmButton: false
            });
        } else {
            console.log("Reinicio cancelado.");
        }
    });
}


// Función para guardar el estado de los checkboxes en localStorage
function updateState(checkbox) {
    const idWithoutBox = checkbox.id.replace("Box", ""); // Remueve la palabra "Box"
    const isChecked = checkbox.checked; // Estado del checkbox
    localStorage.setItem(idWithoutBox, isChecked); // Guarda el estado

    // Notificar a otras páginas que hubo un cambio
    localStorage.setItem("lastUpdated", Date.now());
}

// Función para cargar el estado desde localStorage y actualizar los divs
function loadStateAndApplyStyles() {
    const ids = ["blue1C", "blue2C", "blue3C", "blueHC", "blueH"];
    ids.forEach(id => {
        const isActive = localStorage.getItem(id) === "true"; // Recupera el estado
        const div = document.getElementById(id);
        if (div) {
            div.classList.toggle("bg-white", isActive); // Cambia el color si está activo
            div.classList.toggle("bg-blue-900", !isActive); // Cambia al color original si no está activo
        }
    });
}

function updateRedState(checkbox) {
    const idWithoutBox = checkbox.id.replace("Box", ""); // Eliminar "Box" del id para obtener el identificador del div
    const isChecked = checkbox.checked; // Estado actual del checkbox
    localStorage.setItem(idWithoutBox, isChecked); // Guardamos el estado en localStorage

    // Notificar que hubo un cambio (por si otras pestañas necesitan actualizarse)
    localStorage.setItem("lastUpdated", Date.now());
}

// Cargar el estado de los checkboxes Red y actualizar los divs
function loadRedStateAndApplyStyles() {
    const ids = ["red1C", "red2C", "red3C", "redHC", "redH"]; // Los IDs de los divs
    ids.forEach(id => {
        const isActive = localStorage.getItem(id) === "true"; // Recuperamos el estado del checkbox (true o false)
        const checkbox = document.getElementById(id + "Box"); // Checkbox correspondiente (suponemos que tiene "Box" al final)
        const div = document.getElementById(id); // El div correspondiente

        if (checkbox) {
            checkbox.checked = isActive; // Actualizamos el estado del checkbox según lo guardado
        }

        if (div) {
            div.classList.toggle("bg-white", isActive); // Cambiamos el color si está activo
            div.classList.toggle("bg-red-900", !isActive); // Cambiamos el color si no está activo
        }
    });
}


function resetAllCheckboxes() {
    // IDs de los checkboxes azules y rojos
    const blueCheckboxIds = ["blueBox1C", "blueBox2C", "blueBox3C", "blueBoxHC", "blueBoxH"];
    const redCheckboxIds = ["redBox1C", "redBox2C", "redBox3C", "redBoxHC", "redBoxH"];

    // Resetear checkboxes azules
    blueCheckboxIds.forEach(id => {
        const checkbox = document.getElementById(id);
        if (checkbox) {
            checkbox.checked = false; // Desmarcar el checkbox
        }

        const relatedDivId = id.replace("Box", "");
        const relatedDiv = document.getElementById(relatedDivId);
        if (relatedDiv) {
            relatedDiv.classList.add("bg-blue-900"); // Regresar al color original
            relatedDiv.classList.remove("bg-white"); // Quitar el color activo
        }

        localStorage.setItem(relatedDivId, false); // Actualizar localStorage
    });

    // Resetear checkboxes rojos
    redCheckboxIds.forEach(id => {
        const checkbox = document.getElementById(id);
        if (checkbox) {
            checkbox.checked = false; // Desmarcar el checkbox
        }

        const relatedDivId = id.replace("Box", "");
        const relatedDiv = document.getElementById(relatedDivId);
        if (relatedDiv) {
            relatedDiv.classList.add("bg-red-900"); // Regresar al color original
            relatedDiv.classList.remove("bg-white"); // Quitar el color activo
        }

        localStorage.setItem(relatedDivId, false); // Actualizar localStorage
    });

    // Notificar a otras páginas del cambio
    localStorage.setItem("lastUpdated", Date.now());
}


// Función para cambiar los estilos cuando el checkbox es marcado o desmarcado
function toggleSenshu(checkboxId, divId) {
    const checkbox = document.getElementById(checkboxId);
    const div = document.getElementById(divId);

    if (checkbox && div) {
        if (checkbox.checked) {
            // Si el checkbox está marcado, aplicamos el borde blanco y el texto blanco
            div.style.border = "2px solid white";  // Borde blanco
            div.style.color = "white";  // Texto blanco
            div.style.backgroundColor = "";  // Restaura el fondo original
        } else {
            // Si el checkbox no está marcado, aplicamos borde negro, texto negro y fondo negro
            div.style.border = "2px solid black";  // Borde negro
            div.style.color = "black";  // Texto negro
            div.style.backgroundColor = "black";  // Fondo negro
        }
    }
}

// Función para cargar los estados de los divs basados en localStorage
function loadSenshuStates() {
    const senshuBlueState = localStorage.getItem('senshuBlueState') === 'true';
    const senshuRedState = localStorage.getItem('senshuRedState') === 'true';

    const divBlue = document.getElementById('divSenshuBlue');
    const divRed = document.getElementById('divSenshuRed');

    if (senshuBlueState) {
        divBlue.classList.remove('hidden');
    } else {
        divBlue.classList.add('hidden');
    }

    if (senshuRedState) {
        divRed.classList.remove('hidden');
    } else {
        divRed.classList.add('hidden');
    }

    // Sincronizar los estados de los checkboxes con los divs
    const checkboxBlue = document.getElementById('senshuBlue');
    const checkboxRed = document.getElementById('senshuRed');

    checkboxBlue.checked = senshuBlueState;
    checkboxRed.checked = senshuRedState;
}




// Escucha cambios en localStorage desde otras pestañas
window.addEventListener('storage', function (event) {
    if (event.key === 'timerValue') {
        timerValue = parseInt(event.newValue, 10);
        updateTimerDisplay();
    } else if (event.key === 'blueScore') {
        blueScore = parseInt(event.newValue, 10);
        document.getElementById('blueScore').textContent = blueScore;
    } else if (event.key === 'redScore') {
        redScore = parseInt(event.newValue, 10);
        document.getElementById('redScore').textContent = redScore;
    }

    if (event.key === "lastUpdated") {
        loadStateAndApplyStyles(); // Recargar los estados en la página actual
        loadRedStateAndApplyStyles();
    }

    if (event.key === 'senshuBlueState' || event.key === 'senshuRedState') {
        // Recargar el estado de los divs cuando el estado de los checkboxes cambia
        loadSenshuStates();
    }
});

document.addEventListener('DOMContentLoaded', () => {

    loadState();
    loadStateAndApplyStyles();
    loadRedStateAndApplyStyles();   

    const add10SecondsButton = document.getElementById('add10Seconds');
    if (add10SecondsButton) {
        add10SecondsButton.addEventListener('click', add10Seconds);
    }

    const savedTime = localStorage.getItem('timerValue');
    if (savedTime) {
        timerValue = parseInt(savedTime, 10);
        updateTimerDisplay();
    }

    loadSenshuStates();

    // Agregar listeners para los cambios en los checkboxes
    const checkboxBlue = document.getElementById('senshuBlue');
    const checkboxRed = document.getElementById('senshuRed');

    checkboxBlue.addEventListener('change', function () {
        if (this.checked) {
            document.getElementById('divSenshuBlue').classList.remove('hidden');
            localStorage.setItem('senshuBlueState', 'true');
        } else {
            document.getElementById('divSenshuBlue').classList.add('hidden');
            localStorage.setItem('senshuBlueState', 'false');
        }
    });

    checkboxRed.addEventListener('change', function () {
        if (this.checked) {
            document.getElementById('divSenshuRed').classList.remove('hidden');
            localStorage.setItem('senshuRedState', 'true');
        } else {
            document.getElementById('divSenshuRed').classList.add('hidden');
            localStorage.setItem('senshuRedState', 'false');
        }
    });

});

document.querySelectorAll('.checkbox').forEach(checkbox => {
    checkbox.addEventListener('change', function() {
        updateRedState(this); // Llamamos a la función que guarda el estado en localStorage
    });
});

