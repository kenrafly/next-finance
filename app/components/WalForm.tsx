"use client";
import React, { useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { WalletRecord } from "@/lib/types/types";
// Define props for the WalForm component
interface WalFormProps {
  show: boolean;
  setShow: (show: boolean) => void;
  addWalRecord: (newRecord: Omit<WalletRecord, "_id">) => void; // ✅ Correct type
}
// Define the Wallet record structure

// Mock function (Replace with actual API function)

const WalForm: React.FC<WalFormProps> = ({ show, setShow, addWalRecord }) => {
  if (!show) {
    return null;
  }

  const [title, setTitle] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const { user } = useUser();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!user) return;

    const newRecord: Omit<WalletRecord, "_id"> = {
      userId: user.id,
      date: new Date().toISOString(), // ✅ Convert Date to string
      title,
      amount: parseFloat(amount),
    };

    addWalRecord(newRecord);
    setTitle("");
    setAmount("");
  };

  return (
    <div className="fixed inset-0 z-40 backdrop-blur-xs flex items-center justify-center">
      <div className="flex flex-col w-3/4 h-2/3">
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
              <label>Title:</label>
              <input
                className="border-2 rounded-xl p-2"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="flex flex-col">
              <label>Amount:</label>
              <input
                className="p-4 border-2 rounded-xl w-1/2 h-5"
                type="number"
                placeholder="amount"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="justify-center items-center bg-gradient-to-r from-red-500 to-yellow-500 border-2 hover:bg-gradient-to-l hover:cursor-pointer duration-500 transition border-black rounded-lg px-2"
            >
              Add
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default WalForm;
