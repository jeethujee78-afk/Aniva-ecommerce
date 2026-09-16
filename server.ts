import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { createApp } from "./backend/src/app.js";
import { logEnvironmentDiagnostics } from "./backend/src/config/env.js";
import { INITIAL_PRODUCTS, INITIAL_COUPONS, INITIAL_REVIEWS } from "./src/data/initialData.js";
import { Product, Order, Coupon, Review } from "./src/types.js";

async function startServer() {
  // Initialize modular monolith app
  const app = createApp();
  const PORT = 3000;

  // In-memory data store for server lifetime (for legacy demo endpoints)
  let products: Product[] = [...INITIAL_PRODUCTS];
  let coupons: Coupon[] = [...INITIAL_COUPONS];
  let reviews: Review[] = [...INITIAL_REVIEWS];
  let orders: Order[] = [
    {
      id: "ANV-89420",
      createdAt: "2026-07-22T10:30:00Z",
      items: [
        {
          productId: "ANV-TS-01",
          productName: "Monolith Classic Plain Tee",
          price: 1299,
          quantity: 2,
          selectedSize: "L",
          selectedColor: "Matte Black",
          image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1000&q=80"
        }
      ],
      shippingAddress: {
        fullName: "Siddharth Rajan",
        phone: "+91 98401 23456",
        email: "siddharth.r@example.com",
        addressLine: "No 42, Nungambakkam High Road",
        city: "Chennai",
        state: "Tamil Nadu",
        pincode: "600034"
      },
      subtotal: 2598,
      discount: 260,
      shippingFee: 0,
      total: 2338,
      paymentMethod: "UPI Direct",
      paymentStatus: "Paid",
      orderStatus: "Dispatched",
      trackingNumber: "BD-TN-8829102",
      estimatedDelivery: "2026-07-25",
      courierPartner: "Express Logistics"
    }
  ];

  // Legacy prototype routes for review and coupon validation
  app.get("/api/products", (req, res) => {
    // Redirect to v1 endpoint format internally
    const { category, brand, minPrice, maxPrice, search, inStock, sortBy } = req.query;
    let result = [...products];

    if (category) {
      result = result.filter(p => p.category.toLowerCase() === (category as string).toLowerCase());
    }
    if (brand) {
      result = result.filter(p => p.brand.toLowerCase() === (brand as string).toLowerCase());
    }
    if (minPrice) {
      result = result.filter(p => p.price >= Number(minPrice));
    }
    if (maxPrice) {
      result = result.filter(p => p.price <= Number(maxPrice));
    }
    if (inStock === "true") {
      result = result.filter(p => p.inStock);
    }
    if (search) {
      const q = (search as string).toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.tags.some(t => t.toLowerCase().includes(q))
      );
    }
    res.json({ success: true, count: result.length, products: result });
  });

  app.post("/api/orders", (req, res) => {
    const { items, shippingAddress, subtotal, discount, shippingFee, total, paymentMethod } = req.body;
    if (!items || items.length === 0 || !shippingAddress) {
      return res.status(400).json({ success: false, message: "Invalid order payload" });
    }

    const randomId = "ANV-" + Math.floor(10000 + Math.random() * 90000);
    const trackingNum = "ANV-EXP-" + Math.floor(1000000 + Math.random() * 9000000);

    const southStates = ["tamil nadu", "kerala", "karnataka", "andhra pradesh", "telangana"];
    const isSouth = southStates.includes((shippingAddress.state || "").toLowerCase());
    const deliveryDays = isSouth ? 2 : 4;
    const estDate = new Date();
    estDate.setDate(estDate.getDate() + deliveryDays);

    const newOrder: Order = {
      id: randomId,
      createdAt: new Date().toISOString(),
      items,
      shippingAddress,
      subtotal,
      discount: discount || 0,
      shippingFee: shippingFee || 0,
      total,
      paymentMethod: paymentMethod || "UPI",
      paymentStatus: paymentMethod === "Cash on Delivery" ? "COD Confirmed" : "Paid",
      orderStatus: "Placed",
      trackingNumber: trackingNum,
      estimatedDelivery: estDate.toISOString().split("T")[0],
      courierPartner: isSouth ? "South Express Logistics" : "National Air Express"
    };

    orders.unshift(newOrder);

    res.json({
      success: true,
      message: "Order placed successfully",
      order: newOrder
    });
  });

  app.get("/api/orders/track/:query", (req, res) => {
    const query = req.params.query.trim().toLowerCase();
    const found = orders.filter(
      o =>
        o.id.toLowerCase() === query ||
        o.trackingNumber.toLowerCase() === query ||
        o.shippingAddress.phone.replace(/\D/g, "").includes(query.replace(/\D/g, "")) ||
        o.shippingAddress.email.toLowerCase() === query
    );

    if (found.length === 0) {
      return res.status(404).json({ success: false, message: "No active order found matching query." });
    }

    res.json({ success: true, orders: found });
  });

  app.post("/api/coupons/validate", (req, res) => {
    const { code, amount } = req.body;
    if (!code) return res.status(400).json({ success: false, message: "Code required" });

    const coupon = coupons.find(c => c.code.toUpperCase() === code.toUpperCase().trim());
    if (!coupon) {
      return res.status(404).json({ success: false, message: "Invalid coupon code" });
    }

    if (amount < coupon.minOrderAmount) {
      return res.status(400).json({
        success: false,
        message: `Coupon '${coupon.code}' requires a minimum cart value of ₹${coupon.minOrderAmount.toLocaleString()}`
      });
    }

    const discountValue = Math.round((amount * coupon.discountPercentage) / 100);

    res.json({
      success: true,
      coupon,
      discountAmount: discountValue,
      message: `Coupon ${coupon.code} applied! You saved ₹${discountValue.toLocaleString()}`
    });
  });

  app.post("/api/reviews", (req, res) => {
    const { productId, userName, location, rating, comment } = req.body;
    if (!productId || !comment || !rating) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const newRev: Review = {
      id: "REV-" + Date.now(),
      productId,
      userName: userName || "Anonymous Client",
      location: location || "South India",
      rating: Number(rating),
      comment,
      date: new Date().toISOString().split("T")[0],
      verifiedPurchase: true
    };

    reviews.unshift(newRev);

    res.json({ success: true, review: newRev, message: "Thank you for your review!" });
  });

  // ADMIN ENDPOINTS
  app.get("/api/admin/stats", (req, res) => {
    const totalRevenue = orders.reduce((acc, o) => acc + o.total, 0);
    const totalOrders = orders.length;
    const activeProducts = products.length;
    const customPrintOrders = orders.filter(o => o.items.some(i => i.customDesign)).length;

    res.json({
      success: true,
      stats: {
        totalRevenue,
        totalOrders,
        activeProducts,
        customPrintOrders
      },
      recentOrders: orders.slice(0, 10),
      products
    });
  });

  app.post("/api/admin/orders/:id/status", (req, res) => {
    const { status } = req.body;
    const order = orders.find(o => o.id === req.params.id);
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });

    order.orderStatus = status;
    res.json({ success: true, message: `Order status updated to ${status}`, order });
  });

  app.post("/api/admin/products", (req, res) => {
    const productData = req.body;
    if (!productData.name || !productData.price || !productData.category) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const newProduct: Product = {
      ...productData,
      id: productData.id || "ANV-PROD-" + Date.now(),
      rating: productData.rating || 5.0,
      reviewCount: productData.reviewCount || 1,
      inStock: true
    };

    products.unshift(newProduct);
    res.json({ success: true, product: newProduct, message: "Product added successfully" });
  });

  // Vite middleware for development or static serving for production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`ANIVA Server running on port ${PORT}`);
    logEnvironmentDiagnostics();
  });
}

startServer().catch(err => {
  console.error("Failed to start server:", err);
});
