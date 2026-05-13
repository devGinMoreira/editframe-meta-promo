#!/usr/bin/env node
/**
 * Generate ElevenLabs voiceover MP3s per scene.
 * Requires ELEVENLABS_API_KEY env var.
 * Writes src/assets/voice-s{N}.mp3
 */
import { writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, "..");
const assetsDir = resolve(projectRoot, "src", "assets");
mkdirSync(assetsDir, { recursive: true });

function loadApiKey() {
  if (process.env.ELEVENLABS_API_KEY) return process.env.ELEVENLABS_API_KEY;
  throw new Error("Set ELEVENLABS_API_KEY in your environment before running this script.");
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
