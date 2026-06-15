// VARIABLES PARA EL DIBUJO
let posX, posY;
let prevX, prevY;
let grosorPincel = 5;

// CONFIGURACIÓN DEL WEBSOCKET (IP fija del modo Access Point)
const ESP32_IP = '192.168.4.1'; 
const socket = new WebSocket(`ws://${ESP32_IP}:81`);

// Color verde pizarrón clásico escolar
const COLOR_PIZARRON = [30, 63, 32]; 

function setup() {
    let canvas = createCanvas(800, 600);
    canvas.parent('canvas-container');
    
    // Pintamos el pizarrón de verde
    background(COLOR_PIZARRON[0], COLOR_PIZARRON[1], COLOR_PIZARRON[2]); 

    posX = width / 2;
    posY = height / 2;
    prevX = posX;
    prevY = posY;

    const statusText = document.getElementById('status');

    socket.onopen = () => {
        statusText.innerText = "Conectado";
        statusText.style.color = "#2ed573";
    };

    socket.onclose = () => {
        statusText.innerText = "Desconectado";
        statusText.style.color = "#ff4757";
    };

    socket.onmessage = (event) => {
        let datos = event.data.split(',');

        if (datos.length >= 4) {
            let valorZ     = parseFloat(datos[0]); 
            let valorX     = parseFloat(datos[1]); 
            let valorY     = parseFloat(datos[2]); 
            let estadoBtn  = parseInt(datos[3]);   

            posX = valorX * width;
            posY = valorY * height;

            // Grosor de la tiza (de 3 a 25 píxeles)
            grosorPincel = valorZ * 22 + 3; 

            // Si apretás el botón físico, "borramos" el pizarrón con el color verde
            if (estadoBtn === 1) {
                borrarPizarron();
            }
        }
    };
}

function draw() {
    if (frameCount > 10 && prevX !== undefined) {
        // TIZA BLANCA CON OPACIDAD (Simula el polvo de tiza)
        // El cuarto parámetro (200) es la opacidad de 0 a 255. 
        stroke(255, 255, 255, 200);          
        strokeWeight(grosorPincel);  
        line(prevX, prevY, posX, posY); 
    }

    prevX = posX;
    prevY = posY;
}

// Función dedicada a limpiar el pizarrón
function borrarPizarron() {
    background(COLOR_PIZARRON[0], COLOR_PIZARRON[1], COLOR_PIZARRON[2]);
    console.log("Pizarrón borrado");
}

// Extra: Borrar con barra espaciadora
function keyPressed() {
    if (key === ' ') {
        borrarPizarron();
    }
}