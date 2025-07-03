let editIndex = null;

document.getElementById('productForm').addEventListener('submit', function(e) {
  e.preventDefault();

  const name = document.getElementById('productName').value.trim();
  const price = document.getElementById('productPrice').value.trim();
  const quantity = document.getElementById('productQuantity').value.trim();
  const category = document.getElementById('productCategory').value.trim();

  if (!name || !price || !quantity || !category) {
    showMessage('Preencha todos os campos!', 'error');
    return;
  }

  const product = { name, price, quantity, category };

  if (editIndex !== null) {
    updateProduct(product, editIndex);
  } else {
    saveProduct(product);
  }

  this.reset();
  editIndex = null;
});

function showMessage(msg, type) {
  const messageDiv = document.getElementById('message');
  messageDiv.innerText = msg;
  messageDiv.className = type;
  messageDiv.style.display = 'block';
  setTimeout(() => messageDiv.style.display = 'none', 3000);
}

function addProductToTable(product, index) {
  const table = document.getElementById('productTable').getElementsByTagName('tbody')[0];
  const row = table.insertRow();

  row.insertCell(0).innerText = product.name;
  row.insertCell(1).innerText = product.price;
  row.insertCell(2).innerText = product.quantity;
  row.insertCell(3).innerText = product.category;

  const actionCell = row.insertCell(4);

  const editBtn = document.createElement('button');
  editBtn.innerText = 'Editar';
  editBtn.className = 'edit-btn';
  editBtn.onclick = function() { loadProductToForm(index); };

  const deleteBtn = document.createElement('button');
  deleteBtn.innerText = 'Excluir';
  deleteBtn.className = 'delete-btn';
  deleteBtn.onclick = function() { deleteProduct(index); };

  actionCell.appendChild(editBtn);
  actionCell.appendChild(deleteBtn);
}

function saveProduct(product) {
  let products = JSON.parse(localStorage.getItem('products')) || [];
  products.push(product);
  localStorage.setItem('products', JSON.stringify(products));
  loadProducts();
  showMessage('Produto cadastrado com sucesso!', 'success');
}

function updateProduct(product, index) {
  let products = JSON.parse(localStorage.getItem('products')) || [];
  products[index] = product;
  localStorage.setItem('products', JSON.stringify(products));
  loadProducts();
  showMessage('Produto atualizado com sucesso!', 'success');
}

function deleteProduct(index) {
  let products = JSON.parse(localStorage.getItem('products')) || [];
  products.splice(index, 1);
  localStorage.setItem('products', JSON.stringify(products));
  loadProducts();
  showMessage('Produto excluído com sucesso!', 'success');
}

function loadProductToForm(index) {
  let products = JSON.parse(localStorage.getItem('products')) || [];
  const product = products[index];

  document.getElementById('productName').value = product.name;
  document.getElementById('productPrice').value = product.price;
  document.getElementById('productQuantity').value = product.quantity;
  document.getElementById('productCategory').value = product.category;

  editIndex = index;
}

function loadProducts() {
  const table = document.getElementById('productTable').getElementsByTagName('tbody')[0];
  table.innerHTML = '';
  const products = JSON.parse(localStorage.getItem('products')) || [];
  products.forEach((product, index) => addProductToTable(product, index));
}

document.getElementById('searchInput').addEventListener('input', function() {
  const searchText = this.value.toLowerCase();
  const products = JSON.parse(localStorage.getItem('products')) || [];
  const filtered = products.filter(p => p.name.toLowerCase().includes(searchText));

  const table = document.getElementById('productTable').getElementsByTagName('tbody')[0];
  table.innerHTML = '';
  filtered.forEach((product, index) => addProductToTable(product, index));
});

window.onload = loadProducts;