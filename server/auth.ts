import bcrypt from "bcryptjs";
import { getUserByEmail, createUser, updateUserLastSignedIn } from "./db";

const SALT_ROUNDS = 10;

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function registerUser(email: string, name: string, password: string) {
  const existingUser = await getUserByEmail(email);
  if (existingUser) {
    throw new Error("User already exists");
  }

  const hashedPassword = await hashPassword(password);
  const role = email === "morehackk@gmail.com" ? "owner" : "employee";
  
  return await createUser({
    email,
    name,
    password: hashedPassword,
    role,
  });
}

export async function loginUser(email: string, password: string) {
  const user = await getUserByEmail(email);
  if (!user) {
    throw new Error("Invalid email or password");
  }

  if (!user.isActive) {
    throw new Error("Account is disabled");
  }

  const isPasswordValid = await verifyPassword(password, user.password);
  if (!isPasswordValid) {
    throw new Error("Invalid email or password");
  }

  await updateUserLastSignedIn(email);

  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
}
