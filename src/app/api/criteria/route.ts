//app/api/criteria/route.ts
import { NextResponse } from "next/server";
import { auth, getIsAdmin } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const session = await auth();
    let isAdmin 
  
  try {
    isAdmin = await getIsAdmin()
  } catch (error) {
    console.error("Error fetching isAdmin:", error)
    isAdmin = false
  }


    console.log("Session", session)
    console.log("isAdmin", isAdmin)

    // if (!session) {
    //   return new NextResponse("Unauthorized", { status: 401 });
    // }

    if (!isAdmin) {
      // return new NextResponse("Forbidden", { status: 403 });
    }

    const criteria = await db.criterion.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(criteria);
  } catch (error) {
    console.error("Failed to fetch criteria:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    const isAdmin = await getIsAdmin();

    console.log("Session", session)
    console.log("isAdmin", isAdmin)
    
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!isAdmin) {
      // return new NextResponse("Forbidden", { status: 403 });
    }

    const body = await request.json();
    const { name, description, weight, isVotable } = body;

    const criterion = await db.criterion.create({
      data: {
        name,
        description,
        weight: parseFloat(weight.toString()),
        isVotable,
      },
    });

    return NextResponse.json(criterion);
  } catch (error) {
    console.error("Failed to create criterion:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}