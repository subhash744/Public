/**
 * ONE-TIME CLEANUP SCRIPT
 * 
 * This removes all legacy fake data from localStorage.
 * Run this once to clear Blake Robinson and other mock profiles.
 * 
 * After the cleanup runs once, this can be safely removed.
 */

const CLEANUP_VERSION = "v1.0.0";
const CLEANUP_KEY = "data_cleanup_completed";

export function cleanupLegacyData(): void {
  if (typeof window === "undefined") return;

  // Check if cleanup already ran
  const cleanupCompleted = localStorage.getItem(CLEANUP_KEY);
  if (cleanupCompleted === CLEANUP_VERSION) {
    return; // Already cleaned
  }

  console.log("🧹 Running one-time data cleanup...");

  // Clear all old data
  localStorage.removeItem("allUsers");
  localStorage.removeItem("currentUser");
  localStorage.removeItem("upvotes");

  // Mark cleanup as complete
  localStorage.setItem(CLEANUP_KEY, CLEANUP_VERSION);

  console.log("✅ Cleanup complete! All fake profiles removed.");
  console.log("🎉 Starting fresh with 0 users.");
}
