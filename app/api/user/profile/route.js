import { ensureDatabase, formatDbError } from "@/lib/auth-helpers";
import { requireApiSession } from "@/lib/api-auth";
import User from "@/models/User";
import { notifyProfileUpdate } from "@/lib/notification-service";
import { jsonError, jsonOk } from "@/lib/api-utils";

export const runtime = "nodejs";

export async function PATCH(request) {
  try {
    const { session, error, status } = await requireApiSession();
    if (error) return jsonError(error, status);

    const body = await request.json();
    await ensureDatabase();

    const user = await User.findById(session.id);
    if (!user) return jsonError("User not found", 404);

    const updatedFields = [];

    if (body.phone !== undefined) {
      user.phone = body.phone?.trim() || "";
      updatedFields.push("phone");
    }
    if (body.firstName?.trim()) {
      user.firstName = body.firstName.trim();
      updatedFields.push("first name");
    }
    if (body.lastName?.trim()) {
      user.lastName = body.lastName.trim();
      updatedFields.push("last name");
    }

    if (!updatedFields.length) {
      return jsonError("No valid fields to update", 400);
    }

    await user.save();

    await notifyProfileUpdate(session.id, { fields: updatedFields });

    return jsonOk({
      success: true,
      user: {
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        email: user.email,
      },
    });
  } catch (err) {
    return jsonError(formatDbError(err) || "Update failed", 500);
  }
}
