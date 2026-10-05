// first visit in this tab plays the boot fight
// after that coming back from portfolio skips it

const BOOT_SEEN_KEY = "hari_boot_seen";

export function shouldSkipBoot() {
  try {
    const hold = new URLSearchParams(window.location.search).get("bootHold");
    if (hold) return false;
    return sessionStorage.getItem(BOOT_SEEN_KEY) === "1";
  } catch {
    return false;
  }
}

export function markBootSeen() {
  try {
    sessionStorage.setItem(BOOT_SEEN_KEY, "1");
  } catch {
    /* private mode just skip saving */
  }
}
