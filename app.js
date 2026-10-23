const fallbackProducts = [
  {
    id: 'p1',
    name: 'Printed Everyday Kurti',
    category: 'Women',
    price: 499,
    mrp: 999,
    rating: 4.3,
    image: 'https://images.unsplash.com/photo-1583391733956-6c78276477e3?auto=format&fit=crop&w=800&q=80',
    desc: 'Breathable cotton kurti crafted for day-long comfort and effortless style.'
  },
  {
    id: 'p2',
    name: 'Casual Cotton Shirt',
    category: 'Men',
    price: 399,
    mrp: 799,
    rating: 4.1,
    image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80',
    desc: 'Soft and relaxed-fit shirt that makes everyday layering easy.'
  },
  {
    id: 'p3',
    name: 'Minimal Daily Backpack',
    category: 'Accessories',
    price: 599,
    mrp: 1199,
    rating: 4.4,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80',
    desc: 'Lightweight and practical backpack for work, travel and all-day carry.'
  },
  {
    id: 'p4',
    name: 'Classic Sneakers',
    category: 'Footwear',
    price: 799,
    mrp: 1499,
    rating: 4.2,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
    desc: 'Everyday sneakers with sturdy grips and all-season comfort.'
  },
  {
    id: 'p5',
    name: 'Home Cushion Set',
    category: 'Home',
    price: 349,
    mrp: 699,
    rating: 4.0,
    image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=800&q=80',
    desc: 'Soft, textured cushions designed to instantly brighten your living room.'
  },
  {
    id: 'p6',
    name: "Women's Everyday Tote",
    category: 'Accessories',
    price: 449,
    mrp: 899,
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1590877740965-2e4e2f5f8a4f?auto=format&fit=crop&w=800&q=80',
    desc: 'Roomy tote bag with tidy compartments for commute and errands.'
  },
  {
    id: 'p7',
    name: 'Soft Knit Lounge Set',
    category: 'Women',
    price: 899,
    mrp: 1799,
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80',
    desc: 'Cozy knit essentials made for relaxed evenings and slow mornings.'
  },
  {
    id: 'p8',
    name: 'Minimal Desk Lamp',
    category: 'Home',
    price: 549,
    mrp: 1099,
    rating: 4.3,
    image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80',
    desc: 'A sleek desk lamp for focused work and calming evening ambience.'
  }
];

const state = {
  query: '',
  category: 'All',
  cart: []
};

const productGrid = document.getElementById('productGrid');
const searchInput = document.getElementById('searchInput');
const categoryFilter = document.getElementById('categoryFilter');
const cartCount = document.getElementById('cartCount');
const cartPanel = document.getElementById('cartPanel');
const backdrop = document.getElementById('backdrop');
const cartItems = document.getElementById('cartItems');
const cartSubtotal = document.getElementById('cartSubtotal');
const checkoutForm = document.getElementById('checkoutForm');
const toast = document.getElementById('toast');

function money(value) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value);
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove('show'), 2200);
}

function openCart() {
  cartPanel.classList.add('open');
  backdrop.classList.add('visible');
}

function closeCart() {
  cartPanel.classList.remove('open');
  backdrop.classList.remove('visible');
}

function addToCart(productId) {
  const item = state.cart.find((entry) => entry.id === productId);
  if (item) {
    item.qty += 1;
  } else {
    state.cart.push({ id: productId, qty: 1 });
  }
  renderCart();
  showToast('Added to cart');
}

function updateQty(productId, delta) {
  const item = state.cart.find((entry) => entry.id === productId);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) {
    state.cart = state.cart.filter((entry) => entry.id !== productId);
  }
  renderCart();
}

function removeItem(productId) {
  state.cart = state.cart.filter((entry) => entry.id !== productId);
  renderCart();
}

function getProductById(productId) {
  return [...fallbackProducts].find((product) => product.id === productId) || null;
}

function renderCart() {
  let subtotal = 0;

  if (!state.cart.length) {
    cartItems.innerHTML = '<div class="empty-state">Your cart is empty. Add a few favorites to get started.</div>';
  } else {
    cartItems.innerHTML = state.cart
      .map((entry) => {
        const product = getProductById(entry.id);
        if (!product) return '';
        subtotal += product.price * entry.qty;
        return `
          <article class="cart-item">
            <img src="${product.image}" alt="${product.name}" />
            <div>
              <h4>${product.name}</h4>
              <div class="meta">${money(product.price)} each</div>
              <div class="qty-row">
                <button type="button" class="qty-btn" data-action="decrease" data-id="${product.id}" aria-label="Decrease quantity">−</button>
                <span class="qty-value">${entry.qty}</span>
                <button type="button" class="qty-btn" data-action="increase" data-id="${product.id}" aria-label="Increase quantity">+</button>
              </div>
            </div>
            <div class="price-box">
              <strong>${money(product.price * entry.qty)}</strong>
              <button type="button" class="remove-item" data-id="${product.id}">Remove</button>
            </div>
          </article>
        `;
      })
      .join('');
  }

  cartCount.textContent = state.cart.reduce((total, entry) => total + entry.qty, 0);
  cartSubtotal.textContent = money(subtotal);
}

function renderProducts() {
  const list = fallbackProducts.filter((product) => {
    const matchesCategory = state.category === 'All' || product.category === state.category;
    const text = `${product.name} ${product.category}`.toLowerCase();
    const matchesQuery = !state.query || text.includes(state.query.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  if (!list.length) {
    productGrid.innerHTML = '<div class="empty-state">No products match your filters. Try another search.</div>';
    return;
  }

  productGrid.innerHTML = list
    .map(
      (product) => `
      <article class="product-card">
        <div class="product-image-wrap">
          <img src="${product.image}" alt="${product.name}" />
          <span class="tag">${Math.round((1 - product.price / product.mrp) * 100)}% OFF</span>
        </div>
        <div class="product-body">
          <div class="product-meta">
            <span>${product.category}</span>
            <span class="rating">★ ${product.rating}</span>
          </div>
          <h3 class="product-name">${product.name}</h3>
          <div class="product-price-row">
            <span class="price">${money(product.price)}</span>
            <span class="mrp">${money(product.mrp)}</span>
            <span class="offer">Deal</span>
          </div>
          <div class="product-actions">
            <button class="secondary-btn small" type="button" data-detail="${product.id}">View</button>
            <button class="primary-btn small" type="button" data-add="${product.id}">Add to cart</button>
          </div>
        </div>
      </article>
    `
    )
    .join('');
}

searchInput.addEventListener('input', (event) => {
  state.query = event.target.value.trim();
  renderProducts();
});

categoryFilter.addEventListener('click', (event) => {
  const button = event.target.closest('[data-category]');
  if (!button) return;
  state.category = button.dataset.category;
  categoryFilter.querySelectorAll('.chip').forEach((chip) => chip.classList.toggle('active', chip === button));
  renderProducts();
});

productGrid.addEventListener('click', (event) => {
  const addButton = event.target.closest('[data-add]');
  if (addButton) {
    addToCart(addButton.dataset.add);
    return;
  }

  const detailButton = event.target.closest('[data-detail]');
  if (detailButton) {
    const product = fallbackProducts.find((item) => item.id === detailButton.dataset.detail);
    if (product) {
      showToast(`${product.name} — ${money(product.price)}`);
    }
  }
});

cartItems.addEventListener('click', (event) => {
  const button = event.target.closest('[data-action]');
  if (button) {
    const productId = button.dataset.id;
    const action = button.dataset.action;
    updateQty(productId, action === 'increase' ? 1 : -1);
    return;
  }

  const removeButton = event.target.closest('.remove-item');
  if (removeButton) {
    removeItem(removeButton.dataset.id);
  }
});

document.getElementById('cartToggle').addEventListener('click', openCart);
document.getElementById('closeCart').addEventListener('click', closeCart);
document.getElementById('backdrop').addEventListener('click', closeCart);

checkoutForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  if (!state.cart.length) {
    showToast('Your cart is empty');
    return;
  }

  const formData = new FormData(checkoutForm);
  const payload = {
    customer: formData.get('customer'),
    phone: formData.get('phone'),
    address: formData.get('address'),
    items: state.cart.map(({ id, qty }) => ({ productId: id, quantity: qty }))
  };

  try {
    const response = await fetch('http://localhost:4000/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (response.ok) {
      showToast('Order placed successfully');
      state.cart = [];
      checkoutForm.reset();
      renderCart();
      closeCart();
      return;
    }

    const error = await response.json().catch(() => ({ error: 'Unable to place order' }));
    showToast(error.error || 'Unable to place order');
  } catch (error) {
    showToast('Demo mode: order saved locally');
    state.cart = [];
    checkoutForm.reset();
    renderCart();
    closeCart();
  }
});

renderProducts();
renderCart();
