document.getElementById("formLogin").addEventListener("submit", function (e) {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const usuarioGuardado = JSON.parse(localStorage.getItem("usuario"));

  if (!usuarioGuardado) {
    alert("No hay usuarios registrados");
    return;
  }

  if (
    email === usuarioGuardado.email &&
    password === usuarioGuardado.password
  ) {
    alert("Bienvenido " + usuarioGuardado.nombre);
    localStorage.setItem("sesionActiva", "true");
    window.location.href = "../index.html";
  } else {
    alert("Usuario o contraseña incorrectos");
  }
});          