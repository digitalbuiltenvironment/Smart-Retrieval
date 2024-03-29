export { default } from "next-auth/middleware"

// export const config = {
//   matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
// }

// Ensure auth is required for all except the following paths
export const config = {
    matcher: ['/((?!api/auth|_next/static|_next/image|favicon.ico|favicon-16x16.png|apple-touch-icon.png|about|sign-in|privacy-policy|terms-of-service|sitemap.xml|robots.txt).+)']
};
