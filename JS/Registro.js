document.getElementById("formRegistro").addEventListener("submit", function (e) {
  e.preventDefault(); 

  const nombre = document.getElementById("nombre").value;
  const email = document.getElementById("email").value;
  const telefono = document.getElementById("telefono").value;
  const password = document.getElementById("password").value;
  const confirmar = document.getElementById("confirmar").value;

  
  if (password !== confirmar) {
    alert("Las contraseñas no coinciden");
    return;
  }

  
  const usuario = {
    nombre,
    email,
    telefono,
    password
  };

  
  localStorage.setItem("usuario", JSON.stringify(usuario));

  alert("Registro exitoso");

  
  window.location.href = "Html/Login.html";
});
                 