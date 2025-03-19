"use server";

import BalanceRecord from "../models/balance.model";
import { Types } from "mongoose";
import { connectToDatabase } from "../mongoose";

interface FinancialRecord {
  _id: string;
  userId: string;
  title: string;
  amount: number;
  deadline: string;
}

export async function getBalance(userId: string): Promise<FinancialRecord[]> {
  try {
    await connectToDatabase();

    // ✅ Fetch records with lean() for better performance
    const balance = await BalanceRecord.find({ userId }).lean();

    // ✅ Ensure `_id` is properly converted to string
    const formattedBalance: FinancialRecord[] = balance.map((record) => ({
      _id:
        record._id instanceof Types.ObjectId
          ? record._id.toString()
          : String(record._id),
      userId: record.userId,
      title: record.title,
      amount: record.amount,
      deadline: record.deadline,
    }));

    return formattedBalance;
  } catch (error) {
    console.error("❌ Error fetching balance:", error);
    throw new Error("Failed to fetch balance");
  }
}

export async function createBalance(
  userId: string,
  data: Omit<FinancialRecord, "_id">
) {
  try {
    await connectToDatabase();
    const newBalance = await BalanceRecord.create({ ...data, userId });

    return {
      _id: newBalance._id.toString(), // Convert ObjectId to string
      userId: newBalance.userId,
      title: newBalance.title,
      amount: newBalance.amount,
      deadline: newBalance.deadline,
    };
  } catch (error) {
    console.error("❌ Error creating balance:", error);
    throw new Error("Failed to create balance");
  }
}

export async function deleteBalance(id: string): Promise<FinancialRecord> {
  try {
    await connectToDatabase();

    // Ensure the deleted balance is correctly typed
    const deletedBalance = await BalanceRecord.findByIdAndDelete(
      id
    ).lean<FinancialRecord>();

    if (!deletedBalance) {
      throw new Error("Balance not found");
    }

    return {
      _id: deletedBalance._id.toString(), // Ensure _id is a string
      userId: deletedBalance.userId?.toString() || "",
      title: deletedBalance.title || "",
      amount: deletedBalance.amount ?? 0,
      deadline: deletedBalance.deadline
        ? new Date(deletedBalance.deadline).toISOString()
        : "",
    };
  } catch (error) {
    console.error("❌ Error deleting balance:", error);
    throw new Error("Failed to delete balance");
  }
}

export async function updateBalance(
  id: string,
  updatedData: Partial<FinancialRecord>
) {
  try {
    await connectToDatabase();

    // ✅ Ensure Mongoose returns a plain object
    const updatedRecord = await BalanceRecord.findByIdAndUpdate(
      id,
      updatedData,
      { new: true }
    ).lean<FinancialRecord>(); // Explicitly define the expected type

    if (!updatedRecord) throw new Error("Balance record not found");

    const updateBalance: FinancialRecord = {
      _id: updatedRecord._id.toString(), // Ensure ObjectId is a string
      userId: updatedRecord.userId.toString(), // Ensure ObjectId is a string
      title: updatedRecord.title || "", // Ensure title exists
      amount: updatedRecord.amount ?? 0, // Ensure amount is a number
      deadline: updatedRecord.deadline
        ? new Date(updatedRecord.deadline).toISOString()
        : "", // Ensure deadline is formatted
    };
    return updateBalance;
  } catch (error) {
    console.error("❌ Error updating balance:", error);
    throw new Error("Failed to update balance");
  }
}
