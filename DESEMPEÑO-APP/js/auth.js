const API_URL = "http://localhost:3000/usuarios";

// REGISTRO
const registroForm = document.getElementById("registroForm");
if (registroForm) {
  registroForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nombre = document.getElementById("nombre").value;
    const correo = document.getElementById("correo").value;
    const contrasena = document.getElementById("contrasena").value;
    const rol = document.getElementById("rol").value;

    const nuevoUsuario = { nombre, correo, contrasena, rol };

    // Verifica si ya existe el correo
    const res = await fetch(`${API_URL}?correo=${correo}`);
    const usuarios = await res.json();
    if (usuarios.length > 0) {
      alert("Este correo ya está registrado.");
      return;
    }

    // Registra el nuevo usuario
    await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nuevoUsuario),
    });

    alert("Usuario registrado exitosamente.");
    window.location.href = "login.html";
  });
}

// LOGIN
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const correo = document.getElementById("correoLogin").value;
    const contrasena = document.getElementById("contrasenaLogin").value;

    const res = await fetch(`${API_URL}?correo=${correo}&contrasena=${contrasena}`);
    const data = await res.json();

    if (data.length === 1) {
      const usuario = data[0];
      // Guardar sesión
      localStorage.setItem("usuarioActual", JSON.stringify(usuario));
      alert("Inicio de sesión exitoso.");

      // Redirigir según el rol
      if (usuario.rol === "bibliotecario") {
        window.location.href = "bibliotecario.html";
      } else {
        window.location.href = "visitante.html";
      }
    } else {
      alert("Credenciales incorrectas.");
    }
  });
}

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
