import { db } from "@/lib/db";
import { UserRole } from "@prisma/client";

// Fetch a user by email
export async function getUserByEmail(email: string) {
  try {
    const user = await db.user.findUnique({ where: { email } });
    return user;
  } catch (error) {
    console.error("Error fetching user by email:", error);
    return null;
  }
}

// Fetch a user by ID, including their associated accounts
export async function getUserById(id: string) {
  try {
    const user = await db.user.findUnique({
      where: { id },
      include: {
        accounts: true,
      },
    });
    return user;
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    return null;
  }
}

// Delete a user by ID
export async function deleteUserById(id: string) {
  try {
    const deletedUser = await db.user.delete({ where: { id } });
    return deletedUser;
  } catch (error) {
    console.error("Error deleting user by ID:", error);
    return null;
  }
}

// Update a user's role by ID
export async function updateUserRole(id: string, role: UserRole) {
  try {
    const updatedUser = await db.user.update({
      where: { id },
      data: { role },
    });
    return updatedUser;
  } catch (error) {
    console.error("Error updating user role:", error);
    return null;
  }
}
