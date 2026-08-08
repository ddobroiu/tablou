import { getServerSession } from "next-auth";
import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import CredentialsProvider from "next-auth/providers/credentials";
import EmailProvider from "next-auth/providers/email";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { getConfigForSource, sendEmail } from './email';
import { siteConfig } from './siteConfig';

// Redundant local getResend removed in favor of exported one from ./email

// Template minimal pentru email de login (Magic Link)
function getLoginHtml({ url, config }: { url: string; config: any }) {
    return `
    <body style="background: #f9f9f9; padding: 20px; font-family: sans-serif;">
      <div style="max-width: 500px; margin: 0 auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        <h2 style="color: #333; margin-top: 0;">Autentificare ${config.name}</h2>
        <p style="color: #666;">Folosește butonul de mai jos pentru a te autentifica pe ${config.name}.</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${url}" style="background: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Autentificare</a>
        </div>
        <p style="font-size: 12px; color: #999;">Dacă nu ai solicitat acest email, îl poți ignora.</p>
      </div>
    </body>
  `;
}

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    session: {
        strategy: "jwt",
    },
    pages: {
        signIn: '/login',
        error: '/login',
    },
    providers: [
        EmailProvider({
            server: "",
            from: "contact@Tablou.net", // Placeholder
            async sendVerificationRequest({ identifier: email, url }) {
                // Încercăm să deducem sursa din URL
                let source = siteConfig.domain;
                try {
                    const u = new URL(url);
                    const host = u.host;
                    if (host.includes('prynt')) source = 'prynt.ro';
                    else if (host.includes('euprint')) source = 'euprint.ro';
                    else if (host.includes('visionboard')) source = 'visionboard.ro';
                    else if (host.includes('adbanner')) source = 'adbanner.ro';
                    else if (host.includes('tablou')) source = 'tablou.net';
                } catch (e) { }

                const config = getConfigForSource(source);

                try {
                    await sendEmail({
                        from: `${config.name} <${config.email}>`,
                        to: email,
                        subject: `Autentificare ${config.name}`,
                        html: getLoginHtml({ url, config }),
                    });
                } catch (error) {
                    console.error("Auth Email Error:", error);
                    throw new Error("Nu s-a putut trimite email-ul.");
                }
            },

        }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
                source: { label: "Source", type: "text" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) return null;

                const source = credentials.source || siteConfig.domain;

                const user = await prisma.user.findUnique({
                    where: {
                        email_source: {
                            email: credentials.email,
                            source: source
                        }
                    }
                });

                if (!user || !user.passwordHash) {
                    return null;
                }

                const isValid = await bcrypt.compare(credentials.password, user.passwordHash);
                if (!isValid) return null;

                return user;
            }
        })
    ],
    callbacks: {
        async jwt({ token, user, trigger, session }) {
            if (user) {
                token.sub = user.id;
                // token.role = user.role; // Asigură-te că User are 'role' în schemă
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user && token.sub) {
                (session.user as any).id = token.sub;
                // (session.user as any).role = token.role;
                try {
                    // Refresh user name/role from DB
                    const fresh = await prisma.user.findUnique({
                        where: { id: token.sub },
                        select: { name: true, email: true, role: true }
                    });
                    if (fresh) {
                        session.user.name = fresh.name;
                        session.user.email = fresh.email;
                        (session.user as any).role = fresh.role;
                    }
                } catch { }
            }
            return session;
        },
    },
    secret: process.env.NEXTAUTH_SECRET || "supersecret",
};

export async function getAuthSession() {
    return getServerSession(authOptions);
}
