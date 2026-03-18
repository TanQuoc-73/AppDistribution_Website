"use client"

import Navbar from "@/components/layout/navbar"
import Footer from "@/components/layout/footer"
import { useCartStore } from "@/store/cartStore"
import Link from "next/link"

export default function CartPage() {
    const { items, removeFromCart, clearCart, totalPrice } = useCartStore()

    if (items.length === 0) {
        return (
            <main className="min-h-screen bg-autumn-bg">
                <Navbar />
                <div className="max-w-7xl mx-auto px-6 py-24 text-center">
                    <div className="text-6xl mb-6">🛒</div>
                    <h1 className="text-2xl font-bold text-autumn-text mb-2">Your cart is empty</h1>
                    <p className="text-autumn-muted mb-6">Browse the store and add some amazing apps!</p>
                    <Link href="/store" className="inline-block px-6 py-3 rounded-xl bg-autumn-primary text-white font-semibold hover:bg-autumn-primary-hover transition">
                        Browse Store
                    </Link>
                </div>
                <Footer />
            </main>
        )
    }

    return (
        <main className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="max-w-7xl mx-auto px-6 py-10">
                <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Shopping Cart</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Cart items */}
                    <div className="lg:col-span-2 space-y-4">
                        {items.map((item) => (
                            <div key={item.product.id} className="flex items-center gap-4 bg-white rounded-2xl border border-autumn-border p-4 shadow-sm">
                                <img
                                    src={item.product.thumbnail ?? "/images/app1.jpg"}
                                    alt={item.product.name}
                                    className="w-20 h-20 rounded-xl object-cover"
                                />
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-semibold text-autumn-text truncate">{item.product.name}</h3>
                                    <p className="text-sm text-autumn-muted">Digital License</p>
                                </div>
                                <p className="font-bold text-autumn-accent whitespace-nowrap">
                                    ${(Number(item.product.price) * item.quantity).toFixed(2)}
                                </p>
                                <button
                                    onClick={() => removeFromCart(item.product.id)}
                                    className="p-2 rounded-lg text-autumn-muted hover:text-rose-500 hover:bg-rose-50 transition"
                                    title="Remove"
                                >
                                    ✕
                                </button>
                            </div>
                        ))}

                        <button
                            onClick={clearCart}
                            className="text-sm text-rose-500 hover:text-rose-700 font-medium transition"
                        >
                            Clear cart
                        </button>
                    </div>

                    {/* Order summary */}
                    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm h-fit sticky top-24">
                        <h2 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h2>

                        <div className="flex justify-between text-sm text-gray-600 mb-2">
                            <span>Subtotal ({items.length} item{items.length !== 1 ? "s" : ""})</span>
                            <span>${totalPrice().toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm text-gray-600 mb-4">
                            <span>Tax</span>
                            <span>$0.00</span>
                        </div>

                        <hr className="mb-4" />

                        <div className="flex justify-between text-lg font-bold text-gray-900 mb-6">
                            <span>Total</span>
                            <span>${totalPrice().toFixed(2)}</span>
                        </div>

                        <Link
                            href="/checkout"
                            className="block w-full py-3.5 rounded-xl bg-autumn-primary text-white text-center font-semibold hover:bg-autumn-primary-hover hover:shadow-lg transition-all"
                        >
                            Proceed to Checkout
                        </Link>
                    </div>

                </div>
            </div>

            <Footer />
        </main>
    )
}
