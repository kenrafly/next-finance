import React from "react";
import Wallet from "@/app/components/Wallet";
import { getUser } from "@/lib/actions/common";

const page = async () => {
  const user = await getUser();
  if (!user) {
    console.error("User is not logged in.");
    return;
  }

  return (
    <div>
      <Wallet userId={user.id} />
    </div>
  );
};
export default page;
