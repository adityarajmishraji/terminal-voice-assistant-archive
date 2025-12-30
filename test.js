import { execSync } from "child_process";
import fs from "fs";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

console.log("🎤 Speak for 5 seconds...");

// record audio (stereo OK)
execSync(
  'ffmpeg -y -f dshow -i audio="Microphone (Realtek(R) Audio)" -t 5 input.wav',
  { stdio: "ignore" }
);

// speech → text
const transcript = await openai.audio.transcriptions.create({
  file: fs.createReadStream("input.wav"),
  model: "gpt-4o-transcribe",
});

console.log("🗣️ You said:", transcript.text);

// GPT response
const response = await openai.responses.create({
  model: "gpt-4.1-mini",
  input: transcript.text,
});

console.log("🤖 GPT:", response.output_text);
