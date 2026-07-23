// Clerk is enabled only when the publishable key is present at build time.
// Without it the app runs fully offline/guest — auth UI simply disappears.
export const clerkPublishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY ?? "";

export const clerkEnabled = clerkPublishableKey.length > 0;
