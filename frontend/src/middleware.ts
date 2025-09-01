import withAuth from "next-auth/middleware"

export default withAuth({
	pages: {},
})

export const config = {
	matcher: ["/dashboard/events/create"],
}
