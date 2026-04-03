import { spawn } from "node:child_process";
import { mkdirSync } from "node:fs";
import { join } from "node:path";

const chromePath = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const userDataDir = join(process.cwd(), `.codex-chrome-debug-${Date.now()}`);
mkdirSync(userDataDir, { recursive: true });
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const browser = spawn(chromePath, [
  "--headless=new",
  "--disable-gpu",
  "--remote-debugging-port=9225",
  `--user-data-dir=${userDataDir}`,
  "http://127.0.0.1:3100/admin",
], { stdio: "ignore" });

async function waitForJson(url, timeoutMs = 15000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const response = await fetch(url);
      if (response.ok) return await response.json();
    } catch {}
    await sleep(200);
  }
  throw new Error(`Timed out waiting for ${url}`);
}

let ws;
let id = 0;
const pending = new Map();
function send(method, params = {}) {
  const messageId = ++id;
  ws.send(JSON.stringify({ id: messageId, method, params }));
  return new Promise((resolve, reject) => pending.set(messageId, { resolve, reject }));
}
async function evaluate(expression) {
  const result = await send("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true });
  return result.result?.value;
}
async function waitFor(expression, timeoutMs = 15000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    const value = await evaluate(expression);
    if (value) return value;
    await sleep(200);
  }
  throw new Error(`Timed out: ${expression}`);
}
async function clickButtonByText(text) {
  await evaluate(`(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const match = buttons.find((button) => (button.textContent || '').includes(${JSON.stringify(text)}));
    if (match) match.click();
  })()`);
}
async function setControlValue(selector, value) {
  await evaluate(`(() => {
    const element = document.querySelector(${JSON.stringify(selector)});
    const prototype = element.tagName === 'INPUT' ? HTMLInputElement.prototype : HTMLTextAreaElement.prototype;
    Object.getOwnPropertyDescriptor(prototype, 'value').set.call(element, ${JSON.stringify(value)});
    element.dispatchEvent(new Event('input', { bubbles: true }));
    element.dispatchEvent(new Event('change', { bubbles: true }));
  })()`);
}

try {
  await waitForJson("http://127.0.0.1:9225/json/version");
  const targets = await waitForJson("http://127.0.0.1:9225/json/list");
  const target = targets.find((item) => item.url.includes("/admin"));
  ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => {
    ws.addEventListener("open", resolve, { once: true });
    ws.addEventListener("error", reject, { once: true });
  });
  ws.addEventListener("message", (event) => {
    const message = JSON.parse(event.data.toString());
    if (message.id) {
      const entry = pending.get(message.id);
      if (entry) {
        pending.delete(message.id);
        if (message.error) entry.reject(new Error(message.error.message));
        else entry.resolve(message.result);
      }
    }
  });
  await send("Page.enable");
  await send("Runtime.enable");
  await waitFor("document.body && document.body.innerText.includes('Login')");
  await setControlValue("input[placeholder='Username']", "admin");
  await setControlValue("input[placeholder='Password']", "admin123");
  await clickButtonByText("Login");
  await waitFor("document.body && (document.body.innerText.includes('Workspace') || document.body.innerText.includes('Refresh Data') || document.body.innerText.includes('Dashboard'))", 20000);
  const buttons = await evaluate(`Array.from(document.querySelectorAll('button')).map((button) => (button.textContent || '').replace(/\s+/g, ' ').trim())`);
  console.log(JSON.stringify(buttons, null, 2));
} finally {
  try { ws?.close(); } catch {}
  try { browser.kill('SIGTERM'); } catch {}
  process.exit(0);
}

