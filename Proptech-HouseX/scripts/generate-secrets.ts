import { randomBytes } from "node:crypto";

/** In secret mẫu — copy vào .env production (không commit). */
console.log("# Copy vào .env production — KHÔNG commit file .env\n");
console.log(`AUTH_SECRET="${randomBytes(32).toString("base64")}"`);
console.log(`ADMIN_SECRET="${randomBytes(32).toString("base64")}"`);
console.log(`CRON_SECRET="${randomBytes(24).toString("base64")}"`);
console.log(`EMAIL_WEBHOOK_SECRET="${randomBytes(24).toString("hex")}"`);
