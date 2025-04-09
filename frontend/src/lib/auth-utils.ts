import KeycloakProvider from "next-auth/providers/keycloak"
import { getServerSession, type NextAuthOptions } from "next-auth"
import type { DefaultSession } from "next-auth"
import { JWT } from "next-auth/jwt"

declare module "next-auth" {
	interface Session extends DefaultSession {
		token: JWT
		user: {
			id?: string
			preferred_username?: string
		} & DefaultSession["user"]
		error?: string
	}
}

declare module "next-auth/jwt" {
	interface JWT {
		access_token: string
		id_token: string
		refresh_token: string
		expires_at: number
		error?: string
	}
}

const keycloakProvider = KeycloakProvider({
	clientId: process.env.KEYCLOAK_ID!,
	clientSecret: process.env.KEYCLOAK_SECRET!,
	issuer: process.env.KEYCLOAK_ISSUER,
})

const refreshAccessToken = async (token: JWT) => {
	try {
		const response = await fetch(
			`${process.env.KEYCLOAK_ISSUER}/protocol/openid-connect/token`,
			{
				method: "POST",
				body: new URLSearchParams({
					grant_type: "refresh_token",
					refresh_token: token.refresh_token,
					client_id: process.env.KEYCLOAK_ID!,
					client_secret: process.env.KEYCLOAK_SECRET!,
				}),
			}
		)
		const newToken = await response.json()
		if (!response.ok) {
			throw newToken
		}
		return {
			...token,
			access_token: newToken.access_token,
			id_token: newToken.id_token,
			refresh_token: newToken.refresh_token,
			expires_at: Date.now() + newToken.expires_in * 1000,
		}
	} catch (error) {
		console.log("Failed to refresh token", error)
		return {
			...token,
			error: "RefreshAccessTokenError",
		}
	}
}

export const authOptions: NextAuthOptions = {
	providers: [keycloakProvider],
	callbacks: {
		async jwt({ token, account }) {
			if (account) {
				return {
					...token,
					access_token: account.access_token,
					id_token: account.id_token,
					refresh_token: account.refresh_token,
					expires_at: account.expires_at! * 1000,
				}
			} else if (Date.now() < token.expires_at) {
				return token
			}
			const newToken = await refreshAccessToken(token)
			return newToken
		},
		async session({ session, token }) {
			if (session.user) {
				session.user
				session.user.id = token.sub
			}
			session.token = token
			session.error = token.error
			return session
		},
	},
	events: {
		async signOut({ token }) {
			const logOutUrl = new URL(
				`${keycloakProvider.options?.issuer}/protocol/openid-connect/logout`
			)
			logOutUrl.searchParams.set("id_token_hint", token.id_token)
			await fetch(logOutUrl)
		},
	},
}

export async function getUserId(): Promise<string | undefined> {
	const session = await getServerSession(authOptions)
	return session?.user.id
}
