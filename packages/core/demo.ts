import { stdin as input, stdout as output } from "node:process";
import { createInterface } from "node:readline/promises";

import { Model, ModelProviders, Provider } from "@samrith/sodalite-providers";

import { Bus } from "./src/events";
import { Workspace } from "./src/workspace";

const modelId = "gemma4";

const provider = new Provider({
  models: [modelId],
  options: {
    baseURL: "http://localhost:11434/v1",
  },
  provider: ModelProviders.OPENAI_COMPATIBLE,
});

const model = new Model(modelId, provider);
const workspace = new Workspace({
  cwd: process.cwd(),
});

const session = workspace.createSession();

const rl = createInterface({ input, output });

try {
  Bus.on("message.start", () => {
    process.stdout.write("\nAssistant: ");
  });
  Bus.on("message.stream", ({ message }) => {
    process.stdout.write(message.content.content);
  });
  Bus.on("message.end", ({ usage }) => {
    process.stdout.write(`\nusage:`);
    process.stdout.write(
      `\n  input: ${usage.input.total} tokens, ${usage.input.cachedRead} cached read, ${usage.input.cachedWrite} cached write, ${usage.input.noCache} no cache`
    );
    process.stdout.write(
      `\n  output: ${usage.output.total} tokens, ${usage.output.text} text, ${usage.output.reasoning} reasoning`
    );
    process.stdout.write(
      `\n  total: ${usage.total} tokens, ${usage.input.total} input, ${usage.output.total} output`
    );
    process.stdout.write("\n\n");
  });

  await loop(
    async (text) =>{ 
      await session.message(text, {
        model,
      }); }
  );
} finally {
  rl.close();
}

async function loop(cb: (text: string) => Promise<void>) {
  for (;;) {
    const line = await rl.question("You: ");
    const trimmed = line.trim();
    if (trimmed === "" || trimmed === "exit" || trimmed === "quit") {
      break;
    }

    await cb(trimmed);
  }
}
