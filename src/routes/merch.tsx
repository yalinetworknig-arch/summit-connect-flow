import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { ShoppingBag, Plus, Minus } from "lucide-react";

export const Route = createFileRoute("/merch")({
  head: () => ({
    meta: [
      { title: "Merchandise Store — YALI Summit 2026" },
      {
        name: "description",
        content: "Order exclusive AIDIFILN 2026 merchandise and apparel.",
      },
      {
        property: "og:title",
        content: "Merchandise Store — YALI Summit 2026",
      },
      {
        property: "og:description",
        content: "Order exclusive AIDIFILN 2026 merchandise and apparel.",
      },
    ],
  }),
  component: MerchPage,
});

const MERCH_PRODUCTS = [
  {
    id: "tshirt",
    name: "AIDIFILN T-Shirt",
    description: "Official AIDIFILN 2026 t-shirt with front and back design",
    price: 8000, // in Naira
    image: "🎽",
    sizes: ["M", "L", "XL", "2XL"],
    colors: ["black", "white"],
  },
];

interface CartItem {
  productId: string;
  size: string;
  color: string;
  quantity: number;
}

function MerchPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [selectedQty, setSelectedQty] = useState(1);

  function addToCart(productId: string) {
    if (!selectedSize || !selectedColor) {
      alert("Please select size and color");
      return;
    }

    const existingItem = cart.find(
      (item) =>
        item.productId === productId &&
        item.size === selectedSize &&
        item.color === selectedColor
    );

    if (existingItem) {
      setCart(
        cart.map((item) =>
          item === existingItem
            ? { ...item, quantity: item.quantity + selectedQty }
            : item
        )
      );
    } else {
      setCart([
        ...cart,
        {
          productId,
          size: selectedSize,
          color: selectedColor,
          quantity: selectedQty,
        },
      ]);
    }

    // Reset
    setSelectedSize("");
    setSelectedColor("");
    setSelectedQty(1);
  }

  function removeFromCart(index: number) {
    setCart(cart.filter((_, i) => i !== index));
  }

  function updateQuantity(index: number, delta: number) {
    setCart(
      cart.map((item, i) => {
        if (i === index) {
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : item;
        }
        return item;
      })
    );
  }

  const cartTotal = cart.reduce((sum, item) => {
    const product = MERCH_PRODUCTS.find((p) => p.id === item.productId);
    return sum + (product?.price || 0) * item.quantity;
  }, 0);

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 py-10 md:py-14">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-12 text-center"
      >
        <div className="flex items-center justify-center gap-3 mb-4">
          <ShoppingBag className="w-8 h-8" style={{ color: "var(--accent-cyan)" }} />
          <h1
            className="font-bold"
            style={{
              fontFamily: "Space Grotesk, sans-serif",
              fontSize: "clamp(28px, 4vw, 40px)",
              color: "var(--text-primary)",
            }}
          >
            Merchandise Store
          </h1>
        </div>
        <p style={{ color: "var(--text-secondary)" }}>
          Get exclusive AIDIFILN 2026 apparel and merch
        </p>
      </motion.header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Products */}
        <div className="lg:col-span-2 space-y-6">
          {MERCH_PRODUCTS.map((product) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border p-6"
              style={{ background: "var(--card)", borderColor: "var(--border-strong)" }}
            >
              {/* Product header */}
              <div className="flex gap-6 mb-6">
                <div
                  className="text-6xl"
                  style={{
                    width: "120px",
                    height: "120px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "var(--surface)",
                    borderRadius: "12px",
                  }}
                >
                  {product.image}
                </div>
                <div className="flex-1">
                  <h2
                    className="text-2xl font-bold mb-2"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {product.name}
                  </h2>
                  <p style={{ color: "var(--text-secondary)" }}>
                    {product.description}
                  </p>
                  <p
                    className="text-3xl font-bold mt-3"
                    style={{ color: "var(--accent-cyan)" }}
                  >
                    ₦{product.price.toLocaleString("en-NG")}
                  </p>
                </div>
              </div>

              {/* Size and Color Selection */}
              <div className="space-y-4 mb-6">
                {/* Size */}
                <div>
                  <label className="text-sm font-semibold block mb-2" style={{ color: "var(--text-primary)" }}>
                    Size
                  </label>
                  <div className="flex gap-2 flex-wrap">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className="px-4 py-2 rounded-lg font-medium transition-all"
                        style={{
                          background:
                            selectedSize === size
                              ? "var(--accent-cyan)"
                              : "var(--surface)",
                          color:
                            selectedSize === size
                              ? "var(--brand-navy)"
                              : "var(--text-primary)",
                          border:
                            selectedSize === size
                              ? "2px solid var(--accent-cyan)"
                              : "2px solid var(--border-strong)",
                        }}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Color */}
                <div>
                  <label className="text-sm font-semibold block mb-2" style={{ color: "var(--text-primary)" }}>
                    Color
                  </label>
                  <div className="flex gap-2 flex-wrap">
                    {product.colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className="px-4 py-2 rounded-lg font-medium transition-all capitalize"
                        style={{
                          background:
                            selectedColor === color
                              ? "var(--accent-cyan)"
                              : "var(--surface)",
                          color:
                            selectedColor === color
                              ? "var(--brand-navy)"
                              : "var(--text-primary)",
                          border:
                            selectedColor === color
                              ? "2px solid var(--accent-cyan)"
                              : "2px solid var(--border-strong)",
                        }}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quantity */}
                <div>
                  <label className="text-sm font-semibold block mb-2" style={{ color: "var(--text-primary)" }}>
                    Quantity
                  </label>
                  <div className="flex items-center gap-2 w-fit">
                    <button
                      onClick={() => setSelectedQty(Math.max(1, selectedQty - 1))}
                      className="p-2 rounded-lg"
                      style={{
                        background: "var(--surface)",
                        border: "1px solid var(--border-strong)",
                      }}
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span
                      className="w-12 text-center font-semibold"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {selectedQty}
                    </span>
                    <button
                      onClick={() => setSelectedQty(selectedQty + 1)}
                      className="p-2 rounded-lg"
                      style={{
                        background: "var(--surface)",
                        border: "1px solid var(--border-strong)",
                      }}
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={() => addToCart(product.id)}
                className="w-full py-3 rounded-full text-sm font-semibold flex items-center justify-center gap-2"
                style={{
                  background: "var(--accent-cyan)",
                  color: "var(--brand-navy)",
                }}
              >
                <ShoppingBag className="w-4 h-4" />
                Add to Cart
              </button>
            </motion.div>
          ))}
        </div>

        {/* Cart Sidebar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border p-6 h-fit sticky top-6"
          style={{ background: "var(--card)", borderColor: "var(--border-strong)" }}
        >
          <h3
            className="text-xl font-bold mb-4"
            style={{ color: "var(--text-primary)" }}
          >
            🛒 Your Cart
          </h3>

          {cart.length === 0 ? (
            <p style={{ color: "var(--text-secondary)" }}>
              Your cart is empty. Add items to get started.
            </p>
          ) : (
            <>
              <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                {cart.map((item, index) => {
                  const product = MERCH_PRODUCTS.find(
                    (p) => p.id === item.productId
                  );
                  return (
                    <div
                      key={index}
                      className="flex items-start justify-between gap-3 p-3 rounded-lg"
                      style={{ background: "var(--surface)" }}
                    >
                      <div className="flex-1">
                        <p
                          className="font-semibold text-sm"
                          style={{ color: "var(--text-primary)" }}
                        >
                          {product?.name}
                        </p>
                        <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
                          {item.size} • {item.color}
                        </p>
                        <div className="flex gap-2 mt-2 items-center">
                          <button
                            onClick={() => updateQuantity(index, -1)}
                            className="p-1"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-medium w-4 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(index, 1)}
                            className="p-1"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-sm" style={{ color: "var(--accent-cyan)" }}>
                          ₦{((product?.price || 0) * item.quantity).toLocaleString("en-NG")}
                        </p>
                        <button
                          onClick={() => removeFromCart(index)}
                          className="text-xs mt-1"
                          style={{ color: "var(--error)" }}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Total and Checkout */}
              <div className="border-t" style={{ borderColor: "var(--border-strong)" }}>
                <div className="flex justify-between mt-4 mb-4">
                  <span style={{ color: "var(--text-secondary)" }}>Subtotal:</span>
                  <span
                    className="font-bold"
                    style={{ color: "var(--text-primary)" }}
                  >
                    ₦{cartTotal.toLocaleString("en-NG")}
                  </span>
                </div>
                <button
                  disabled={cart.length === 0}
                  className="w-full py-3 rounded-full text-sm font-semibold disabled:opacity-50"
                  style={{
                    background: "var(--accent-cyan)",
                    color: "var(--brand-navy)",
                  }}
                >
                  Proceed to Checkout
                </button>
                <p className="text-xs mt-3 text-center" style={{ color: "var(--text-secondary)" }}>
                  💬 Coming soon: Order placement and payment
                </p>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </section>
  );
}
