const products = [
  {
    id: "rice-bag",
    title: "Premium Rice",
    category: "grains",
    description: "5kg long-grain rice, soft texture and rich taste.",
    price: 12.99,
    image: createGroceryImage("Premium Rice", "Grains", "#f6edd5", "#d7be89")
  },
  {
    id: "tomatoes",
    title: "Fresh Tomatoes",
    category: "vegetables",
    description: "Juicy red tomatoes picked from local farms.",
    price: 2.49,
    image: createGroceryImage("Fresh Tomatoes", "Vegetables", "#fde3df", "#ee8f85")
  },
  {
    id: "milk-pack",
    title: "Farm Milk",
    category: "dairy",
    description: "1L full-cream milk, chilled and delivered fresh.",
    price: 1.99,
    image: createGroceryImage("Farm Milk", "Dairy", "#e5efff", "#9ab8ef")
  },
  {
    id: "fruit-basket",
    title: "Fruit Basket",
    category: "fruits",
    description: "Seasonal fruits for healthy snacking at home.",
    price: 8.75,
    image: createGroceryImage("Fruit Basket", "Fruits", "#fff1d8", "#f0bf6f")
  },
  {
    id: "wheat-flour",
    title: "Whole Wheat Flour",
    category: "grains",
    description: "Stone-ground atta, perfect for soft chapatis.",
    price: 3.25,
    image: createGroceryImage("Whole Wheat Flour", "Grains", "#f8ecd6", "#debd85")
  },
  {
    id: "brown-rice",
    title: "Brown Rice",
    category: "grains",
    description: "Nutritious fiber-rich rice for healthy meals.",
    price: 4.6,
    image: createGroceryImage("Brown Rice", "Grains", "#efe5d7", "#c6a77c")
  },
  {
    id: "potatoes",
    title: "Fresh Potatoes",
    category: "vegetables",
    description: "Farm-fresh potatoes ideal for curries and fries.",
    price: 1.85,
    image: createGroceryImage("Fresh Potatoes", "Vegetables", "#f6e9ce", "#d7b57f")
  },
  {
    id: "onions",
    title: "Red Onions",
    category: "vegetables",
    description: "Crisp and pungent onions for everyday cooking.",
    price: 1.7,
    image: createGroceryImage("Red Onions", "Vegetables", "#f4e2ee", "#ce90ba")
  },
  {
    id: "carrots",
    title: "Crunchy Carrots",
    category: "vegetables",
    description: "Sweet carrots packed with vitamins and flavor.",
    price: 2.1,
    image: createGroceryImage("Crunchy Carrots", "Vegetables", "#ffe8d8", "#f39b62")
  },
  {
    id: "curd",
    title: "Natural Curd",
    category: "dairy",
    description: "Thick homemade-style curd for every meal.",
    price: 1.5,
    image: createGroceryImage("Natural Curd", "Dairy", "#edf4ff", "#a4bde9")
  },
  {
    id: "paneer",
    title: "Fresh Paneer",
    category: "dairy",
    description: "Soft cottage cheese cubes for rich dishes.",
    price: 3.95,
    image: createGroceryImage("Fresh Paneer", "Dairy", "#fef8e5", "#efd08c")
  },
  {
    id: "butter",
    title: "Creamy Butter",
    category: "dairy",
    description: "Salted table butter for toast and cooking.",
    price: 2.8,
    image: createGroceryImage("Creamy Butter", "Dairy", "#fff7dc", "#f1cf72")
  },
  {
    id: "bananas",
    title: "Bananas",
    category: "fruits",
    description: "Naturally sweet bananas, great for quick energy.",
    price: 1.2,
    image: createGroceryImage("Bananas", "Fruits", "#fff4cf", "#edd06e")
  },
  {
    id: "apples",
    title: "Red Apples",
    category: "fruits",
    description: "Juicy apples selected for freshness and crunch.",
    price: 3.4,
    image: createGroceryImage("Red Apples", "Fruits", "#ffe3de", "#e78d80")
  }
];

const cart = new Map();
let catalogSearchTerm = "";
let catalogFilterValue = "all";
const CATALOG_ITEMS_PER_PAGE = 8;
let catalogCurrentPage = 1;
const ADMIN_CATALOG_ITEMS_PER_PAGE = 8;
const USER_TABLE_ITEMS_PER_PAGE = 6;
const shownQtyControls = new Set();
let isLoggedIn = false;

function formatCurrency(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
}

function imageFallback(title = "Product") {
  const safeTitle = encodeURIComponent(title);
  return `https://placehold.co/800x600/e8f4ef/165d46?text=${safeTitle}`;
}

function createGroceryImage(title, subtitle, colorStart, colorEnd) {
  void colorStart;
  void colorEnd;
  void subtitle;
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return `assets/products/photos/${slug}.jpg`;
}

function setupProfileDropdown() {
  const profileBtn = document.getElementById("profileBtn");
  const profileDropdown = document.getElementById("profileDropdown");

  if (!profileBtn || !profileDropdown) return;

  profileBtn.addEventListener("click", () => {
    const isOpen = profileDropdown.classList.toggle("show");
    profileBtn.setAttribute("aria-expanded", String(isOpen));
  });

  document.addEventListener("click", (event) => {
    const menu = document.getElementById("profileMenu");
    if (!menu.contains(event.target)) {
      profileDropdown.classList.remove("show");
      profileBtn.setAttribute("aria-expanded", "false");
    }
  });
}

function closeProfileDropdown() {
  const profileBtn = document.getElementById("profileBtn");
  const profileDropdown = document.getElementById("profileDropdown");
  if (!profileBtn || !profileDropdown) return;
  profileDropdown.classList.remove("show");
  profileBtn.setAttribute("aria-expanded", "false");
}

function setLoggedInState(value) {
  isLoggedIn = value;
  applyAuthStateToNav();
}

function applyAuthStateToNav() {
  const dashboardLink = document.getElementById("dashboardLink");
  const ordersLink = document.getElementById("ordersLink");
  const signinLink = document.getElementById("signinLink");
  const logoutLink = document.getElementById("logoutLink");

  if (dashboardLink) dashboardLink.hidden = !isLoggedIn;
  if (ordersLink) ordersLink.hidden = !isLoggedIn;
  if (signinLink) signinLink.hidden = isLoggedIn;
  if (logoutLink) logoutLink.hidden = !isLoggedIn;
}

function setupAuthUi() {
  isLoggedIn = false;
  applyAuthStateToNav();

  const signinLink = document.getElementById("signinLink");
  const logoutLink = document.getElementById("logoutLink");
  const signinModal = document.getElementById("signinModal");
  const closeSigninModal = document.getElementById("closeSigninModal");
  const googleLoginBtn = document.getElementById("googleLoginBtn");

  if (!signinLink || !logoutLink || !signinModal || !closeSigninModal || !googleLoginBtn) return;

  signinModal.hidden = true;

  const openModal = () => {
    signinModal.hidden = false;
  };

  const closeModal = () => {
    signinModal.hidden = true;
  };

  signinLink.addEventListener("click", (event) => {
    event.preventDefault();
    closeProfileDropdown();
    openModal();
  });

  logoutLink.addEventListener("click", (event) => {
    event.preventDefault();
    setLoggedInState(false);
    closeProfileDropdown();
  });

  closeSigninModal.addEventListener("click", closeModal);

  signinModal.addEventListener("click", (event) => {
    if (event.target === signinModal) closeModal();
  });

  const signinModalCard = signinModal.querySelector(".signin-modal");
  if (signinModalCard) {
    signinModalCard.addEventListener("click", (event) => {
      event.stopPropagation();
    });
  }

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !signinModal.hidden) closeModal();
  });

  googleLoginBtn.addEventListener("click", () => {
    setLoggedInState(true);
    closeModal();
  });
}

function getFilteredProducts() {
  const query = catalogSearchTerm.trim().toLowerCase();
  return products.filter((product) => {
    const matchesSearch = !query || product.title.toLowerCase().includes(query);
    const matchesFilter = catalogFilterValue === "all" || product.category === catalogFilterValue;
    return matchesSearch && matchesFilter;
  });
}

function renderProducts() {
  const productGrid = document.getElementById("productGrid");
  const catalogPagination = document.getElementById("catalogPagination");
  if (!productGrid) return;

  const visibleProducts = getFilteredProducts();
  const totalPages = Math.max(1, Math.ceil(visibleProducts.length / CATALOG_ITEMS_PER_PAGE));
  catalogCurrentPage = Math.min(catalogCurrentPage, totalPages);

  const pageStart = (catalogCurrentPage - 1) * CATALOG_ITEMS_PER_PAGE;
  const pageItems = visibleProducts.slice(pageStart, pageStart + CATALOG_ITEMS_PER_PAGE);

  if (visibleProducts.length === 0) {
    productGrid.innerHTML = '<p class="cart-empty">No products found for your search.</p>';
    if (catalogPagination) catalogPagination.innerHTML = "";
    return;
  }

  productGrid.innerHTML = pageItems.map((product) => {
    const qty = cart.get(product.id)?.quantity ?? 0;
    const isShown = shownQtyControls.has(product.id);
    return `
      <article class="product-card">
        <img src="${product.image}" alt="${product.title}" loading="lazy" onerror="this.onerror=null;this.src='${imageFallback("Image Unavailable")}';" />
        <div class="product-content">
          <h3>${product.title}</h3>
          <p>${product.description}</p>
          <div class="price-row">
            <span class="price">${formatCurrency(product.price)}</span>
          </div>
          <div class="card-actions">
            <div class="qty-controls" id="qty-controls-${product.id}" ${isShown ? "" : "hidden"}>
              <button class="qty-step-btn" data-step="down" data-id="${product.id}" type="button" aria-label="Decrease quantity">-</button>
              <input
                class="qty-input"
                type="number"
                min="1"
                value="${Math.max(1, qty)}"
                id="input-${product.id}"
                aria-label="Enter quantity for ${product.title}"
                readonly
              />
              <button class="qty-step-btn" data-step="up" data-id="${product.id}" type="button" aria-label="Increase quantity">+</button>
            </div>
            <button class="add-btn" data-add="${product.id}" type="button" ${isShown ? "hidden" : ""}>Add to Cart</button>
          </div>
        </div>
      </article>
    `;
  }).join("");

  productGrid.onclick = (event) => {
    const addId = event.target.dataset.add;
    const step = event.target.dataset.step;
    const stepId = event.target.dataset.id;

    if (step && stepId) {
      const existing = cart.get(stepId);
      const currentQty = existing?.quantity ?? 0;
      const nextQty = step === "up" ? currentQty + 1 : Math.max(0, currentQty - 1);

      if (nextQty === 0) {
        cart.delete(stepId);
        shownQtyControls.delete(stepId);
      } else if (existing) {
        existing.quantity = nextQty;
      } else {
        const product = products.find((item) => item.id === stepId);
        if (!product) return;
        cart.set(stepId, { ...product, quantity: nextQty });
      }

      persistCart();
      renderCart();
      renderProducts();
      return;
    }

    if (addId) {
      shownQtyControls.add(addId);
      addToCart(addId, 1);
      renderProducts();
    }
  };

  if (!catalogPagination) return;

  if (totalPages <= 1) {
    catalogPagination.innerHTML = "";
    return;
  }

  catalogPagination.innerHTML = `
    <button class="page-btn" type="button" id="pagePrev" ${catalogCurrentPage === 1 ? "disabled" : ""}>Prev</button>
    <span class="page-indicator">Page ${catalogCurrentPage} / ${totalPages}</span>
    <button class="page-btn" type="button" id="pageNext" ${catalogCurrentPage === totalPages ? "disabled" : ""}>Next</button>
  `;

  const prevBtn = document.getElementById("pagePrev");
  const nextBtn = document.getElementById("pageNext");

  if (prevBtn) {
    prevBtn.onclick = () => {
      catalogCurrentPage = Math.max(1, catalogCurrentPage - 1);
      renderProducts();
    };
  }

  if (nextBtn) {
    nextBtn.onclick = () => {
      catalogCurrentPage = Math.min(totalPages, catalogCurrentPage + 1);
      renderProducts();
    };
  }
}

function setupCatalogSearch() {
  const searchInput = document.getElementById("catalogSearch");
  if (!searchInput) return;

  searchInput.addEventListener("input", (event) => {
    catalogSearchTerm = event.target.value;
    catalogCurrentPage = 1;
    renderProducts();
  });
}

function setupCatalogFilter() {
  const filterInput = document.getElementById("catalogFilter");
  if (!filterInput) return;

  filterInput.addEventListener("change", (event) => {
    catalogFilterValue = event.target.value;
    catalogCurrentPage = 1;
    renderProducts();
  });
}

function addToCart(id, quantity = 1) {
  const product = products.find((item) => item.id === id);
  if (!product) return;

  const existing = cart.get(id);
  if (!existing) {
    cart.set(id, { ...product, quantity });
  } else {
    existing.quantity += quantity;
  }

  updateQtyBadge(id);
  renderCart();
  persistCart();
}

function updateQtyBadge(id) {
  void id;
}

function renderCart() {
  const cartList = document.getElementById("cartList");
  const cartTotal = document.getElementById("cartTotal");
  const floatingBar = document.getElementById("floatingCartBar");
  const floatingItemCount = document.getElementById("floatingItemCount");
  const floatingCartTotal = document.getElementById("floatingCartTotal");

  const cartItems = Array.from(cart.values());
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  let total = 0;
  cartItems.forEach((item) => {
    total += item.price * item.quantity;
  });

  if (floatingBar && floatingItemCount && floatingCartTotal) {
    floatingItemCount.textContent = `${totalItems} item${totalItems === 1 ? "" : "s"}`;
    floatingCartTotal.textContent = formatCurrency(total);
    floatingBar.classList.toggle("show", totalItems > 0);
  }

  if (!cartList || !cartTotal) return;

  if (cartItems.length === 0) {
    cartList.innerHTML = '<p class="cart-empty">Your cart is empty. Start adding groceries.</p>';
    cartTotal.textContent = formatCurrency(0);
    return;
  }

  cartList.innerHTML = cartItems.map((item) => {
    const latestProduct = products.find((product) => product.id === item.id);
    const imageSrc = latestProduct?.image ?? item.image;
    const itemTotal = item.price * item.quantity;

    return `
      <div class="cart-item">
        <div class="cart-item-layout">
          <img class="cart-item-image" src="${imageSrc}" alt="${item.title}" loading="lazy" onerror="this.onerror=null;this.src='${imageFallback("Image Unavailable")}';" />
          <div class="cart-item-main">
            <div class="cart-item-row">
              <strong>${item.title}</strong>
              <strong>${formatCurrency(itemTotal)}</strong>
            </div>
            <div class="cart-meta">${formatCurrency(item.price)} each · Qty: ${item.quantity}</div>
          </div>
          <div class="cart-actions">
            <button class="cart-step-btn" data-cart-step="up" data-id="${item.id}" type="button" aria-label="Increase ${item.title}">+</button>
            <button class="cart-step-btn" data-cart-step="down" data-id="${item.id}" type="button" aria-label="Decrease ${item.title}">-</button>
            <button class="cart-delete-btn" data-cart-delete="${item.id}" type="button" aria-label="Remove ${item.title}">🗑</button>
          </div>
        </div>
      </div>
    `;
  }).join("");

  cartTotal.textContent = formatCurrency(total);

  cartList.onclick = (event) => {
    const cartStep = event.target.dataset.cartStep;
    const cartStepId = event.target.dataset.id;
    const cartDeleteId = event.target.dataset.cartDelete;

    if (cartStep && cartStepId) {
      const existing = cart.get(cartStepId);
      if (!existing) return;

      if (cartStep === "up") {
        existing.quantity += 1;
      } else {
        existing.quantity = Math.max(1, existing.quantity - 1);
      }

      updateQtyBadge(cartStepId);
      renderCart();
      persistCart();
      return;
    }

    if (cartDeleteId) {
      cart.delete(cartDeleteId);
      updateQtyBadge(cartDeleteId);
      renderCart();
      persistCart();
    }
  };
}

function persistCart() {
  localStorage.setItem("thriftyHomesCart", JSON.stringify(Array.from(cart.values())));
}

function restoreCart() {
  const saved = localStorage.getItem("thriftyHomesCart");
  if (!saved) return;

  try {
    const parsed = JSON.parse(saved);
    parsed.forEach((item) => {
      const latestProduct = products.find((product) => product.id === item.id);
      if (!latestProduct) {
        cart.set(item.id, item);
        return;
      }

      cart.set(item.id, {
        ...item,
        title: latestProduct.title,
        price: latestProduct.price,
        category: latestProduct.category,
        description: latestProduct.description,
        image: latestProduct.image
      });
    });
  } catch (error) {
    localStorage.removeItem("thriftyHomesCart");
  }
}

function setupCheckoutButton() {
  const checkoutBtn = document.getElementById("checkoutBtn");
  const floatingCheckoutBtn = document.getElementById("floatingCheckoutBtn");

  const goToCheckout = () => {
    persistCart();
    window.location.href = "checkout.html";
  };

  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", goToCheckout);
  }

  if (floatingCheckoutBtn) {
    floatingCheckoutBtn.addEventListener("click", goToCheckout);
  }
}

function setupSlideshow() {
  const slides = Array.from(document.querySelectorAll(".slide"));
  const dotsWrap = document.getElementById("slideDots");
  if (slides.length === 0 || !dotsWrap) return;

  let currentIndex = 0;

  dotsWrap.innerHTML = slides
    .map((_, index) => `<button class="dot ${index === 0 ? "active" : ""}" data-index="${index}" aria-label="Go to slide ${index + 1}"></button>`)
    .join("");

  const dots = Array.from(dotsWrap.querySelectorAll(".dot"));

  function showSlide(index) {
    slides.forEach((slide, i) => {
      slide.classList.toggle("active", i === index);
    });

    dots.forEach((dot, i) => {
      dot.classList.toggle("active", i === index);
    });

    currentIndex = index;
  }

  dotsWrap.addEventListener("click", (event) => {
    const dot = event.target.closest(".dot");
    if (!dot) return;

    showSlide(Number(dot.dataset.index));
  });

  setInterval(() => {
    const next = (currentIndex + 1) % slides.length;
    showSlide(next);
  }, 3000);
}

function openMockRazorpay(amountPaise, name, onSuccess, onDismiss) {
  const modal = document.getElementById("rzpModal");
  if (!modal) return;

  const fmt = (p) => "₹" + (p / 100).toLocaleString("en-IN", { minimumFractionDigits: 2 });
  document.getElementById("rzpAmountDisplay").textContent = fmt(amountPaise);
  document.getElementById("rzpPayAmount").textContent = fmt(amountPaise);

  modal.hidden = false;
  document.body.style.overflow = "hidden";

  const close = () => {
    modal.hidden = true;
    document.body.style.overflow = "";
    onDismiss();
  };

  document.getElementById("rzpClose").onclick = close;
  modal.addEventListener("click", (e) => { if (e.target === modal) close(); }, { once: true });

  // Tab switching
  modal.querySelectorAll(".rzp-tab").forEach((tab) => {
    tab.onclick = () => {
      modal.querySelectorAll(".rzp-tab").forEach((t) => t.classList.remove("active"));
      modal.querySelectorAll(".rzp-panel").forEach((p) => (p.hidden = true));
      tab.classList.add("active");
      document.getElementById("rzp-panel-" + tab.dataset.tab).hidden = false;
    };
  });

  // Card number auto-format
  const cardNumInput = document.getElementById("rzpCardNum");
  if (cardNumInput) {
    cardNumInput.oninput = (e) => {
      let v = e.target.value.replace(/\D/g, "").slice(0, 16);
      e.target.value = v.replace(/(.{4})/g, "$1  ").trim();
    };
  }

  document.getElementById("rzpPayBtn").onclick = () => {
    const payBtn = document.getElementById("rzpPayBtn");
    payBtn.textContent = "Processing…";
    payBtn.disabled = true;
    setTimeout(() => {
      modal.hidden = true;
      document.body.style.overflow = "";
      onSuccess();
    }, 1500);
  };
}

function renderCheckoutPage() {
  const checkoutItems = document.getElementById("checkoutItems");
  const checkoutTotal = document.getElementById("checkoutTotal");
  const checkoutForm = document.getElementById("checkoutForm");
  const orderNote = document.getElementById("orderNote");

  if (!checkoutItems || !checkoutTotal || !checkoutForm) return;

  const saved = localStorage.getItem("thriftyHomesCart");
  let items = saved ? JSON.parse(saved) : [];

  const syncCheckoutImages = () => {
    items = items.map((item) => {
      const latestProduct = products.find((product) => product.id === item.id);
      if (!latestProduct) return item;
      return {
        ...item,
        image: latestProduct.image,
        title: latestProduct.title,
        price: latestProduct.price
      };
    });
  };

  const persistCheckoutItems = () => {
    localStorage.setItem("thriftyHomesCart", JSON.stringify(items));
  };

  const drawCheckoutItems = () => {
    syncCheckoutImages();

    if (items.length === 0) {
      checkoutItems.innerHTML = '<p class="cart-empty">No items in cart yet.</p>';
      checkoutTotal.textContent = formatCurrency(0);
      return;
    }

    let total = 0;
    checkoutItems.innerHTML = items.map((item) => {
      const lineTotal = item.quantity * item.price;
      total += lineTotal;

      return `
        <div class="checkout-item">
          <div class="checkout-item-layout">
            <img class="checkout-item-image" src="${item.image}" alt="${item.title}" loading="lazy" onerror="this.onerror=null;this.src='${imageFallback("Image Unavailable")}';" />
            <div class="checkout-item-main">
              <strong>${item.title}</strong>
              <div class="cart-meta">${formatCurrency(item.price)} each</div>
              <div><strong>${formatCurrency(lineTotal)}</strong></div>
            </div>
            <div class="checkout-item-controls">
              <button class="checkout-step-btn" data-checkout-step="down" data-id="${item.id}" type="button" aria-label="Decrease ${item.title}">-</button>
              <span class="checkout-qty">${item.quantity}</span>
              <button class="checkout-step-btn" data-checkout-step="up" data-id="${item.id}" type="button" aria-label="Increase ${item.title}">+</button>
              <button class="checkout-delete-btn" data-checkout-delete="${item.id}" type="button" aria-label="Remove ${item.title}">🗑</button>
            </div>
          </div>
        </div>
      `;
    }).join("");

    checkoutTotal.textContent = formatCurrency(total);
  };

  drawCheckoutItems();

  checkoutItems.onclick = (event) => {
    const step = event.target.dataset.checkoutStep;
    const stepId = event.target.dataset.id;
    const deleteId = event.target.dataset.checkoutDelete;

    if (step && stepId) {
      items = items.map((item) => {
        if (item.id !== stepId) return item;
        const nextQty = step === "up" ? item.quantity + 1 : Math.max(1, item.quantity - 1);
        return { ...item, quantity: nextQty };
      });

      persistCheckoutItems();
      drawCheckoutItems();
      return;
    }

    if (deleteId) {
      items = items.filter((item) => item.id !== deleteId);
      persistCheckoutItems();
      drawCheckoutItems();
    }
  };

  const getCartTotal = () =>
    items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const finaliseOrder = (name, payment) => {
    localStorage.removeItem("thriftyHomesCart");
    window.location.href = "orders.html";
  };

  checkoutForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(checkoutForm);
    const name = formData.get("fullName");
    const phone = formData.get("phone");
    const payment = formData.get("payment");
    const totalPaise = Math.max(100, Math.round(getCartTotal() * 100));

    openMockRazorpay(totalPaise, name, () => finaliseOrder(name, payment), () => {
      if (orderNote) orderNote.textContent = "Payment cancelled. Your cart is still saved.";
    });
  });
}

const mockOrders = [
  {
    id: "ORD-20240521",
    date: "21 May 2024",
    status: "Delivered",
    payment: "UPI",
    items: [
      { title: "Premium Rice", quantity: 2, price: 12.99, image: createGroceryImage("Premium Rice", "Grains", "#f6edd5", "#d7be89") },
      { title: "Farm Milk", quantity: 3, price: 1.99, image: createGroceryImage("Farm Milk", "Dairy", "#e5efff", "#9ab8ef") }
    ]
  },
  {
    id: "ORD-20240614",
    date: "14 Jun 2024",
    status: "Delivered",
    payment: "Cash on Delivery",
    items: [
      { title: "Fresh Tomatoes", quantity: 1, price: 2.49, image: createGroceryImage("Fresh Tomatoes", "Vegetables", "#fde3df", "#ee8f85") },
      { title: "Red Onions", quantity: 2, price: 1.70, image: createGroceryImage("Red Onions", "Vegetables", "#f4e2ee", "#ce90ba") },
      { title: "Crunchy Carrots", quantity: 1, price: 2.10, image: createGroceryImage("Crunchy Carrots", "Vegetables", "#ffe8d8", "#f39b62") }
    ]
  },
  {
    id: "ORD-20240802",
    date: "2 Aug 2024",
    status: "Delivered",
    payment: "Credit/Debit Card",
    items: [
      { title: "Fruit Basket", quantity: 1, price: 8.75, image: createGroceryImage("Fruit Basket", "Fruits", "#fff1d8", "#f0bf6f") },
      { title: "Bananas", quantity: 3, price: 1.20, image: createGroceryImage("Bananas", "Fruits", "#fff4cf", "#edd06e") },
      { title: "Red Apples", quantity: 2, price: 3.40, image: createGroceryImage("Red Apples", "Fruits", "#ffe3de", "#e78d80") }
    ]
  },
  {
    id: "ORD-20241015",
    date: "15 Oct 2024",
    status: "Delivered",
    payment: "UPI",
    items: [
      { title: "Fresh Paneer", quantity: 2, price: 3.95, image: createGroceryImage("Fresh Paneer", "Dairy", "#fef8e5", "#efd08c") },
      { title: "Creamy Butter", quantity: 1, price: 2.80, image: createGroceryImage("Creamy Butter", "Dairy", "#fff7dc", "#f1cf72") },
      { title: "Natural Curd", quantity: 2, price: 1.50, image: createGroceryImage("Natural Curd", "Dairy", "#edf4ff", "#a4bde9") }
    ]
  },
  {
    id: "ORD-20250112",
    date: "12 Jan 2025",
    status: "Delivered",
    payment: "Cash on Delivery",
    items: [
      { title: "Whole Wheat Flour", quantity: 2, price: 3.25, image: createGroceryImage("Whole Wheat Flour", "Grains", "#f8ecd6", "#debd85") },
      { title: "Brown Rice", quantity: 1, price: 4.60, image: createGroceryImage("Brown Rice", "Grains", "#efe5d7", "#c6a77c") }
    ]
  }
];

function renderOrdersPage() {
  const ordersList = document.getElementById("ordersList");
  if (!ordersList) return;

  const statusColor = { "Delivered": "#165d46", "Pending": "#b45309", "Cancelled": "#8a3d21" };

  ordersList.innerHTML = mockOrders.slice().reverse().map((order) => {
    const orderTotal = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const itemsHtml = order.items.map((item) => `
      <div class="order-line-item">
        <img class="order-item-image" src="${item.image}" alt="${item.title}" loading="lazy" />
        <div class="order-item-meta">
          <span class="order-item-title">${item.title}</span>
          <span class="order-item-qty">Qty: ${item.quantity} × ${formatCurrency(item.price)}</span>
        </div>
        <strong class="order-item-total">${formatCurrency(item.price * item.quantity)}</strong>
      </div>
    `).join("");

    return `
      <div class="order-card">
        <div class="order-card-header">
          <div class="order-card-meta">
            <span class="order-id">${order.id}</span>
            <span class="order-date">${order.date}</span>
          </div>
          <div class="order-card-right">
            <span class="order-payment">${order.payment}</span>
            <span class="order-status" style="color:${statusColor[order.status] ?? "#555"}">${order.status}</span>
          </div>
        </div>
        <div class="order-items">${itemsHtml}</div>
        <div class="order-total-row">
          <span>Order Total</span>
          <strong>${formatCurrency(orderTotal)}</strong>
        </div>
      </div>
    `;
  }).join("");
}

function renderDashboardPage() {
  const dashboardPage = document.getElementById("dashboardPage");
  if (!dashboardPage) return;

  const roleTabs = Array.from(document.querySelectorAll(".dashboard-tab"));
  const sidebarTitle = document.getElementById("dashboardSidebarTitle");
  const sidebarRefChip = document.getElementById("dashboardSidebarRefChip");
  const sidebarMenu = document.getElementById("dashboardSidebarMenu");
  const contentTitle = document.getElementById("dashboardContentTitle");
  const contentCopy = document.getElementById("dashboardContentCopy");
  const contentBody = document.getElementById("dashboardContentBody");
  const primaryActionBtn = document.getElementById("dashboardPrimaryAction");
  const productEditorModal = document.getElementById("productEditorModal");
  const closeProductEditor = document.getElementById("closeProductEditor");
  const cancelProductEditor = document.getElementById("cancelProductEditor");
  const productEditorTitle = document.getElementById("productEditorTitle");
  const productEditorForm = document.getElementById("productEditorForm");
  const mockUploadBtn = document.getElementById("mockUploadBtn");
  const mockUploadFileName = document.getElementById("mockUploadFileName");
  const userEditorModal = document.getElementById("userEditorModal");
  const closeUserEditor = document.getElementById("closeUserEditor");
  const cancelUserEditor = document.getElementById("cancelUserEditor");
  const userEditorForm = document.getElementById("userEditorForm");
  const stockistDealerModal = document.getElementById("stockistDealerModal");
  const closeStockistDealerModal = document.getElementById("closeStockistDealerModal");
  const cancelStockistDealerModal = document.getElementById("cancelStockistDealerModal");
  const stockistDealerForm = document.getElementById("stockistDealerForm");
  const dealerInviteModal = document.getElementById("dealerInviteModal");
  const closeDealerInviteModal = document.getElementById("closeDealerInviteModal");
  const cancelDealerInviteModal = document.getElementById("cancelDealerInviteModal");
  const dealerInviteForm = document.getElementById("dealerInviteForm");
  const dispatchCompleteModal = document.getElementById("dispatchCompleteModal");
  const closeDispatchCompleteModal = document.getElementById("closeDispatchCompleteModal");
  const cancelDispatchCompleteModal = document.getElementById("cancelDispatchCompleteModal");
  const dispatchCompleteForm = document.getElementById("dispatchCompleteForm");
  const dispatchStatusSelect = document.getElementById("dispatchStatus");
  const dispatchDateTimeRow = document.getElementById("dispatchDateTimeRow");
  const deleteConfirmModal = document.getElementById("deleteConfirmModal");
  const closeDeleteConfirmModal = document.getElementById("closeDeleteConfirmModal");
  const cancelDeleteConfirmModal = document.getElementById("cancelDeleteConfirmModal");
  const confirmDeleteConfirmModal = document.getElementById("confirmDeleteConfirmModal");
  const deleteConfirmTitle = document.getElementById("deleteConfirmTitle");
  const deleteConfirmMessage = document.getElementById("deleteConfirmMessage");

  if (!sidebarTitle || !sidebarMenu || !contentTitle || !contentCopy || !contentBody || !primaryActionBtn) return;

  const roleReferenceIds = {
    superstockist: "SS-REF-317",
    stockist: "ST-REF-903",
    dealer: "DL-REF-903"
  };

  const roleMenuItems = {
    admin: ["Manage Product Catalog", "User Management", "View Orders"],
    superstockist: ["Invite Stockist or Dealers", "View Orders"],
    stockist: ["Invite Dealer", "View Orders"],
    dealer: ["View Orders"]
  };

  const roleLabel = {
    admin: "Admin",
    superstockist: "Superstockist",
    stockist: "Stockist",
    dealer: "Dealer"
  };

  let activeRole = "admin";
  let activeMenuItem = "Manage Product Catalog";
  let editingProductId = null;
  let adminCatalogSearchTerm = "";
  let adminCatalogFilterValue = "all";
  let adminCatalogPage = 1;
  let userManagementPage = 1;
  let superstockistDispatchTab = "pending";
  let pendingDeleteAction = null;
  let mockUsers = [
    {
      id: "usr-1",
      firstName: "Aarav",
      lastName: "Sharma",
      email: "aarav.sharma@gmail.com",
      role: "Admin",
      referenceNumber: "REF-ADM-001"
    },
    {
      id: "usr-2",
      firstName: "Priya",
      lastName: "Nair",
      email: "priya.nair@gmail.com",
      role: "Superstockist",
      referenceNumber: "REF-SS-102"
    },
    {
      id: "usr-3",
      firstName: "Rohan",
      lastName: "Patel",
      email: "rohan.patel@gmail.com",
      role: "Stockist",
      referenceNumber: "REF-ST-213"
    },
    {
      id: "usr-4",
      firstName: "Neha",
      lastName: "Gupta",
      email: "neha.gupta@gmail.com",
      role: "Stockist",
      referenceNumber: "REF-CUS-348"
    }
  ];
  let mockStockistDealerUsers = [
    {
      id: "sd-1",
      firstName: "Vikram",
      lastName: "Jain",
      email: "vikram.jain@gmail.com",
      type: "stockist",
      stockistReferenceId: "ST-REF-550",
      dealerReferenceId: "-"
    },
    {
      id: "sd-2",
      firstName: "Meera",
      lastName: "Kapoor",
      email: "meera.kapoor@gmail.com",
      type: "dealer",
      stockistReferenceId: "-",
      dealerReferenceId: "DL-REF-812"
    },
    {
      id: "sd-3",
      firstName: "Suresh",
      lastName: "Yadav",
      email: "suresh.yadav@gmail.com",
      type: "stockist",
      stockistReferenceId: "ST-REF-903",
      dealerReferenceId: "-"
    }
  ];
  let mockDealerUsers = [
    {
      id: "dl-1",
      firstName: "Nitin",
      lastName: "Malhotra",
      email: "nitin.malhotra@gmail.com",
      stockistReferenceId: "ST-REF-903",
      dealerReferenceId: "DL-REF-221"
    },
    {
      id: "dl-2",
      firstName: "Pooja",
      lastName: "Kulkarni",
      email: "pooja.kulkarni@gmail.com",
      stockistReferenceId: "ST-REF-903",
      dealerReferenceId: "DL-REF-336"
    }
  ];
  let mockDashboardOrders = [
    {
      id: "ORD-250301",
      referenceIds: {
        superstockistId: "SS-REF-301",
        stockistId: "ST-REF-301",
        dealerId: "DL-REF-301"
      },
      orderDate: "01 Mar 2025",
      status: "Delivered",
      total: 1465,
      customer: {
        firstName: "Rahul",
        lastName: "Verma",
        email: "rahul.verma@gmail.com",
        phone: "+91 98765 43210",
        address: "22, Green Park, Mumbai"
      },
      itemCount: 7,
      dispatch: {
        status: "pending",
        completedAt: "",
        comments: ""
      }
    },
    {
      id: "ORD-250317",
      referenceIds: {
        superstockistId: "SS-REF-317",
        stockistId: "ST-REF-317",
        dealerId: "DL-REF-317"
      },
      orderDate: "17 Mar 2025",
      status: "Processing",
      total: 845,
      customer: {
        firstName: "Sneha",
        lastName: "Iyer",
        email: "sneha.iyer@gmail.com",
        phone: "+91 99887 77665",
        address: "12, Lake View Road, Bengaluru"
      },
      itemCount: 4,
      dispatch: {
        status: "pending",
        completedAt: "",
        comments: ""
      }
    },
    {
      id: "ORD-250402",
      referenceIds: {
        superstockistId: "SS-REF-402",
        stockistId: "ST-REF-402",
        dealerId: "DL-REF-402"
      },
      orderDate: "02 Apr 2025",
      status: "Delivered",
      total: 2390,
      customer: {
        firstName: "Arjun",
        lastName: "Mehta",
        email: "arjun.mehta@gmail.com",
        phone: "+91 90909 81818",
        address: "45, Sunrise Colony, Pune"
      },
      itemCount: 11,
      dispatch: {
        status: "pending",
        completedAt: "",
        comments: ""
      }
    },
    {
      id: "ORD-250418",
      referenceIds: {
        superstockistId: "SS-REF-418",
        stockistId: "ST-REF-418",
        dealerId: "DL-REF-418"
      },
      orderDate: "18 Apr 2025",
      status: "Packed",
      total: 1099,
      customer: {
        firstName: "Kavya",
        lastName: "Nanda",
        email: "kavya.nanda@gmail.com",
        phone: "+91 98111 22334",
        address: "9, Heritage Block, Hyderabad"
      },
      itemCount: 5,
      dispatch: {
        status: "pending",
        completedAt: "",
        comments: ""
      }
    },
    {
      id: "ORD-250429",
      referenceIds: {
        superstockistId: "SS-REF-317",
        stockistId: "ST-REF-903",
        dealerId: "DL-REF-903"
      },
      orderDate: "29 Apr 2025",
      status: "Shipped",
      total: 1260,
      customer: {
        firstName: "Diya",
        lastName: "Rao",
        email: "diya.rao@gmail.com",
        phone: "+91 91234 55667",
        address: "88, Palm Street, Chennai"
      },
      itemCount: 6,
      dispatch: {
        status: "dispatched",
        completedAt: "2025-04-30T11:15",
        comments: "Left warehouse after quality check"
      }
    }
  ];

  const getImageFileName = (imagePath) => {
    if (!imagePath) return "No file selected";
    const parts = imagePath.split("/");
    return parts[parts.length - 1] || "mock-file.jpg";
  };

  const closeEditorModal = () => {
    if (!productEditorModal) return;
    productEditorModal.hidden = true;
  };

  const closeUserModal = () => {
    if (!userEditorModal) return;
    userEditorModal.hidden = true;
  };

  const openUserModal = () => {
    if (!userEditorModal || !userEditorForm) return;
    userEditorForm.reset();
    userEditorModal.hidden = false;
  };

  const closeStockistDealerFormModal = () => {
    if (!stockistDealerModal) return;
    stockistDealerModal.hidden = true;
  };

  const openStockistDealerFormModal = () => {
    if (!stockistDealerModal || !stockistDealerForm) return;
    stockistDealerForm.reset();
    stockistDealerModal.hidden = false;
  };

  const closeDealerFormModal = () => {
    if (!dealerInviteModal) return;
    dealerInviteModal.hidden = true;
  };

  const closeDispatchCompleteFormModal = () => {
    if (!dispatchCompleteModal) return;
    dispatchCompleteModal.hidden = true;
  };

  const closeDeleteModal = () => {
    if (!deleteConfirmModal) return;
    deleteConfirmModal.hidden = true;
    pendingDeleteAction = null;
  };

  const openDeleteModal = (title, message, onConfirm) => {
    if (!deleteConfirmModal || !deleteConfirmTitle || !deleteConfirmMessage) return;
    pendingDeleteAction = onConfirm;
    deleteConfirmTitle.textContent = title;
    deleteConfirmMessage.textContent = message;

    deleteConfirmModal.hidden = false;
  };

  const getCurrentDateTimeLocalValue = () => {
    const now = new Date();
    const localTime = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
    return localTime.toISOString().slice(0, 16);
  };

  const toggleDispatchDateTimeField = (dispatchStatus) => {
    const dispatchDateTimeInput = document.getElementById("dispatchCompletedAt");
    if (!dispatchDateTimeRow || !dispatchDateTimeInput) return;

    const shouldShow = dispatchStatus === "dispatched";
    dispatchDateTimeRow.hidden = !shouldShow;
    dispatchDateTimeInput.required = shouldShow;
  };

  const openDispatchCompleteFormModal = (orderId) => {
    if (!dispatchCompleteModal || !dispatchCompleteForm || !orderId) return;
    const matchedOrder = mockDashboardOrders.find((order) => order.id === orderId);
    dispatchCompleteForm.reset();

    const orderIdInput = document.getElementById("dispatchOrderId");
    const dispatchDateTimeInput = document.getElementById("dispatchCompletedAt");
    const dispatchCommentsInput = document.getElementById("dispatchComments");
    if (orderIdInput) {
      orderIdInput.value = orderId;
    }
    const statusValue = matchedOrder?.dispatch?.status === "cancelled" ? "cancelled" : "dispatched";
    if (dispatchStatusSelect) {
      dispatchStatusSelect.value = statusValue;
    }
    if (dispatchCommentsInput) {
      dispatchCommentsInput.value = matchedOrder?.dispatch?.comments ?? "";
    }
    if (dispatchDateTimeInput) {
      dispatchDateTimeInput.value = matchedOrder?.dispatch?.completedAt || getCurrentDateTimeLocalValue();
    }

    toggleDispatchDateTimeField(statusValue);

    dispatchCompleteModal.hidden = false;
  };

  const openDealerFormModal = () => {
    if (!dealerInviteModal || !dealerInviteForm) return;
    dealerInviteForm.reset();
    dealerInviteModal.hidden = false;
  };

  const openEditorModal = (product = null) => {
    if (!productEditorModal || !productEditorForm || !productEditorTitle) return;

    editingProductId = product?.id ?? null;
    productEditorTitle.textContent = product ? "Update Product" : "Add New Product";

    const titleInput = document.getElementById("editorTitle");
    const categoryInput = document.getElementById("editorCategory");
    const descriptionInput = document.getElementById("editorDescription");
    const priceInput = document.getElementById("editorPrice");
    const imageInput = document.getElementById("editorImage");

    if (!titleInput || !categoryInput || !descriptionInput || !priceInput || !imageInput) return;

    titleInput.value = product?.title ?? "";
    categoryInput.value = product?.category ?? "grains";
    descriptionInput.value = product?.description ?? "";
    priceInput.value = product ? String(product.price) : "";
    imageInput.value = product?.image ?? "";
    if (mockUploadFileName) {
      mockUploadFileName.textContent = getImageFileName(imageInput.value);
    }

    productEditorModal.hidden = false;
  };

  const renderCatalogProducts = () => {
    const query = adminCatalogSearchTerm.trim().toLowerCase();
    const filteredProducts = products.filter((product) => {
      const matchesSearch = !query || product.title.toLowerCase().includes(query);
      const matchesFilter = adminCatalogFilterValue === "all" || product.category === adminCatalogFilterValue;
      return matchesSearch && matchesFilter;
    });

    const totalPages = Math.max(1, Math.ceil(filteredProducts.length / ADMIN_CATALOG_ITEMS_PER_PAGE));
    adminCatalogPage = Math.min(adminCatalogPage, totalPages);

    const pageStart = (adminCatalogPage - 1) * ADMIN_CATALOG_ITEMS_PER_PAGE;
    const pageItems = filteredProducts.slice(pageStart, pageStart + ADMIN_CATALOG_ITEMS_PER_PAGE);

    contentBody.innerHTML = `
      <div class="dashboard-catalog-controls">
        <input
          id="dashboardCatalogSearch"
          class="dashboard-catalog-search"
          type="search"
          placeholder="Search products"
          value="${adminCatalogSearchTerm}"
          aria-label="Search products in catalog"
        />
        <div class="dashboard-catalog-filter-wrap">
          <label for="dashboardCatalogFilter">Filter</label>
          <select id="dashboardCatalogFilter" class="dashboard-catalog-filter" aria-label="Filter products by category">
            <option value="all" ${adminCatalogFilterValue === "all" ? "selected" : ""}>All</option>
            <option value="grains" ${adminCatalogFilterValue === "grains" ? "selected" : ""}>Grains</option>
            <option value="vegetables" ${adminCatalogFilterValue === "vegetables" ? "selected" : ""}>Vegetables</option>
            <option value="dairy" ${adminCatalogFilterValue === "dairy" ? "selected" : ""}>Dairy</option>
            <option value="fruits" ${adminCatalogFilterValue === "fruits" ? "selected" : ""}>Fruits</option>
          </select>
        </div>
      </div>

      <div class="dashboard-products-grid">
        ${pageItems
          .map(
            (product) => `
              <article class="dashboard-product-card">
                <img src="${product.image}" alt="${product.title}" loading="lazy" onerror="this.onerror=null;this.src='${imageFallback("Image Unavailable")}';" />
                <div class="dashboard-product-content">
                  <h4>${product.title}</h4>
                  <p>${product.description}</p>
                  <div class="dashboard-product-meta">
                    <span>${product.category}</span>
                    <strong>${formatCurrency(product.price)}</strong>
                  </div>
                  <button type="button" class="dashboard-update-btn" data-edit-product="${product.id}">
                    <svg class="dashboard-update-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                      <path d="M3 17.25V21h3.75L17.8 9.94l-3.75-3.75L3 17.25zm17.71-10.04a1.004 1.004 0 0 0 0-1.42l-2.5-2.5a1.004 1.004 0 0 0-1.42 0l-1.96 1.96 3.75 3.75 2.13-1.79z" />
                    </svg>
                    <span>Update Product</span>
                  </button>
                </div>
              </article>
            `
          )
          .join("")}
      </div>

      ${filteredProducts.length === 0 ? '<p class="dashboard-placeholder">No products found for your search/filter.</p>' : ""}

      ${totalPages > 1 ? `
        <div class="dashboard-catalog-pagination">
          <button type="button" class="page-btn" id="dashboardPagePrev" ${adminCatalogPage === 1 ? "disabled" : ""}>Prev</button>
          <span class="page-indicator">Page ${adminCatalogPage} / ${totalPages}</span>
          <button type="button" class="page-btn" id="dashboardPageNext" ${adminCatalogPage === totalPages ? "disabled" : ""}>Next</button>
        </div>
      ` : ""}
    `;

    const searchInput = document.getElementById("dashboardCatalogSearch");
    const filterInput = document.getElementById("dashboardCatalogFilter");
    const prevBtn = document.getElementById("dashboardPagePrev");
    const nextBtn = document.getElementById("dashboardPageNext");

    if (searchInput) {
      searchInput.addEventListener("input", (event) => {
        adminCatalogSearchTerm = event.target.value;
        adminCatalogPage = 1;
        renderCatalogProducts();
      });
    }

    if (filterInput) {
      filterInput.addEventListener("change", (event) => {
        adminCatalogFilterValue = event.target.value;
        adminCatalogPage = 1;
        renderCatalogProducts();
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener("click", () => {
        adminCatalogPage = Math.max(1, adminCatalogPage - 1);
        renderCatalogProducts();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener("click", () => {
        adminCatalogPage = Math.min(totalPages, adminCatalogPage + 1);
        renderCatalogProducts();
      });
    }

    const editButtons = contentBody.querySelectorAll("[data-edit-product]");
    editButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const id = button.getAttribute("data-edit-product");
        if (!id) return;
        const selectedProduct = products.find((product) => product.id === id);
        if (!selectedProduct) return;
        openEditorModal(selectedProduct);
      });
    });
  };

  const renderOrdersAccordion = (orders, emptyMessage = "No orders found.", options = {}) => {
    const {
      container = contentBody,
      showDispatchActions = false
    } = options;

    primaryActionBtn.hidden = true;

    if (!container) return;

    if (!orders.length) {
      container.innerHTML = `<p class="dashboard-placeholder">${emptyMessage}</p>`;
      return;
    }

    container.innerHTML = `
      <div class="dashboard-orders-accordion" id="dashboardOrdersAccordion">
        ${orders
          .map((order, index) => {
            const isOpen = index === 0;
            const dispatchAt = order.dispatch?.completedAt ?? "";
            const dispatchComments = order.dispatch?.comments ?? "";
            const dispatchState = order.dispatch?.status ?? (dispatchAt ? "dispatched" : "pending");
            const dispatchInfo = dispatchState !== "pending"
              ? `
                <div class="dashboard-dispatch-details">
                  <p><strong>Dispatch Status:</strong> ${dispatchState === "cancelled" ? "Cancelled" : "Dispatched"}</p>
                  ${dispatchState === "dispatched" && dispatchAt ? `<p><strong>Dispatch Completed At:</strong> ${dispatchAt.replace("T", " ")}</p>` : ""}
                  ${dispatchComments ? `<p><strong>Comments:</strong> ${dispatchComments}</p>` : ""}
                </div>
              `
              : "";

            return `
              <article class="dashboard-order-accordion-item ${isOpen ? "open" : ""}" data-order-acc>
                <button type="button" class="dashboard-order-accordion-toggle" data-order-toggle aria-expanded="${isOpen ? "true" : "false"}">
                  <div class="dashboard-order-summary-left">
                    <strong>${order.id}</strong>
                    <p>${order.orderDate}</p>
                  </div>
                  <div class="dashboard-order-summary-right">
                    <span class="dashboard-order-status">${order.status}</span>
                    <span class="dashboard-order-total">${formatCurrency(order.total)}</span>
                  </div>
                </button>

                <div class="dashboard-order-accordion-body" ${isOpen ? "" : "hidden"}>
                  <div class="dashboard-order-refs">
                    <span class="dashboard-order-ref-chip"><strong>Superstockist ID:</strong> ${order.referenceIds.superstockistId}</span>
                    <span class="dashboard-order-ref-chip"><strong>Stockist ID:</strong> ${order.referenceIds.stockistId}</span>
                    <span class="dashboard-order-ref-chip"><strong>Dealer ID:</strong> ${order.referenceIds.dealerId}</span>
                  </div>

                  <div class="dashboard-order-customer">
                    <h4>Customer Details</h4>
                    <p>${order.customer.firstName} ${order.customer.lastName}</p>
                    <p>${order.customer.email}</p>
                    <p>${order.customer.phone}</p>
                    <p>${order.customer.address}</p>
                  </div>

                  <div class="dashboard-order-meta">
                    <span>${order.itemCount} items</span>
                    <strong>${formatCurrency(order.total)}</strong>
                  </div>

                  ${showDispatchActions ? `
                    <div class="dashboard-dispatch-actions">
                      <button type="button" class="dashboard-primary-btn" data-dispatch-complete-order="${order.id}"><span aria-hidden="true">✎</span> Update Status</button>
                    </div>
                  ` : ""}

                  ${dispatchInfo}
                </div>
              </article>
            `;
          })
          .join("")}
      </div>
    `;

    const accordionItems = Array.from(container.querySelectorAll("[data-order-acc]"));
    const toggleButtons = Array.from(container.querySelectorAll("[data-order-toggle]"));

    toggleButtons.forEach((toggleBtn, index) => {
      toggleBtn.addEventListener("click", () => {
        accordionItems.forEach((item, itemIndex) => {
          const body = item.querySelector(".dashboard-order-accordion-body");
          const btn = item.querySelector("[data-order-toggle]");
          if (!body || !btn) return;

          const shouldOpen = itemIndex === index && body.hidden;
          item.classList.toggle("open", shouldOpen);
          body.hidden = !shouldOpen;
          btn.setAttribute("aria-expanded", shouldOpen ? "true" : "false");
        });
      });
    });

    const dispatchButtons = Array.from(container.querySelectorAll("[data-dispatch-complete-order]"));
    dispatchButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const orderId = button.getAttribute("data-dispatch-complete-order");
        if (!orderId) return;
        openDispatchCompleteFormModal(orderId);
      });
    });
  };

  const renderSuperstockistDispatchPanel = (ordersForSuperstockist) => {
    const getDispatchState = (order) => order.dispatch?.status ?? (order.dispatch?.completedAt ? "dispatched" : "pending");
    const pendingOrders = ordersForSuperstockist.filter((order) => getDispatchState(order) === "pending");
    const completedOrders = ordersForSuperstockist.filter((order) => getDispatchState(order) !== "pending");

    contentBody.innerHTML = `
      <div class="dashboard-dispatch-toggle" role="tablist" aria-label="Dispatch status filter">
        <button type="button" class="dashboard-dispatch-toggle-btn ${superstockistDispatchTab === "pending" ? "active" : ""}" data-dispatch-tab="pending">Pending Dispatch</button>
        <button type="button" class="dashboard-dispatch-toggle-btn ${superstockistDispatchTab === "completed" ? "active" : ""}" data-dispatch-tab="completed">Shipped</button>
      </div>
      <div id="superstockistDispatchOrders"></div>
    `;

    const dispatchTarget = document.getElementById("superstockistDispatchOrders");
    if (!dispatchTarget) return;

    if (superstockistDispatchTab === "pending") {
      renderOrdersAccordion(
        pendingOrders,
        "No pending dispatch orders for your Superstockist reference ID.",
        { container: dispatchTarget, showDispatchActions: true }
      );
    } else {
      renderOrdersAccordion(
        completedOrders,
        "No shipped orders for your Superstockist reference ID.",
        { container: dispatchTarget, showDispatchActions: false }
      );
    }

    const tabButtons = Array.from(contentBody.querySelectorAll("[data-dispatch-tab]"));
    tabButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const selectedTab = button.getAttribute("data-dispatch-tab");
        if (!selectedTab || selectedTab === superstockistDispatchTab) return;
        superstockistDispatchTab = selectedTab;
        renderSuperstockistDispatchPanel(ordersForSuperstockist);
      });
    });
  };

  const renderPanelBody = () => {
    if (activeRole === "admin" && activeMenuItem === "Manage Product Catalog") {
      primaryActionBtn.hidden = false;
      primaryActionBtn.textContent = "+ Add New Product";
      renderCatalogProducts();
      return;
    }

    if (activeRole === "admin" && activeMenuItem === "User Management") {
      primaryActionBtn.hidden = false;
      primaryActionBtn.textContent = "+ Add User";

      const totalUserPages = Math.max(1, Math.ceil(mockUsers.length / USER_TABLE_ITEMS_PER_PAGE));
      userManagementPage = Math.min(userManagementPage, totalUserPages);
      const userStart = (userManagementPage - 1) * USER_TABLE_ITEMS_PER_PAGE;
      const pageUsers = mockUsers.slice(userStart, userStart + USER_TABLE_ITEMS_PER_PAGE);

      contentBody.innerHTML = `
        <div class="dashboard-table-wrap">
          <table class="dashboard-table" aria-label="User management table">
            <thead>
              <tr>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Gmail ID</th>
                <th>Role</th>
                <th>Reference Number</th>
                <th>Remove User</th>
              </tr>
            </thead>
            <tbody>
              ${pageUsers
                .map(
                  (user) => `
                    <tr>
                      <td>${user.firstName}</td>
                      <td>${user.lastName}</td>
                      <td>${user.email}</td>
                      <td>${user.role}</td>
                      <td>${user.referenceNumber}</td>
                      <td>
                        <button type="button" class="dashboard-remove-btn" data-remove-user="${user.id}">Remove</button>
                      </td>
                    </tr>
                  `
                )
                .join("")}
            </tbody>
          </table>
        </div>

        ${totalUserPages > 1 ? `
          <div class="dashboard-catalog-pagination">
            <button type="button" class="page-btn" id="userPagePrev" ${userManagementPage === 1 ? "disabled" : ""}>Prev</button>
            <span class="page-indicator">Page ${userManagementPage} / ${totalUserPages}</span>
            <button type="button" class="page-btn" id="userPageNext" ${userManagementPage === totalUserPages ? "disabled" : ""}>Next</button>
          </div>
        ` : ""}
      `;

      const removeButtons = contentBody.querySelectorAll("[data-remove-user]");
      removeButtons.forEach((button) => {
        button.addEventListener("click", () => {
          const userId = button.getAttribute("data-remove-user");
          if (!userId) return;
          const user = mockUsers.find((item) => item.id === userId);
          const userLabel = user ? `${user.firstName} ${user.lastName}` : "this user";
          openDeleteModal(
            "Warning",
            `You are about to remove ${userLabel}. Click Proceed to continue to final confirmation.`,
            () => {
              mockUsers = mockUsers.filter((item) => item.id !== userId);
              renderPanelBody();
            }
          );
        });
      });

      const userPrevBtn = document.getElementById("userPagePrev");
      const userNextBtn = document.getElementById("userPageNext");

      if (userPrevBtn) {
        userPrevBtn.addEventListener("click", () => {
          userManagementPage = Math.max(1, userManagementPage - 1);
          renderPanelBody();
        });
      }

      if (userNextBtn) {
        userNextBtn.addEventListener("click", () => {
          userManagementPage = Math.min(totalUserPages, userManagementPage + 1);
          renderPanelBody();
        });
      }

      return;
    }

    if (activeRole === "admin" && activeMenuItem === "View Orders") {
      renderOrdersAccordion(mockDashboardOrders);
      return;
    }

    if (activeRole === "superstockist" && activeMenuItem === "View Orders") {
      const superstockistReferenceId = roleReferenceIds.superstockist;
      const filteredOrders = mockDashboardOrders.filter(
        (order) => order.referenceIds.superstockistId === superstockistReferenceId
      );
      renderSuperstockistDispatchPanel(filteredOrders);

      return;
    }

    if (activeRole === "superstockist" && activeMenuItem === "Invite Stockist or Dealers") {
      primaryActionBtn.hidden = false;
      primaryActionBtn.textContent = "+ Add Stockist or Dealer";

      contentBody.innerHTML = `
        <div class="dashboard-table-wrap">
          <table class="dashboard-table" aria-label="Stockist and dealer table">
            <thead>
              <tr>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Stockist Reference ID</th>
                <th>Dealer Reference ID</th>
                <th>Gmail ID</th>
                <th>Remove User</th>
              </tr>
            </thead>
            <tbody>
              ${mockStockistDealerUsers
                .map(
                  (user) => `
                    <tr>
                      <td>${user.firstName}</td>
                      <td>${user.lastName}</td>
                      <td>${user.stockistReferenceId || "-"}</td>
                      <td>${user.dealerReferenceId || "-"}</td>
                      <td>${user.email}</td>
                      <td>
                        <button type="button" class="dashboard-remove-btn" data-remove-sd-user="${user.id}">Remove</button>
                      </td>
                    </tr>
                  `
                )
                .join("")}
            </tbody>
          </table>
        </div>
      `;

      const removeButtons = contentBody.querySelectorAll("[data-remove-sd-user]");
      removeButtons.forEach((button) => {
        button.addEventListener("click", () => {
          const userId = button.getAttribute("data-remove-sd-user");
          if (!userId) return;
          const user = mockStockistDealerUsers.find((item) => item.id === userId);
          const userLabel = user ? `${user.firstName} ${user.lastName}` : "this user";
          openDeleteModal(
            "Warning",
            `You are about to remove ${userLabel}. Click Proceed to continue to final confirmation.`,
            () => {
              mockStockistDealerUsers = mockStockistDealerUsers.filter((item) => item.id !== userId);
              renderPanelBody();
            }
          );
        });
      });

      return;
    }

    if (activeRole === "stockist" && activeMenuItem === "Invite Dealer") {
      primaryActionBtn.hidden = false;
      primaryActionBtn.textContent = "+ Add Dealer";

      contentBody.innerHTML = `
        <div class="dashboard-table-wrap">
          <table class="dashboard-table" aria-label="Dealer invite table">
            <thead>
              <tr>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Stockist Reference ID</th>
                <th>Dealer Reference ID</th>
                <th>Gmail ID</th>
                <th>Remove User</th>
              </tr>
            </thead>
            <tbody>
              ${mockDealerUsers
                .map(
                  (user) => `
                    <tr>
                      <td>${user.firstName}</td>
                      <td>${user.lastName}</td>
                      <td>${user.stockistReferenceId || "-"}</td>
                      <td>${user.dealerReferenceId || "-"}</td>
                      <td>${user.email}</td>
                      <td>
                        <button type="button" class="dashboard-remove-btn" data-remove-dealer-user="${user.id}">Remove</button>
                      </td>
                    </tr>
                  `
                )
                .join("")}
            </tbody>
          </table>
        </div>
      `;

      const removeButtons = contentBody.querySelectorAll("[data-remove-dealer-user]");
      removeButtons.forEach((button) => {
        button.addEventListener("click", () => {
          const userId = button.getAttribute("data-remove-dealer-user");
          if (!userId) return;
          const user = mockDealerUsers.find((item) => item.id === userId);
          const userLabel = user ? `${user.firstName} ${user.lastName}` : "this user";
          openDeleteModal(
            "Warning",
            `You are about to remove ${userLabel}. Click Proceed to continue to final confirmation.`,
            () => {
              mockDealerUsers = mockDealerUsers.filter((item) => item.id !== userId);
              renderPanelBody();
            }
          );
        });
      });

      return;
    }

    if (activeRole === "stockist" && activeMenuItem === "View Orders") {
      const stockistReferenceId = roleReferenceIds.stockist;
      const filteredOrders = mockDashboardOrders.filter(
        (order) => order.referenceIds.stockistId === stockistReferenceId
      );
      renderOrdersAccordion(filteredOrders, "No orders found for your Stockist reference ID.");
      return;
    }

    if (activeRole === "dealer" && activeMenuItem === "View Orders") {
      const dealerReferenceId = roleReferenceIds.dealer;
      const filteredOrders = mockDashboardOrders.filter(
        (order) => order.referenceIds.dealerId === dealerReferenceId
      );
      renderOrdersAccordion(filteredOrders, "No orders found for your Dealer reference ID.");
      return;
    }

    primaryActionBtn.hidden = true;
    contentBody.innerHTML = `<p class="dashboard-placeholder">${activeMenuItem} section is ready for configuration.</p>`;
  };

  const setSelectedMenuItem = (itemName, label) => {
    activeMenuItem = itemName;

    const hideHeaderForAdminView =
      (activeRole === "admin" && (itemName === "Manage Product Catalog" || itemName === "User Management" || itemName === "View Orders"))
      || (activeRole === "superstockist" && (itemName === "Invite Stockist or Dealers" || itemName === "View Orders"))
      || (activeRole === "stockist" && (itemName === "Invite Dealer" || itemName === "View Orders"))
      || (activeRole === "dealer" && itemName === "View Orders");

    if (hideHeaderForAdminView) {
      contentTitle.textContent = "";
      contentCopy.textContent = "";
      contentTitle.hidden = true;
      contentCopy.hidden = true;
    } else {
      contentTitle.hidden = false;
      contentCopy.hidden = false;
      contentTitle.textContent = itemName;
      contentCopy.textContent = `${label} panel: ${itemName}.`;
    }

    const allMenuButtons = sidebarMenu.querySelectorAll(".dashboard-menu-btn");
    allMenuButtons.forEach((button) => {
      const isActive = button.dataset.menuItem === itemName;
      button.classList.toggle("active", isActive);
      button.setAttribute("aria-current", isActive ? "page" : "false");
    });

    renderPanelBody();
  };

  const setRole = (role) => {
    activeRole = role;
    const menuItems = roleMenuItems[role] ?? [];
    const label = roleLabel[role] ?? "Dashboard";

    sidebarTitle.textContent = label;
    if (sidebarRefChip) {
      const referenceId = roleReferenceIds[role];
      if (referenceId) {
        sidebarRefChip.textContent = `Your reference number: ${referenceId}`;
        sidebarRefChip.hidden = false;
      } else {
        sidebarRefChip.textContent = "";
        sidebarRefChip.hidden = true;
      }
    }
    contentTitle.textContent = `${label} Workspace`;
    contentCopy.textContent = `Use the ${label.toLowerCase()} tools from the left sidebar.`;

    sidebarMenu.innerHTML = menuItems
      .map((item) => `<li><button type="button" class="dashboard-menu-btn" data-menu-item="${item}">${item}</button></li>`)
      .join("");

    const menuButtons = sidebarMenu.querySelectorAll(".dashboard-menu-btn");
    menuButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const selectedItem = button.dataset.menuItem;
        if (!selectedItem) return;
        setSelectedMenuItem(selectedItem, label);
      });
    });

    if (menuItems.length > 0) {
      setSelectedMenuItem(menuItems[0], label);
    } else {
      contentBody.innerHTML = "";
      primaryActionBtn.hidden = true;
    }

    roleTabs.forEach((tab) => {
      const isActive = tab.dataset.dashboardRole === role;
      tab.classList.toggle("active", isActive);
      tab.setAttribute("aria-selected", isActive ? "true" : "false");
    });
  };

  primaryActionBtn.addEventListener("click", () => {
    if (activeRole === "admin" && activeMenuItem === "Manage Product Catalog") {
      openEditorModal();
      return;
    }

    if (activeRole === "admin" && activeMenuItem === "User Management") {
      openUserModal();
      return;
    }

    if (activeRole === "superstockist" && activeMenuItem === "Invite Stockist or Dealers") {
      openStockistDealerFormModal();
      return;
    }

    if (activeRole === "stockist" && activeMenuItem === "Invite Dealer") {
      openDealerFormModal();
    }
  });

  if (productEditorModal) {
    productEditorModal.addEventListener("click", (event) => {
      if (event.target === productEditorModal) closeEditorModal();
    });
  }

  if (userEditorModal) {
    userEditorModal.addEventListener("click", (event) => {
      if (event.target === userEditorModal) closeUserModal();
    });
  }

  if (stockistDealerModal) {
    stockistDealerModal.addEventListener("click", (event) => {
      if (event.target === stockistDealerModal) closeStockistDealerFormModal();
    });
  }

  if (dealerInviteModal) {
    dealerInviteModal.addEventListener("click", (event) => {
      if (event.target === dealerInviteModal) closeDealerFormModal();
    });
  }

  if (dispatchCompleteModal) {
    dispatchCompleteModal.addEventListener("click", (event) => {
      if (event.target === dispatchCompleteModal) closeDispatchCompleteFormModal();
    });
  }

  if (deleteConfirmModal) {
    deleteConfirmModal.addEventListener("click", (event) => {
      if (event.target === deleteConfirmModal) closeDeleteModal();
    });
  }

  if (closeProductEditor) {
    closeProductEditor.addEventListener("click", closeEditorModal);
  }

  if (cancelProductEditor) {
    cancelProductEditor.addEventListener("click", closeEditorModal);
  }

  if (closeUserEditor) {
    closeUserEditor.addEventListener("click", closeUserModal);
  }

  if (cancelUserEditor) {
    cancelUserEditor.addEventListener("click", closeUserModal);
  }

  if (closeStockistDealerModal) {
    closeStockistDealerModal.addEventListener("click", closeStockistDealerFormModal);
  }

  if (cancelStockistDealerModal) {
    cancelStockistDealerModal.addEventListener("click", closeStockistDealerFormModal);
  }

  if (closeDealerInviteModal) {
    closeDealerInviteModal.addEventListener("click", closeDealerFormModal);
  }

  if (cancelDealerInviteModal) {
    cancelDealerInviteModal.addEventListener("click", closeDealerFormModal);
  }

  if (closeDispatchCompleteModal) {
    closeDispatchCompleteModal.addEventListener("click", closeDispatchCompleteFormModal);
  }

  if (cancelDispatchCompleteModal) {
    cancelDispatchCompleteModal.addEventListener("click", closeDispatchCompleteFormModal);
  }

  if (closeDeleteConfirmModal) {
    closeDeleteConfirmModal.addEventListener("click", closeDeleteModal);
  }

  if (cancelDeleteConfirmModal) {
    cancelDeleteConfirmModal.addEventListener("click", closeDeleteModal);
  }

  if (confirmDeleteConfirmModal) {
    confirmDeleteConfirmModal.addEventListener("click", () => {
      if (typeof pendingDeleteAction === "function") {
        pendingDeleteAction();
      }
      closeDeleteModal();
    });
  }

  if (productEditorForm) {
    if (mockUploadBtn) {
      mockUploadBtn.addEventListener("click", () => {
        const titleInput = document.getElementById("editorTitle");
        const categoryInput = document.getElementById("editorCategory");
        const imageInput = document.getElementById("editorImage");
        if (!imageInput) return;

        const titleValue = String(titleInput?.value ?? "Product").trim() || "Product";
        const categoryValue = String(categoryInput?.value ?? "grains").trim() || "grains";
        const generatedImage = createGroceryImage(titleValue, categoryValue, "#e8f0e3", "#8fb57d");

        imageInput.value = generatedImage;
        if (mockUploadFileName) {
          mockUploadFileName.textContent = getImageFileName(generatedImage);
        }
      });
    }

    productEditorForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const formData = new FormData(productEditorForm);
      const title = String(formData.get("title") ?? "").trim();
      const category = String(formData.get("category") ?? "grains").trim();
      const description = String(formData.get("description") ?? "").trim();
      const price = Number(formData.get("price"));
      const customImage = String(formData.get("image") ?? "").trim();

      if (!title || !description || Number.isNaN(price) || price <= 0) return;

      const fallbackImage = createGroceryImage(title, category, "#e8f0e3", "#8fb57d");
      const finalImage = customImage || fallbackImage;

      if (editingProductId) {
        const existingProduct = products.find((product) => product.id === editingProductId);
        if (existingProduct) {
          existingProduct.title = title;
          existingProduct.category = category;
          existingProduct.description = description;
          existingProduct.price = price;
          existingProduct.image = finalImage;
        }
      } else {
        const baseSlug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
        let newId = baseSlug || "product";
        let duplicateCounter = 2;
        while (products.some((product) => product.id === newId)) {
          newId = `${baseSlug || "product"}-${duplicateCounter}`;
          duplicateCounter += 1;
        }

        products.push({
          id: newId,
          title,
          category,
          description,
          price,
          image: finalImage
        });
      }

      closeEditorModal();
      renderPanelBody();
    });
  }

  if (userEditorForm) {
    userEditorForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const formData = new FormData(userEditorForm);
      const firstName = String(formData.get("firstName") ?? "").trim();
      const lastName = String(formData.get("lastName") ?? "").trim();
      const email = String(formData.get("email") ?? "").trim();
      const role = String(formData.get("role") ?? "Stockist").trim();
      const referenceNumber = String(formData.get("referenceNumber") ?? "").trim();

      if (!firstName || !lastName || !email || !referenceNumber) return;

      const newId = `usr-${Date.now()}`;
      mockUsers.unshift({
        id: newId,
        firstName,
        lastName,
        email,
        role,
        referenceNumber
      });

      userManagementPage = 1;
      closeUserModal();
      renderPanelBody();
    });
  }

  if (stockistDealerForm) {
    stockistDealerForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const formData = new FormData(stockistDealerForm);
      const firstName = String(formData.get("firstName") ?? "").trim();
      const lastName = String(formData.get("lastName") ?? "").trim();
      const email = String(formData.get("email") ?? "").trim();
      const type = String(formData.get("type") ?? "stockist").trim().toLowerCase();
      const referenceId = String(formData.get("referenceId") ?? "").trim();

      if (!firstName || !lastName || !email || !referenceId) return;

      const newEntry = {
        id: `sd-${Date.now()}`,
        firstName,
        lastName,
        email,
        type,
        stockistReferenceId: type === "stockist" ? referenceId : "-",
        dealerReferenceId: type === "dealer" ? referenceId : "-"
      };

      mockStockistDealerUsers.unshift(newEntry);
      closeStockistDealerFormModal();
      renderPanelBody();
    });
  }

  if (dealerInviteForm) {
    dealerInviteForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const formData = new FormData(dealerInviteForm);
      const firstName = String(formData.get("firstName") ?? "").trim();
      const lastName = String(formData.get("lastName") ?? "").trim();
      const email = String(formData.get("email") ?? "").trim();
      const stockistReferenceId = String(formData.get("stockistReferenceId") ?? "").trim();
      const dealerReferenceId = String(formData.get("dealerReferenceId") ?? "").trim();

      if (!firstName || !lastName || !email || !stockistReferenceId || !dealerReferenceId) return;

      mockDealerUsers.unshift({
        id: `dl-${Date.now()}`,
        firstName,
        lastName,
        email,
        stockistReferenceId,
        dealerReferenceId
      });

      closeDealerFormModal();
      renderPanelBody();
    });
  }

  if (dispatchCompleteForm) {
    dispatchCompleteForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const formData = new FormData(dispatchCompleteForm);
      const orderId = String(formData.get("orderId") ?? "").trim();
      const comments = String(formData.get("comments") ?? "").trim();
      const dispatchStatus = String(formData.get("dispatchStatus") ?? "dispatched").trim().toLowerCase();
      const completedAt = String(formData.get("completedAt") ?? "").trim();

      if (!orderId) return;
      if (dispatchStatus === "dispatched" && !completedAt) return;

      const matchedOrder = mockDashboardOrders.find((order) => order.id === orderId);
      if (!matchedOrder) return;

      matchedOrder.dispatch = {
        status: dispatchStatus === "cancelled" ? "cancelled" : "dispatched",
        completedAt: dispatchStatus === "dispatched" ? completedAt : "",
        comments
      };
      matchedOrder.status = dispatchStatus === "cancelled" ? "Cancelled" : "Dispatched";

      closeDispatchCompleteFormModal();
      renderPanelBody();
    });
  }

  if (dispatchStatusSelect) {
    dispatchStatusSelect.addEventListener("change", () => {
      toggleDispatchDateTimeField(dispatchStatusSelect.value);
    });
  }

  roleTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const role = tab.dataset.dashboardRole;
      if (!role) return;
      setRole(role);
    });
  });

  setRole("admin");
}

function initHomePage() {
  if (!document.getElementById("productGrid")) return;
  restoreCart();
  setupCatalogSearch();
  setupCatalogFilter();
  renderProducts();
  products.forEach((product) => updateQtyBadge(product.id));
  renderCart();
  setupCheckoutButton();
  setupSlideshow();
}

setupProfileDropdown();
setupAuthUi();
initHomePage();
renderCheckoutPage();
renderOrdersPage();
renderDashboardPage();
