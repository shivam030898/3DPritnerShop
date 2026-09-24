// One-off helper: promote an existing user to ADMIN by email.
//
// This intentionally does NOT create a new User row for an email that
// hasn't signed in yet — pre-creating a bare row can conflict with that
// email's first OAuth sign-in. Have the person sign in normally first,
// then run this.
//
// Usage: node scripts/promote-admin.js someone@example.com
const { PrismaClient } = require("../lib/generated/prisma");

async function main() {
  const email = process.argv[2];
  if (!email) {
    console.error("Usage: node scripts/promote-admin.js <email>");
    process.exit(1);
  }

  const db = new PrismaClient();
  try {
    const user = await db.user.findUnique({ where: { email } });
    if (!user) {
      console.error(
        `No user found with email "${email}". They need to sign in at least once first, then re-run this script.`
      );
      process.exit(1);
    }
    if (user.role === "ADMIN") {
      console.log(`${email} is already ADMIN.`);
      return;
    }
    await db.user.update({ where: { email }, data: { role: "ADMIN" } });
    console.log(`Promoted ${email} to ADMIN.`);
  } finally {
    await db.$disconnect();
  }
}

main();
