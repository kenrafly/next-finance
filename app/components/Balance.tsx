"use client";
import { useEffect, useState } from "react";
import BalForm from "@/app/components/BalForm";
import EditableGoal from "@/app/components/EditableGoal";
import {
  getBalance,
  createBalance,
  updateBalance,
  deleteBalance,
} from "@/lib/actions/balance.action";

interface FinancialRecord {
  _id: string;
  userId: string;
  title: string;
  amount: number;
  deadline: string;
}

const Balance = ({ userId }: { userId: string }) => {
  console.log("UserditerimA:", userId);
  const [show, setShow] = useState<boolean>(false);
  const [savRecords, setSavRecords] = useState<FinancialRecord[]>([]);

  // ✅ Ensure Hooks are always called at the top level
  useEffect(() => {
    if (!userId) {
      console.error("User is not logged in.");
      return;
    } // ✅ Move conditional inside useEffect()

    const fetchBalances = async () => {
      try {
        const records = await getBalance(userId);
        return setSavRecords(records);
      } catch (error) {
        console.error("Error fetching balance records:", error);
      }
    };
    fetchBalances();
  }, [userId]); // ✅ Add `user` to dependency array

  // ✅ Function to add a new record
  const addSavRecord = async (newRecord: Omit<FinancialRecord, "_id">) => {
    if (!userId) return;
    try {
      const createdRecord = await createBalance(userId, newRecord);
      setSavRecords((prev) => [...prev, createdRecord]);
    } catch (error) {
      console.error("Error creating balance record:", error);
    }
  };

  // ✅ Function to update a record
  const updateSavRecord = async (
    id: string,
    updatedData: Partial<FinancialRecord>
  ) => {
    try {
      const updatedRecord = await updateBalance(id, updatedData);
      setSavRecords((prev) =>
        prev.map((record) => (record._id === id ? updatedRecord : record))
      );
    } catch (error) {
      console.error("Error updating balance record:", error);
    }
  };

  // ✅ Function to delete a record
  const deleteSavRecord = async (id: string) => {
    try {
      await deleteBalance(id);
      setSavRecords((prev) => prev.filter((record) => record._id !== id));
    } catch (error) {
      console.error("Error deleting balance record:", error);
    }
  };

  return (
    <div className="bg-black min-h-screen p-4 flex flex-col gap-5">
      <div className="flex justify-end gap-2">
        <button
          className="bg-gradient-to-r from-red-500 to-yellow-500 border-2 hover:bg-gradient-to-l hover:cursor-pointer hover:scale-110 duration-500 hover:border-amber-300 transition border-white rounded-lg px-2"
          onClick={() => setShow(true)}
        >
          Add Data
        </button>
      </div>
      <div className="flex flex-col w-full h-full p-4 rounded-2xl gap-4 bg-gray-800">
        <h1 className="text-white text-2xl font-bold">Financial Goals</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {savRecords.map((goal) => (
            <EditableGoal
              key={goal._id}
              goal={goal}
              updateData={updateSavRecord}
              deleteData={deleteSavRecord}
            />
          ))}
        </div>
      </div>

      {show && (
        <BalForm show={show} setShow={setShow} addSavRecord={addSavRecord} />
      )}
    </div>
  );
};

export default Balance;
