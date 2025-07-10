const API_LIBROS = "http://localhost:3000/libros";
const API_RESERVAS = "http://localhost:3000/reservas";
const API_USUARIOS = "http://localhost:3000/usuarios";
const usuario = JSON.parse(localStorage.getItem("usuarioActual"));

const bienvenida = document.getElementById("bienvenida");
const listaLibros = document.getElementById("listaLibros");
const listaReservas = document.getElementById("listaReservas");

if (!usuario || usuario.rol !== "visitante") {
  window.location.href = "login.html";
} else {
  bienvenida.textContent = `Bienvenido, ${usuario.nombre}`;
}

// Mostrar libros disponibles
async function cargarLibros() {
  const res = await fetch(API_LIBROS);
  const libros = await res.json();

  listaLibros.innerHTML = "";
  libros.forEach((libro) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <strong>${libro.titulo}</strong> - ${libro.autor} (${libro.disponibles} disponibles)
      ${libro.disponibles > 0 ? `<button onclick="reservarLibro(${libro.id})">Reservar</button>` : `<span>No disponible</span>`}
    `;
    listaLibros.appendChild(li);
  });
}

// Hacer una reserva
async function reservarLibro(idLibro) {
  // Crear nueva reserva
  const reserva = {
    idLibro,
    idUsuario: usuario.id,
    fecha: new Date().toISOString().split("T")[0]
  };

  // Guardar reserva
  await fetch(API_RESERVAS, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(reserva)
  });

  // Disminuir disponibilidad del libro
  const res = await fetch(`${API_LIBROS}/${idLibro}`);
  const libro = await res.json();

  await fetch(`${API_LIBROS}/${idLibro}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ disponibles: libro.disponibles - 1 })
  });

  cargarLibros();
  cargarMisReservas();
}

// Mostrar reservas del usuario
async function cargarMisReservas() {
  const res = await fetch(`${API_RESERVAS}?idUsuario=${usuario.id}`);
  const reservas = await res.json();

  listaReservas.innerHTML = "";

  for (let reserva of reservas) {
    const libroRes = await fetch(`${API_LIBROS}/${reserva.idLibro}`);
    const libro = await libroRes.json();

    const li = document.createElement("li");
    li.textContent = `${libro.titulo} - Reservado el ${reserva.fecha}`;
    listaReservas.appendChild(li);
  }
}

cargarLibros();
cargarMisReservas();

// Cerrar sesión
document.addEventListener("DOMContentLoaded", () => {
  const btnCerrar = document.getElementById("cerrarSesion");
  if (btnCerrar) {
    btnCerrar.addEventListener("click", () => {
      localStorage.removeItem("usuarioActual");
      window.location.href = "login.html";
    });
  }
});

// Detectar modo guardado
document.addEventListener("DOMContentLoaded", () => {
  const modoGuardado = localStorage.getItem("modo");
  if (modoGuardado === "oscuro") {
    document.body.classList.add("modo-oscuro");
  }

  const btnToggle = document.getElementById("toggleModo");
  if (btnToggle) {
    btnToggle.addEventListener("click", () => {
      document.body.classList.toggle("modo-oscuro");
      const modoActual = document.body.classList.contains("modo-oscuro") ? "oscuro" : "claro";
      localStorage.setItem("modo", modoActual);
    });
  }
});
