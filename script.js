document.addEventListener('DOMContentLoaded', () => {
    // Funciones DOM y Fetch API
    fetchProductos();
    setupCarrito();
    cargarCarritoDesdeLocalStorage();
    setupCarousel();
    setupProductosDropdown();
});

function fetchProductos() {
    fetch('./productos.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const productosContainer = document.querySelector('.productos-container');
            const productosDropdown = document.querySelector('.productos-dropdown');
            data.forEach(producto => {
                const card = document.createElement('div');
                card.classList.add('card');
                card.innerHTML = `
                    <img src="${producto.imagen}" alt="${producto.nombre}">
                    <h3>${producto.nombre}</h3>
                    <p>Precio: ${producto.precio}</p>
                    <button onclick="añadirAlCarrito('${producto.nombre}', ${producto.precio.replace('$', '')}, '${producto.imagen}')">Añadir al Carrito</button>
                `;
                productosContainer.appendChild(card);

                const dropdownItem = document.createElement('a');
                dropdownItem.href = '#productos';
                dropdownItem.innerHTML = `
                    <img src="${producto.imagen}" alt="${producto.nombre}">
                    ${producto.nombre}
                `;
                productosDropdown.appendChild(dropdownItem);
            });
        })
        .catch(error => console.error('Error fetching productos:', error));
}

let carrito = [];

function añadirAlCarrito(nombre, precio, imagen) {
    const productoExistente = carrito.find(producto => producto.nombre === nombre);
    if (productoExistente) {
        productoExistente.cantidad++;
    } else {
        carrito.push({ nombre, precio: parseFloat(precio), cantidad: 1, imagen });
    }
    actualizarCarrito();
}

function removerDelCarrito(nombre) {
    carrito = carrito.filter(producto => producto.nombre !== nombre);
    actualizarCarrito();
}

function modificarCantidad(nombre, cantidad) {
    const producto = carrito.find(producto => producto.nombre === nombre);
    if (producto) {
        producto.cantidad = parseInt(cantidad);
        if (producto.cantidad <= 0) {
            removerDelCarrito(nombre);
        } else {
            actualizarCarrito();
        }
    }
}

function actualizarCarrito() {
    const carritoLista = document.getElementById('carrito-lista');
    const carritoTotal = document.getElementById('carrito-total');
    const carritoCantidad = document.getElementById('carrito-cantidad');
    carritoLista.innerHTML = '';
    let total = 0;
    let cantidadTotal = 0;
    carrito.forEach(producto => {
        const li = document.createElement('li');
        li.innerHTML = `
            ${producto.nombre} - $${producto.precio} x ${producto.cantidad}
            <button onclick="removerDelCarrito('${producto.nombre}')">Remover</button>
            <input type="number" value="${producto.cantidad}" min="1" onchange="modificarCantidad('${producto.nombre}', this.value)">
        `;
        carritoLista.appendChild(li);
        total += producto.precio * producto.cantidad;
        cantidadTotal += producto.cantidad;
    });
    carritoTotal.textContent = total.toFixed(2);
    carritoCantidad.textContent = cantidadTotal;
    guardarCarritoEnLocalStorage();
}

function setupCarrito() {
    document.getElementById('carrito-icono').addEventListener('click', (event) => {
        event.preventDefault();
        const carritoSection = document.getElementById('carrito');
        carritoSection.style.display = carritoSection.style.display === 'none' ? 'block' : 'none';
    });

    document.getElementById('finalizar-compra').addEventListener('click', () => {
        mostrarDetalleCompra();
    });

    document.getElementById('form-compra').addEventListener('submit', (event) => {
        event.preventDefault();
        alert('Información enviada. Gracias por su compra!');
        carrito = [];
        actualizarCarrito();
        document.getElementById('detalle-compra').style.display = 'none';
    });
}

function mostrarDetalleCompra() {
    const detalleCompraLista = document.getElementById('detalle-compra-lista');
    const detalleCompraTotal = document.getElementById('detalle-compra-total');
    detalleCompraLista.innerHTML = '';
    let total = 0;
    carrito.forEach(producto => {
        const li = document.createElement('li');
        li.innerHTML = `
            <img src="${producto.imagen}" alt="${producto.nombre}" width="50">
            ${producto.nombre} - $${producto.precio} x ${producto.cantidad}
        `;
        detalleCompraLista.appendChild(li);
        total += producto.precio * producto.cantidad;
    });
    detalleCompraTotal.textContent = total.toFixed(2);
    document.getElementById('detalle-compra').style.display = 'block';
}

function guardarCarritoEnLocalStorage() {
    localStorage.setItem('carrito', JSON.stringify(carrito));
}

function cargarCarritoDesdeLocalStorage() {
    const carritoGuardado = localStorage.getItem('carrito');
    if (carritoGuardado) {
        carrito = JSON.parse(carritoGuardado);
        actualizarCarrito();
    }
}

function setupCarousel() {
    const carousel = document.querySelector('.carousel-inner');
    const items = document.querySelectorAll('.carousel-item');
    let currentIndex = 0;

    function showNextItem() {
        items[currentIndex].classList.remove('active');
        currentIndex = (currentIndex + 1) % items.length;
        items[currentIndex].classList.add('active');
        carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
    }

    document.querySelector('.carousel-control-next').addEventListener('click', showNextItem);

    document.querySelector('.carousel-control-prev').addEventListener('click', () => {
        items[currentIndex].classList.remove('active');
        currentIndex = (currentIndex - 1 + items.length) % items.length;
        items[currentIndex].classList.add('active');
        carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
    });

    setInterval(showNextItem, 3000); // Cambiar de imagen cada 3 segundos
}

function abrirChat() {
    window.open('https://wa.me/1134670429', '_blank');
}

function setupProductosDropdown() {
    const productosLink = document.querySelector('.productos-link');
    const productosDropdown = document.querySelector('.productos-dropdown');

    productosLink.addEventListener('mouseover', () => {
        productosDropdown.style.display = 'block';
    });

    productosLink.addEventListener('mouseout', () => {
        productosDropdown.style.display = 'none';
    });

    productosDropdown.addEventListener('mouseover', () => {
        productosDropdown.style.display = 'block';
    });

    productosDropdown.addEventListener('mouseout', () => {
        productosDropdown.style.display = 'none';
    });
}
