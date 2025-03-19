"use client";
import React, { useState } from "react";

// Define the structure of a Wallet record
interface WalletRecord {
  _id: string;
  title: string;
  amount: number;
}

// Define the props for EditableWallet
interface EditableWalletProps {
  wallet: WalletRecord;
  updateData: (id: string, updatedData: Partial<WalletRecord>) => void;
  deleteData: (id: string) => Promise<void>;
}

const EditableWallet: React.FC<EditableWalletProps> = ({
  wallet,
  updateData,
  deleteData,
}) => {
  const [isEditing, setIsEditing] = useState<"title" | "amount" | null>(null);
  const [formData, setFormData] = useState<
    Pick<WalletRecord, "title" | "amount">
  >({
    title: wallet.title,
    amount: wallet.amount,
  });

  // Function to handle text click (switch to input mode)
  const handleEdit = (field: "title" | "amount") => {
    setIsEditing(field);
  };

  // Function to handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [isEditing as "title" | "amount"]: e.target.value,
    });
  };

  // Function to save changes when input loses focus
  const handleBlur = () => {
    if (isEditing) {
      updateData(wallet._id, formData); // Call function to update MongoDB
      setIsEditing(null); // Exit edit mode
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this wallet?")) {
      await deleteData(wallet._id); // Call delete function
    }
  };

  return (
    <div className="p-4 bg-gray-900 text-white rounded-lg w-full">
      {/* Title */}
      <div className="flex justify-between">
        <h2>
          {isEditing === "title" ? (
            <input
              type="text"
              value={formData.title}
              onChange={handleChange}
              onBlur={handleBlur}
              autoFocus
              className="bg-transparent border-b focus:outline-none"
            />
          ) : (
            <span
              onClick={() => handleEdit("title")}
              className="font-bold cursor-pointer"
            >
              {formData.title}
            </span>
          )}
        </h2>
        <button
          className="hover:cursor-pointer bg-pinkdark"
          onClick={handleDelete}
        >
          Delete
        </button>
      </div>

      {/* Amount */}
      <p>
        Amount:{" "}
        {isEditing === "amount" ? (
          <input
            type="number"
            value={formData.amount}
            onChange={handleChange}
            onBlur={handleBlur}
            autoFocus
            className="bg-transparent border-b focus:outline-none"
          />
        ) : (
          <span onClick={() => handleEdit("amount")} className="cursor-pointer">
            {new Intl.NumberFormat("id-ID", {
              style: "currency",
              currency: "IDR",
              minimumFractionDigits: 0, // Remove decimals for Rupiah
            }).format(formData.amount)}
          </span>
        )}
      </p>
    </div>
  );
};

export default EditableWallet;
