function cargarProductos() {
  let productos = JSON.parse(localStorage.getItem("productos"));

  if (!productos) {
    return fetch('../Json/productos.json')
      .then(r => r.json())
      .then(data => {
        localStorage.setItem("productos", JSON.stringify(data));
        return data;
      });
  } else {
    return Promise.resolve(productos);
  }
}