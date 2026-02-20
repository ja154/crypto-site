import { NextResponse } from "next/server";
import { cancelOrderAction } from "@/lib/actions/order.actions";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const result = await cancelOrderAction(id);

  if (result?.error) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }
  return NextResponse.json({ success: true });
}
