let productos = [];

// Cargar productos una sola vez
fetch('../Json/productos.json')
    .then(response => response.json())
    .then(data => {
        productos = data;
    })
    .catch(error => console.error('Error cargando el JSON:', error));

function mostrarProducto(id) {
    window.open(`Html/producto.html?id=${id}`, '_self');  
}

const urlParams = new URLSearchParams(window.location.search);
const id = parseInt(urlParams.get('id'));
console.log('ID obtenido:', id);

let currentProduct = null;

if (id) {
    // Reutilizar los datos ya cargados en lugar de volver a fetch
    if (productos.length > 0) {
        const producto = productos.find(p => p.id === id);
        console.log('Producto encontrado:', producto);
        if (producto) {
            currentProduct = producto;
            const imgElement = document.getElementById('imagen-producto');
            const tituloElement = document.getElementById('titulo-producto');
            const nombreElement = document.getElementById('nombre-producto');
            const precioElement = document.getElementById('precio-producto');
            const descElement = document.getElementById('descripcion-producto');
            
            if (imgElement) imgElement.src = '../' + producto.imagen;
            if (tituloElement) tituloElement.textContent = producto.nombre;
            if (nombreElement) nombreElement.textContent = producto.nombre;
            if (precioElement) precioElement.textContent = producto.precio;
            if (descElement) descElement.textContent = producto.descripcion;
        }
    } else {
        // Fallback: cargar si no se ha cargado aún
        fetch('../Json/productos.json')
            .then(response => response.json())
            .then(data => {
                const producto = data.find(p => p.id === id);
                console.log('Producto encontrado:', producto);
                if (producto) {
                    currentProduct = producto;
                    document.getElementById('titulo-producto').textContent = producto.nombre;
                    document.getElementById('imagen-producto').src = '../' + producto.imagen;  
                    document.getElementById('nombre-producto').textContent = producto.nombre;
                    document.getElementById('precio-producto').textContent = producto.precio;
                    document.getElementById('descripcion-producto').textContent = producto.descripcion;
                }
            })
            .catch(error => console.error('Error cargando el JSON:', error));
    }
}

// Lógica para agregar al carrito
document.addEventListener('DOMContentLoaded', () => {
    const addCartBtn = document.querySelector('.btn-add-cart');
    if (addCartBtn) {
        addCartBtn.addEventListener('click', () => {
            if (currentProduct) {
                CartUtils.addItem('fashion_cart', currentProduct);
                alert(`${currentProduct.nombre} ha sido agregado al carrito.`);
            } else {
                alert("Error: Producto no cargado correctamente.");
            }
        });
    }
});

// Delegación para botones "Agregar al carrito" en tarjetas/listados
// Usamos la fase de captura para que funcione aunque el botón haga stopPropagation()
document.addEventListener('click', (e) => {
    const btn = e.target.closest('.add-to-cart');
    if (!btn) return;
    const id = Number(btn.dataset.id);
    const prod = productos.find(p => p.id === id);
    if (prod) {
        CartUtils.addItem('fashion_cart', prod);
        if (window.renderMiniCart) renderMiniCart();
        // Mostrar mini carrito brevemente como feedback
        const mini = document.getElementById('mini-cart');
        if (mini) {
            mini.classList.add('active');
            setTimeout(() => mini.classList.remove('active'), 2000);
        }
        alert(`${prod.nombre} ha sido agregado al carrito.`);
    } else {
        alert('Producto no encontrado.');
    }
}, true);
