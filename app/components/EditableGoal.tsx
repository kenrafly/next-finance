"use client";

import React, { useState } from "react";

// Define the structure of a financial goal
interface FinancialGoal {
  _id: string;
  title: string;
  amount: number;
  deadline: string; // Stored as an ISO string
}

// Define the component props
interface EditableGoalProps {
  goal: FinancialGoal;
  updateData: (
    id: string,
    updatedData: Partial<FinancialGoal>
  ) => Promise<void>;
  deleteData: (id: string) => Promise<void>;
}

const EditableGoal: React.FC<EditableGoalProps> = ({
  goal,
  updateData,
  deleteData,
}) => {
  const [isEditing, setIsEditing] = useState<keyof FinancialGoal | null>(null);
  const [formData, setFormData] = useState<FinancialGoal>({ ...goal });

  // Handle text click (switch to input mode)
  const handleEdit = (field: keyof FinancialGoal) => {
    setIsEditing(field);
  };

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: name === "amount" ? parseFloat(value) || 0 : value, // Ensure `amount` is a number
    }));
  };

  // Save changes when input loses focus
  const handleBlur = async () => {
    if (!isEditing) return;

    const updatedValue = formData[isEditing];
    if (goal[isEditing] !== updatedValue) {
      await updateData(goal._id, { [isEditing]: updatedValue });
    }

    setIsEditing(null); // Exit edit mode
  };

  // Handle delete action
  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this goal?")) {
      await deleteData(goal._id);
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
              name="title"
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
          className="hover:cursor-pointer bg-red-500 px-2 py-1 rounded-md"
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
            name="amount"
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
              minimumFractionDigits: 0, // No decimals for Rupiah
            }).format(formData.amount)}
          </span>
        )}
      </p>

      {/* Deadline */}
      <p>
        Deadline:{" "}
        {isEditing === "deadline" ? (
          <input
            type="date"
            name="deadline"
            value={formData.deadline.split("T")[0]} // Format the date
            onChange={handleChange}
            onBlur={handleBlur}
            autoFocus
            className="bg-transparent border-b focus:outline-none"
          />
        ) : (
          <span
            onClick={() => handleEdit("deadline")}
            className="cursor-pointer"
          >
            {new Date(formData.deadline).toLocaleDateString("en-GB", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
            })}
          </span>
        )}
      </p>
    </div>
  );
};

export default EditableGoal;
