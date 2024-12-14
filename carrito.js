const cartContainer = document.getElementById("cart-container");
const cartTotal = document.getElementById("cart-total");
const emptyCartButton = document.getElementById("empty-cart");
const checkoutButton = document.getElementById("checkout");

let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

// Muestra los productos en el carrito
function mostrarCarrito() {
    cartContainer.innerHTML = "";

    if (carrito.length === 0) {
        cartContainer.innerHTML = "<p>Tu carrito está vacío. <a href='index.html'>Seguir comprando</a></p>";
        return;
    }

    carrito.forEach(producto => {
        const div = document.createElement("div");
        div.classList.add("cart-item");
        div.innerHTML = `
            <img src="${producto.imagen}" alt="${producto.titulo}" class="cart-item-img">
            <div>
                <h3>${producto.titulo}</h3>
                <p>Precio: $${producto.precio}</p>
                <p>Cantidad: ${producto.cantidad}</p>
                <p>Subtotal: $${(producto.precio * producto.cantidad).toFixed(2)}</p>
            </div>
            <button class="remove-item" data-id="${producto.id}">Eliminar</button>
        `;
        cartContainer.appendChild(div);
    });

    actualizarTotal();

    // Agrega eventos a los botones de eliminar
    agregarEventosEliminar();
}

// Actualiza el total del carrito
function actualizarTotal() {
    const total = carrito.reduce((acc, producto) => acc + producto.precio * producto.cantidad, 0);
    cartTotal.textContent = total.toFixed(2);
}

// Agrega eventos a los botones "Eliminar"
function agregarEventosEliminar() {
    const botonesEliminar = document.querySelectorAll(".remove-item");

    botonesEliminar.forEach(boton => {
        boton.addEventListener("click", (e) => {
            const idProducto = e.target.dataset.id;

            // Filtra el carrito para eliminar el producto seleccionado
            carrito = carrito.filter(producto => producto.id !== idProducto);

            // Actualiza localStorage y mostrar carrito actualizado
            localStorage.setItem("carrito", JSON.stringify(carrito));
            mostrarCarrito();

            // Mostrar notificación con Toastify
            Toastify({
                text: "Producto eliminado del carrito",
                duration: 3000,
                gravity: "top",
                position: "right",
                style: {
                    background: "linear-gradient(to right, #ff5722, #ff9800)",
                    color: "#fff"
                }
            }).showToast();
        });
    });
}

// Vacia carrito
emptyCartButton.addEventListener("click", () => {
    if (carrito.length === 0) {
        Toastify({
            text: "El carrito ya está vacío",
            duration: 3000,
            gravity: "top",
            position: "right",
            style: {
                background: "linear-gradient(to right, #ff5722, #ff9800)",
                color: "#fff"
            }
        }).showToast();
        return;
    }

    carrito = [];
    localStorage.setItem("carrito", JSON.stringify(carrito));
    mostrarCarrito();

    Toastify({
        text: "Carrito vaciado",
        duration: 3000,
        gravity: "top",
        position: "right",
        style: {
            background: "linear-gradient(to right, #ff5722, #ff9800)",
            color: "#fff"
        }
    }).showToast();
});

// Finaliza la compra
checkoutButton.addEventListener("click", () => {
    if (carrito.length === 0) {
        Toastify({
            text: "El carrito está vacío",
            duration: 3000,
            gravity: "top",
            position: "right",
            style: {
                background: "linear-gradient(to right, #ff5722, #ff9800)",
                color: "#fff"
            }
        }).showToast();
        return;
    }

    const resumen = carrito.map(prod => `${prod.cantidad} x ${prod.titulo}`).join('\n');
    const total = carrito.reduce((acc, producto) => acc + producto.precio * producto.cantidad, 0);

    carrito = [];
    localStorage.setItem("carrito", JSON.stringify(carrito));
    mostrarCarrito();

    Toastify({
        text: `¡Gracias por tu compra!\n\nResumen:\n${resumen}\nTotal: $${total.toFixed(2)}`,
        duration: 4000,
        gravity: "top",
        position: "center",
        style: {
            background: "linear-gradient(to right, #4caf50, #8bc34a)",
            color: "#fff"
        }
    }).showToast();
});

// Mostrar el carrito al cargar la página
mostrarCarrito();

