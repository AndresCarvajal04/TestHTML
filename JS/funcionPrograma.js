// ========== VARIABLES GLOBALES ==========
let productos = JSON.parse(localStorage.getItem("productos")) || [];
let actual = null; // Índice del producto seleccionado


// ========== GESTIÓN DE DATOS ==========
function guardar(){
  localStorage.setItem("productos", JSON.stringify(productos));
}


// ========== INTERFAZ DE USUARIO ==========
function mostrar(){
  const tienda = document.getElementById("tienda");
  if(!tienda) return;
  
  tienda.innerHTML = "";
  
  productos.forEach((p,i)=>{
    tienda.innerHTML += `
      <div class="producto">
        <div class="disponibilidad-container">
          <span class="status-text">Enviar a Tienda</span>
          <label class="switch">
            <input type="checkbox" checked> 
            <span class="slider"></span>
          </label>
        </div>

        <div onclick="abrirModal(${i})">
          <img src="${p.img}">
          <p>${p.nombre}</p>
        </div>
      </div>
    `;
  });
}


// ========== MODAL ==========
function abrirModal(i){
  actual = i;
  const p = productos[i];
  
  modalImg.src = p.img;
  modalNombre.textContent = p.nombre;
  modalPrecio.textContent = "Precio: " + p.precio;
  modalTalla.textContent = "Talla: " + p.talla;
  modalColor.textContent = "Color: " + p.color;
  modalDesc.textContent = p.desc;
  modal.style.display = "flex";
}

function cerrarModal(){
  modal.style.display = "none";
}


// ========== CRUD DE PRODUCTOS ==========
function borrarProducto(){
  modal.style.display = "none";
  
  Swal.fire({
    title:"¿Eliminar?",
    text:"No se puede deshacer",
    icon:"warning",
    showCancelButton:true,
    confirmButtonText:"Sí",
    cancelButtonText:"Cancelar"
  }).then(r=>{
    if(r.isConfirmed){
      productos.splice(actual,1);
      guardar();
      mostrar();
      Swal.fire("Eliminado","","success");
    }
  });
}


function editarProducto(){
  modal.style.display="none";
  const p = productos[actual];

  Swal.fire({
    title: "EDITAR PRODUCTO", 
    html: `
      <div class="admin-edit-form">
        <label class="edit-label">Nombre del Producto</label>
        <input id="eNombre" class="edit-input" value="${p.nombre}">
        
        <label class="edit-label">Precio (USD)</label>
        <input id="ePrecio" class="edit-input" value="${p.precio}">
        
        <label class="edit-label">Talla</label>
        <input id="eTalla" class="edit-input" value="${p.talla}">
        
        <label class="edit-label">Color</label>
        <input id="eColor" class="edit-input" value="${p.color}">
      </div>
    `,
    showCancelButton: true,
    confirmButtonText: "GUARDAR CAMBIOS",
    cancelButtonText: "CANCELAR",
  
    customClass: {
      popup: 'premium-modal',
      confirmButton: 'premium-confirm-btn',
      cancelButton: 'premium-cancel-btn',
      title: 'premium-title'
    },
    buttonsStyling: false, 
    preConfirm: () => {
      p.nombre = document.getElementById('eNombre').value;
      p.precio = document.getElementById('ePrecio').value;
      p.talla = document.getElementById('eTalla').value;
      p.color = document.getElementById('eColor').value;
      guardar();
      mostrar();
    }
  });
}


function agregarProducto(){
  const file = imagen.files[0];
  const reader = new FileReader();

  reader.onload = ()=>{
    productos.push({
      nombre: nombre.value,
      precio: precio.value,
      talla: talla.value,
      color: color.value,
      desc: desc.value,
      img: reader.result
    });

    guardar();
    mostrar();
    Swal.fire("Producto agregado","","success");
  };

  if(file) reader.readAsDataURL(file);
}


// ========== VISTA PREVIA DE IMAGEN ==========
function previewImage(){
  const file = imagen.files[0];

  if(file){
    const reader = new FileReader();
    reader.onload = ()=>{
      previewImg.src = reader.result;
    };
    reader.readAsDataURL(file);
  }
}


// ========== PUBLICAR EN TIENDA ==========
function publicarEnTienda() {

  const checksSeleccionados = document.querySelectorAll('.producto input[type="checkbox"]:checked');
  const total = checksSeleccionados.length;

  if (total === 0) {
    Swal.fire({
      title: '¡Atención!',
      text: 'No has seleccionado ningún producto para enviar a la tienda.',
      icon: 'warning',
      confirmButtonColor: '#000'
    });
    return;
  }

  Swal.fire({
    title: '¡Publicación Exitosa!',
    text: `Has enviado ${total} productos al catálogo de clientes de Fashion Style.`,
    icon: 'success',
    confirmButtonColor: '#2ecc71'
  });
}


// ========== INICIALIZACIÓN ==========
window.onload = ()=>{
  mostrar();
  if(imagen) imagen.addEventListener('change', previewImage);
};
