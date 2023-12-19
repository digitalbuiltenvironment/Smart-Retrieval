export { default } from "next-auth/middleware"

// export const config = {
//   matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
// }

// Ensure auth is required for all except the following paths
export const config = {
    matcher: ['/((?!api/auth|_next/static|_next/image|favicon.ico|about|sign-in).+)']
};
