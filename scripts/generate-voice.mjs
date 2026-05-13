#!/usr/bin/env node
/**
 * Generate ElevenLabs voiceover MP3s per scene.
 * Reads ELEVENLABS_API_KEY from ~/.claude/credentials.env or env.
 * Writes src/assets/voice-s{N}.mp3
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { homedir } from "node:os";

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, "..");
const assetsDir = resolve(projectRoot, "src", "assets");
mkdirSync(assetsDir, { recursive: true });

function loadApiKey() {
  if (process.env.ELEVENLABS_API_KEY) return process.env.ELEVENLABS_API_KEY;
  const credPath = resolve(homedir(), ".claude", "credentials.env");
  const text = readFileSync(credPath, "utf8");
  const m = text.match(/^ELEVENLABS_API_KEY=(.+)$/m);
  if (!m) throw new Error("ELEVENLABS_API_KEY not found in env or " + credPath);
  return m[1].trim();
}

const apiKey = loadApiKey();
const voiceId = process.env.VOICE_ID || "nPczCjzI2devNBz1zQrb"; // Brian, deep male, news-anchor

const scenes = [
  { id: "s1", duration: 3.5, text: "What if video was just code?" },
  { id: "s2", duration: 5.5, text: "Write a few components. Watch it render. Live." },
  { id: "s3", duration: 6.0, text: "Components. Not timelines." },
  { id: "s4", duration: 6.0, text: "Preview in your browser. Render in the cloud." },
  { id: "s5", duration: 6.0, text: "Editframe. Build video with code." },
];

async function generate(scene) {
  const url = `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`;
  const body = {
    text: scene.text,
    model_id: "eleven_multilingual_v2",
    voice_settings: { stability: 0.45, similarity_boost: 0.78, style: 0.35, use_speaker_boost: true },
  };
  const res = await fetch(url, {
    method: "POST",
    headers: { "xi-api-key": apiKey, "Content-Type": "application/json", "Accept": "audio/mpeg" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Scene ${scene.id} failed: HTTP ${res.status} — ${errText}`);
  }
  const buf = Buffer.from(await res.arrayBuffer());
  const outPath = resolve(assetsDir, `voice-${scene.id}.mp3`);
  writeFileSync(outPath, buf);
  console.log(`  ${scene.id}: ${buf.length} bytes -> ${outPath}`);
}

console.log(`Voice ID: ${voiceId}`);
console.log(`Output:   ${assetsDir}`);
for (const scene of scenes) {
  console.log(`Generating ${scene.id} ("${scene.text}")...`);
  await generate(scene);
}
console.log("\nDone.");
