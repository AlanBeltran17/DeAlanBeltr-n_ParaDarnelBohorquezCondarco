// Sincronizar las letras con la canción
var audio = document.querySelector("audio");
var lyrics = document.querySelector("#lyrics");


// Array de objetos que contiene cada línea y su tiempo de aparición en segundos
var lyricsData = [
  { text: "Yo me muero por ti, por ti, por ti...", time: 42 },
  { text: "y no sé qué decir, qué hacer para ser", time: 49 },
  { text: "algo más para ti, para ti, para ti...", time: 56 },
  { text: "escribí esta canción, quiero que sepas que habla mi corazón.", time: 63 },
  { text: "Si yo te quiero lo único que no puedo es hacerte daño", time: 72 },
  { text: "y si estás tú preocupada porque pase lo contrario...", time: 79 },
  { text: "dejame decirte que mi corazón era de piedra mucho tiempo atrás", time: 84 },
  { text: "y que mi vida solo es triste cuando tú no estás, pues eres la única mujer capáz", time: 90 },
  { text: "de revivir mis sentimientos, llenarlos de momentos especiales, importantes para mi", time: 98 },
  { text: "perdidamente enamorado de ti...", time: 105 },
  { text: "Yo me muero por ti, por ti, por ti...", time: 111 },
  { text: "y no sé qué decir, qué hacer para ser", time: 118 },
  { text: "algo más para ti, para ti, para ti...", time: 125 },
  { text: "escribí esta canción, quiero que sepas que habla mi corazón.", time: 132 },
  { text: "Mi corazón el que late por ti, mi corazón el que tú haces feliz", time: 141 },
  { text: "y si mi vida es tiempo te doy una eternidad", time: 148 },
  { text: "con la única condición de que tú me vuelvas a amar", time: 154 },
  { text: "sólo te pido en este momento una oportunidad", time: 160 },
  { text: "Yo me muero por ti, por ti, por ti...", time: 167 },
  { text: "y no sé qué decir, qué hacer para ser", time: 174 },
  { text: "algo más para ti, para ti, para ti...", time: 181 },
  { text: "escribí esta canción, quiero que sepas que habla mi corazón.", time: 188 },
  { text: "Te Amo, bueno... Te QuieAmoDoroSeo.", time: 196 },
  { text: "", time: 215 },
];

// Animar las letras
function updateLyrics() {
  var time = Math.floor(audio.currentTime);
  var currentLine = lyricsData.find(
    (line) => time >= line.time && time < line.time + 8
  );

  if (currentLine) {
    // Calcula la opacidad basada en el tiempo en la línea actual
    var fadeInDuration = 0.1; // Duración del efecto de aparición en segundos
    var opacity = Math.min(1, (time - currentLine.time) / fadeInDuration);

    // Aplica el efecto de aparición
    lyrics.style.opacity = opacity;
    lyrics.innerHTML = currentLine.text;
  } else {
    // Restablece la opacidad y el contenido si no hay una línea actual
    lyrics.style.opacity = 0;
    lyrics.innerHTML = "";
  }
}

setInterval(updateLyrics, 1000);

//funcion titulo
// Función para ocultar el título después de 216 segundos
function ocultarTitulo() {
  var titulo = document.querySelector(".titulo");
  titulo.style.animation =
    "fadeOut 3s ease-in-out forwards"; /* Duración y función de temporización de la desaparición */
  setTimeout(function () {
    titulo.style.display = "none";
  }, 3000); // Espera 3 segundos antes de ocultar completamente
}

// Llama a la función después de 216 segundos (216,000 milisegundos)
setTimeout(ocultarTitulo, 216000);