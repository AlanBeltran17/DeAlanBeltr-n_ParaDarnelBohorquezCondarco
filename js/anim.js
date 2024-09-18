// Sincronizar las letras con la canción
var audio = document.querySelector("audio");
var lyrics = document.querySelector("#lyrics");


// Array de objetos que contiene cada línea y su tiempo de aparición en segundos
var lyricsData = [
  { text: "Yo me muero por ti, por ti, por ti...", time: 41 },
  { text: "y no sé qué decir, qué hacer para ser", time: 48 },
  { text: "algo más para ti, para ti, para ti...", time: 55 },
  { text: "escribí esta canción, quiero que sepas que habla mi corazón.", time: 62 },
  { text: "Si yo te quiero lo único que no puedo es hacerte daño", time: 71 },
  { text: "y si estás tú preocupada porque pase lo contrario...", time: 78 },
  { text: "dejame decirte que mi corazón era de piedra mucho tiempo atrás", time: 83 },
  { text: "y que mi vida solo es triste cuando tú no estás, pues eres la única mujer capáz", time: 89 },
  { text: "de revivir mis sentimientos, llenarlos de momentos especiales, importantes para mi", time: 97 },
  { text: "perdidamente enamorado de ti...", time: 104 },
  { text: "Yo me muero por ti, por ti, por ti...", time: 110 },
  { text: "y no sé qué decir, qué hacer para ser", time: 117 },
  { text: "algo más para ti, para ti, para ti...", time: 124 },
  { text: "escribí esta canción, quiero que sepas que habla mi corazón.", time: 131 },
  { text: "Mi corazón el que late por ti, mi corazón el que tú haces feliz", time: 140 },
  { text: "y si mi vida es tiempo te doy una eternidad", time: 147 },
  { text: "con la única condición de que tú me vuelvas a amar", time: 153 },
  { text: "sólo te pido en este momento una oportunidad", time: 159 },
  { text: "Yo me muero por ti, por ti, por ti...", time: 166 },
  { text: "y no sé qué decir, qué hacer para ser", time: 173 },
  { text: "algo más para ti, para ti, para ti...", time: 180 },
  { text: "escribí esta canción, quiero que sepas que habla mi corazón.", time: 187 },
  { text: "Te Amo, bueno... Te QuieAmoDoroSeo.", time: 195 },

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