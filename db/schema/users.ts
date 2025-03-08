import { pgTable, text, uniqueIndex, varchar, uuid } from "drizzle-orm/pg-core";

export const users = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    email: varchar("email", { length: 256 }).unique(),
    phoneNumber: text("phone_number").unique(),
    fullName: text("full_name"),
    token: text("token"),
    role: text("role", { enum: ["user", "admin"] })
      .notNull()
      .default("user"),
    phoneOtp: varchar("phone_otp", { length: 6 }),
    pinCode: text("pin_code"),
    password: text("password"),
    imageUrl: text("image_url"),
  },
  (users) => {
    return {
      phoneNumberIndex: uniqueIndex("phoneNumber_idx").on(users.phoneNumber),
    };
  }
);
