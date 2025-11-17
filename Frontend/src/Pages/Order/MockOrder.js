export const mockOrders = [
  {
    id: 625,
    date: "2025-11-10",
    customerName: "James",
    email: "test@iconicwp.com",
    paymentMethod: "Check payments",
    address: "7513 N Bray Rd, Mount Morris, MI 48458",

    items: [
      {
        id: 1,
        title: "Hoodie",
        color: "Red",
        logo: "Yes",
        qty: 1,
        price: 49.52,
        image: "https://via.placeholder.com/80",
      },
      {
        id: 2,
        title: "T-Shirt",
        qty: 1,
        price: 17.14,
        image: "https://via.placeholder.com/80",
      },
    ],

    itemsCount: 2,
    thumbnail: "https://via.placeholder.com/80",

    subtotal: 66.67,
    shipping: "Flat rate US",
    tax: 3.33,
    total: 70.0,

    status: "shipped", // ✔ added
    timeline: {
      placed: "2025-11-10",
      packed: "2025-11-11",
      shipped: "2025-11-12",
      out_for_delivery: null,
      delivered: null,
    },
  },

  // --------------------------- ORDER 2 ---------------------------
  {
    id: 626,
    date: "2025-11-08",
    customerName: "Sophia Wilson",
    email: "sophia@example.com",
    paymentMethod: "Credit Card",
    address: "140 Meadow Lane, Dallas, TX 75201",

    items: [
      {
        id: 3,
        title: "Winter Jacket",
        color: "Black",
        qty: 1,
        price: 89.99,
        image: "https://via.placeholder.com/80",
      },
    ],

    itemsCount: 1,
    thumbnail: "https://via.placeholder.com/80",

    subtotal: 89.99,
    shipping: "Free Shipping",
    tax: 7.2,
    total: 97.19,

    status: "out_for_delivery", // ✔ added
    timeline: {
      placed: "2025-11-08",
      packed: "2025-11-09",
      shipped: "2025-11-10",
      out_for_delivery: "2025-11-12",
      delivered: null,
    },
  },

  // --------------------------- ORDER 3 ---------------------------
  {
    id: 627,
    date: "2025-11-05",
    customerName: "Michael Brown",
    email: "michaelb@example.com",
    paymentMethod: "PayPal",
    address: "23 King Street, Seattle, WA 98101",

    items: [
      {
        id: 4,
        title: "Sneakers",
        qty: 1,
        price: 59.99,
        image: "https://via.placeholder.com/80",
      },
      {
        id: 5,
        title: "Cap",
        qty: 1,
        price: 14.99,
        image: "https://via.placeholder.com/80",
      },
    ],

    itemsCount: 2,
    thumbnail: "https://via.placeholder.com/80",

    subtotal: 74.98,
    shipping: "Standard",
    tax: 5.0,
    total: 79.98,

    status: "delivered", // ✔ added
    timeline: {
      placed: "2025-11-05",
      packed: "2025-11-06",
      shipped: "2025-11-07",
      out_for_delivery: "2025-11-08",
      delivered: "2025-11-09",
    },
  },

  // --------------------------- ORDER 4 ---------------------------
  {
    id: 628,
    date: "2025-11-14",
    customerName: "Emily Jones",
    email: "emily@example.com",
    paymentMethod: "UPI",
    address: "906 Sunset Blvd, Los Angeles, CA 90028",

    items: [
      {
        id: 6,
        title: "Graphic Tee",
        color: "White",
        qty: 2,
        price: 22.5,
        image: "https://via.placeholder.com/80",
      },
    ],

    itemsCount: 2,
    thumbnail: "https://via.placeholder.com/80",

    subtotal: 45.0,
    shipping: "Express",
    tax: 2.8,
    total: 47.8,

    status: "packed", // ✔ added
    timeline: {
      placed: "2025-11-14",
      packed: "2025-11-15",
      shipped: null,
      out_for_delivery: null,
      delivered: null,
    },
  },

  // --------------------------- ORDER 5 ---------------------------
  {
    id: 629,
    date: "2025-11-16",
    customerName: "Oliver Martinez",
    email: "oliver@example.com",
    paymentMethod: "Cash on Delivery",
    address: "55 Maple Street, New York, NY 10001",

    items: [
      {
        id: 7,
        title: "Joggers",
        color: "Grey",
        qty: 1,
        price: 39.99,
        image: "https://via.placeholder.com/80",
      },
      {
        id: 8,
        title: "Socks Pack (3 pairs)",
        qty: 1,
        price: 9.99,
        image: "https://via.placeholder.com/80",
      },
    ],

    itemsCount: 2,
    thumbnail: "https://via.placeholder.com/80",

    subtotal: 49.98,
    shipping: "Standard",
    tax: 3.5,
    total: 53.48,

    status: "placed", // ✔ added
    timeline: {
      placed: "2025-11-16",
      packed: null,
      shipped: null,
      out_for_delivery: null,
      delivered: null,
    },
  },
];
