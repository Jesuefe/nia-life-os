import { createClient } from "@supabase/supabase-js";
import { useState, useEffect, useRef, useCallback } from "react";

const API = "/.netlify/functions/ai";
const MODEL = "llama-3.3-70b-versatile";

// ─── SUPABASE ───────────────────────────────────────────────────────────────
const SUPA_URL = process.env.REACT_APP_SUPABASE_URL || "";
const SUPA_KEY = process.env.REACT_APP_SUPABASE_ANON_KEY || "";
const supabase = createClient(SUPA_URL, SUPA_KEY);

const C = {
  bg: "#08080E", surface: "#0F0F1A", card: "#13131E", border: "#1C1C2E",
  borderHov: "#28283E", accent: "#7B6CF6", accentSoft: "#1E1A3A", accentMid: "#2D2850",
  text: "#ECEAF8", textMuted: "#7875A0", textDim: "#3D3B55",
  success: "#3DDC84", successSoft: "#0A2018",
  warn: "#F5A623", warnSoft: "#261800",
  danger: "#F06B6B", dangerSoft: "#1F0808",
  teal: "#1FD8C2", tealSoft: "#071F1C",
  pink: "#E879A0", pinkSoft: "#20061A",
  green: "#22C55E", greenSoft: "#052010",
};

// ─── SVG ICONS ───────────────────────────────────────────────────────────────
const Icon = ({ name, size = 20, color = "currentColor", style = {} }) => {
  const s = { width: size, height: size, display: "inline-block", flexShrink: 0, ...style };
  const P = {
    chat: <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>,
    sun: <><circle cx="12" cy="12" r="5" fill="none" stroke={color} strokeWidth="1.6"/><line x1="12" y1="1" x2="12" y2="3" stroke={color} strokeWidth="1.6" strokeLinecap="round"/><line x1="12" y1="21" x2="12" y2="23" stroke={color} strokeWidth="1.6" strokeLinecap="round"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" stroke={color} strokeWidth="1.6" strokeLinecap="round"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" stroke={color} strokeWidth="1.6" strokeLinecap="round"/><line x1="1" y1="12" x2="3" y2="12" stroke={color} strokeWidth="1.6" strokeLinecap="round"/><line x1="21" y1="12" x2="23" y2="12" stroke={color} strokeWidth="1.6" strokeLinecap="round"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" stroke={color} strokeWidth="1.6" strokeLinecap="round"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" stroke={color} strokeWidth="1.6" strokeLinecap="round"/></>,
    target: <><circle cx="12" cy="12" r="10" fill="none" stroke={color} strokeWidth="1.6"/><circle cx="12" cy="12" r="6" fill="none" stroke={color} strokeWidth="1.6"/><circle cx="12" cy="12" r="2" fill={color}/></>,
    refresh: <><polyline points="23 4 23 10 17 10" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/><polyline points="1 20 1 14 7 14" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></>,
    bell: <><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/><path d="M13.73 21a2 2 0 0 1-3.46 0" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></>,
    brain: <><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.46 2.5 2.5 0 0 1-1.98-3 2.5 2.5 0 0 1-1.32-4.24 3 3 0 0 1 .34-5.58 2.5 2.5 0 0 1 1.96-3.22A2.5 2.5 0 0 1 9.5 2Z" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.46 2.5 2.5 0 0 0 1.98-3 2.5 2.5 0 0 0 1.32-4.24 3 3 0 0 0-.34-5.58 2.5 2.5 0 0 0-1.96-3.22A2.5 2.5 0 0 0 14.5 2Z" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></>,
    mic: <><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/><path d="M19 10v2a7 7 0 0 1-14 0v-2" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/><line x1="12" y1="19" x2="12" y2="23" stroke={color} strokeWidth="1.6" strokeLinecap="round"/><line x1="8" y1="23" x2="16" y2="23" stroke={color} strokeWidth="1.6" strokeLinecap="round"/></>,
    send: <><line x1="22" y1="2" x2="11" y2="13" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/><polygon points="22 2 15 22 11 13 2 9 22 2" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></>,
    check: <polyline points="20 6 9 17 4 12" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>,
    x: <><line x1="18" y1="6" x2="6" y2="18" stroke={color} strokeWidth="1.8" strokeLinecap="round"/><line x1="6" y1="6" x2="18" y2="18" stroke={color} strokeWidth="1.8" strokeLinecap="round"/></>,
    plus: <><line x1="12" y1="5" x2="12" y2="19" stroke={color} strokeWidth="1.8" strokeLinecap="round"/><line x1="5" y1="12" x2="19" y2="12" stroke={color} strokeWidth="1.8" strokeLinecap="round"/></>,
    trash: <><polyline points="3 6 5 6 21 6" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></>,
    download: <><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/><polyline points="7 10 12 15 17 10" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/><line x1="12" y1="15" x2="12" y2="3" stroke={color} strokeWidth="1.6" strokeLinecap="round"/></>,
    user: <><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/><circle cx="12" cy="7" r="4" fill="none" stroke={color} strokeWidth="1.6"/></>,
    sparkle: <><path d="M12 3L13.5 8.5L19 10L13.5 11.5L12 17L10.5 11.5L5 10L10.5 8.5L12 3Z" fill={color} stroke={color} strokeWidth="0.5" strokeLinejoin="round"/><path d="M5 3L5.75 5.25L8 6L5.75 6.75L5 9L4.25 6.75L2 6L4.25 5.25L5 3Z" fill={color} opacity="0.6"/><path d="M19 15L19.75 17.25L22 18L19.75 18.75L19 21L18.25 18.75L16 18L18.25 17.25L19 15Z" fill={color} opacity="0.4"/></>,
    zap: <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>,
    calendar: <><rect x="3" y="4" width="18" height="18" rx="2" ry="2" fill="none" stroke={color} strokeWidth="1.6"/><line x1="16" y1="2" x2="16" y2="6" stroke={color} strokeWidth="1.6" strokeLinecap="round"/><line x1="8" y1="2" x2="8" y2="6" stroke={color} strokeWidth="1.6" strokeLinecap="round"/><line x1="3" y1="10" x2="21" y2="10" stroke={color} strokeWidth="1.6"/></>,
    trending: <><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/><polyline points="17 6 23 6 23 12" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></>,
    eye: <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" fill="none" stroke={color} strokeWidth="1.6"/><circle cx="12" cy="12" r="3" fill="none" stroke={color} strokeWidth="1.6"/></>,
    loop: <><polyline points="17 1 21 5 17 9" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/><path d="M3 11V9a4 4 0 0 1 4-4h14" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/><polyline points="7 23 3 19 7 15" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/><path d="M21 13v2a4 4 0 0 1-4 4H3" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></>,
    phone: <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.91a16 16 0 0 0 6 6l1-1a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>,
    link: <><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></>,
    search: <><circle cx="11" cy="11" r="8" fill="none" stroke={color} strokeWidth="1.6"/><line x1="21" y1="21" x2="16.65" y2="16.65" stroke={color} strokeWidth="1.6" strokeLinecap="round"/></>,
    book: <><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></>,
    copy: <><rect x="9" y="9" width="13" height="13" rx="2" ry="2" fill="none" stroke={color} strokeWidth="1.6"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></>,
    settings: <><circle cx="12" cy="12" r="3" fill="none" stroke={color} strokeWidth="1.6"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></>,
    whatsapp: <><circle cx="12" cy="12" r="10" fill="none" stroke={color} strokeWidth="1.6"/><path d="M8.56 10.56c.17-.45.33-.9.66-1.25a1.9 1.9 0 0 1 1.44-.62c.28 0 .56.06.79.22.24.16.38.4.44.67l.33 1.56c.06.27 0 .56-.17.77l-.5.61a5.5 5.5 0 0 0 2.22 2.22l.6-.5c.22-.17.5-.23.78-.17l1.56.33c.28.06.5.2.67.44.16.24.22.5.22.79a1.9 1.9 0 0 1-.62 1.44c-.34.33-.8.5-1.25.66a5.5 5.5 0 0 1-6.17-6.17z" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></>,
    alert: <><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/><line x1="12" y1="9" x2="12" y2="13" stroke={color} strokeWidth="1.6" strokeLinecap="round"/><line x1="12" y1="17" x2="12.01" y2="17" stroke={color} strokeWidth="2" strokeLinecap="round"/></>,
    lightbulb: <><line x1="9" y1="18" x2="15" y2="18" stroke={color} strokeWidth="1.6" strokeLinecap="round"/><line x1="10" y1="22" x2="14" y2="22" stroke={color} strokeWidth="1.6" strokeLinecap="round"/><path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A7 7 0 1 0 6.5 11.5c.76.76 1.23 1.52 1.41 2.5" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></>,
    grid: <><rect x="3" y="3" width="7" height="7" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/><rect x="14" y="3" width="7" height="7" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/><rect x="14" y="14" width="7" height="7" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/><rect x="3" y="14" width="7" height="7" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></>,
    list: <><line x1="8" y1="6" x2="21" y2="6" stroke={color} strokeWidth="1.6" strokeLinecap="round"/><line x1="8" y1="12" x2="21" y2="12" stroke={color} strokeWidth="1.6" strokeLinecap="round"/><line x1="8" y1="18" x2="21" y2="18" stroke={color} strokeWidth="1.6" strokeLinecap="round"/><line x1="3" y1="6" x2="3.01" y2="6" stroke={color} strokeWidth="2" strokeLinecap="round"/><line x1="3" y1="12" x2="3.01" y2="12" stroke={color} strokeWidth="2" strokeLinecap="round"/><line x1="3" y1="18" x2="3.01" y2="18" stroke={color} strokeWidth="2" strokeLinecap="round"/></>,
    heart: <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>,
    droplet: <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>,
    pill: <><line x1="10.5" y1="13.5" x2="13.5" y2="10.5" stroke={color} strokeWidth="1.6" strokeLinecap="round"/><rect x="2" y="7" width="12" height="10" rx="5" ry="5" transform="rotate(-45 8 12)" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></>,
    moon: <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>,
    activity: <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>,
    coffee: <><path d="M18 8h1a4 4 0 0 1 0 8h-1" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/><line x1="6" y1="1" x2="6" y2="4" stroke={color} strokeWidth="1.6" strokeLinecap="round"/><line x1="10" y1="1" x2="10" y2="4" stroke={color} strokeWidth="1.6" strokeLinecap="round"/><line x1="14" y1="1" x2="14" y2="4" stroke={color} strokeWidth="1.6" strokeLinecap="round"/></>,
    clock: <><circle cx="12" cy="12" r="10" fill="none" stroke={color} strokeWidth="1.6"/><polyline points="12 6 12 12 16 14" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></>,
    image: <><rect x="3" y="3" width="18" height="18" rx="2" ry="2" fill="none" stroke={color} strokeWidth="1.6"/><circle cx="8.5" cy="8.5" r="1.5" fill={color}/><polyline points="21 15 16 10 5 21" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></>,
  };
  return <svg viewBox="0 0 24 24" style={s}>{P[name] || null}</svg>;
};

// ─── ONBOARDING ──────────────────────────────────────────────────────────────
const OQ = [
  { field: "name", q: "What's your name? I'd love to address you properly." },
  { field: "age", q: (a) => `Nice to meet you, ${a.name}! How old are you?` },
  { field: "marital", q: () => "Are you single, married, or in a relationship?" },
  { field: "occupation", q: () => "What do you do for a living — or are you a student?" },
  { field: "goals_raw", q: (a) => `And what would you most like my help with, ${a.name}? Goals, habits, work challenges — be honest.` },
];

// ─── PROMPTS ─────────────────────────────────────────────────────────────────
const buildSystem = (mem) => `You are Nia, a warm, intelligent AI life companion — coach, organizer, memory keeper, accountability partner.

USER PROFILE: ${JSON.stringify({ name: mem.userName, age: mem.age, marital: mem.marital, occupation: mem.occupation, notes: mem.notes, goals: mem.goals?.map(g=>g.title), habits: mem.habits?.map(h=>h.title), pendingReminders: mem.reminders?.filter(r=>!r.done)?.map(r=>({title:r.title,when:r.when})), health: mem.health?.enabled ? { waterToday: mem.health.waterToday, waterGoal: mem.health.waterGoal, medsTracked: mem.health.medications?.length, nudgingStyle: mem.health.nudgingStyle } : "not enabled" })}

PERSONALITY:
- Warm, direct, honest — like a trusted mentor
- Nigerian/African cultural awareness where relevant
- Never hollow ("Great question!") — always substantive
- Proactive: after answering, ask ONE meaningful follow-up question
- Notice patterns across conversation

TASK AUTO-MANAGEMENT (critical):
- If user says they did something ("I went to the gym", "called mum", "paid rent", "done with presentation"), detect the matching task/habit/reminder and confirm you're marking it done
- Auto-create reminders for one-time things, habits for recurring things
- Confirm everything: "Got it — I've marked your presentation prep done."

WHATSAPP REMINDERS:
- If the user has connected WhatsApp (check memory.whatsappNumber), you CAN send reminders via WhatsApp
- Tell users their WhatsApp reminders are queued and will be sent at the right time
- If no WhatsApp connected, gently suggest they connect it in Settings

RESPONSE FORMAT: Conversational, max 3 paragraphs, end with question or encouraging close`;

const EXTRACT_SYS = `Extract structured data from conversation. Return ONLY valid JSON, no fences.
Schema: {"goals":[{"id":"g_TS","title":"","category":"health|finance|career|personal|relationship","progress":0}],"habits":[{"id":"h_TS","title":"","frequency":"daily|weekly","streak":0}],"reminders":[{"id":"r_TS","title":"","when":"","recurring":false,"done":false,"whatsapp":false}],"markDone":[],"deleteGoals":[],"deleteHabits":[],"deleteReminders":[],"updateGoals":[{"id":"existing_id","progress":50}],"notes":[],"userName":null,"age":null,"marital":null,"occupation":null,"health":null}
Rules:
- markDone: IDs of items user said they COMPLETED
- deleteGoals/deleteHabits/deleteReminders: IDs to DELETE when user says remove/delete/stop tracking
- updateGoals: update progress on existing goals by ID
- goals/habits/reminders: ONLY NEW items not already in memory
- health: object with updates if user mentions water/medication/sleep/meals, else null
- null for unchanged. Only extract what was explicitly mentioned this turn.
- If user says remind me on WhatsApp, set whatsapp:true on that reminder.`;

const BRAINSTORM_SYS = `You are Nia's Research & Brainstorm engine. The user needs help with a topic.
Respond in this exact JSON format (no fences):
{
  "summary": "2-3 sentence overview of the topic",
  "keyPoints": ["point 1","point 2","point 3","point 4","point 5"],
  "outline": [{"section":"Section title","content":"What to cover here"}],
  "questions": ["Clarifying question 1","Clarifying question 2","Clarifying question 3"],
  "resources": ["Suggested resource or search term 1","Suggested resource or search term 2"],
  "nextStep": "One concrete immediate action"
}`;

// ─── WHATSAPP SIMULATION ──────────────────────────────────────────────────────
// In production: replace sendWhatsApp with real API call to your Laravel backend
// which calls WhatsApp Business API / Twilio. This simulates the full flow.
async function sendWhatsApp(phone, message) {
  // Simulate API call — replace with: fetch('/api/whatsapp/send', {method:'POST', body: JSON.stringify({phone, message})})
  return new Promise(resolve => setTimeout(() => resolve({ ok: true, messageId: `wa_${Date.now()}` }), 800));
}

function scheduleWhatsAppReminder(reminder, phone, addLog) {
  if (!phone || !reminder.when) return;
  // In production this hits your Laravel scheduler endpoint
  // Here we show it's queued and simulate delivery
  addLog({ type: "whatsapp_queued", reminder: reminder.title, phone, when: reminder.when, ts: Date.now() });
}

// ─── HEALTH DECISION ENGINE ──────────────────────────────────────────────────
const HEALTH_DEF = { enabled:false, waterGoal:2.5, waterToday:0, waterLog:[], medicationEnabled:false, medications:[], medLogs:{}, sleepEnabled:false, sleepTarget:"23:00", sleepLog:[], mealsEnabled:false, mealLog:[], nudgingStyle:"gentle", quietStart:22, quietEnd:7 };

function canNudge(health, type) {
  const now=Date.now(), lastKey=`last_nudge_${type}`, lastNudge=health[lastKey]||0;
  const hr=new Date().getHours(), qs=health.quietStart||22, qe=health.quietEnd||7;
  if(hr>=qs||hr<qe) return false;
  if(now-lastNudge<2*60*60*1000) return false;
  return true;
}
function waterMsg(health) {
  const intake=parseFloat((health.waterToday||0).toFixed(1)), goal=health.waterGoal||2.5;
  const pct=Math.round((intake/goal)*100), tone=health.nudgingStyle||"gentle";
  if(tone==="gentle") {
    if(pct<30) return `You've had about ${intake}L today. A glass now would be a good start.`;
    if(pct<65) return `You're at ${intake}L — roughly halfway to your ${goal}L goal. One more bottle will keep you on track.`;
    if(pct<100) return `Almost there — ${intake}L so far. One last glass and you've hit your water goal today.`;
    return `You've hit your ${goal}L water goal today. That's one of the easiest wins for how you feel tomorrow.`;
  }
  if(tone==="supportive") return `Water check: ${intake}L of your ${goal}L goal today. Hydration makes a real difference.`;
  return `You're at ${intake}L. Your goal is ${goal}L — please make sure you drink enough today.`;
}
function medMsg(medName, tone="gentle") {
  if(tone==="gentle") return `Just checking — did you take your ${medName||"medication"} today? No rush, just want to make sure.`;
  if(tone==="supportive") return `Your ${medName||"medication"} time has passed. Missing doses can affect how you feel — take it when you can.`;
  return `You've missed your ${medName||"medication"} window. Please take it as soon as possible.`;
}

// ─── HOOKS ───────────────────────────────────────────────────────────────────
function useMemory() {
  const def = { goals:[], habits:[], reminders:[], notes:[], habitLogs:{}, userName:null, age:null, marital:null, occupation:null, onboarded:false, whatsappNumber:null, whatsappLogs:[], health:{...HEALTH_DEF} };
  const [mem, setMem] = useState(def);  // Always start with defaults — Supabase is source of truth
  const save = useCallback((u) => setMem(p => { const n={...p,...u}; return n; }), []);
  return [mem, save];
}
function useMsgs() {
  const [msgs, setMsgs] = useState([]);  // Always start empty — load from Supabase
  const add = useCallback((m) => setMsgs(p => { const n=[...p,{...m,id:`${Date.now()}_${Math.random()}`,ts:new Date().toISOString()}].slice(-80); try{localStorage.setItem("nia_msgs_v3",JSON.stringify(n));}catch{} return n; }), []);
  return [msgs, add];
}

async function ai(messages, system, maxTokens=1000) {
  const r = await fetch(API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ model: MODEL, max_tokens: maxTokens, system, messages })
  });
  if (!r.ok) throw new Error(`API error: ${r.status}`);
  const d = await r.json();
  return d.content?.[0]?.text || "";
}

function useSpeech() {
  const recRef = useRef(null);
  const [listening, setListening] = useState(false);
  const speak = useCallback((text) => { const u=new SpeechSynthesisUtterance(text); u.rate=0.95; u.pitch=1.05; const vs=speechSynthesis.getVoices(); const pref=vs.find(v=>v.name.includes("Samantha")||v.name.includes("Google UK English Female")); if(pref) u.voice=pref; speechSynthesis.cancel(); speechSynthesis.speak(u); }, []);
  const stopSpeak = useCallback(() => speechSynthesis.cancel(), []);
  const listen = useCallback((onResult) => {
    const SR=window.SpeechRecognition||window.webkitSpeechRecognition; if(!SR) return;
    const r=new SR(); r.lang="en-NG"; r.continuous=false; r.interimResults=false;
    r.onresult=e=>onResult(e.results[0][0].transcript);
    r.onend=()=>setListening(false); r.onerror=()=>setListening(false);
    recRef.current=r; r.start(); setListening(true);
  }, []);
  const stopListen = useCallback(() => { recRef.current?.stop(); setListening(false); }, []);
  return { speak, stopSpeak, listen, stopListen, listening };
}

// ─── UI ATOMS ────────────────────────────────────────────────────────────────
function Badge({children, color="accent"}) {
  const m={accent:[C.accentMid,C.accent],success:[C.successSoft,C.success],warn:[C.warnSoft,C.warn],danger:[C.dangerSoft,C.danger],teal:[C.tealSoft,C.teal],pink:[C.pinkSoft,C.pink],green:[C.greenSoft,C.green]};
  const [bg,fg]=m[color]||m.accent;
  return <span style={{background:bg,color:fg,fontSize:10,padding:"2px 8px",borderRadius:99,fontWeight:600,letterSpacing:"0.04em",textTransform:"uppercase"}}>{children}</span>;
}
function Btn({children,onClick,variant="ghost",disabled,style={},size="md",icon,loading:ld}) {
  const [h,setH]=useState(false);
  const p=size==="sm"?"6px 12px":"10px 20px"; const fs=size==="sm"?12:14;
  const v={primary:{background:h?"#6A5BE8":C.accent,color:"#fff",border:"none"},ghost:{background:h?C.surface:"transparent",color:C.text,border:`1px solid ${C.border}`},danger:{background:h?"#4A1010":C.dangerSoft,color:C.danger,border:`1px solid ${C.dangerSoft}`},success:{background:h?"#082214":C.successSoft,color:C.success,border:`1px solid ${C.successSoft}`},green:{background:h?"#0A2E18":C.greenSoft,color:C.green,border:`1px solid ${C.greenSoft}`}};
  return <button onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)} onClick={onClick} disabled={disabled||ld} style={{...v[variant],padding:p,borderRadius:10,fontSize:fs,fontWeight:500,cursor:disabled||ld?"not-allowed":"pointer",opacity:disabled||ld?0.45:1,transition:"all 0.15s",fontFamily:"inherit",display:"inline-flex",alignItems:"center",gap:6,...style}}>
    {ld?<span style={{width:12,height:12,border:`2px solid currentColor`,borderTopColor:"transparent",borderRadius:"50%",animation:"spin 0.7s linear infinite",display:"inline-block"}}/>:icon&&<Icon name={icon} size={14}/>}{children}
  </button>;
}
function Card({children,style={},onClick}) {
  const [h,setH]=useState(false);
  return <div onClick={onClick} onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)} style={{background:C.card,border:`1px solid ${h&&onClick?C.borderHov:C.border}`,borderRadius:14,padding:"16px 18px",transition:"border-color 0.15s",cursor:onClick?"pointer":"default",...style}}>{children}</div>;
}
function Input({value,onChange,placeholder,onKeyDown,multiline,rows=2,style={},autoFocus}) {
  const base={background:C.surface,border:`1px solid ${C.border}`,color:C.text,borderRadius:10,padding:"10px 14px",fontSize:14,fontFamily:"inherit",width:"100%",boxSizing:"border-box",outline:"none",resize:"none",lineHeight:1.5,...style};
  return multiline?<textarea autoFocus={autoFocus} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} rows={rows} style={base}/>:<input autoFocus={autoFocus} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} onKeyDown={onKeyDown} style={base}/>;
}
function Ring({pct=0,size=46,stroke=3.5,color=C.accent}) {
  const r=(size-stroke*2)/2,circ=2*Math.PI*r,off=circ-(pct/100)*circ;
  return <svg width={size} height={size} style={{transform:"rotate(-90deg)",flexShrink:0}}>
    <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={C.border} strokeWidth={stroke}/>
    <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke} strokeDasharray={circ} strokeDashoffset={off} strokeLinecap="round" style={{transition:"stroke-dashoffset 0.5s ease"}}/>
  </svg>;
}
function Dots() {
  return <div style={{display:"flex",gap:5,padding:"12px 16px",background:C.card,border:`1px solid ${C.border}`,borderRadius:"18px 18px 18px 4px"}}>
    {[0,1,2].map(i=><div key={i} style={{width:7,height:7,borderRadius:"50%",background:C.accent,animation:"pulse 1.2s infinite",animationDelay:`${i*0.2}s`}}/>)}
  </div>;
}
function NiaAvatar({size=32}) {
  return <div style={{width:size,height:size,borderRadius:"50%",background:C.accentMid,border:`1px solid ${C.accent}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
    <Icon name="sparkle" size={size*0.5} color={C.accent}/>
  </div>;
}

// ─── ONBOARDING ──────────────────────────────────────────────────────────────
function Onboarding({onComplete}) {
  const [step,setStep]=useState(0);
  const [answers,setAnswers]=useState({});
  const [input,setInput]=useState("");
  const [msgs,setMsgs]=useState([]);
  const [loading,setLoading]=useState(false);
  const bottomRef=useRef(null);
  const {speak}=useSpeech();

  useEffect(()=>{
    const txt=OQ[0].q;
    setMsgs([{role:"nia",text:typeof txt==="function"?txt({}):txt}]);
    setTimeout(()=>speak(typeof txt==="function"?txt({}):txt),300);
  },[]);
  useEffect(()=>{bottomRef.current?.scrollIntoView({behavior:"smooth"});},[msgs]);

  const next=async()=>{
    const val=input.trim(); if(!val) return;
    const newA={...answers,[OQ[step].field]:val};
    setAnswers(newA);
    setMsgs(m=>[...m,{role:"user",text:val}]);
    setInput(""); setLoading(true);
    const ns=step+1;
    if(ns<OQ.length){
      const q=OQ[ns].q;
      const txt=typeof q==="function"?q(newA):q;
      setTimeout(()=>{ setMsgs(m=>[...m,{role:"nia",text:txt}]); speak(txt); setStep(ns); setLoading(false); },700);
    } else {
      try {
        const ext=await ai([{role:"user",content:`Extract goals, habits, reminders from: "${newA.goals_raw}"\nUser: ${JSON.stringify({name:newA.name,age:newA.age,marital:newA.marital,occupation:newA.occupation})}`}],EXTRACT_SYS);
        let parsed={}; try{parsed=JSON.parse(ext.replace(/```json|```/g,"").trim());}catch{}
        const close=`Perfect. I've got a clear picture now, ${newA.name}. I've noted everything you've shared and I'm ready to help you follow through. Let's go.`;
        setMsgs(m=>[...m,{role:"nia",text:close}]); speak(close);
        setTimeout(()=>onComplete({userName:newA.name,age:newA.age,marital:newA.marital,occupation:newA.occupation,goals:parsed.goals||[],habits:parsed.habits||[],reminders:parsed.reminders||[],notes:parsed.notes||[],onboarded:true,habitLogs:{},whatsappNumber:null,whatsappLogs:[]}),2500);
      } catch { onComplete({userName:newA.name,age:newA.age,marital:newA.marital,occupation:newA.occupation,goals:[],habits:[],reminders:[],notes:[],onboarded:true,habitLogs:{},whatsappNumber:null,whatsappLogs:[]}); }
      setLoading(false);
    }
  };

  return (
    <div style={{minHeight:"100vh",background:C.bg,display:"flex",flexDirection:"column",fontFamily:"'DM Sans',sans-serif"}}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&display=swap" rel="stylesheet"/>
      <div style={{flex:1,display:"flex",flexDirection:"column",maxWidth:540,margin:"0 auto",width:"100%",padding:"24px 20px 110px"}}>
        <div style={{textAlign:"center",paddingTop:32,marginBottom:32}}>
          <div style={{width:60,height:60,borderRadius:"50%",background:C.accentMid,border:`2px solid ${C.accent}`,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 14px"}}><Icon name="sparkle" size={28} color={C.accent}/></div>
          <h1 style={{fontSize:22,fontWeight:600,margin:"0 0 4px",color:C.text}}>Meet Nia</h1>
          <p style={{color:C.textMuted,fontSize:13,margin:"0 0 16px"}}>Your personal AI life companion</p>
          <div style={{display:"flex",justifyContent:"center",gap:6}}>
            {OQ.map((_,i)=><div key={i} style={{width:i===step?20:6,height:6,borderRadius:3,background:i<=step?C.accent:C.border,transition:"all 0.3s"}}/>)}
          </div>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          {msgs.map((m,i)=>(
            <div key={i} style={{display:"flex",justifyContent:m.role==="user"?"flex-end":"flex-start",gap:10}}>
              {m.role==="nia"&&<NiaAvatar/>}
              <div style={{maxWidth:"78%",padding:"11px 15px",borderRadius:m.role==="user"?"18px 18px 4px 18px":"18px 18px 18px 4px",background:m.role==="user"?C.accent:C.card,border:m.role==="user"?"none":`1px solid ${C.border}`,color:C.text,fontSize:14,lineHeight:1.65}}>{m.text}</div>
            </div>
          ))}
          {loading&&<div style={{display:"flex",gap:10,alignItems:"center"}}><NiaAvatar/><Dots/></div>}
          <div ref={bottomRef}/>
        </div>
      </div>
      <div style={{position:"fixed",bottom:0,left:0,right:0,background:C.surface,borderTop:`1px solid ${C.border}`,padding:"14px 20px"}}>
        <div style={{maxWidth:540,margin:"0 auto",display:"flex",gap:10}}>
          <Input value={input} onChange={setInput} placeholder="Type your answer…" onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();next();}}} style={{flex:1}} autoFocus/>
          <Btn variant="primary" onClick={next} disabled={!input.trim()||loading} icon="send"/>
        </div>
      </div>
      <style>{`@keyframes pulse{0%,80%,100%{opacity:0.3;transform:scale(0.9)}40%{opacity:1;transform:scale(1)}}@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

// ─── WHATSAPP SETUP MODAL ────────────────────────────────────────────────────
function WhatsAppModal({mem, save, onClose}) {
  const [phone,setPhone]=useState(mem.whatsappNumber||"");
  const [saved,setSaved]=useState(false);
  const [testing,setTesting]=useState(false);
  const [testOk,setTestOk]=useState(false);

  const savePhone=()=>{
    if(!phone.trim()) return;
    const cleaned=phone.replace(/\s/g,"");
    save({whatsappNumber:cleaned});
    setSaved(true);
  };
  const testSend=async()=>{
    setTesting(true);
    await sendWhatsApp(phone, `Hi ${mem.userName||"there"}! 👋 This is Nia — your AI life companion. WhatsApp reminders are now active. I'll reach you here when something important comes up.`);
    setTestOk(true); setTesting(false);
  };

  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.7)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:100,padding:20}}>
      <Card style={{width:"100%",maxWidth:440,padding:"24px"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <div style={{width:36,height:36,borderRadius:"50%",background:C.greenSoft,border:`1px solid ${C.green}`,display:"flex",alignItems:"center",justifyContent:"center"}}><Icon name="whatsapp" size={18} color={C.green}/></div>
            <div><p style={{margin:0,fontSize:15,fontWeight:600}}>Connect WhatsApp</p><p style={{margin:0,fontSize:12,color:C.textMuted}}>Get reminders on WhatsApp</p></div>
          </div>
          <button onClick={onClose} style={{background:"none",border:"none",cursor:"pointer",color:C.textMuted}}><Icon name="x" size={18} color={C.textMuted}/></button>
        </div>

        <div style={{background:C.greenSoft,border:`1px solid ${C.green}`,borderRadius:10,padding:"10px 14px",marginBottom:16}}>
          <p style={{margin:0,fontSize:13,color:C.green,lineHeight:1.6}}>Enter your WhatsApp number with country code. Nia will send reminders, morning briefings, and check-ins directly to your WhatsApp.</p>
        </div>

        <p style={{fontSize:12,color:C.textMuted,margin:"0 0 6px"}}>WhatsApp number</p>
        <Input value={phone} onChange={setPhone} placeholder="+234 800 000 0000" style={{marginBottom:12}} onKeyDown={e=>e.key==="Enter"&&savePhone()}/>
        <p style={{fontSize:11,color:C.textDim,margin:"0 0 16px"}}>Include country code. Nigeria: +234, UK: +44, US: +1</p>

        {!saved
          ? <Btn variant="green" onClick={savePhone} disabled={!phone.trim()} icon="check" style={{width:"100%",justifyContent:"center"}}>Save number</Btn>
          : <div>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12,padding:"10px 14px",background:C.successSoft,borderRadius:10,border:`1px solid ${C.success}`}}>
                <Icon name="check" size={16} color={C.success}/><p style={{margin:0,fontSize:13,color:C.success}}>Number saved: {phone}</p>
              </div>
              {!testOk
                ? <Btn variant="ghost" onClick={testSend} loading={testing} icon="whatsapp" style={{width:"100%",justifyContent:"center"}}>Send test message</Btn>
                : <div style={{display:"flex",alignItems:"center",gap:8,padding:"10px 14px",background:C.greenSoft,borderRadius:10,border:`1px solid ${C.green}`}}>
                    <Icon name="check" size={16} color={C.green}/><p style={{margin:0,fontSize:13,color:C.green}}>Test message sent! Check your WhatsApp.</p>
                  </div>
              }
            </div>
        }

        <div style={{marginTop:20,padding:"12px 14px",background:C.surface,borderRadius:10,border:`1px solid ${C.border}`}}>
          <p style={{margin:"0 0 8px",fontSize:12,fontWeight:600,color:C.textMuted}}>How it works in production</p>
          <div style={{display:"flex",flexDirection:"column",gap:6}}>
            {["Your Laravel backend receives reminder schedules","Sends via WhatsApp Business API or Twilio","Nia detects WhatsApp reminders from chat and queues them","You get the message at exactly the right time"].map((t,i)=>(
              <div key={i} style={{display:"flex",gap:8,alignItems:"flex-start"}}>
                <div style={{width:18,height:18,borderRadius:"50%",background:C.accentMid,display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,color:C.accent,fontWeight:700,flexShrink:0,marginTop:1}}>{i+1}</div>
                <p style={{margin:0,fontSize:12,color:C.textMuted,lineHeight:1.5}}>{t}</p>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}

// ─── BRAINSTORM VIEW ─────────────────────────────────────────────────────────
function BrainstormView({mem}) {
  const [topic,setTopic]=useState("");
  const [result,setResult]=useState(null);
  const [loading,setLoading]=useState(false);
  const [followUp,setFollowUp]=useState("");
  const [followLoading,setFollowLoading]=useState(false);
  const [followResult,setFollowResult]=useState("");
  const [copied,setCopied]=useState(false);
  const {speak}=useSpeech();

  const run=async(t)=>{
    const q=t||topic; if(!q.trim()) return;
    setLoading(true); setResult(null); setFollowResult("");
    try {
      const userCtx=`User is ${mem.userName||"unknown"}, ${mem.occupation||"works professionally"}.`;
      const raw=await ai([{role:"user",content:`Topic: "${q}"\n${userCtx}\n\nBrainstorm and research this topic. Provide a structured breakdown.`}],BRAINSTORM_SYS,1500);
      const parsed=JSON.parse(raw.replace(/```json|```/g,"").trim());
      setResult(parsed);
    } catch(e) { setResult({summary:"Could not parse structured response. Try rephrasing your topic.",keyPoints:[],outline:[],questions:[],resources:[],nextStep:""}); }
    setLoading(false);
  };

  const askFollowUp=async()=>{
    if(!followUp.trim()||!result) return;
    setFollowLoading(true);
    const ctx=`Context: ${JSON.stringify(result)}\nUser follow-up: ${followUp}`;
    const r=await ai([{role:"user",content:ctx}],`You are Nia. Answer a follow-up question about a brainstormed topic. Be specific, concise, under 150 words.`);
    setFollowResult(r); setFollowLoading(false); setFollowUp("");
  };

  const copyAll=()=>{
    if(!result) return;
    const txt=`TOPIC: ${topic}\n\nSUMMARY:\n${result.summary}\n\nKEY POINTS:\n${result.keyPoints.map((p,i)=>`${i+1}. ${p}`).join("\n")}\n\nOUTLINE:\n${result.outline.map(o=>`\n## ${o.section}\n${o.content}`).join("\n")}\n\nNEXT STEP:\n${result.nextStep}`;
    navigator.clipboard.writeText(txt).then(()=>{setCopied(true);setTimeout(()=>setCopied(false),2000);});
  };

  const suggestions=["How to structure a medical presentation for colleagues","Effective public speaking techniques","Evidence-based habits for productivity","Financial planning basics for young professionals","How to build a morning routine that sticks"];

  return (
    <div style={{maxWidth:740,margin:"0 auto",width:"100%",padding:"24px 16px"}}>
      <div style={{marginBottom:24}}>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:4}}>
          <Icon name="lightbulb" size={20} color={C.warn}/>
          <h2 style={{fontSize:20,fontWeight:600,margin:0}}>Brainstorm & Research</h2>
        </div>
        <p style={{color:C.textMuted,fontSize:13,margin:0}}>Give Nia a topic — she'll break it down, outline it, and help you think it through.</p>
      </div>

      <Card style={{marginBottom:16}}>
        <Input value={topic} onChange={setTopic} placeholder="e.g. Medical presentation on hypertension management for junior doctors…" multiline rows={2} onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();run();}}}/>
        <div style={{display:"flex",gap:8,marginTop:10}}>
          <Btn variant="primary" onClick={()=>run()} disabled={!topic.trim()} loading={loading} icon="search" style={{flex:1,justifyContent:"center"}}>Research & Brainstorm</Btn>
          {result&&<Btn variant="ghost" onClick={copyAll} icon={copied?"check":"copy"}>{copied?"Copied!":"Copy all"}</Btn>}
        </div>
      </Card>

      {!result&&!loading&&(
        <div>
          <p style={{fontSize:11,color:C.textDim,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:10}}>Suggestions</p>
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {suggestions.map(s=>(
              <button key={s} onClick={()=>{setTopic(s);run(s);}} style={{background:C.surface,border:`1px solid ${C.border}`,color:C.textMuted,borderRadius:10,padding:"10px 14px",fontSize:13,cursor:"pointer",fontFamily:"inherit",textAlign:"left",display:"flex",alignItems:"center",gap:8}}>
                <Icon name="sparkle" size={13} color={C.textDim}/>{s}
              </button>
            ))}
          </div>
        </div>
      )}

      {loading&&<Card style={{textAlign:"center",padding:"40px 24px"}}>
        <NiaAvatar size={44}/><p style={{color:C.textMuted,fontSize:14,marginTop:12}}>Nia is researching and structuring your topic…</p>
      </Card>}

      {result&&(
        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          {/* Summary */}
          <Card>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}><Icon name="eye" size={16} color={C.accent}/><p style={{margin:0,fontSize:12,fontWeight:600,textTransform:"uppercase",letterSpacing:"0.05em",color:C.textMuted}}>Overview</p></div>
            <p style={{margin:0,fontSize:15,lineHeight:1.75,color:C.text}}>{result.summary}</p>
          </Card>

          {/* Key Points */}
          {result.keyPoints?.length>0&&<Card>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}><Icon name="list" size={16} color={C.teal}/><p style={{margin:0,fontSize:12,fontWeight:600,textTransform:"uppercase",letterSpacing:"0.05em",color:C.textMuted}}>Key points</p></div>
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              {result.keyPoints.map((pt,i)=>(
                <div key={i} style={{display:"flex",gap:12,alignItems:"flex-start"}}>
                  <div style={{width:22,height:22,borderRadius:"50%",background:C.accentMid,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,color:C.accent,fontWeight:700,flexShrink:0,marginTop:1}}>{i+1}</div>
                  <p style={{margin:0,fontSize:14,color:C.text,lineHeight:1.6}}>{pt}</p>
                </div>
              ))}
            </div>
          </Card>}

          {/* Outline */}
          {result.outline?.length>0&&<Card>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}><Icon name="book" size={16} color={C.pink}/><p style={{margin:0,fontSize:12,fontWeight:600,textTransform:"uppercase",letterSpacing:"0.05em",color:C.textMuted}}>Suggested outline</p></div>
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              {result.outline.map((o,i)=>(
                <div key={i} style={{borderLeft:`2px solid ${C.accent}`,paddingLeft:14}}>
                  <p style={{margin:"0 0 3px",fontSize:13,fontWeight:600,color:C.text}}>{o.section}</p>
                  <p style={{margin:0,fontSize:13,color:C.textMuted,lineHeight:1.55}}>{o.content}</p>
                </div>
              ))}
            </div>
          </Card>}

          {/* Two col: questions + resources */}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
            {result.questions?.length>0&&<Card>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}><Icon name="chat" size={14} color={C.warn}/><p style={{margin:0,fontSize:11,fontWeight:600,textTransform:"uppercase",letterSpacing:"0.05em",color:C.textMuted}}>Questions to consider</p></div>
              <div style={{display:"flex",flexDirection:"column",gap:8}}>
                {result.questions.map((q,i)=><p key={i} style={{margin:0,fontSize:13,color:C.textMuted,lineHeight:1.5,paddingLeft:8,borderLeft:`1px solid ${C.border}`}}>{q}</p>)}
              </div>
            </Card>}
            {result.resources?.length>0&&<Card>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}><Icon name="search" size={14} color={C.teal}/><p style={{margin:0,fontSize:11,fontWeight:600,textTransform:"uppercase",letterSpacing:"0.05em",color:C.textMuted}}>Research resources</p></div>
              <div style={{display:"flex",flexDirection:"column",gap:8}}>
                {result.resources.map((r,i)=><p key={i} style={{margin:0,fontSize:13,color:C.textMuted,lineHeight:1.5,paddingLeft:8,borderLeft:`1px solid ${C.border}`}}>{r}</p>)}
              </div>
            </Card>}
          </div>

          {/* Next step */}
          {result.nextStep&&<div style={{background:C.accentMid,border:`1px solid ${C.accent}`,borderRadius:12,padding:"14px 16px",display:"flex",gap:12,alignItems:"flex-start"}}>
            <Icon name="zap" size={18} color={C.accent} style={{marginTop:1}}/>
            <div><p style={{margin:"0 0 2px",fontSize:11,fontWeight:600,textTransform:"uppercase",letterSpacing:"0.05em",color:C.accent}}>Immediate next step</p><p style={{margin:0,fontSize:14,color:C.text,lineHeight:1.6}}>{result.nextStep}</p></div>
          </div>}

          {/* Follow-up */}
          <Card>
            <p style={{fontSize:12,fontWeight:600,margin:"0 0 10px",color:C.textMuted,textTransform:"uppercase",letterSpacing:"0.05em"}}>Ask Nia a follow-up</p>
            <div style={{display:"flex",gap:8}}>
              <Input value={followUp} onChange={setFollowUp} placeholder="What else do you want to know about this topic?" onKeyDown={e=>{if(e.key==="Enter")askFollowUp();}} style={{flex:1}}/>
              <Btn variant="primary" onClick={askFollowUp} disabled={!followUp.trim()} loading={followLoading} icon="send"/>
            </div>
            {followResult&&<div style={{marginTop:12,padding:"12px 14px",background:C.surface,borderRadius:10,border:`1px solid ${C.border}`}}>
              <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:8}}><NiaAvatar size={24}/><p style={{margin:0,fontSize:12,fontWeight:600,color:C.textMuted}}>Nia</p></div>
              <p style={{margin:0,fontSize:14,color:C.text,lineHeight:1.7}}>{followResult}</p>
            </div>}
          </Card>
        </div>
      )}
    </div>
  );
}

// ─── CHAT VIEW ───────────────────────────────────────────────────────────────
function ChatView({mem,save,msgs,addMsg,onOpenWA,user}) {
  const [input,setInput]=useState("");
  const [loading,setLoading]=useState(false);
  const bottomRef=useRef(null);
  const {speak,listen,stopListen,listening}=useSpeech();
  const [voiceOn,setVoiceOn]=useState(false);
  const proTimerRef=useRef(null);

  useEffect(()=>{bottomRef.current?.scrollIntoView({behavior:"smooth"});},[msgs,loading]);

  const resetProTimer=useCallback(()=>{
    if(proTimerRef.current) clearTimeout(proTimerRef.current);
    proTimerRef.current=setTimeout(async()=>{
      if(loading) return;
      const items=[...mem.habits?.map(h=>h.title)||[],...mem.goals?.map(g=>g.title)||[],...mem.reminders?.filter(r=>!r.done)?.map(r=>r.title)||[]];
      if(!items.length) return;
      const q=await ai([{role:"user",content:`Based on: name=${mem.userName}, items=[${items.slice(0,4).join(", ")}], ask ONE natural proactive check-in question. Max 20 words. No greeting. Just the question.`}],"You are Nia, an AI life companion. Ask a brief proactive question.");
      if(q){ addMsg({role:"assistant",content:q}); if(voiceOn) speak(q); }
    },90000);
  },[msgs,loading,mem]);

  useEffect(()=>{ resetProTimer(); return()=>clearTimeout(proTimerRef.current); },[msgs]);

  const mergeById=(ex=[],inc=[])=>{ const m={}; ex.forEach(i=>{m[i.id]=i;}); inc.forEach(i=>{if(i.id&&!m[i.id])m[i.id]=i;}); return Object.values(m); };

  const send=async(txt)=>{
    const t=(txt||input).trim(); if(!t||loading) return;
    setInput(""); setLoading(true);
    addMsg({role:"user",content:t});
    // Save user message to Supabase
    if(user?.id) supabase.from("conversations").insert({user_id:user.id,role:"user",content:t}).then(()=>{});
    try {
      const apiMsgs=[...msgs.slice(-24).map(m=>({role:m.role==="assistant"?"assistant":"user",content:m.content})),{role:"user",content:t}];
      const reply=await ai(apiMsgs,buildSystem(mem));
      addMsg({role:"assistant",content:reply});
      // Save assistant reply to Supabase
      if(user?.id) supabase.from("conversations").insert({user_id:user.id,role:"assistant",content:reply}).then(()=>{});
      if(voiceOn) speak(reply);
      // Background extraction
      setTimeout(async()=>{
        try {
          const conv=apiMsgs.slice(-6).map(m=>`${m.role}: ${m.content}`).join("\n");
          const existing=JSON.stringify({goals:mem.goals,habits:mem.habits,reminders:mem.reminders,notes:mem.notes});
          const raw=await ai([{role:"user",content:`Conv:\n${conv}\nNia reply: ${reply}\nExisting: ${existing}\nExtract new.`}],EXTRACT_SYS);
          const p=JSON.parse(raw.replace(/```json|```/g,"").trim());
          const u={};
          // Add new items
          if(p.goals?.length) u.goals=mergeById(mem.goals,p.goals);
          if(p.habits?.length) u.habits=mergeById(mem.habits,p.habits);
          if(p.reminders?.length){
            const newRems=p.reminders.filter(r=>!mem.reminders.find(e=>e.id===r.id));
            u.reminders=mergeById(mem.reminders,p.reminders);
            if(mem.whatsappNumber){ newRems.filter(r=>r.whatsapp).forEach(r=>scheduleWhatsAppReminder(r,mem.whatsappNumber,(log)=>save({whatsappLogs:[...(mem.whatsappLogs||[]),log]}))); }
          }
          if(p.notes?.length) u.notes=[...new Set([...(mem.notes||[]),...p.notes])].slice(-30);
          if(p.userName) u.userName=p.userName;
          if(p.age) u.age=p.age; if(p.marital) u.marital=p.marital; if(p.occupation) u.occupation=p.occupation;
          // Delete items user asked to remove
          if(p.deleteGoals?.length){ const ds=new Set(p.deleteGoals); u.goals=(u.goals||mem.goals).filter(g=>!ds.has(g.id)); }
          if(p.deleteHabits?.length){ const ds=new Set(p.deleteHabits); u.habits=(u.habits||mem.habits).filter(h=>!ds.has(h.id)); }
          if(p.deleteReminders?.length){ const ds=new Set(p.deleteReminders); u.reminders=(u.reminders||mem.reminders).filter(r=>!ds.has(r.id)); }
          // Update goal progress
          if(p.updateGoals?.length){ const updates={}; p.updateGoals.forEach(g=>{updates[g.id]=g.progress;}); u.goals=(u.goals||mem.goals).map(g=>updates[g.id]!==undefined?{...g,progress:updates[g.id]}:g); }
          // Health updates from chat
          if(p.health){ u.health={...(mem.health||{}), ...p.health}; }
          // Mark done
          if(p.markDone?.length){
            const ds=new Set(p.markDone);
            u.goals=(u.goals||mem.goals).map(g=>ds.has(g.id)?{...g,progress:100}:g);
            const today=new Date().toDateString();
            const logs={...mem.habitLogs};
            u.habits=(u.habits||mem.habits).map(h=>{ if(!ds.has(h.id)) return h; logs[`${h.id}_${today}`]=true; return {...h,streak:(h.streak||0)+1,lastDone:today}; });
            u.habitLogs=logs;
            u.reminders=(u.reminders||mem.reminders).map(r=>ds.has(r.id)?{...r,done:true}:r);
          }
          if(Object.keys(u).length){
            save(u);
            // Immediately sync to Supabase
            if(user?.id){
              const syncData={user_id:user.id,...(u.goals&&{goals:u.goals}),...(u.habits&&{habits:u.habits}),...(u.reminders&&{reminders:u.reminders}),...(u.notes&&{notes:u.notes}),...(u.health&&{health:u.health}),updated_at:new Date().toISOString()};
              supabase.from("memories").upsert(syncData,{onConflict:"user_id"}).then(()=>{});
            }
          }
        }catch{}
      },100);
    }catch{ addMsg({role:"assistant",content:"Something went wrong. Try again."}); }
    setLoading(false);
  };

  const handleVoice=()=>{ if(listening){stopListen();return;} listen(t=>send(t)); };
  const hr=new Date().getHours();
  const greet=hr<12?"Good morning":hr<17?"Good afternoon":"Good evening";

  // WhatsApp banner
  const showWABanner=!mem.whatsappNumber;

  return (
    <div style={{display:"flex",flexDirection:"column",height:"100%",maxWidth:720,margin:"0 auto",width:"100%"}}>
      {showWABanner&&(
        <div style={{margin:"12px 16px 0",background:C.greenSoft,border:`1px solid ${C.green}`,borderRadius:10,padding:"10px 14px",display:"flex",alignItems:"center",gap:10}}>
          <Icon name="whatsapp" size={16} color={C.green}/>
          <p style={{margin:0,fontSize:13,color:C.green,flex:1}}>Connect WhatsApp to receive reminders directly on your phone.</p>
          <Btn size="sm" variant="green" onClick={onOpenWA} icon="link">Connect</Btn>
        </div>
      )}

      {msgs.length===0&&(
        <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"2rem 1.5rem",textAlign:"center"}}>
          <NiaAvatar size={60}/>
          <h2 style={{fontSize:22,fontWeight:600,margin:"16px 0 8px"}}>{greet}{mem.userName?`, ${mem.userName}`:""}</h2>
          <p style={{color:C.textMuted,fontSize:14,margin:"0 0 28px",lineHeight:1.7,maxWidth:380}}>I'm here. Tell me what's on your mind.</p>
          <div style={{display:"flex",flexWrap:"wrap",gap:8,justifyContent:"center",maxWidth:460}}>
            {["How are my goals looking?","I just finished my workout","Remind me to call mum every Sunday","Let's brainstorm my presentation"].map(s=>(
              <button key={s} onClick={()=>send(s)} style={{background:C.surface,border:`1px solid ${C.border}`,color:C.textMuted,borderRadius:99,padding:"8px 16px",fontSize:13,cursor:"pointer",fontFamily:"inherit"}}>{s}</button>
            ))}
          </div>
        </div>
      )}
      {msgs.length>0&&(
        <div style={{flex:1,overflowY:"auto",padding:"20px 16px",display:"flex",flexDirection:"column",gap:16}}>
          {msgs.map(msg=>(
            <div key={msg.id} style={{display:"flex",justifyContent:msg.role==="user"?"flex-end":"flex-start",gap:10}}>
              {msg.role==="assistant"&&<NiaAvatar/>}
              <div style={{maxWidth:"74%",padding:"11px 15px",borderRadius:msg.role==="user"?"18px 18px 4px 18px":"18px 18px 18px 4px",background:msg.role==="user"?C.accent:C.card,border:msg.role==="user"?"none":`1px solid ${C.border}`,color:C.text,fontSize:14,lineHeight:1.7,whiteSpace:"pre-wrap"}}>{msg.content}</div>
            </div>
          ))}
          {loading&&<div style={{display:"flex",gap:10,alignItems:"center"}}><NiaAvatar/><Dots/></div>}
          <div ref={bottomRef}/>
        </div>
      )}
      <div style={{padding:"12px 16px 16px",borderTop:`1px solid ${C.border}`,background:C.bg}}>
        <div style={{display:"flex",gap:8,alignItems:"flex-end"}}>
          <button onClick={handleVoice} style={{width:40,height:40,borderRadius:"50%",border:`1px solid ${listening?C.danger:C.border}`,background:listening?C.dangerSoft:C.surface,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,transition:"all 0.2s"}}>
            <Icon name="mic" size={18} color={listening?C.danger:C.textMuted}/>
          </button>
          <div style={{flex:1}}><Input value={input} onChange={setInput} placeholder="Talk to Nia…" multiline rows={2} onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();send();}}}/></div>
          <div style={{display:"flex",flexDirection:"column",gap:6}}>
            <button onClick={()=>setVoiceOn(v=>!v)} title="Toggle voice" style={{width:40,height:40,borderRadius:"50%",border:`1px solid ${voiceOn?C.accent:C.border}`,background:voiceOn?C.accentMid:C.surface,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",transition:"all 0.2s"}}>
              <Icon name="zap" size={16} color={voiceOn?C.accent:C.textMuted}/>
            </button>
            <Btn variant="primary" onClick={()=>send()} disabled={!input.trim()||loading} icon="send" style={{width:40,height:40,padding:0,justifyContent:"center",borderRadius:"50%"}}/>
          </div>
        </div>
        <p style={{fontSize:11,color:C.textDim,margin:"8px 0 0",textAlign:"center"}}>{listening?"Listening… speak now":"Enter to send · Mic for voice · ⚡ toggles voice responses"}</p>
      </div>
    </div>
  );
}

// ─── MORNING VIEW ─────────────────────────────────────────────────────────────
function MorningView({mem,save}) {
  const [brief,setBrief]=useState(""); const [loading,setLoading]=useState(false); const [done,setDone]=useState(false);
  const {speak}=useSpeech();
  const [waSending,setWaSending]=useState(false); const [waSent,setWaSent]=useState(false);

  const gen=async()=>{
    setLoading(true);
    const r=await ai([{role:"user",content:"Give me my morning briefing. Cover active goals, habits, pending reminders. Warm and specific. Under 120 words."}],buildSystem(mem));
    setBrief(r); setDone(true); setLoading(false); speak(r);
  };
  const sendToWA=async()=>{
    setWaSending(true);
    await sendWhatsApp(mem.whatsappNumber,`☀️ Morning briefing from Nia:\n\n${brief}`);
    setWaSent(true); setWaSending(false);
  };
  const dateStr=new Date().toLocaleDateString("en-NG",{weekday:"long",month:"long",day:"numeric"});
  const hr=new Date().getHours();
  return (
    <div style={{maxWidth:620,margin:"0 auto",width:"100%",padding:"28px 16px"}}>
      <div style={{textAlign:"center",marginBottom:28}}>
        <div style={{width:56,height:56,borderRadius:"50%",background:C.warnSoft,border:`1.5px solid ${C.warn}`,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 14px"}}><Icon name="sun" size={26} color={C.warn}/></div>
        <h2 style={{fontSize:22,fontWeight:600,margin:"0 0 4px"}}>{hr<12?"Morning Briefing":hr<17?"Afternoon Check-in":"Evening Wrap-up"}</h2>
        <p style={{color:C.textMuted,fontSize:13,margin:0}}>{dateStr}</p>
      </div>
      {!done&&!loading&&<Card style={{textAlign:"center",padding:"36px 24px"}}>
        <p style={{color:C.textMuted,fontSize:15,marginBottom:20,lineHeight:1.7}}>{mem.goals.length+mem.habits.length===0?"Chat with Nia first to build your profile.":`Nia is ready to brief you on ${mem.goals.length} goal${mem.goals.length!==1?"s":""} and ${mem.habits.length} habit${mem.habits.length!==1?"s":""}.`}</p>
        <Btn variant="primary" onClick={gen} icon="sun">Generate briefing</Btn>
      </Card>}
      {loading&&<Card style={{textAlign:"center",padding:"40px 24px"}}><NiaAvatar size={44}/><p style={{color:C.textMuted,fontSize:14,marginTop:12}}>Preparing your briefing…</p></Card>}
      {done&&brief&&<>
        <Card style={{marginBottom:14}}>
          <div style={{display:"flex",gap:10,alignItems:"center",marginBottom:14}}><NiaAvatar/><div><p style={{margin:0,fontSize:13,fontWeight:600}}>Nia</p><p style={{margin:0,fontSize:11,color:C.textMuted}}>Your personal briefing</p></div></div>
          <p style={{fontSize:15,lineHeight:1.8,margin:0,color:C.text}}>{brief}</p>
        </Card>
        <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
          <Btn variant="ghost" onClick={gen} icon="refresh" style={{flex:1}}>Regenerate</Btn>
          <Btn variant="ghost" onClick={()=>speak(brief)} icon="zap">Read aloud</Btn>
          {mem.whatsappNumber&&(waSent?<Btn variant="success" icon="check">Sent to WhatsApp</Btn>:<Btn variant="green" onClick={sendToWA} loading={waSending} icon="whatsapp">Send to WhatsApp</Btn>)}
        </div>
      </>}
      <div style={{marginTop:24,display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10}}>
        {[{label:"Goals",v:mem.goals.length,icon:"target",color:C.accent},{label:"Habits",v:mem.habits.length,icon:"loop",color:C.teal},{label:"Reminders",v:mem.reminders.filter(r=>!r.done).length,icon:"bell",color:C.warn}].map(s=>(
          <Card key={s.label} style={{textAlign:"center",padding:"14px 10px"}}>
            <div style={{display:"flex",justifyContent:"center",marginBottom:8}}><Icon name={s.icon} size={20} color={s.color}/></div>
            <p style={{fontSize:22,fontWeight:600,margin:"0 0 2px",color:C.text}}>{s.v}</p>
            <p style={{fontSize:11,color:C.textMuted,margin:0}}>{s.label}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ─── GOALS VIEW ───────────────────────────────────────────────────────────────
function GoalsView({mem,save}) {
  const [adding,setAdding]=useState(false); const [title,setTitle]=useState(""); const [cat,setCat]=useState("personal");
  const [tips,setTips]=useState({}); const [tipLoad,setTipLoad]=useState(null);
  const cats=["health","finance","career","personal","relationship"];
  const cc={health:"success",finance:"teal",career:"accent",personal:"warn",relationship:"pink"};
  const add=()=>{ if(!title.trim()) return; save({goals:[...mem.goals,{id:`g_${Date.now()}`,title:title.trim(),category:cat,progress:0}]}); setTitle(""); setAdding(false); };
  const del=(id)=>save({goals:mem.goals.filter(g=>g.id!==id)});
  const upd=(id,d)=>save({goals:mem.goals.map(g=>g.id===id?{...g,progress:Math.min(100,Math.max(0,(g.progress||0)+d))}:g)});
  const done=(id)=>save({goals:mem.goals.map(g=>g.id===id?{...g,progress:100}:g)});
  const getTip=async(g)=>{ if(tips[g.id]){setTips(t=>({...t,[g.id]:null}));return;} setTipLoad(g.id); const r=await ai([{role:"user",content:`One specific tip for: "${g.title}" (${g.progress||0}% done). Under 50 words.`}],buildSystem(mem)); setTips(t=>({...t,[g.id]:r})); setTipLoad(null); };
  return (
    <div style={{maxWidth:660,margin:"0 auto",width:"100%",padding:"24px 16px"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
        <div><h2 style={{fontSize:20,fontWeight:600,margin:"0 0 3px"}}>Goals</h2><p style={{color:C.textMuted,fontSize:13,margin:0}}>{mem.goals.length} active</p></div>
        <Btn variant="primary" onClick={()=>setAdding(true)} size="sm" icon="plus">Add goal</Btn>
      </div>
      {adding&&<Card style={{marginBottom:16}}>
        <Input value={title} onChange={setTitle} placeholder="What do you want to achieve?" style={{marginBottom:10}} onKeyDown={e=>e.key==="Enter"&&add()} autoFocus/>
        <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:14}}>{cats.map(c=><button key={c} onClick={()=>setCat(c)} style={{padding:"5px 12px",borderRadius:99,fontSize:12,cursor:"pointer",fontFamily:"inherit",border:`1px solid ${cat===c?C.accent:C.border}`,background:cat===c?C.accentMid:"transparent",color:cat===c?C.accent:C.textMuted}}>{c}</button>)}</div>
        <div style={{display:"flex",gap:8}}><Btn variant="primary" onClick={add} size="sm">Save</Btn><Btn variant="ghost" onClick={()=>{setAdding(false);setTitle("");}} size="sm">Cancel</Btn></div>
      </Card>}
      {mem.goals.length===0&&!adding&&<Card style={{textAlign:"center",padding:"40px 24px"}}><Icon name="target" size={36} color={C.textDim} style={{marginBottom:12}}/><p style={{color:C.textMuted,fontSize:15}}>No goals yet. Add one or mention your goals to Nia in chat.</p></Card>}
      <div style={{display:"flex",flexDirection:"column",gap:12}}>
        {mem.goals.map(g=>(
          <Card key={g.id}>
            <div style={{display:"flex",alignItems:"center",gap:14}}>
              <div style={{position:"relative"}}><Ring pct={g.progress||0}/><span style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,fontWeight:700,color:C.accent}}>{g.progress||0}%</span></div>
              <div style={{flex:1}}>
                <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}><p style={{margin:0,fontSize:15,fontWeight:500,color:C.text}}>{g.title}</p><Badge color={cc[g.category]||"accent"}>{g.category}</Badge></div>
                <div style={{background:C.border,borderRadius:99,height:4}}><div style={{background:C.accent,height:"100%",width:`${g.progress||0}%`,borderRadius:99,transition:"width 0.4s ease"}}/></div>
              </div>
            </div>
            <div style={{display:"flex",gap:6,marginTop:14,flexWrap:"wrap"}}>
              <Btn size="sm" onClick={()=>upd(g.id,-10)}>−10%</Btn>
              <Btn size="sm" onClick={()=>upd(g.id,10)}>+10%</Btn>
              <Btn size="sm" variant="success" onClick={()=>done(g.id)} icon="check">Mark done</Btn>
              <Btn size="sm" onClick={()=>getTip(g)} loading={tipLoad===g.id} icon="sparkle">{tips[g.id]?"Hide tip":"Get tip"}</Btn>
              <Btn size="sm" variant="danger" onClick={()=>del(g.id)} icon="trash"/>
            </div>
            {tips[g.id]&&<div style={{marginTop:12,padding:"10px 14px",background:C.accentMid,borderRadius:10,borderLeft:`3px solid ${C.accent}`}}><p style={{margin:0,fontSize:13,color:C.text,lineHeight:1.65}}>{tips[g.id]}</p></div>}
          </Card>
        ))}
      </div>
    </div>
  );
}

// ─── HABITS VIEW ──────────────────────────────────────────────────────────────
function HabitsView({mem,save}) {
  const [adding,setAdding]=useState(false); const [title,setTitle]=useState(""); const [freq,setFreq]=useState("daily");
  const today=new Date().toDateString();
  const add=()=>{ if(!title.trim()) return; save({habits:[...mem.habits,{id:`h_${Date.now()}`,title:title.trim(),frequency:freq,streak:0,lastDone:null}]}); setTitle(""); setAdding(false); };
  const mark=(id)=>{ const key=`${id}_${today}`,logs={...mem.habitLogs},was=!!logs[key]; logs[key]=!was; const habits=mem.habits.map(h=>{ if(h.id!==id) return h; const wasYest=h.lastDone===new Date(Date.now()-86400000).toDateString(); const streak=!was?(wasYest?(h.streak||0)+1:1):Math.max(0,(h.streak||1)-1); return {...h,streak,lastDone:!was?today:h.lastDone}; }); save({habits,habitLogs:logs}); };
  const del=(id)=>save({habits:mem.habits.filter(h=>h.id!==id)});
  const isDone=(id)=>!!mem.habitLogs?.[`${id}_${today}`];
  const dc=mem.habits.filter(h=>isDone(h.id)).length;
  return (
    <div style={{maxWidth:660,margin:"0 auto",width:"100%",padding:"24px 16px"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
        <div><h2 style={{fontSize:20,fontWeight:600,margin:"0 0 3px"}}>Habits</h2><p style={{color:C.textMuted,fontSize:13,margin:0}}>{dc}/{mem.habits.length} done today</p></div>
        <Btn variant="primary" onClick={()=>setAdding(true)} size="sm" icon="plus">Add habit</Btn>
      </div>
      {mem.habits.length>0&&<div style={{background:C.surface,borderRadius:10,padding:"12px 16px",marginBottom:16,border:`1px solid ${C.border}`}}>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}><span style={{fontSize:12,color:C.textMuted}}>Today</span><span style={{fontSize:12,fontWeight:600,color:C.text}}>{Math.round(dc/Math.max(1,mem.habits.length)*100)}%</span></div>
        <div style={{background:C.border,borderRadius:99,height:5}}><div style={{background:`linear-gradient(90deg,${C.accent},${C.teal})`,height:"100%",borderRadius:99,width:`${dc/Math.max(1,mem.habits.length)*100}%`,transition:"width 0.4s ease"}}/></div>
      </div>}
      {adding&&<Card style={{marginBottom:16}}>
        <Input value={title} onChange={setTitle} placeholder="What habit do you want to build?" style={{marginBottom:10}} onKeyDown={e=>e.key==="Enter"&&add()} autoFocus/>
        <div style={{display:"flex",gap:6,marginBottom:14}}>{["daily","weekly"].map(f=><button key={f} onClick={()=>setFreq(f)} style={{padding:"5px 14px",borderRadius:99,fontSize:12,cursor:"pointer",fontFamily:"inherit",border:`1px solid ${freq===f?C.accent:C.border}`,background:freq===f?C.accentMid:"transparent",color:freq===f?C.accent:C.textMuted}}>{f}</button>)}</div>
        <div style={{display:"flex",gap:8}}><Btn variant="primary" onClick={add} size="sm">Save</Btn><Btn variant="ghost" onClick={()=>{setAdding(false);setTitle("");}} size="sm">Cancel</Btn></div>
      </Card>}
      {mem.habits.length===0&&!adding&&<Card style={{textAlign:"center",padding:"40px 24px"}}><Icon name="loop" size={36} color={C.textDim} style={{marginBottom:12}}/><p style={{color:C.textMuted,fontSize:15}}>No habits yet.</p></Card>}
      <div style={{display:"flex",flexDirection:"column",gap:10}}>
        {mem.habits.map(h=>{ const done=isDone(h.id); return <Card key={h.id} style={{display:"flex",alignItems:"center",gap:14}}>
          <button onClick={()=>mark(h.id)} style={{width:30,height:30,borderRadius:"50%",border:`2px solid ${done?C.success:C.border}`,background:done?C.successSoft:"transparent",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,transition:"all 0.2s"}}>{done&&<Icon name="check" size={14} color={C.success}/>}</button>
          <div style={{flex:1}}>
            <p style={{margin:"0 0 4px",fontSize:14,fontWeight:500,color:done?C.textMuted:C.text,textDecoration:done?"line-through":"none"}}>{h.title}</p>
            <div style={{display:"flex",gap:6,alignItems:"center"}}><Badge color={h.frequency==="daily"?"accent":"teal"}>{h.frequency}</Badge>{(h.streak||0)>0&&<span style={{fontSize:11,color:C.warn,display:"flex",alignItems:"center",gap:3}}><Icon name="trending" size={12} color={C.warn}/>{h.streak} streak</span>}</div>
          </div>
          <Btn size="sm" variant="danger" onClick={()=>del(h.id)} icon="trash"/>
        </Card>; })}
      </div>
    </div>
  );
}

// ─── REMINDERS VIEW ───────────────────────────────────────────────────────────
function RemindersView({mem,save,onOpenWA}) {
  const [adding,setAdding]=useState(false); const [title,setTitle]=useState(""); const [when,setWhen]=useState(""); const [recur,setRecur]=useState(false); const [wa,setWa]=useState(false);
  const add=()=>{ if(!title.trim()) return; const r={id:`r_${Date.now()}`,title:title.trim(),when:when||"Unspecified",recurring:recur,done:false,whatsapp:wa}; save({reminders:[...mem.reminders,r]}); if(wa&&mem.whatsappNumber) scheduleWhatsAppReminder(r,mem.whatsappNumber,()=>{}); setTitle(""); setWhen(""); setAdding(false); setWa(false); };
  const toggle=(id)=>save({reminders:mem.reminders.map(r=>r.id===id?{...r,done:!r.done}:r)});
  const del=(id)=>save({reminders:mem.reminders.filter(r=>r.id!==id)});
  const active=mem.reminders.filter(r=>!r.done), done=mem.reminders.filter(r=>r.done);
  return (
    <div style={{maxWidth:660,margin:"0 auto",width:"100%",padding:"24px 16px"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
        <div><h2 style={{fontSize:20,fontWeight:600,margin:"0 0 3px"}}>Reminders</h2><p style={{color:C.textMuted,fontSize:13,margin:0}}>{active.length} pending</p></div>
        <Btn variant="primary" onClick={()=>setAdding(true)} size="sm" icon="plus">Add</Btn>
      </div>
      {!mem.whatsappNumber&&<div style={{background:C.greenSoft,border:`1px solid ${C.green}`,borderRadius:10,padding:"10px 14px",marginBottom:14,display:"flex",alignItems:"center",gap:10}}>
        <Icon name="whatsapp" size={15} color={C.green}/><p style={{margin:0,fontSize:13,color:C.green,flex:1}}>Connect WhatsApp to get reminders on your phone.</p>
        <Btn size="sm" variant="green" onClick={onOpenWA} icon="link">Connect</Btn>
      </div>}
      {adding&&<Card style={{marginBottom:16}}>
        <Input value={title} onChange={setTitle} placeholder="What should Nia remind you about?" style={{marginBottom:10}} autoFocus/>
        <Input value={when} onChange={setWhen} placeholder="When? (e.g. Every Sunday, 1st of month, 9pm tonight)" style={{marginBottom:10}}/>
        <div style={{display:"flex",gap:16,marginBottom:14}}>
          <label style={{display:"flex",alignItems:"center",gap:8,cursor:"pointer",fontSize:13,color:C.textMuted}}><input type="checkbox" checked={recur} onChange={e=>setRecur(e.target.checked)} style={{accentColor:C.accent}}/>Recurring</label>
          <label style={{display:"flex",alignItems:"center",gap:8,cursor:"pointer",fontSize:13,color:mem.whatsappNumber?C.green:C.textDim}}>
            <input type="checkbox" checked={wa} onChange={e=>setWa(e.target.checked)} disabled={!mem.whatsappNumber} style={{accentColor:C.green}}/>
            <Icon name="whatsapp" size={13} color={mem.whatsappNumber?C.green:C.textDim}/>Send to WhatsApp
          </label>
        </div>
        <div style={{display:"flex",gap:8}}><Btn variant="primary" onClick={add} size="sm">Save</Btn><Btn variant="ghost" onClick={()=>{setAdding(false);setTitle("");setWhen("");}} size="sm">Cancel</Btn></div>
      </Card>}
      {mem.reminders.length===0&&!adding&&<Card style={{textAlign:"center",padding:"40px 24px"}}><Icon name="bell" size={36} color={C.textDim} style={{marginBottom:12}}/><p style={{color:C.textMuted,fontSize:15}}>No reminders yet. Tell Nia "remind me to…" in chat.</p></Card>}
      <div style={{display:"flex",flexDirection:"column",gap:10}}>
        {active.map(r=><Card key={r.id} style={{display:"flex",alignItems:"center",gap:14}}>
          <button onClick={()=>toggle(r.id)} style={{width:28,height:28,borderRadius:"50%",border:`2px solid ${C.border}`,background:"transparent",cursor:"pointer",flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center"}}/>
          <div style={{flex:1}}>
            <p style={{margin:"0 0 4px",fontSize:14,fontWeight:500,color:C.text}}>{r.title}</p>
            <div style={{display:"flex",gap:6,alignItems:"center",flexWrap:"wrap"}}>
              {r.when&&<span style={{fontSize:11,color:C.textMuted,display:"flex",alignItems:"center",gap:3}}><Icon name="calendar" size={11} color={C.textMuted}/>{r.when}</span>}
              {r.recurring&&<Badge color="teal">recurring</Badge>}
              {r.whatsapp&&<Badge color="green"><span style={{display:"flex",alignItems:"center",gap:3}}><Icon name="whatsapp" size={9} color={C.green}/>WhatsApp</span></Badge>}
            </div>
          </div>
          <Btn size="sm" variant="danger" onClick={()=>del(r.id)} icon="trash"/>
        </Card>)}
        {done.length>0&&<><p style={{fontSize:11,color:C.textDim,textTransform:"uppercase",letterSpacing:"0.06em",marginTop:8,marginBottom:4}}>Completed</p>{done.map(r=><Card key={r.id} style={{display:"flex",alignItems:"center",gap:14,opacity:0.45,marginBottom:6}}>
          <button onClick={()=>toggle(r.id)} style={{width:28,height:28,borderRadius:"50%",border:`2px solid ${C.success}`,background:C.successSoft,cursor:"pointer",flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center"}}><Icon name="check" size={13} color={C.success}/></button>
          <p style={{margin:0,fontSize:14,color:C.textMuted,textDecoration:"line-through",flex:1}}>{r.title}</p>
          <Btn size="sm" variant="danger" onClick={()=>del(r.id)} icon="trash"/>
        </Card>)}</>}
      </div>
    </div>
  );
}

// ─── MEMORY + SETTINGS VIEW ───────────────────────────────────────────────────
function MemoryView({mem,save,onOpenWA}) {
  const [confirmClear,setConfirmClear]=useState(false);
  const delNote=(i)=>save({notes:mem.notes.filter((_,idx)=>idx!==i)});
  const clearAll=()=>{ if(confirmClear){ save({goals:[],habits:[],reminders:[],notes:[],userName:null,age:null,marital:null,occupation:null,habitLogs:{},onboarded:false,whatsappNumber:null,whatsappLogs:[],health:{...HEALTH_DEF}}); setConfirmClear(false); } else setConfirmClear(true); };
  const exp=()=>{ const b=new Blob([JSON.stringify(mem,null,2)],{type:"application/json"}); const a=document.createElement("a"); a.href=URL.createObjectURL(b); a.download="nia-memory.json"; a.click(); };
  const fields=[{label:"Name",v:mem.userName},{label:"Age",v:mem.age},{label:"Marital status",v:mem.marital},{label:"Occupation",v:mem.occupation}].filter(f=>f.v);
  return (
    <div style={{maxWidth:660,margin:"0 auto",width:"100%",padding:"24px 16px"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
        <div><h2 style={{fontSize:20,fontWeight:600,margin:"0 0 3px"}}>Memory & Settings</h2><p style={{color:C.textMuted,fontSize:13,margin:0}}>What Nia knows about you</p></div>
        <div style={{display:"flex",gap:8}}><Btn variant="ghost" onClick={exp} size="sm" icon="download">Export</Btn><Btn variant="danger" onClick={clearAll} size="sm" icon="trash">{confirmClear?"Confirm clear":"Clear"}</Btn></div>
      </div>

      {/* WhatsApp */}
      <Card style={{marginBottom:14}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <div style={{width:36,height:36,borderRadius:"50%",background:mem.whatsappNumber?C.greenSoft:C.surface,border:`1px solid ${mem.whatsappNumber?C.green:C.border}`,display:"flex",alignItems:"center",justifyContent:"center"}}><Icon name="whatsapp" size={18} color={mem.whatsappNumber?C.green:C.textMuted}/></div>
            <div><p style={{margin:0,fontSize:14,fontWeight:500}}>WhatsApp</p><p style={{margin:0,fontSize:12,color:C.textMuted}}>{mem.whatsappNumber?`Connected: ${mem.whatsappNumber}`:"Not connected"}</p></div>
          </div>
          <Btn size="sm" variant={mem.whatsappNumber?"ghost":"green"} onClick={onOpenWA} icon={mem.whatsappNumber?"settings":"link"}>{mem.whatsappNumber?"Edit":"Connect"}</Btn>
        </div>
        {mem.whatsappLogs?.length>0&&<div style={{marginTop:10,padding:"8px 10px",background:C.surface,borderRadius:8,border:`1px solid ${C.border}`}}>
          <p style={{margin:"0 0 6px",fontSize:11,color:C.textDim,textTransform:"uppercase",letterSpacing:"0.05em"}}>WhatsApp log</p>
          {mem.whatsappLogs.slice(-3).map((l,i)=><p key={i} style={{margin:"3px 0",fontSize:12,color:C.textMuted}}>{l.type==="whatsapp_queued"?`Queued: "${l.reminder}" → ${l.phone} (${l.when})`:`${l.type}`}</p>)}
        </div>}
      </Card>

      {fields.length>0&&<Card style={{marginBottom:14}}>
        <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:14}}>
          <div style={{width:46,height:46,borderRadius:"50%",background:C.accentMid,border:`2px solid ${C.accent}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,fontWeight:700,color:C.accent}}>{(mem.userName||"N")[0].toUpperCase()}</div>
          <div><p style={{margin:0,fontSize:16,fontWeight:600}}>{mem.userName||"User"}</p><p style={{margin:0,fontSize:12,color:C.textMuted}}>Personal profile</p></div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
          {fields.map(f=><div key={f.label} style={{background:C.surface,borderRadius:8,padding:"8px 12px",border:`1px solid ${C.border}`}}>
            <p style={{margin:"0 0 2px",fontSize:10,color:C.textDim,textTransform:"uppercase",letterSpacing:"0.05em"}}>{f.label}</p>
            <p style={{margin:0,fontSize:14,fontWeight:500,color:C.text}}>{f.v}</p>
          </div>)}
        </div>
      </Card>}

      {mem.notes.length>0&&<div style={{marginBottom:20}}>
        <p style={{fontSize:11,color:C.textDim,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:10}}>Notes on file</p>
        {mem.notes.map((note,i)=><div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 14px",background:C.surface,borderRadius:10,border:`1px solid ${C.border}`,marginBottom:8}}>
          <p style={{margin:0,fontSize:13,color:C.textMuted,flex:1,lineHeight:1.5}}>{note}</p>
          <button onClick={()=>delNote(i)} style={{background:"none",border:"none",cursor:"pointer",padding:4}}><Icon name="x" size={14} color={C.textDim}/></button>
        </div>)}
      </div>}

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
        {[{label:"Goals",count:mem.goals.length,icon:"target",color:C.accent},{label:"Habits",count:mem.habits.length,icon:"loop",color:C.teal},{label:"Reminders",count:mem.reminders.length,icon:"bell",color:C.warn},{label:"Notes",count:mem.notes.length,icon:"eye",color:C.pink}].map(s=>(
          <div key={s.label} style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,padding:"14px 16px",display:"flex",alignItems:"center",gap:12}}>
            <Icon name={s.icon} size={20} color={s.color}/>
            <div><p style={{margin:"0 0 1px",fontSize:20,fontWeight:600,color:C.text}}>{s.count}</p><p style={{margin:0,fontSize:12,color:C.textMuted}}>{s.label}</p></div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── HEALTH VIEW ─────────────────────────────────────────────────────────────
function HealthView({ mem, save }) {
  const h = mem.health || HEALTH_DEF;
  const saveH = (u) => save({ health: { ...h, ...u } });

  const [nudgeMsg, setNudgeMsg] = useState("");
  const [nudgeType, setNudgeType] = useState("");
  const [addMed, setAddMed] = useState(false);
  const [medName, setMedName] = useState("");
  const [medTime, setMedTime] = useState("08:00");
  const [insight, setInsight] = useState("");
  const [insightLoad, setInsightLoad] = useState(false);

  const today = new Date().toDateString();
  const todayKey = today.replace(/\s/g, "_");

  // Water
  const logWater = (ml) => {
    const add = ml / 1000;
    const newTotal = parseFloat(((h.waterToday || 0) + add).toFixed(2));
    const log = [...(h.waterLog || []), { ts: Date.now(), ml, date: today }];
    saveH({ waterToday: newTotal, waterLog: log });
  };
  const resetWater = () => saveH({ waterToday: 0, waterLog: (h.waterLog || []).filter(l => l.date !== today) });
  const waterPct = Math.min(100, Math.round(((h.waterToday || 0) / (h.waterGoal || 2.5)) * 100));

  // Medication
  const addMedication = () => {
    if (!medName.trim()) return;
    const meds = [...(h.medications || []), { id: `med_${Date.now()}`, name: medName.trim(), time: medTime }];
    saveH({ medications: meds, medicationEnabled: true });
    setMedName(""); setMedTime("08:00"); setAddMed(false);
  };
  const toggleMedDone = (id) => {
    const logs = { ...(h.medLogs || {}) };
    const key = `${id}_${todayKey}`;
    logs[key] = !logs[key];
    saveH({ medLogs: logs });
  };
  const delMed = (id) => saveH({ medications: (h.medications || []).filter(m => m.id !== id) });
  const isMedDone = (id) => !!(h.medLogs || {})[`${id}_${todayKey}`];

  // Sleep
  const logSleep = (time) => {
    const log = [...(h.sleepLog || []), { ts: Date.now(), time, date: today }];
    saveH({ sleepLog: log });
  };
  const lastSleep = (h.sleepLog || []).filter(l => l.date === today).slice(-1)[0];

  // Meals
  const logMeal = (meal) => {
    const log = [...(h.mealLog || []), { ts: Date.now(), meal, date: today }];
    saveH({ mealLog: log });
  };
  const todayMeals = (h.mealLog || []).filter(l => l.date === today);

  // Proactive nudge
  const fireNudge = (type) => {
    if (!canNudge(h, type)) { setNudgeMsg("Nia is respecting your quiet hours or recently nudged you about this."); setNudgeType("info"); return; }
    let msg = "";
    if (type === "water") msg = waterMsg(h);
    else if (type === "med" && h.medications?.length) msg = medMsg(h.medications[0]?.name, h.nudgingStyle);
    setNudgeMsg(msg); setNudgeType(type);
    saveH({ [`last_nudge_${type}`]: Date.now() });
  };

  // AI insight
  const getInsight = async () => {
    setInsightLoad(true);
    const ctx = `User health today: water=${h.waterToday}L of ${h.waterGoal}L goal, meals logged=${todayMeals.length}, medications done=${(h.medications||[]).filter(m=>isMedDone(m.id)).length}/${(h.medications||[]).length}, sleep target=${h.sleepTarget}. User: ${mem.userName}, occupation: ${mem.occupation}.`;
    const r = await ai([{ role: "user", content: ctx + "\n\nGive one warm, observational health insight. Not advice. Just what you notice. Under 50 words. Tone: like a caring friend." }], "You are Nia, an AI life companion. Give a warm, brief, observational health insight — not a lecture.");
    setInsight(r); setInsightLoad(false);
  };

  const toneColors = { gentle: C.teal, supportive: C.accent, strong: C.warn };
  const waterSegments = 8;

  return (
    <div style={{ maxWidth: 660, margin: "0 auto", width: "100%", padding: "24px 16px" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
            <Icon name="heart" size={18} color={C.pink} />
            <h2 style={{ fontSize: 20, fontWeight: 600, margin: 0 }}>Health & Care</h2>
          </div>
          <p style={{ color: C.textMuted, fontSize: 13, margin: 0 }}>Awareness, not control</p>
        </div>
        {!h.enabled
          ? <Btn variant="primary" size="sm" icon="heart" onClick={() => saveH({ enabled: true })}>Enable</Btn>
          : <Btn variant="ghost" size="sm" icon="settings" onClick={() => saveH({ enabled: false })}>Pause</Btn>}
      </div>

      {!h.enabled && (
        <Card style={{ textAlign: "center", padding: "40px 24px" }}>
          <div style={{ width: 56, height: 56, borderRadius: "50%", background: C.pinkSoft, border: `1.5px solid ${C.pink}`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
            <Icon name="heart" size={26} color={C.pink} />
          </div>
          <p style={{ fontSize: 16, fontWeight: 600, margin: "0 0 8px", color: C.text }}>Health & Self-Care Layer</p>
          <p style={{ color: C.textMuted, fontSize: 14, lineHeight: 1.7, margin: "0 0 20px", maxWidth: 360, marginLeft: "auto", marginRight: "auto" }}>Track water, medication, sleep and meals. Nia will nudge you gently — at the right time, in the right tone. Never intrusive.</p>
          <Btn variant="primary" onClick={() => saveH({ enabled: true })} icon="heart">Enable health tracking</Btn>
        </Card>
      )}

      {h.enabled && (<>

        {/* Nudge tone selector */}
        <Card style={{ marginBottom: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <Icon name="activity" size={15} color={C.textMuted} />
            <p style={{ margin: 0, fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", color: C.textMuted }}>Nudging style</p>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            {["gentle", "supportive", "strong"].map(t => (
              <button key={t} onClick={() => saveH({ nudgingStyle: t })}
                style={{ flex: 1, padding: "8px 6px", borderRadius: 10, fontSize: 12, fontWeight: 500, cursor: "pointer", fontFamily: "inherit", border: `1px solid ${h.nudgingStyle === t ? toneColors[t] : C.border}`, background: h.nudgingStyle === t ? (t === "gentle" ? C.tealSoft : t === "supportive" ? C.accentMid : C.warnSoft) : "transparent", color: h.nudgingStyle === t ? toneColors[t] : C.textMuted, transition: "all 0.15s" }}>
                {t === "gentle" ? "Gentle" : t === "supportive" ? "Supportive" : "Direct"}
              </button>
            ))}
          </div>
          <p style={{ margin: "8px 0 0", fontSize: 11, color: C.textDim }}>
            {h.nudgingStyle === "gentle" ? "Soft awareness nudges. No pressure." : h.nudgingStyle === "supportive" ? "Progress-focused. Encouraging but clear." : "Direct reminders. Used sparingly for critical things."}
          </p>
        </Card>

        {/* AI Insight */}
        <div style={{ marginBottom: 14, padding: "12px 16px", background: C.accentMid, borderRadius: 12, border: `1px solid ${C.accent}`, display: "flex", gap: 12, alignItems: "flex-start" }}>
          <Icon name="sparkle" size={16} color={C.accent} style={{ marginTop: 2 }} />
          <div style={{ flex: 1 }}>
            <p style={{ margin: "0 0 6px", fontSize: 11, fontWeight: 600, color: C.accent, textTransform: "uppercase", letterSpacing: "0.05em" }}>Nia's observation</p>
            <p style={{ margin: "0 0 8px", fontSize: 13, color: C.text, lineHeight: 1.65 }}>{insight || `${mem.userName ? mem.userName + ", I'm" : "I'm"} keeping an eye on your health today. Tap below for my current read.`}</p>
            <Btn size="sm" variant="ghost" onClick={getInsight} loading={insightLoad} icon="eye">Get today's insight</Btn>
          </div>
        </div>

        {/* Water */}
        <Card style={{ marginBottom: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Icon name="droplet" size={18} color={C.teal} />
              <p style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>Water</p>
              <Badge color="teal">{(h.waterToday || 0).toFixed(1)}L / {h.waterGoal}L</Badge>
            </div>
            <button onClick={() => fireNudge("water")} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 11, color: C.textDim, display: "flex", alignItems: "center", gap: 4 }}>
              <Icon name="bell" size={12} color={C.textDim} />nudge me
            </button>
          </div>

          {/* Water visual bar */}
          <div style={{ display: "flex", gap: 4, marginBottom: 14 }}>
            {Array.from({ length: waterSegments }).map((_, i) => (
              <div key={i} style={{ flex: 1, height: 8, borderRadius: 4, background: i < Math.round(waterPct / (100 / waterSegments)) ? C.teal : C.border, transition: "background 0.3s" }} />
            ))}
          </div>

          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 10 }}>
            {[150, 250, 350, 500].map(ml => (
              <Btn key={ml} size="sm" variant="ghost" onClick={() => logWater(ml)} style={{ flex: 1 }}>+{ml}ml</Btn>
            ))}
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ fontSize: 11, color: C.textMuted }}>{waterPct}% of daily goal</span>
                <span style={{ fontSize: 11, color: C.textDim }}>{Math.max(0, (h.waterGoal || 2.5) - (h.waterToday || 0)).toFixed(1)}L remaining</span>
              </div>
              <div style={{ background: C.border, borderRadius: 99, height: 5 }}>
                <div style={{ background: waterPct >= 100 ? C.success : C.teal, borderRadius: 99, height: "100%", width: `${waterPct}%`, transition: "width 0.4s ease" }} />
              </div>
            </div>
            <button onClick={resetWater} style={{ background: "none", border: "none", cursor: "pointer", color: C.textDim, fontSize: 11, whiteSpace: "nowrap" }}>Reset</button>
          </div>

          {/* Water goal slider */}
          <div style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 11, color: C.textDim, whiteSpace: "nowrap" }}>Goal</span>
            <input type="range" min={1} max={5} step={0.5} value={h.waterGoal || 2.5} onChange={e => saveH({ waterGoal: parseFloat(e.target.value) })} style={{ flex: 1, accentColor: C.teal }} />
            <span style={{ fontSize: 11, color: C.textMuted, minWidth: 28 }}>{h.waterGoal || 2.5}L</span>
          </div>
        </Card>

        {/* Medication */}
        <Card style={{ marginBottom: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Icon name="pill" size={18} color={C.accent} />
              <p style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>Medication</p>
              {(h.medications || []).length > 0 && <Badge color="accent">{(h.medications || []).filter(m => isMedDone(m.id)).length}/{(h.medications || []).length} today</Badge>}
            </div>
            <Btn size="sm" icon="plus" onClick={() => setAddMed(v => !v)}>Add</Btn>
          </div>

          {addMed && (
            <div style={{ background: C.surface, borderRadius: 10, padding: "12px 14px", marginBottom: 12, border: `1px solid ${C.border}` }}>
              <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                <Input value={medName} onChange={setMedName} placeholder="Medication name" style={{ flex: 2 }} autoFocus />
                <Input value={medTime} onChange={setMedTime} placeholder="Time" style={{ flex: 1 }} />
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <Btn size="sm" variant="primary" onClick={addMedication}>Save</Btn>
                <Btn size="sm" variant="ghost" onClick={() => setAddMed(false)}>Cancel</Btn>
              </div>
            </div>
          )}

          {(h.medications || []).length === 0 && !addMed && (
            <p style={{ fontSize: 13, color: C.textDim, margin: 0 }}>No medications added yet. Nia will check in at your set times.</p>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {(h.medications || []).map(med => {
              const done = isMedDone(med.id);
              return (
                <div key={med.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 12px", background: C.surface, borderRadius: 10, border: `1px solid ${done ? C.successSoft : C.border}` }}>
                  <button onClick={() => toggleMedDone(med.id)} style={{ width: 28, height: 28, borderRadius: "50%", border: `2px solid ${done ? C.success : C.border}`, background: done ? C.successSoft : "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all 0.2s" }}>
                    {done && <Icon name="check" size={13} color={C.success} />}
                  </button>
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: "0 0 2px", fontSize: 13, fontWeight: 500, color: done ? C.textMuted : C.text, textDecoration: done ? "line-through" : "none" }}>{med.name}</p>
                    <p style={{ margin: 0, fontSize: 11, color: C.textDim, display: "flex", alignItems: "center", gap: 4 }}><Icon name="clock" size={10} color={C.textDim} />{med.time}</p>
                  </div>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button onClick={() => fireNudge("med")} style={{ background: "none", border: "none", cursor: "pointer", color: C.textDim }}><Icon name="bell" size={14} color={C.textDim} /></button>
                    <button onClick={() => delMed(med.id)} style={{ background: "none", border: "none", cursor: "pointer", color: C.textDim }}><Icon name="trash" size={14} color={C.textDim} /></button>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Sleep */}
        <Card style={{ marginBottom: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <Icon name="moon" size={18} color={C.pink} />
            <p style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>Sleep</p>
            {lastSleep && <Badge color="pink">Slept at {lastSleep.time}</Badge>}
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 10 }}>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 11, color: C.textMuted, margin: "0 0 6px" }}>Target bedtime</p>
              <Input value={h.sleepTarget || "23:00"} onChange={v => saveH({ sleepTarget: v })} placeholder="23:00" style={{ padding: "7px 12px", fontSize: 13 }} />
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 11, color: C.textMuted, margin: "0 0 6px" }}>Log actual bedtime</p>
              <Input value={""} onChange={() => {}} placeholder="e.g. 23:30" onKeyDown={e => { if (e.key === "Enter" && e.target.value) { logSleep(e.target.value); e.target.value = ""; } }} style={{ padding: "7px 12px", fontSize: 13 }} />
            </div>
          </div>
          {(h.sleepLog || []).filter(l => l.date === today).length === 0 && (
            <p style={{ fontSize: 12, color: C.textDim, margin: 0 }}>No sleep logged today. Type your bedtime and press Enter to log it.</p>
          )}
        </Card>

        {/* Meals */}
        <Card style={{ marginBottom: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Icon name="coffee" size={18} color={C.warn} />
              <p style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>Meals</p>
              <Badge color="warn">{todayMeals.length} today</Badge>
            </div>
          </div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 10 }}>
            {["Breakfast", "Lunch", "Dinner", "Snack"].map(meal => {
              const logged = todayMeals.some(m => m.meal === meal);
              return (
                <button key={meal} onClick={() => !logged && logMeal(meal)} style={{ padding: "7px 14px", borderRadius: 99, fontSize: 12, cursor: logged ? "default" : "pointer", fontFamily: "inherit", border: `1px solid ${logged ? C.success : C.border}`, background: logged ? C.successSoft : "transparent", color: logged ? C.success : C.textMuted, transition: "all 0.2s", display: "flex", alignItems: "center", gap: 5 }}>
                  {logged && <Icon name="check" size={11} color={C.success} />}{meal}
                </button>
              );
            })}
          </div>
          {todayMeals.length === 0 && <p style={{ fontSize: 12, color: C.textDim, margin: 0 }}>No meals logged today. Tap a meal above to mark it.</p>}
        </Card>

        {/* Quiet hours */}
        <Card>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <Icon name="moon" size={15} color={C.textMuted} />
            <p style={{ margin: 0, fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", color: C.textMuted }}>Quiet hours</p>
          </div>
          <p style={{ fontSize: 12, color: C.textDim, margin: "0 0 10px" }}>Nia will not send health nudges during these hours</p>
          <div style={{ display: "flex", gap: 10 }}>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 11, color: C.textMuted, margin: "0 0 5px" }}>From</p>
              <input type="number" min={0} max={23} value={h.quietStart ?? 22} onChange={e => saveH({ quietStart: parseInt(e.target.value) })} style={{ background: C.surface, border: `1px solid ${C.border}`, color: C.text, borderRadius: 8, padding: "7px 12px", fontSize: 13, fontFamily: "inherit", width: "100%", boxSizing: "border-box" }} />
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 11, color: C.textMuted, margin: "0 0 5px" }}>To</p>
              <input type="number" min={0} max={23} value={h.quietEnd ?? 7} onChange={e => saveH({ quietEnd: parseInt(e.target.value) })} style={{ background: C.surface, border: `1px solid ${C.border}`, color: C.text, borderRadius: 8, padding: "7px 12px", fontSize: 13, fontFamily: "inherit", width: "100%", boxSizing: "border-box" }} />
            </div>
          </div>
        </Card>

        {/* Nudge toast */}
        {nudgeMsg && (
          <div style={{ marginTop: 14, padding: "14px 16px", background: nudgeType === "info" ? C.surface : C.accentMid, border: `1px solid ${nudgeType === "info" ? C.border : C.accent}`, borderRadius: 12, display: "flex", gap: 10, alignItems: "flex-start" }}>
            <Icon name="sparkle" size={16} color={nudgeType === "info" ? C.textMuted : C.accent} style={{ marginTop: 2 }} />
            <div style={{ flex: 1 }}>
              <p style={{ margin: "0 0 6px", fontSize: 13, color: C.text, lineHeight: 1.6 }}>{nudgeMsg}</p>
              <button onClick={() => setNudgeMsg("")} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 11, color: C.textDim }}>Dismiss</button>
            </div>
          </div>
        )}

      </>)}
    </div>
  );
}


// ─── INSPIRE VIEW ────────────────────────────────────────────────────────────
function InspireView({mem}) {
  const [cards,setCards]=useState([]);
  const [loading,setLoading]=useState(false);
  const [genLoading,setGenLoading]=useState(null);

  const CATEGORIES=[
    {id:"money",label:"Money",prompt:"motivational money wealth success quote golden coins luxury dark background cinematic"},
    {id:"morning",label:"Good Morning",prompt:"good morning sunrise motivational quote beautiful golden light peaceful inspiring"},
    {id:"hustle",label:"Hustle",prompt:"hustle grind success entrepreneur motivational dark dramatic cinematic quote background"},
    {id:"health",label:"Health",prompt:"health wellness fitness motivation nature green energy vibrant inspiring"},
    {id:"mindset",label:"Mindset",prompt:"mindset growth positive thinking brain universe galaxy motivational dark background"},
    {id:"faith",label:"Faith",prompt:"faith hope spiritual light divine motivational peaceful golden rays inspiring"},
    {id:"love",label:"Love",prompt:"love heart warmth relationship motivation soft colors beautiful inspiring"},
    {id:"nigeria",label:"Naija",prompt:"african success motivation vibrant colors nigeria africa inspiring entrepreneur"},
  ];

  const getQuote=async(category)=>{
    const r=await ai([{role:"user",content:`Give me one powerful ${category} motivational quote. Max 15 words. No author name. Just the quote.`}],"You give short powerful motivational quotes. Return ONLY the quote text, nothing else.");
    return r.trim().replace(/^["']|["']$/g,"");
  };

  const generate=async(cat)=>{
    setGenLoading(cat.id);
    try{
      const quote=await getQuote(cat.label);
      const encodedPrompt=encodeURIComponent(`${cat.prompt}, with text overlay saying "${quote}", professional motivational poster`);
      const imgUrl=`https://image.pollinations.ai/prompt/${encodedPrompt}?width=800&height=800&seed=${Date.now()}&nologo=true`;
      setCards(prev=>[{id:Date.now(),quote,category:cat.label,imgUrl,prompt:cat.prompt},  ...prev].slice(0,12));
    }catch(e){console.error(e);}
    setGenLoading(null);
  };

  const download=(card)=>{
    const a=document.createElement("a");
    a.href=card.imgUrl;
    a.download=`nia-inspire-${card.category}.jpg`;
    a.target="_blank";
    a.click();
  };

  return(
    <div style={{maxWidth:700,margin:"0 auto",width:"100%",padding:"24px 16px"}}>
      <div style={{marginBottom:20}}>
        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
          <Icon name="image" size={18} color={C.pink}/>
          <h2 style={{fontSize:20,fontWeight:600,margin:0}}>Inspire</h2>
        </div>
        <p style={{color:C.textMuted,fontSize:13,margin:0}}>AI-generated motivational image cards. Tap a category to generate.</p>
      </div>

      <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:20}}>
        {CATEGORIES.map(cat=>(
          <button key={cat.id} onClick={()=>generate(cat)} disabled={genLoading===cat.id} style={{padding:"8px 14px",borderRadius:99,fontSize:13,fontWeight:500,cursor:genLoading===cat.id?"not-allowed":"pointer",fontFamily:"inherit",border:`1px solid ${C.border}`,background:genLoading===cat.id?C.accentMid:"transparent",color:genLoading===cat.id?C.accent:C.textMuted,transition:"all 0.2s",display:"flex",alignItems:"center",gap:6}}>
            {genLoading===cat.id&&<span style={{width:10,height:10,border:`2px solid ${C.accent}`,borderTopColor:"transparent",borderRadius:"50%",animation:"spin 0.7s linear infinite",display:"inline-block"}}/>}
            {cat.label}
          </button>
        ))}
      </div>

      {cards.length===0&&!genLoading&&(
        <Card style={{textAlign:"center",padding:"48px 24px"}}>
          <div style={{display:"flex",justifyContent:"center",marginBottom:14}}><Icon name="image" size={40} color={C.textDim}/></div>
          <p style={{fontSize:15,color:C.textMuted,margin:"0 0 6px"}}>Pick a category above</p>
          <p style={{fontSize:13,color:C.textDim,margin:0}}>Nia will generate a motivational image card with a quote for you</p>
        </Card>
      )}

      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:14}}>
        {cards.map(card=>(
          <div key={card.id} style={{borderRadius:14,overflow:"hidden",border:`1px solid ${C.border}`,background:C.card,position:"relative"}}>
            <div style={{position:"relative",paddingTop:"100%",background:C.surface}}>
              <img src={card.imgUrl} alt={card.quote} style={{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover"}} onError={e=>{e.target.style.display="none";}}/>
              <div style={{position:"absolute",inset:0,background:"linear-gradient(to top,rgba(0,0,0,0.8) 0%,transparent 60%)",display:"flex",alignItems:"flex-end",padding:14}}>
                <p style={{margin:0,fontSize:13,fontWeight:600,color:"#fff",lineHeight:1.5,textShadow:"0 1px 4px rgba(0,0,0,0.8)"}}>&ldquo;{card.quote}&rdquo;</p>
              </div>
            </div>
            <div style={{padding:"10px 14px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <span style={{fontSize:11,color:C.textMuted}}>{card.category}</span>
              <div style={{display:"flex",gap:8}}>
                <button onClick={()=>generate(CATEGORIES.find(c=>c.label===card.category)||CATEGORIES[0])} style={{background:"none",border:"none",cursor:"pointer",color:C.textMuted,fontSize:11,display:"flex",alignItems:"center",gap:4,fontFamily:"inherit"}}><Icon name="refresh" size={12} color={C.textMuted}/>New</button>
                <button onClick={()=>download(card)} style={{background:"none",border:"none",cursor:"pointer",color:C.accent,fontSize:11,display:"flex",alignItems:"center",gap:4,fontFamily:"inherit"}}><Icon name="download" size={12} color={C.accent}/>Save</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
// ─── NAV ─────────────────────────────────────────────────────────────────────
const NAV=[{id:"chat",icon:"chat",label:"Chat"},{id:"morning",icon:"sun",label:"Briefing"},{id:"goals",icon:"target",label:"Goals"},{id:"habits",icon:"loop",label:"Habits"},{id:"reminders",icon:"bell",label:"Reminders"},{id:"health",icon:"heart",label:"Health"},{id:"inspire",icon:"image",label:"Inspire"},{id:"memory",icon:"brain",label:"Memory"}];

// ─── ROOT (replaced by AuthenticatedApp below) ────────────────────────────────
function OldApp___unused() {
  const [mem,save]=useMemory();
  const [msgs,addMsg]=useMsgs();
  const [tab,setTab]=useState("chat");
  const [showWA,setShowWA]=useState(false);

  if(!mem.onboarded) return <Onboarding onComplete={save}/>;

  return (
    <div style={{fontFamily:"'DM Sans','Segoe UI',sans-serif",background:C.bg,color:C.text,minHeight:"100vh",display:"flex",flexDirection:"column"}}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&display=swap" rel="stylesheet"/>
      {showWA&&<WhatsAppModal mem={mem} save={save} onClose={()=>setShowWA(false)}/>}

      <div style={{background:C.surface,borderBottom:`1px solid ${C.border}`,padding:"0 20px",display:"flex",alignItems:"center",height:54,flexShrink:0,position:"sticky",top:0,zIndex:20}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <NiaAvatar size={32}/>
          <span style={{fontSize:16,fontWeight:600,letterSpacing:"-0.01em"}}>Nia</span>
          <span style={{fontSize:10,background:C.accentMid,color:C.accent,padding:"2px 8px",borderRadius:99,fontWeight:600,letterSpacing:"0.04em",textTransform:"uppercase"}}>Life OS</span>
        </div>
        <div style={{marginLeft:"auto",display:"flex",alignItems:"center",gap:12}}>
          {mem.whatsappNumber&&<div style={{display:"flex",alignItems:"center",gap:4,padding:"3px 8px",background:C.greenSoft,borderRadius:99,border:`1px solid ${C.green}`}}><Icon name="whatsapp" size={11} color={C.green}/><span style={{fontSize:10,color:C.green,fontWeight:600}}>WA</span></div>}
          {mem.userName&&<span style={{fontSize:13,color:C.textMuted,display:"flex",alignItems:"center",gap:5}}><Icon name="user" size={14} color={C.textMuted}/>{mem.userName}</span>}
        </div>
      </div>

      <div style={{flex:1,overflowY:"auto",paddingBottom:68,display:"flex",flexDirection:"column"}}>
        {tab==="chat"&&<ChatView mem={mem} save={save} msgs={msgs} addMsg={addMsg} onOpenWA={()=>setShowWA(true)}/>}
        {tab==="morning"&&<MorningView mem={mem} save={save}/>}
        {tab==="goals"&&<GoalsView mem={mem} save={save}/>}
        {tab==="habits"&&<HabitsView mem={mem} save={save}/>}
        {tab==="reminders"&&<RemindersView mem={mem} save={save} onOpenWA={()=>setShowWA(true)}/>}
        {tab==="health"&&<HealthView mem={mem} save={save}/>}
        {tab==="brainstorm"&&<BrainstormView mem={mem}/>}
        {tab==="memory"&&<MemoryView mem={mem} save={save} onOpenWA={()=>setShowWA(true)}/>}
      </div>

      <div style={{position:"fixed",bottom:0,left:0,right:0,background:C.surface,borderTop:`1px solid ${C.border}`,display:"flex",zIndex:20,padding:"0 2px"}}>
        {NAV.map(item=>(
          <button key={item.id} onClick={()=>setTab(item.id)} style={{flex:1,padding:"9px 2px 9px",border:"none",background:"transparent",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:3,position:"relative"}}>
            {tab===item.id&&<div style={{position:"absolute",top:0,left:"15%",right:"15%",height:2,background:C.accent,borderRadius:"0 0 2px 2px"}}/>}
            <Icon name={item.icon} size={18} color={tab===item.id?C.accent:C.textDim}/>
            <span style={{fontSize:8,color:tab===item.id?C.accent:C.textDim,fontWeight:tab===item.id?600:400,fontFamily:"inherit",letterSpacing:"0.03em",textTransform:"uppercase"}}>{item.label}</span>
          </button>
        ))}
      </div>
      <style>{`@keyframes pulse{0%,80%,100%{opacity:0.3;transform:scale(0.9)}40%{opacity:1;transform:scale(1)}}@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

// ─── AUTH SCREEN ─────────────────────────────────────────────────────────────
function AuthScreen({onAuth}) {
  const [mode,setMode]=useState("login");
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [name,setName]=useState("");
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState("");
  const submit=async()=>{
    if(!email||!password){setError("Please fill in all fields.");return;}
    setLoading(true);setError("");
    try{
      if(mode==="login"){
        const {data,error:e}=await supabase.auth.signInWithPassword({email,password});
        if(e)throw e; onAuth(data.user);
      } else {
        if(!name){setError("Please enter your name.");setLoading(false);return;}
        const {data,error:e}=await supabase.auth.signUp({email,password,options:{data:{name}}});
        if(e)throw e; onAuth(data.user);
      }
    }catch(e){setError(e.message||"Something went wrong.");}
    setLoading(false);
  };
  return(
    <div style={{minHeight:"100vh",background:C.bg,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"24px",fontFamily:"'DM Sans',sans-serif"}}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&display=swap" rel="stylesheet"/>
      <div style={{width:"100%",maxWidth:400}}>
        <div style={{textAlign:"center",marginBottom:28}}>
          <div style={{width:60,height:60,borderRadius:"50%",background:C.accentMid,border:`2px solid ${C.accent}`,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 14px"}}><Icon name="sparkle" size={28} color={C.accent}/></div>
          <h1 style={{fontSize:24,fontWeight:600,margin:"0 0 4px",color:C.text}}>Nia Life OS</h1>
          <p style={{color:C.textMuted,fontSize:14,margin:0}}>Your personal AI life companion</p>
        </div>
        <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:16,padding:"28px 24px"}}>
          <div style={{display:"flex",gap:6,marginBottom:22,background:C.surface,borderRadius:10,padding:4}}>
            {["login","signup"].map(m=><button key={m} onClick={()=>{setMode(m);setError("");}} style={{flex:1,padding:"8px",borderRadius:8,border:"none",background:mode===m?C.accent:"transparent",color:mode===m?"#fff":C.textMuted,fontSize:13,fontWeight:500,cursor:"pointer",fontFamily:"inherit",transition:"all 0.2s"}}>{m==="login"?"Sign in":"Create account"}</button>)}
          </div>
          {mode==="signup"&&<div style={{marginBottom:12}}><p style={{fontSize:12,color:C.textMuted,margin:"0 0 5px"}}>Full name</p><Input value={name} onChange={setName} placeholder="Your name" onKeyDown={e=>e.key==="Enter"&&submit()}/></div>}
          <div style={{marginBottom:12}}><p style={{fontSize:12,color:C.textMuted,margin:"0 0 5px"}}>Email</p><Input value={email} onChange={setEmail} placeholder="you@email.com" onKeyDown={e=>e.key==="Enter"&&submit()}/></div>
          <div style={{marginBottom:18}}><p style={{fontSize:12,color:C.textMuted,margin:"0 0 5px"}}>Password</p><input value={password} onChange={e=>setPassword(e.target.value)} type="password" placeholder="••••••••" onKeyDown={e=>e.key==="Enter"&&submit()} style={{background:C.surface,border:`1px solid ${C.border}`,color:C.text,borderRadius:10,padding:"10px 14px",fontSize:14,fontFamily:"inherit",width:"100%",boxSizing:"border-box",outline:"none"}}/></div>
          {error&&<p style={{fontSize:13,color:C.danger,margin:"0 0 14px",padding:"8px 12px",background:C.dangerSoft,borderRadius:8}}>{error}</p>}
          <Btn variant="primary" onClick={submit} loading={loading} style={{width:"100%",justifyContent:"center"}}>{mode==="login"?"Sign in":"Create account"}</Btn>
        </div>
      </div>
    </div>
  );
}

// ─── AUTHENTICATED ROOT ───────────────────────────────────────────────────────
function AuthenticatedApp({user}) {
  const [mem,save]=useMemory();
  const [msgs,addMsg]=useMsgs();
  const [tab,setTab]=useState("chat");
  const [showWA,setShowWA]=useState(false);

  // Sync memory to Supabase
  useEffect(()=>{
    if(!user) return;
    const t=setTimeout(async()=>{
      await supabase.from("memories").upsert({user_id:user.id,goals:mem.goals,habits:mem.habits,reminders:mem.reminders,notes:mem.notes,habit_logs:mem.habitLogs,health:mem.health||{},whatsapp_logs:mem.whatsappLogs||[],updated_at:new Date().toISOString()},{onConflict:"user_id"});
      if(mem.userName) await supabase.from("profiles").update({name:mem.userName,age:mem.age,marital_status:mem.marital,occupation:mem.occupation,whatsapp_number:mem.whatsappNumber,onboarded:mem.onboarded}).eq("id",user.id);
    },2000);
    return()=>clearTimeout(t);
  },[mem]);

  // On login: load fresh from Supabase (localStorage already cleared on auth)
  useEffect(()=>{
    const load=async()=>{
      const {data:m}=await supabase.from("memories").select("*").eq("user_id",user.id).single();
      if(m) save({goals:m.goals||[],habits:m.habits||[],reminders:m.reminders||[],notes:m.notes||[],habitLogs:m.habit_logs||{},health:m.health||{},whatsappLogs:m.whatsapp_logs||[]});
      const {data:p}=await supabase.from("profiles").select("*").eq("id",user.id).single();
      if(p) save({userName:p.name,age:p.age,marital:p.marital_status,occupation:p.occupation,whatsappNumber:p.whatsapp_number,onboarded:p.onboarded||false,plan:p.plan||"free"});
    };
    load();
    // Load conversations from Supabase
    const {data:convos}=await supabase.from("conversations").select("id,role,content,created_at").eq("user_id",user.id).order("created_at",{ascending:true}).limit(80);
    if(convos?.length){
      // setMsgs is not accessible here - pass loaded convos as initial state
      window.__niaMsgs = convos.map(c=>({...c,ts:c.created_at}));
    }
  },[]);

  const logout=async()=>{
    localStorage.removeItem("nia_v3");
    localStorage.removeItem("nia_msgs_v3");
    await supabase.auth.signOut();
  };

  if(!mem.onboarded) return <Onboarding onComplete={save}/>;

  return (
    <div style={{fontFamily:"'DM Sans','Segoe UI',sans-serif",background:C.bg,color:C.text,minHeight:"100vh",display:"flex",flexDirection:"column"}}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&display=swap" rel="stylesheet"/>
      {showWA&&<WhatsAppModal mem={mem} save={save} onClose={()=>setShowWA(false)}/>}
      <div style={{background:C.surface,borderBottom:`1px solid ${C.border}`,padding:"0 20px",display:"flex",alignItems:"center",height:54,flexShrink:0,position:"sticky",top:0,zIndex:20}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <NiaAvatar size={32}/>
          <span style={{fontSize:16,fontWeight:600,letterSpacing:"-0.01em"}}>Nia</span>
          <span style={{fontSize:10,background:C.accentMid,color:C.accent,padding:"2px 8px",borderRadius:99,fontWeight:600,letterSpacing:"0.04em",textTransform:"uppercase"}}>Life OS</span>
        </div>
        <div style={{marginLeft:"auto",display:"flex",alignItems:"center",gap:12}}>
          {mem.whatsappNumber&&<div style={{display:"flex",alignItems:"center",gap:4,padding:"3px 8px",background:C.greenSoft,borderRadius:99,border:`1px solid ${C.green}`}}><Icon name="whatsapp" size={11} color={C.green}/><span style={{fontSize:10,color:C.green,fontWeight:600}}>WA</span></div>}
          {mem.userName&&<span style={{fontSize:13,color:C.textMuted,display:"flex",alignItems:"center",gap:5}}><Icon name="user" size={14} color={C.textMuted}/>{mem.userName}</span>}
          <button onClick={logout} style={{background:"none",border:`1px solid ${C.border}`,color:C.textMuted,borderRadius:8,padding:"4px 10px",fontSize:11,cursor:"pointer",fontFamily:"inherit"}}>Sign out</button>
        </div>
      </div>
      <div style={{flex:1,overflowY:"auto",paddingBottom:68,display:"flex",flexDirection:"column"}}>
        {tab==="chat"&&<ChatView mem={mem} save={save} msgs={msgs} addMsg={addMsg} onOpenWA={()=>setShowWA(true)}/>}
        {tab==="morning"&&<MorningView mem={mem} save={save}/>}
        {tab==="goals"&&<GoalsView mem={mem} save={save}/>}
        {tab==="habits"&&<HabitsView mem={mem} save={save}/>}
        {tab==="reminders"&&<RemindersView mem={mem} save={save} onOpenWA={()=>setShowWA(true)}/>}
        {tab==="health"&&<HealthView mem={mem} save={save}/> }
        {tab==="inspire"&&<InspireView mem={mem}/>}
        {tab==="brainstorm"&&<BrainstormView mem={mem}/>}
        {tab==="memory"&&<MemoryView mem={mem} save={save} onOpenWA={()=>setShowWA(true)}/>}
      </div>
      <div style={{position:"fixed",bottom:0,left:0,right:0,background:C.surface,borderTop:`1px solid ${C.border}`,display:"flex",zIndex:20,padding:"0 2px"}}>
        {NAV.map(item=>(
          <button key={item.id} onClick={()=>setTab(item.id)} style={{flex:1,padding:"9px 2px 9px",border:"none",background:"transparent",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:3,position:"relative"}}>
            {tab===item.id&&<div style={{position:"absolute",top:0,left:"15%",right:"15%",height:2,background:C.accent,borderRadius:"0 0 2px 2px"}}/>}
            <Icon name={item.icon} size={18} color={tab===item.id?C.accent:C.textDim}/>
            <span style={{fontSize:8,color:tab===item.id?C.accent:C.textDim,fontWeight:tab===item.id?600:400,fontFamily:"inherit",letterSpacing:"0.03em",textTransform:"uppercase"}}>{item.label}</span>
          </button>
        ))}
      </div>
      <style>{`@keyframes pulse{0%,80%,100%{opacity:0.3;transform:scale(0.9)}40%{opacity:1;transform:scale(1)}}@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

// ─── MAIN ENTRY ───────────────────────────────────────────────────────────────
// Note: The original App() export above still exists - we override here
// Remove original App export and use this one instead

export default function App() {
  const [user, setUser] = useState(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null);
      setChecked(true);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user || null);
    });
    return () => subscription.unsubscribe();
  }, []);
  if (!checked) return (
    <div style={{ minHeight: "100vh", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: 40, height: 40, borderRadius: "50%", border: `3px solid ${C.accent}`, borderTopColor: "transparent", animation: "spin 0.7s linear infinite" }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
  if (!user) return <AuthScreen onAuth={(u)=>{ 
    // Clear ALL local storage on login so fresh Supabase data loads
    localStorage.removeItem("nia_v3");
    localStorage.removeItem("nia_msgs_v3");
    setUser(u); 
  }} />;
  return <AuthenticatedApp user={user} />;
}
