"use server";
import walletModel from "../models/wallet.model";
import { connectToDatabase } from "../mongoose";
import mongoose from "mongoose";

interface WalletType {
  _id: string;
  userId: string;
  date: string;
  title: string;
  amount: number;
}

export async function getWallet(userId: string) {
  try {
    await connectToDatabase();

    // Fetch wallet records from MongoDB
    const records = await walletModel.find({ userId }).lean();

    // Convert Mongoose object to plain JS object & format date properly
    const formattedData: WalletType[] = records.map((record) => ({
      _id: (record._id as mongoose.Types.ObjectId).toString(), // Ensure _id is a string
      userId: record.userId,
      date: record.date.toISOString(), // Convert Date to string
      title: record.title,
      amount: record.amount,
    }));
    return formattedData;
  } catch (error) {
    console.error("❌ Error fetching wallet records:", error);
    throw new Error("Failed to fetch wallet records");
  }
}

export async function createWallet(
  userId: string,
  data: Omit<WalletType, "_id">
) {
  try {
    await connectToDatabase();

    const newRecord = await walletModel.create({
      ...data,
      date: new Date(data.date).toISOString(), // ✅ Convert Date to string
    });

    return {
      ...newRecord.toObject(),
      _id: newRecord._id.toString(), // ✅ Convert _id to string
    };
  } catch (error) {
    console.error("❌ Error creating financial record:", error);
    throw new Error("Failed to create financial record");
  }
}

export async function updateWallet(id: string, data: Record<string, any>) {
  try {
    await connectToDatabase();

    const updatedRecord = await walletModel.findByIdAndUpdate(id, data, {
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

export async function deleteWallet(id: string) {
  try {
    await connectToDatabase();

    const deletedRecord = await walletModel.findByIdAndDelete(id);

    if (!deletedRecord) {
      throw new Error("Record not found");
    }

    return { success: true, message: "Record deleted successfully" };
  } catch (error) {
    console.error("❌ Error deleting financial record:", error);
    throw new Error("Failed to delete financial record");
  }
}
