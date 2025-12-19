import React from "react";
import AddProductForm from "../Components/AddProductForm";

const AdminAddProduct = () => {
  return (
    <div className="bg-black min-h-screen p-6">
      <h1 className="text-center text-4xl font-bold mb-8 text-white tracking-tight">
        Add New Product
      </h1>
      <AddProductForm />
    </div>
  );
};

export default AdminAddProduct;
