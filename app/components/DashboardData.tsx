"use client";

import React, { useState } from "react";
import Form from "./Form";
import Chart from "./Chart";
import FinancialRecordList from "./FinancialRecordList";

const DashboardData = () => {
  const [show, setShow] = useState(false);
  return (
    <div className="flex flex-col gap-5  bg-black min-h-screen text-white p-4">
      <div className="flex justify-end gap-2">
        <button
          className="bg-gradient-to-r from-red-500 to-yellow-500 border-2 hover:bg-gradient-to-l hover:cursor-pointer hover:scale-110 duration-500 hover:border-amber-300 transition  border-white rounded-lg px-2 "
          onClick={() => setShow(true)}
        >
          Add Data
        </button>
      </div>

      <div className="h-80">
        <Chart />
      </div>
      <div className="overflow-x-auto bg-gray-900 rounded-lg p-4">
        <FinancialRecordList />
      </div>

      <Form show={show} setShow={setShow} />
    </div>
  );
};

export default DashboardData;
