import { cookies } from "next/headers";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "secret");
const JWT_ISSUER = "myapp";

export async function getAuthUser() {
  const token = (await cookies()).get("token")?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET, {
      issuer: JWT_ISSUER,
    });

    const { id, email, role } = payload;
    return { id, email, role };
  } catch (error) {
    return null;
  }
}
