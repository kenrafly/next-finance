"use server";

import mongoose from "mongoose";
import FinancialRecord from "../models/financial.model";
import { connectToDatabase } from "../mongoose";

// Define the expected type for financial records
interface FinancialRecordType {
  _id: string;
  userId: string;
  date: string;
  description: string;
  amount: number;
  category: string;
  paymentMethod: string;
}

// Fetch all financial records for a user
export async function getFinancialRecords(
  userId: string
): Promise<FinancialRecordType[]> {
  try {
    await connectToDatabase();

    // Fetch records and ensure they are converted to plain objects
    const records = await FinancialRecord.find({ userId }).lean();

    return records.map((record) => ({
      _id: (record._id as mongoose.Types.ObjectId).toString(), // ✅ Explicit type assertion
      userId: String(record.userId), // Ensure userId is a string
      date:
        record.date instanceof Date
          ? record.date.toISOString()
          : String(record.date), // Convert date to ISO string
      description: record.description,
      amount: Number(record.amount), // Ensure amount is a number
      category: record.category,
      paymentMethod: record.paymentMethod,
    })) as FinancialRecordType[];
  } catch (error) {
    console.error("❌ Error fetching financial records:", error);
    throw new Error("Failed to fetch financial records");
  }
}

export async function createFinancialRecord(data: Record<string, any>) {
  try {
    await connectToDatabase(); // Ensure MongoDB connection
    // Create a new financial record using provided data
    const newRecord = await FinancialRecord.create(data);
    return newRecord; // Return the newly created record
  } catch (error) {
    console.error("❌ Error creating financial record:", error);
    throw new Error("Failed to create financial record");
  }
}

export async function updateFinancialRecord(
  id: string,
  data: Record<string, any>
) {
  try {
    await connectToDatabase();

    const updatedRecord = await FinancialRecord.findByIdAndUpdate(id, data, {
      new: true,
    });

    if (!updatedRecord) {
      throw new Error("Record not found");
    }

    return JSON.parse(JSON.stringify(updatedRecord)); // Convert to plain object
  } catch (error) {
    console.error("❌ Error updating financial record:", error);
    throw new Error("Failed to update financial record");
  }
}

export async function deleteFinancialRecord(id: string) {
  try {
    await connectToDatabase();

    const deletedRecord = await FinancialRecord.findByIdAndDelete(id);

    if (!deletedRecord) {
      throw new Error("Record not found");
    }

    return { success: true, message: "Record deleted successfully" };
  } catch (error) {
    console.error("❌ Error deleting financial record:", error);
    throw new Error("Failed to delete financial record");
  }
}
