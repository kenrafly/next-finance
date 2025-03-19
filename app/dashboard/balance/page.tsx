import { getUser } from "@/app/api/financial-records/route";
import Balance from "@/app/components/Balance";

import React from "react";

const page = async () => {
  const user = await getUser();
  if (!user) {
    console.error("User is not logged in.");
    return;
  }

  return (
    <div>
      <Balance userId={user.id} />
    </div>
  );
};

export default page;
