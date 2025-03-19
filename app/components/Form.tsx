"use client";

import React, { useState } from "react";
import { useUser } from "@clerk/nextjs";

interface Show {
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
}

const Form = ({ show, setShow }: Show) => {
  if (!show) return null;

  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState<number | string>("");
  const [category, setCategory] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const { user } = useUser();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user || !user.id) {
      console.error("User is not logged in.");
      return;
    }

    const newRecord = {
      userId: user.id,
      date: new Date().toISOString(), // ✅ Make sure the date is serializable
      description,
      amount: typeof amount === "number" ? amount : parseFloat(amount),
      category,
      paymentMethod,
    };

    try {
      const response = await fetch("/api/financial-records", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newRecord),
      });

      if (!response.ok) {
        throw new Error("Failed to create financial record");
      }

      const data = await response.json();
      console.log("Record created:", data);

      // Reset form after successful submission
      setDescription("");
      setAmount("");
      setCategory("");
      setPaymentMethod("");
      setShow(false);
    } catch (error) {
      console.error("Error creating financial record:", error);
    }
  };

  return (
    <div className="fixed inset-0 z-40 backdrop-blur-xs flex items-center justify-center">
      <div className="flex flex-col w-3/4 h-3/4">
        <button
          className="text-white self-end hover:cursor-pointer"
          onClick={() => setShow(false)}
        >
          x
        </button>
        <div className="w-full h-full bg-white rounded-xl p-7 overflow-y-scroll overflow-x-clip no-scrollbar">
          <form
            className="text-black flex flex-col gap-4"
            onSubmit={handleSubmit}
          >
            <div className="flex flex-col">
              <label>Description:</label>
              <textarea
                className="border-2 rounded-xl p-2"
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
            </div>
            <div className="flex flex-col">
              <label>Amount:</label>
              <input
                className="p-4 border-2 rounded-xl w-1/2 h-5"
                type="number"
                placeholder="Amount"
                required
                value={amount}
                onChange={(e) =>
                  setAmount(e.target.value ? parseFloat(e.target.value) : "")
                }
              />
            </div>
            <div className="flex flex-col">
              <label>Payment Method:</label>
              <select
                required
                className="p-2 border-2 rounded-xl"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                <option value="">Select a Payment Method</option>
                <option value="Credit Card">Credit Card</option>
                <option value="Cash">Cash</option>
                <option value="Bank Transfer">Bank Transfer</option>
              </select>
            </div>
            <div className="flex flex-col">
              <label>Category:</label>
              <select
                required
                className="p-2 border-2 rounded-xl"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">Select a Category</option>
                <option value="Food">Food</option>
                <option value="Rent">Rent</option>
                <option value="Salary">Salary</option>
                <option value="Utilities">Utilities</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <button className="justify-center items-center bg-gradient-to-r from-red-500 to-yellow-500 border-2 hover:bg-gradient-to-l hover:cursor-pointer duration-500 transition border-black rounded-lg px-2">
              Add
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Form;
