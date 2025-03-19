"use client";

import React, { useState, useContext } from "react";
import { useUser } from "@clerk/clerk-react";

// Define props type
interface BalFormProps {
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  addSavRecord: (newRecord: FinancialRecord) => Promise<void>;
}
// Define the structure of a financial record
interface FinancialRecord {
  userId: string;
  date: Date;
  title: string;
  amount: number;
  deadline: string;
}

const BalForm: React.FC<BalFormProps> = ({ setShow, addSavRecord }) => {
  const { user } = useUser();
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [deadline, setDeadline] = useState("");

  if (!user) return null;
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newRecord: FinancialRecord = {
      userId: user.id,
      date: new Date(), // Add missing date field
      title,
      amount: parseFloat(amount),
      deadline,
    };

    await addSavRecord(newRecord);
    setTitle("");
    setAmount("");
    setDeadline("");
    setShow(false);
  };

  return (
    <div className="fixed inset-0 z-40 backdrop-blur-xs flex items-center justify-center">
      <div className="flex flex-col w-3/4 h-2/3 bg-white rounded-xl p-7">
        <button
          className="text-black hover:cursor-pointer self-end"
          onClick={() => {
            setShow(false);
          }}
        >
          ✖
        </button>
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
              className="p-4 border-2 rounded-xl"
              type="number"
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
          <div className="flex flex-col">
            <label>Deadline:</label>
            <input
              className="p-4 border-2 rounded-xl"
              type="date"
              required
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
            />
          </div>
          <button className="bg-red-500 text-white px-4 py-2 rounded-lg">
            Add
          </button>
        </form>
      </div>
    </div>
  );
};

export default BalForm;
