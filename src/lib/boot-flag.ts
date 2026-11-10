// sessionStorage flag so the whole intro boot animation only plays once per tab basically
// coming back from other routes skips it directly unless bootHold param is set
// wrapped in try/catch so private browsing or storage quotas dont throw crashes ( for now ig )

const BOOT_SEEN_KEY= "hari_boot_seen";

export function shouldSkipBoot() {
  try {
    const hold =new URLSearchParams(window.location.search).get("bootHold");
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
