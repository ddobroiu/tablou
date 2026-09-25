import { PrismaAdapter } from "@next-auth/prisma-adapter";
import type { Adapter, AdapterAccount, AdapterUser } from "next-auth/adapters";
import type { PrismaClient } from "@prisma/client";

// Toate site-urile de print folosesc aceeasi baza, dar fiecare site are conturile lui:
// un cont e unic pe (email, source). Adaptorul standard cauta userul doar dupa email si
// ar amesteca site-urile, asa ca aici:
//  - userii se cauta / se creeaza pe (email, site-ul curent);
//  - contul Google e salvat cu id-ul prefixat de site („shopprint.ro:1234”), ca aceeasi
//    persoana sa aiba cate un cont separat pe fiecare site (si sa nu vada comenzile altui site).
export function siteAuthAdapter(prisma: PrismaClient, source: string): Adapter {
    const base = PrismaAdapter(prisma) as Adapter;
    const scoped = (providerAccountId: string) => `${source}:${providerAccountId}`;

    return {
        ...base,
        async createUser(data: Omit<AdapterUser, "id">) {
            const user = await prisma.user.create({
                data: { email: data.email, name: data.name ?? null, image: data.image ?? null, emailVerified: data.emailVerified ?? null, source },
            });
            return user as unknown as AdapterUser;
        },
        async getUserByEmail(email: string) {
            // Site-ul apare in baza scris diferit („tablou.net” / „Tablou.net”): cautam fara majuscule
            const user = await prisma.user.findFirst({ where: { email, source: { equals: source, mode: "insensitive" } } });
            return (user as unknown as AdapterUser) ?? null;
        },
        async getUserByAccount({ provider, providerAccountId }) {
            const account = await prisma.account.findUnique({
                where: { provider_providerAccountId: { provider, providerAccountId: scoped(providerAccountId) } },
                include: { user: true },
            });
            return (account?.user as unknown as AdapterUser) ?? null;
        },
        async linkAccount(account: AdapterAccount) {
            await prisma.account.create({ data: { ...(account as any), providerAccountId: scoped(account.providerAccountId) } });
            return account;
        },
        async unlinkAccount({ provider, providerAccountId }: { provider: string; providerAccountId: string }) {
            await prisma.account.delete({
                where: { provider_providerAccountId: { provider, providerAccountId: scoped(providerAccountId) } },
            });
        },
    };
}
