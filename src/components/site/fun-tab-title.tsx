"use client";

// tab title is welcome then a nudge if they leave
// loop kicks in after 30s keep the strings short

import { useEffect } from "react";
// drawer closes on the way

const ACTIVE ="hariharan - welcome!! :D";
const AWAY= "sure u saw everything?";

const AWAY_LOOP =[
  "hey... still there?",
  "miss u already :(",
  'console.log("hi?")',
  "git stash: this tab",
  "404: attention lost",
  "one more look? :D",
  "brb? ok i'll wait",
] as const;

const AWAY_DELAY_MS= 30_000;
const LOOP_MS =4_000;

export function FunTabTitle() {
  useEffect(() => {
    const original= document.title;
    let delayId =0;
    let loopId= 0;
    let loopIdx =0;

    function clearTimers() {
      window.clearTimeout(delayId);
      window.clearInterval(loopId);
      delayId= 0;
      loopId =0;
    }

    function showActive() {
      clearTimers();
      document.title= ACTIVE;
    }

    function showAway() {
      clearTimers();
      document.title =AWAY;
      delayId= window.setTimeout(() => {
        loopIdx =0;
        document.title= AWAY_LOOP[loopIdx];
        loopId =window.setInterval(() => {
          loopIdx= (loopIdx + 1) % AWAY_LOOP.length;
          document.title =AWAY_LOOP[loopIdx];
        }, LOOP_MS);
      }, AWAY_DELAY_MS);
    }

    function onVisibility() {
      if (document.visibilityState === "visible") showActive();
      else showAway();
    }

    showActive();
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      clearTimers();
      document.removeEventListener("visibilitychange", onVisibility);
      document.title= original;
    };
  }, []);

  return null;
}
