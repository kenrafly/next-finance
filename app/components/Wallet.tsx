"use client";

import WalForm from "@/app/components/WalForm";
import React, { useEffect, useState } from "react";
import EditableWallet from "@/app/components/EditableWallet"; // Assuming this component exists
import {
  deleteWallet,
  getWallet,
  updateWallet,
  createWallet,
} from "@/lib/actions/wallet.action";
import { useUser } from "@clerk/nextjs";
import { WalletRecord } from "@/lib/types/types";

// Define the Wallet record structure

// Mock functions (Replace with actual API functions)

// Example wallet data (Replace with API call)

const Wallet = ({ userId }: { userId: string }) => {
  const [walletRecords, setWallet] = useState<WalletRecord[]>([]);
  const [show, setShow] = useState<boolean>(false);
  const { user } = useUser();

  useEffect(() => {
    if (!user) return;
    const fetchWallet = async () => {
      try {
        const records = await getWallet(user.id);
        return setWallet(records);
      } catch (error) {
        console.error("Error fetching wallet records:", error);
      }
    };
    fetchWallet();
  }, [user]);

  const addWallet = async (newRecord: Omit<WalletRecord, "_id">) => {
    if (!userId) return;
    try {
      const createdRecord = await createWallet(userId, newRecord);
      setWallet((prev) => [...prev, createdRecord]);
    } catch (error) {
      console.error("Error creating balance record:", error);
    }
  };
  const putWalRecord = async (
    id: string,
    updatedData: Partial<WalletRecord>
  ) => {
    try {
      // Update the wallet record
      const updatedRecord = await updateWallet(id, updatedData);
      setWallet((prev) =>
        prev.map((record) =>
          record._id === id ? { ...record, ...updatedRecord } : record
        )
      );
    } catch (error) {
      console.error("Error updating wallet record:", error);
    }
  };
  const delWalRecord = async (id: string) => {
    try {
      await deleteWallet(id);
      setWallet((prev) => prev.filter((record) => record._id !== id));
    } catch (error) {
      console.error("Error deleting wallet record:", error);
    }
  };

  return (
    <div className="bg-black h-full p-4">
      <div className="flex justify-between gap-2">
        <h1 className="text-white font-bold text-2xl">Wallet</h1>
        <button
          className="bg-gradient-to-r from-red-500 to-yellow-500 border-2 hover:bg-gradient-to-l hover:cursor-pointer hover:scale-110 duration-500 hover:border-amber-300 transition border-white rounded-lg px-2"
          onClick={() => setShow(true)}
        >
          Add Data
        </button>
      </div>
      <div className="flex flex-col w-full p-4 rounded-2xl gap-4 bg-gray-800 mt-4">
        <h1 className="text-white text-2xl font-bold">Wallet Balance</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {walletRecords.map((wallet) => (
            <EditableWallet
              key={wallet._id}
              wallet={wallet}
              updateData={putWalRecord}
              deleteData={delWalRecord}
            />
          ))}
        </div>
      </div>
      <WalForm show={show} setShow={setShow} addWalRecord={addWallet} />
    </div>
  );
};

export default Wallet;
