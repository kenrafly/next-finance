import { NextResponse } from "next/server";
import { createFinancialRecord } from "@/lib/actions/financial.action"; // Ensure this is correctly implemented
import { currentUser } from "@clerk/nextjs/server";

export const getUser = async () => {
  const user = await currentUser();
  return user;
};

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body.userId || !body.amount || !body.category) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const record = await createFinancialRecord(body);

    return NextResponse.json({ success: true, record }, { status: 201 });
  } catch (error: any) {
    console.error("Error in API route:", error);
    return NextResponse.json(
      { error: "Server error", details: error.message },
      { status: 500 }
    );
  }
}
