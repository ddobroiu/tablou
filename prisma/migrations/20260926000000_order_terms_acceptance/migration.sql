-- Acceptarea Termenilor și condițiilor în checkout (aditiv, coloane nullable).
-- Baza de date e comună tuturor site-urilor de print: rulați O SINGURĂ DATĂ, ÎNAINTE de a publica
-- oricare dintre site-urile al căror schema.prisma conține aceste câmpuri. Idempotent.
ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "termsAcceptedAt" TIMESTAMP(3);
ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "termsVersion" TEXT;
