const socket = io();

let productsArray = [];

document.addEventListener("DOMContentLoaded", () => {
  if (window.location.pathname.endsWith("/realtimeproducts")) {
    socket.emit("getProducts");
    console.log("Cliente conectado al servidor")

    socket.on("all-products", (products) => {
      productsArray = products;
      renderProducts(products);
    });
  }
});
const renderProducts = (products) => {
  const productsContainer = document.getElementById("productos");
  productsContainer.innerHTML = "";

  products.forEach((product) => {
    const productCard = document.createElement("div");
    productCard.id = product._id;
    productCard.className = "col-md-3 mb-3"; // Utiliza col-md-3 para limitar el ancho

    // Verifica si la propiedad thumbnail es null y asigna una imagen por defecto
    const thumbnailSrc = product.thumbnail ? product.thumbnail : "https://upload.wikimedia.org/wikipedia/commons/a/a3/Image-not-found.png";

    productCard.innerHTML = `
      <div class="card">
        <img src="${thumbnailSrc}" alt="${product.title}" class="card-img-top" width="250" height="250">
        <div class="card-body">
          <h5 class="card-title">${product.title}</h5>
          <p class="card-text">${product.description}</p>
          <p class="card-text"><small class="text-muted">Stock: ${product.stock}</small></p>
          <h2 class="text-gray-200 font-semibold text-3xl mt-2 text-center">
            <span class="gradient-text">$${product.price}</span>
          </h2>
          <div class="w-full h-[1px] bg-gray-500 my-4"></div>
          <button class="btn btn-dark w-full mb-2">Comprar</button>
          <button class="btn btn-danger w-full" onclick="deleteProduct('${product._id}')">Eliminar</button>
        </div>
      </div>
    `;

    productsContainer.appendChild(productCard);
  });
};


// Assuming you have Bootstrap and jQuery included in your project

function showForm() {
  // Create the modal HTML dynamically
  const modalHTML = `
    <div class="modal fade" id="addProductModal" tabindex="-1" role="dialog" aria-labelledby="addProductModalLabel" aria-hidden="true">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="addProductModalLabel">Agregar Producto</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
          <form onsubmit="return addProduct()">
          <div class="form-group">
            <label for="title">Título:</label>
            <input type="text" class="form-control" id="title" name="title" required>
          </div>
          <div class="form-group">
            <label for="description">Descripción:</label>
            <textarea class="form-control" id="description" name="description" rows="3" required></textarea>
          </div>
          <div class="form-group">
            <label for="price">Precio:</label>
            <input type="number" class="form-control" id="price" name="price" step="0.01" required>
          </div>
          <div class="form-group">
            <label for="thumbnail">URL de la Imagen (Thumbnail):</label>
            <input type="url" class="form-control" id="thumbnail" name="thumbnail" >
          </div>
          <div class="form-group">
            <label for="code">Código:</label>
            <input type="text" class="form-control" id="code" name="code" required>
          </div>
          <div class="form-group">
            <label for="stock">Stock:</label>
            <input type="number" class="form-control" id="stock" name="stock" required>
          </div>
          <div class="form-group">
            <label for="status">Estado:</label>
            <select class="form-control" id="status" name="status" required>
              <option value="active">Activo</option>
              <option value="inactive">Inactivo</option>
            </select>
          </div>
          <div class="form-group">
            <label for="category">Categoría:</label>
            <input type="text" class="form-control" id="category" name="category" required>
          </div>
          <div class="mt-3">
            <button type="submit" class="btn btn-primary">Agregar Producto</button>
          </div>
          
        </form> 
          </div>
        </div>
      </div>
    </div>
  `;

  // Append the modal HTML to the body
  const modalWrapper = document.createElement('div');
  modalWrapper.innerHTML = modalHTML;
  document.body.appendChild(modalWrapper);

  // Show the modal using jQuery
  $('#addProductModal').modal('show');
}

const addProduct = () => {
  const product = {
    title : document.getElementById('title').value,
    description : document.getElementById('description').value,
    price : document.getElementById('price').value,
    thumbnail : document.getElementById('thumbnail').value,
    code : document.getElementById('code').value,
    stock : document.getElementById('stock').value,
    status : document.getElementById('status').value,
    category : document.getElementById('category').value
  }
  socket.emit('new-product', product)
  Swal.fire({
    text: "Se agrego el producto correctamente!",
    icon: "success", 
    showConfirmButton: true,
  }).then(() => {
    document.getElementById('title').value = '';
    document.getElementById('description').value = '';
    document.getElementById('price').value = '';
    document.getElementById('thumbnail').value = '';
    document.getElementById('code').value = '';
    document.getElementById('stock').value = '';
    document.getElementById('status').value = '';
    document.getElementById('category').value = '';
    $('#addProductModal').modal('hide');
  })
  return false;
}

socket.on("productsData", (products) => {
  productsArray = products
  renderProducts(products);
});

const deleteProduct = (productId) => {
  Swal.fire({
    text: "Se eliminó el producto correctamente!",
    icon: "error",
    showConfirmButton: true,
  });

  socket.emit("deleteProduct", productId);
}

socket.on("productDeleted", (productId) => {
  const deletedProductBox = document.getElementById(productId);

  if (deletedProductBox) {
    deletedProductBox.remove();
  } else {
    console.error("No se encontró el producto para eliminar eliminar");
  }
});