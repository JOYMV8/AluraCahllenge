// URL del servidor local JSON
const API_URL = 'http://localhost:3001/productos';

// Función para obtener productos y renderizarlos en el DOM
function fetchAndDisplayProducts() {
  fetch(API_URL)
    .then((response) => response.json())
    .then((data) => {
      const productsContainer = document.querySelector('.products-container');
      const noProductsMessage = document.querySelector('.no-products-message');

      // Limpiar el contenedor antes de añadir los productos
      productsContainer.innerHTML = '';

      if (data.length === 0) {
        // Mostrar mensaje si no hay productos
        noProductsMessage.style.display = 'block';
      } else {
        // Ocultar mensaje y renderizar productos
        noProductsMessage.style.display = 'none';

        data.forEach((product) => {
          const productCard = document.createElement('div');
          productCard.classList.add('product-card');
          productCard.setAttribute('data-id', product.id);

          productCard.innerHTML = `
            <img src="${product.imagen}" alt="${product.nombre}">
            <h3>${product.nombre}</h3>
            <p>Precio: $${product.precio}</p>
            <button class="delete" data-id="${product.id}">
              <img src="./Imagenes/Basurero.png" alt="Eliminar producto" style="width: 20px;">
            </button>
          `;

          productsContainer.appendChild(productCard);
        });
      }
    })
    .catch((error) => console.error('Error al obtener productos:', error));
}

// Evento para agregar un producto
document.getElementById('product-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const productForm = e.target;

  // Obtener los datos del formulario
  const nombre = productForm.querySelector('input[placeholder="nombre..."]').value;
  const precio = productForm.querySelector('input[placeholder="precio..."]').value;
  const imagen = productForm.querySelector('input[placeholder="imagen..."]').value;

  // Crear un nuevo producto
  const newProduct = { nombre, precio, imagen };

  // Enviar el producto al servidor
  fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newProduct),
  })
    .then(() => {
      fetchAndDisplayProducts();
      productForm.reset();
    })
    .catch((error) => console.error('Error al agregar producto:', error));
});

// Evento delegado para eliminar un producto
document.querySelector('.products-container').addEventListener('click', (e) => {
  const deleteButton = e.target.closest('button.delete'); // Asegúrate de que el clic es en el botón correcto
  if (deleteButton) {
    const productId = deleteButton.getAttribute('data-id'); // Obtén el ID del producto

    fetch(`${API_URL}/${productId}`, {
      method: 'DELETE',
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('No se pudo eliminar el producto');
        }
        return response.json();
      })
      .then(() => fetchAndDisplayProducts())
      .catch((error) => console.error('Error al eliminar producto:', error));
  }
});

// Evento para buscar productos
document.querySelector('.search-input').addEventListener('input', (e) => {
  const searchTerm = e.target.value.toLowerCase();
  document.querySelectorAll('.product-card').forEach((card) => {
    const productName = card.querySelector('h3').textContent.toLowerCase();
    card.style.display = productName.includes(searchTerm) ? 'block' : 'none';
  });
});

// Llamar la función al cargar la página
document.addEventListener('DOMContentLoaded', fetchAndDisplayProducts);
