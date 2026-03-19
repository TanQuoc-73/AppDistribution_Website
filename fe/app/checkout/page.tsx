"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Navbar from "@/components/layout/navbar"
import Footer from "@/components/layout/footer"
import { useCartStore } from "@/store/cartStore"
import { orderService } from "@/services/order.service"

const paymentMethods = [
    { id: "stripe", label: "Stripe", icon: "💳" },
    { id: "paypal", label: "PayPal", icon: "🅿️" },
    { id: "vnpay", label: "VNPay", icon: "🏦" },
]

type Stage = "idle" | "processing" | "success" | "error"

export default function CheckoutPage() {
    const router = useRouter()
    const { items, totalPrice, clearCart } = useCartStore()
    const [payment, setPayment] = useState("stripe")
    const [stage, setStage] = useState<Stage>("idle")
    const [orderId, setOrderId] = useState<string | null>(null)
    const [errorMsg, setErrorMsg] = useState("")

    const handleConfirm = async () => {
        setStage("processing")
        setErrorMsg("")

        // Simulate payment gateway delay
        await new Promise((r) => setTimeout(r, 1500))

        try {
            const orderItems = items.map((item) => ({
                productId: item.product.id,
                price: Number(item.product.price) * item.quantity,
            }))

            const order = await orderService.createOrder(orderItems)
            setOrderId(order.id)
            setStage("success")

            // Redirect to library after success screen
            setTimeout(() => {
                clearCart()
                router.push("/library")
            }, 2500)
        } catch (err: any) {
            const msg =
                err?.response?.data?.message ??
                "Payment failed. Please try again."
            setErrorMsg(Array.isArray(msg) ? msg.join(", ") : String(msg))
            setStage("error")
        }
    }

    // ── Empty cart guard ────────────────────────────────────────────────────
    if (items.length === 0 && stage === "idle") {
        return (
            <main className="min-h-screen bg-autumn-bg">
                <Navbar />
                <div className="max-w-7xl mx-auto px-6 py-24 text-center">
                    <div className="text-6xl mb-6">🛒</div>
                    <h1 className="text-2xl font-bold text-autumn-text mb-2">Nothing to checkout</h1>
                    <p className="text-autumn-muted mb-6">Your cart is empty.</p>
                    <Link href="/store" className="px-6 py-3 rounded-xl bg-autumn-primary text-white font-semibold hover:bg-autumn-primary-hover transition">
                        Browse Store
                    </Link>
                </div>
                <Footer />
            </main>
        )
    }

    // ── Processing screen ───────────────────────────────────────────────────
    if (stage === "processing") {
        return (
            <main className="min-h-screen bg-autumn-bg flex items-center justify-center">
                <div className="text-center space-y-6">
                    <div className="relative w-24 h-24 mx-auto">
                        <div className="absolute inset-0 rounded-full border-4 border-autumn-border" />
                        <div className="absolute inset-0 rounded-full border-4 border-autumn-primary border-t-transparent animate-spin" />
                        <div className="absolute inset-0 flex items-center justify-center text-3xl">
                            {paymentMethods.find((p) => p.id === payment)?.icon ?? "💳"}
                        </div>
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-autumn-text">Processing Payment…</h2>
                        <p className="text-autumn-muted text-sm mt-1">
                            Please wait while we confirm your {paymentMethods.find((p) => p.id === payment)?.label} payment
                        </p>
                    </div>
                </div>
            </main>
        )
    }

    // ── Success screen ──────────────────────────────────────────────────────
    if (stage === "success") {
        return (
            <main className="min-h-screen bg-autumn-bg flex items-center justify-center">
                <div className="text-center space-y-4 max-w-sm px-6">
                    <div className="w-20 h-20 mx-auto rounded-full bg-emerald-100 flex items-center justify-center text-4xl animate-bounce">
                        ✅
                    </div>
                    <h2 className="text-2xl font-extrabold text-autumn-text">Payment Successful!</h2>
                    <p className="text-autumn-muted text-sm">
                        Your order has been placed. Apps are now available in your library.
                    </p>
                    {orderId && (
                        <div className="bg-autumn-surface border border-autumn-border rounded-xl px-4 py-2 text-xs text-autumn-muted font-mono break-all">
                            Order ID: {orderId}
                        </div>
                    )}
                    <p className="text-xs text-autumn-muted">Redirecting to your library…</p>
                </div>
            </main>
        )
    }

    // ── Main checkout form ──────────────────────────────────────────────────
    return (
        <main className="min-h-screen bg-autumn-bg">
            <Navbar />

            <div className="max-w-3xl mx-auto px-6 py-10">
                <h1 className="text-3xl font-extrabold text-autumn-text mb-8">Checkout</h1>

                {/* Error banner */}
                {stage === "error" && (
                    <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-start gap-3">
                        <span className="text-xl">⚠️</span>
                        <div>
                            <p className="font-semibold">Payment failed</p>
                            <p className="mt-0.5">{errorMsg}</p>
                        </div>
                    </div>
                )}

                {/* Order summary */}
                <div className="bg-white rounded-2xl border border-autumn-border p-6 shadow-sm mb-6">
                    <h2 className="text-lg font-bold text-autumn-text mb-4">Order Summary</h2>

                    <div className="space-y-3 mb-4">
                        {items.map((item) => (
                            <div key={item.product.id} className="flex items-center gap-3">
                                <img
                                    src={item.product.thumbnail ?? "/images/app1.jpg"}
                                    alt={item.product.name}
                                    className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                                />
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-autumn-text truncate">{item.product.name}</p>
                                    <p className="text-xs text-autumn-muted">Digital License</p>
                                </div>
                                <span className="text-sm font-bold text-autumn-accent whitespace-nowrap">
                                    ${(Number(item.product.price) * item.quantity).toFixed(2)}
                                </span>
                            </div>
                        ))}
                    </div>

                    <hr className="border-autumn-border my-4" />

                    <div className="flex justify-between text-sm text-autumn-muted mb-1">
                        <span>Subtotal ({items.length} item{items.length !== 1 ? "s" : ""})</span>
                        <span>${totalPrice().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-autumn-muted mb-4">
                        <span>Tax</span>
                        <span>$0.00</span>
                    </div>
                    <div className="flex justify-between text-lg font-extrabold text-autumn-text">
                        <span>Total</span>
                        <span className="text-autumn-accent">${totalPrice().toFixed(2)}</span>
                    </div>
                </div>

                {/* Payment method */}
                <div className="bg-white rounded-2xl border border-autumn-border p-6 shadow-sm mb-8">
                    <h2 className="text-lg font-bold text-autumn-text mb-4">Payment Method</h2>

                    <div className="grid grid-cols-3 gap-3">
                        {paymentMethods.map((pm) => (
                            <button
                                key={pm.id}
                                onClick={() => setPayment(pm.id)}
                                className={`flex flex-col items-center justify-center gap-1 py-4 rounded-xl border-2 font-medium transition-all ${
                                    payment === pm.id
                                        ? "border-autumn-primary bg-autumn-primary/5 text-autumn-primary"
                                        : "border-autumn-border hover:border-autumn-muted text-autumn-muted"
                                }`}
                            >
                                <span className="text-2xl">{pm.icon}</span>
                                <span className="text-sm">{pm.label}</span>
                            </button>
                        ))}
                    </div>

                    <p className="mt-4 text-xs text-autumn-muted text-center">
                        🔒 Simulated payment — no real charges will be made
                    </p>
                </div>

                {/* Confirm button */}
                <button
                    onClick={handleConfirm}
                    disabled={stage === "processing"}
                    className="w-full py-4 rounded-xl bg-autumn-primary text-white font-bold text-lg hover:bg-autumn-primary-hover hover:shadow-lg transition-all disabled:opacity-50"
                >
                    Confirm Purchase · ${totalPrice().toFixed(2)}
                </button>

                <Link
                    href="/cart"
                    className="block text-center mt-4 text-sm text-autumn-muted hover:text-autumn-text transition"
                >
                    ← Back to cart
                </Link>
            </div>

            <Footer />
        </main>
    )
}
