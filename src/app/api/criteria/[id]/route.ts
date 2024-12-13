// app/api/criteria/[id]/route.ts
import { NextResponse } from "next/server";
import { auth, getIsAdmin } from "@/lib/auth";
import { db } from "@/lib/db";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    
    let isAdmin 
  
  try {
    isAdmin = await getIsAdmin()
  } catch (error) {
    console.error("Error fetching isAdmin:", error)
    isAdmin = false
  }

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!isAdmin) {
      // return new NextResponse("Forbidden", { status: 403 });
    }

    const body = await request.json();
    const { name, description, weight, isVotable } = body;

    const criterion = await db.criterion.update({
      where: { id: params.id },
      data: {
        name,
        description,
        weight: parseFloat(weight.toString()),
        isVotable,
      },
    });

    return NextResponse.json(criterion);
  } catch (error) {
    console.error("Failed to update criterion:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    
    let isAdmin 
  
  try {
    isAdmin = await getIsAdmin()
  } catch (error) {
    console.error("Error fetching isAdmin:", error)
    isAdmin = false
  }

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!isAdmin) {
      // return new NextResponse("Forbidden", { status: 403 });
    }

    await db.criterion.delete({
      where: { id: params.id },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Failed to delete criterion:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}