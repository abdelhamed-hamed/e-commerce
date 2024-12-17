import { Document } from "mongoose";
export interface Users extends Document {
  readonly username: string;
  readonly email: string;
  name: string;
  password: string;
  confirmPassword: string;
  readonly role: Role;
  readonly active: boolean;
  readonly googleId: string; // ال اي دي لو مسجل جوجل
  hasPassword: boolean; // لأنه لو مسجل بي جوجل مبيكونش ليه باسوورد دي بتعمل النقطه دي
  passwordChangedAt: Date | number;
  passwordResetCode: string | undefined;
  passwordResetCodeExpires: Date | number | undefined; // لو مرجع كود عشان اغير الباسوورد صلاحيته تبقي قد اي
  passwordResetCodeVerify: boolean | undefined; // هل الكود مطابق الكود ولا لا
  image: string;
}

type Role = "user" | "admin" | "employee";
