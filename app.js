// DOM
const productContainer = document.getElementById("product-container");
const mainTitle = document.getElementById("main-title");
const categoryButtons = document.querySelectorAll(".nav-button");
const cartCount = document.getElementById("cart-count");

// Variables para el carrito
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
let productos = [];

// Obtener productos desde el JSON
async function obtenerProductos() {
    try {
        const respuesta = await fetch('./productos.json');
        productos = await respuesta.json();
        mostrarProductos(productos);
    } catch (error) {
        console.error("Error al cargar los productos:", error);
    }
}

// Muestra productos en la página
function mostrarProductos(productosAMostrar) {
    productContainer.innerHTML = "";
    productosAMostrar.forEach(producto => {
        const div = document.createElement("div");
        div.classList.add("product-card");
        div.innerHTML = `
            <img src="${producto.imagen}" alt="${producto.titulo}" class="product-image">
            <h3>${producto.titulo}</h3>
            <p>$${producto.precio}</p>
            <button data-id="${producto.id}" class="add-to-cart">Agregar al carrito</button>
        `;
        productContainer.appendChild(div);
    });
}

// Filtra productos por categoría
categoryButtons.forEach(button => {
    button.addEventListener("click", () => {
        const categoria = button.id;
        if (categoria === "todos") {
            mainTitle.textContent = "Todos los productos";
            mostrarProductos(productos);
        } else {
            mainTitle.textContent = button.textContent;
            const productosFiltrados = productos.filter(prod => prod.categoria === categoria);
            mostrarProductos(productosFiltrados);
        }
    });
});

// Agrega un producto al carrito
function agregarAlCarrito(idProducto) {
    const productoExistente = carrito.find(prod => prod.id === idProducto);

    if (productoExistente) {
        productoExistente.cantidad += 1;
    } else {
        const producto = productos.find(prod => prod.id === idProducto);
        carrito.push({ ...producto, cantidad: 1 });
    }

    localStorage.setItem("carrito", JSON.stringify(carrito));
    actualizarContadorCarrito();

    // Agrega Tostifay 
    const productoAgregado = productos.find(prod => prod.id === idProducto);
    Toastify({
        text: `Producto "${productoAgregado.titulo}" agregado al carrito`,
        duration: 3000,
        gravity: "top",
        position: "right",
        stopOnFocus: true,
        style: {
            background: "linear-gradient(to right, #4caf50, #8bc34a)",
            color: "#fff"
        }
    }).showToast();
}

// Actualiza el contador del carrito
function actualizarContadorCarrito() {
    const totalProductos = carrito.reduce((total, prod) => total + prod.cantidad, 0);
    cartCount.textContent = totalProductos;
}

// Uso Event listener para el carrito
document.addEventListener("click", (e) => {
    if (e.target.classList.contains("add-to-cart")) {
        const idProducto = e.target.dataset.id;
        agregarAlCarrito(idProducto);
    }
});

// Se inicializa
obtenerProductos();
actualizarContadorCarrito();

