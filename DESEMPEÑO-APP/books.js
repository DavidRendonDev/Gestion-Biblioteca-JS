const API_LIBROS = "http://localhost:3000/libros";
const usuario = JSON.parse(localStorage.getItem("usuarioActual"));
const bienvenida = document.getElementById("bienvenida");
const lista = document.getElementById("listaLibros");
const form = document.getElementById("formLibro");

if (!usuario || usuario.rol !== "bibliotecario") {
  window.location.href = "login.html";
} else {
  bienvenida.textContent = `Bienvenido, ${usuario.nombre}`;
}

// Cargar libros
async function cargarLibros() {
  const res = await fetch(API_LIBROS);
  const libros = await res.json();

  lista.innerHTML = "";
  libros.forEach((libro) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <strong>${libro.titulo}</strong> - ${libro.autor} (${libro.disponibles} disponibles)
      <button onclick="editarLibro(${libro.id})">Editar</button>
      <button onclick="eliminarLibro(${libro.id})">Eliminar</button>
    `;
    lista.appendChild(li);
  });
}

cargarLibros();

// Crear o editar libro
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const id = document.getElementById("idLibro").value;
  const titulo = document.getElementById("titulo").value;
  const autor = document.getElementById("autor").value;
  const disponibles = parseInt(document.getElementById("disponibles").value);

  const nuevoLibro = { titulo, autor, disponibles };

  if (id) {
    await fetch(`${API_LIBROS}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nuevoLibro),
    });
  } else {
    await fetch(API_LIBROS, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nuevoLibro),
    });
  }

  form.reset();
  cargarLibros();
});

// Editar libro
window.editarLibro = async function (id) {
  const res = await fetch(`${API_LIBROS}/${id}`);
  const libro = await res.json();

  document.getElementById("idLibro").value = libro.id;
  document.getElementById("titulo").value = libro.titulo;
  document.getElementById("autor").value = libro.autor;
  document.getElementById("disponibles").value = libro.disponibles;
};

// Eliminar libro
window.eliminarLibro = async function (id) {
  if (confirm("¿Seguro que deseas eliminar este libro?")) {
    await fetch(`${API_LIBROS}/${id}`, { method: "DELETE" });
    cargarLibros();
  }
};

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
