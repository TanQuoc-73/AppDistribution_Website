"use client"

import { useState } from "react"
import Navbar from "@/components/layout/navbar"
import Footer from "@/components/layout/footer"

type Product = {
    id: number
    name: string
    price: number
    category: string
    image: string
}

const initialProducts: Product[] = [
    { id: 1, name: "AI Image Generator", price: 19.99, category: "AI Tools", image: "/images/app1.jpg" },
    { id: 2, name: "Code Editor Pro", price: 29.99, category: "Developer Tools", image: "/images/app2.jpg" },
    { id: 3, name: "Cloud Storage Plus", price: 9.99, category: "Office", image: "/images/app3.jpg" },
    { id: 4, name: "Photo Retouch Studio", price: 14.99, category: "Design", image: "/images/app4.jpg" },
]

export default function AdminProductsPage() {
    const [products, setProducts] = useState<Product[]>(initialProducts)
    const [editing, setEditing] = useState<Product | null>(null)
    const [showForm, setShowForm] = useState(false)

    // Form state
    const [formName, setFormName] = useState("")
    const [formPrice, setFormPrice] = useState("")
    const [formCategory, setFormCategory] = useState("")

    const openCreate = () => {
        setEditing(null)
        setFormName("")
        setFormPrice("")
        setFormCategory("")
        setShowForm(true)
    }

    const openEdit = (p: Product) => {
        setEditing(p)
        setFormName(p.name)
        setFormPrice(String(p.price))
        setFormCategory(p.category)
        setShowForm(true)
    }

    const handleSave = () => {
        if (!formName.trim() || !formPrice || !formCategory.trim()) return

        if (editing) {
            setProducts((prev) =>
                prev.map((p) =>
                    p.id === editing.id ? { ...p, name: formName, price: Number(formPrice), category: formCategory } : p
                )
            )
        } else {
            const newProduct: Product = {
                id: Date.now(),
                name: formName,
                price: Number(formPrice),
                category: formCategory,
                image: "/images/app1.jpg",
            }
            setProducts((prev) => [...prev, newProduct])
        }
        setShowForm(false)
    }

    const handleDelete = (id: number) => {
        setProducts((prev) => prev.filter((p) => p.id !== id))
    }

    return (
        <main className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="max-w-7xl mx-auto px-6 py-10">

                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-extrabold text-gray-900">Manage Products</h1>
                    <button
                        onClick={openCreate}
                        className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold text-sm hover:bg-indigo-700 transition"
                    >
                        + Add Product
                    </button>
                </div>

                {/* Form modal */}
                {showForm && (
                    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl space-y-4">
                            <h2 className="text-xl font-bold text-gray-900">
                                {editing ? "Edit Product" : "Create Product"}
                            </h2>

                            <input
                                value={formName}
                                onChange={(e) => setFormName(e.target.value)}
                                placeholder="Product name"
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                            <input
                                value={formPrice}
                                onChange={(e) => setFormPrice(e.target.value)}
                                type="number"
                                step="0.01"
                                placeholder="Price"
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                            <input
                                value={formCategory}
                                onChange={(e) => setFormCategory(e.target.value)}
                                placeholder="Category"
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />

                            <div className="flex gap-3 pt-2">
                                <button
                                    onClick={handleSave}
                                    className="flex-1 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold text-sm hover:bg-indigo-700 transition"
                                >
                                    {editing ? "Save Changes" : "Create"}
                                </button>
                                <button
                                    onClick={() => setShowForm(false)}
                                    className="flex-1 py-2.5 rounded-xl border border-gray-300 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Product table */}
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="text-left p-4 font-semibold text-gray-600">Product</th>
                                <th className="text-left p-4 font-semibold text-gray-600">Category</th>
                                <th className="text-left p-4 font-semibold text-gray-600">Price</th>
                                <th className="text-right p-4 font-semibold text-gray-600">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((p) => (
                                <tr key={p.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition">
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <img src={p.image} alt={p.name} className="w-10 h-10 rounded-lg object-cover" />
                                            <span className="font-medium text-gray-900">{p.name}</span>
                                        </div>
                                    </td>
                                    <td className="p-4 text-gray-500">{p.category}</td>
                                    <td className="p-4 font-medium text-indigo-600">${Number(p.price).toFixed(2)}</td>
                                    <td className="p-4 text-right">
                                        <button onClick={() => openEdit(p)} className="text-indigo-600 hover:text-indigo-800 font-medium mr-3 transition">
                                            Edit
                                        </button>
                                        <button onClick={() => handleDelete(p.id)} className="text-rose-500 hover:text-rose-700 font-medium transition">
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

            </div>

            <Footer />
        </main>
    )
}
