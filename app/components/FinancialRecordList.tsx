"use client";

import {
  getFinancialRecords,
  updateFinancialRecord,
  deleteFinancialRecord,
} from "@/lib/actions/financial.action";
import React, { useEffect, useMemo, useState } from "react";
import { useTable, Column } from "react-table";
import { useUser } from "@clerk/nextjs";

interface FinancialRecord {
  _id: string;
  description: string;
  amount: number;
  category: string;
  paymentMethod: string;
  date: string;
}

const FinancialRecordList: React.FC = () => {
  const { user } = useUser();
  const [records, setRecords] = useState<FinancialRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      const fetchRecords = async () => {
        try {
          const fetchedRecords = await getFinancialRecords(user.id);
          setRecords(fetchedRecords);
        } catch (error) {
          console.error("❌ Error fetching financial records:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchRecords();
    }
  }, [user]);

  const updateCellRecord = async (
    rowIndex: number,
    columnId: string,
    newValue: any
  ) => {
    setRecords((prevRecords) =>
      prevRecords.map((record, index) =>
        index === rowIndex ? { ...record, [columnId]: newValue } : record
      )
    );

    try {
      const recordId = records[rowIndex]._id;
      await updateFinancialRecord(recordId, { [columnId]: newValue });
    } catch (error) {
      console.error("❌ Error updating financial record:", error);
    }
  };

  const delRecord = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this record?")) return;

    try {
      await deleteFinancialRecord(id);
      setRecords((prevRecords) =>
        prevRecords.filter((record) => record._id !== id)
      );
    } catch (error) {
      console.error("❌ Error deleting financial record:", error);
    }
  };

  const columns: Column<FinancialRecord>[] = useMemo(
    () => [
      {
        Header: "Description",
        accessor: "description",
        Cell: ({ value, row }) => (
          <EditableCell
            value={value}
            row={row}
            column={{ id: "description" }}
            updateRecord={updateCellRecord}
            editable
          />
        ),
      },
      {
        Header: "Amount",
        accessor: "amount",
        Cell: ({ value, row }) => (
          <EditableCell
            value={value}
            row={row}
            column={{ id: "amount" }}
            updateRecord={updateCellRecord}
            editable
          />
        ),
      },
      {
        Header: "Category",
        accessor: "category",
        Cell: ({ value, row }) => (
          <EditableCell
            value={value}
            row={row}
            column={{ id: "category" }}
            updateRecord={updateCellRecord}
            editable
          />
        ),
      },
      {
        Header: "Payment Method",
        accessor: "paymentMethod",
        Cell: ({ value, row }) => (
          <EditableCell
            value={value}
            row={row}
            column={{ id: "paymentMethod" }}
            updateRecord={updateCellRecord}
            editable
          />
        ),
      },
      {
        Header: "Date",
        accessor: "date",
        Cell: ({ value, row }) => (
          <EditableCell
            value={value}
            row={row}
            column={{ id: "date" }}
            updateRecord={updateCellRecord}
            editable
          />
        ),
      },
      {
        Header: "Delete",
        Cell: ({ row }) => (
          <button
            onClick={() => delRecord(row.original._id)}
            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-700 transition"
          >
            Delete
          </button>
        ),
      },
    ],
    [records]
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data: records });

  if (loading) return <p>Loading records...</p>;
  if (!records.length) return <p>No records found.</p>;

  return (
    <div className="overflow-x-auto w-full">
      <table
        {...getTableProps()}
        className="w-full border-collapse border border-gray-300"
      >
        <thead className="bg-gray-800 text-white">
          {headerGroups.map((hg, index) => (
            <tr
              {...hg.getHeaderGroupProps()}
              key={hg.getHeaderGroupProps().key || index}
            >
              {hg.headers.map((column) => (
                <th
                  {...column.getHeaderProps()}
                  className="p-3 border border-gray-600 text-left"
                  key={column.id}
                >
                  {column.render("Header")}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()} className="bg-gray-100 text-black">
          {rows.map((row) => {
            prepareRow(row);
            return (
              <tr
                {...row.getRowProps()}
                className="hover:bg-gray-500"
                key={row.id}
              >
                {row.cells.map((cell) => (
                  <td
                    {...cell.getCellProps()}
                    className="p-3 border border-gray-600"
                    key={cell.column.id}
                  >
                    {cell.render("Cell")}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

interface EditableCellProps {
  value: any;
  row: { index: number; original: FinancialRecord };
  column: { id: string };
  updateRecord: (rowIndex: number, columnId: string, value: any) => void;
  editable: boolean;
}

const EditableCell: React.FC<EditableCellProps> = ({
  value: initialValue,
  row,
  column,
  updateRecord,
  editable,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(initialValue);

  const handleBlur = async () => {
    setIsEditing(false);
    if (value !== initialValue) {
      updateRecord(row.index, column.id, value);

      try {
        await updateFinancialRecord(row.original._id, { [column.id]: value });
      } catch (error) {
        console.error("❌ Error updating record:", error);
      }
    }
  };

  return (
    <div
      onClick={() => editable && setIsEditing(true)}
      style={{ cursor: editable ? "pointer" : "default" }}
    >
      {isEditing ? (
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          autoFocus
          onBlur={handleBlur}
          className="border rounded p-1 w-full"
        />
      ) : typeof value === "string" ? (
        value
      ) : (
        value.toString()
      )}
    </div>
  );
};

export default FinancialRecordList;
