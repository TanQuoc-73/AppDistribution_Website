"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Navbar from "@/components/layout/navbar"
import Footer from "@/components/layout/footer"
import { useCartStore } from "@/store/cartStore"

const paymentMethods = [
    { id: "stripe", label: "Stripe", icon: "💳" },
    { id: "paypal", label: "PayPal", icon: "🅿️" },
    { id: "vnpay", label: "VNPay", icon: "🏦" },
]

export default function CheckoutPage() {
    const router = useRouter()
    const { items, totalPrice, clearCart } = useCartStore()
    const [payment, setPayment] = useState("stripe")
    const [processing, setProcessing] = useState(false)

    const handleConfirm = () => {
        setProcessing(true)
        setTimeout(() => {
            clearCart()
            router.push("/library")
        }, 1500)
    }

    if (items.length === 0 && !processing) {
        return (
            <main className="min-h-screen bg-gray-50">
                <Navbar />
                <div className="max-w-7xl mx-auto px-6 py-24 text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Nothing to checkout</h1>
                    <p className="text-gray-500">Your cart is empty.</p>
                </div>
                <Footer />
            </main>
        )
    }

    return (
        <main className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="max-w-3xl mx-auto px-6 py-10">
                <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Checkout</h1>

                {/* Order summary */}
                <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm mb-8">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h2>

                    <div className="space-y-3 mb-4">
                        {items.map((item) => (
                            <div key={item.product.id} className="flex justify-between text-sm">
                                <span className="text-gray-700">{item.product.name} × {item.quantity}</span>
                                <span className="font-medium">${(item.product.price * item.quantity).toFixed(2)}</span>
                            </div>
                        ))}
                    </div>

                    <hr className="my-4" />
                    <div className="flex justify-between text-lg font-bold text-gray-900">
                        <span>Total</span>
                        <span>${totalPrice().toFixed(2)}</span>
                    </div>
                </div>

                {/* Payment method */}
                <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm mb-8">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">Payment Method</h2>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {paymentMethods.map((pm) => (
                            <button
                                key={pm.id}
                                onClick={() => setPayment(pm.id)}
                                className={`flex items-center justify-center gap-2 py-4 rounded-xl border-2 font-medium transition-all ${payment === pm.id
                                        ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                                        : "border-gray-200 hover:border-gray-300 text-gray-700"
                                    }`}
                            >
                                <span className="text-xl">{pm.icon}</span>
                                {pm.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Confirm */}
                <button
                    onClick={handleConfirm}
                    disabled={processing}
                    className="w-full py-4 rounded-xl bg-indigo-600 text-white font-bold text-lg hover:bg-indigo-700 hover:shadow-lg transition-all disabled:opacity-60"
                >
                    {processing ? "Processing…" : "Confirm Purchase"}
                </button>
            </div>

            <Footer />
        </main>
    )
}
