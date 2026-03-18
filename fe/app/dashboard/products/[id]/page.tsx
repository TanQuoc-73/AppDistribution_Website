import React from 'react';
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import VersionUpload from "./VersionUpload";

// In Next.js App Router, dynamic routes receive params as a promise in Server Components
export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const productId = resolvedParams.id;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Manage Product</h1>
        <p className="text-gray-600 mb-8">Upload new releases and track downloads for your software.</p>
        
        {/* We would fetch and display existing product info and versions here */}
        
        <VersionUpload productId={productId} />
      </main>
      <Footer />
    </div>
  );
}
