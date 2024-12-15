import { NextResponse } from "next/server";

export function handleResponse(statusCode, message, result) {
  if (statusCode === 200) {
    return NextResponse.json(
      {
        status: "success",
        message,
        data: result,
      },
      { status: statusCode }
    );
  } else {
    return NextResponse.json(
      {
        status: "failed",
        message,
      },
      { status: statusCode }
    );
  }
}

export async function GET() {
  return NextResponse.json({ msg: "Hello, world!" });
}
