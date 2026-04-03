import { spawn } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const userDataDir = join(process.cwd(), `.codex-chrome-dump-${Date.now()}`);
mkdirSync(userDataDir, { recursive: true });
const browser = spawn("C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe", [
  "--headless=new",
  "--disable-gpu",
  "--remote-debugging-port=9226",
  `--user-data-dir=${userDataDir}`,
  "http://127.0.0.1:3100/admin",
], { stdio: "ignore" });
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
let ws;
let id = 0;
const pending = new Map();
function send(method, params = {}) {
  const messageId = ++id;
  ws.send(JSON.stringify({ id: messageId, method, params }));
  return new Promise((resolve, reject) => pending.set(messageId, { resolve, reject }));
}
async function evalValue(expression) {
  const result = await send("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true });
  return result.result?.value;
}
async function wait(url) {
  for (let i = 0; i < 80; i += 1) {
    try {
      const response = await fetch(url);
      if (response.ok) return await response.json();
    } catch {}
    await sleep(250);
  }
  throw new Error(url);
}
async function waitFor(expression) {
  for (let i = 0; i < 100; i += 1) {
    const value = await evalValue(expression);
    if (value) return;
    await sleep(200);
  }
  throw new Error(expression);
}
async function setValue(selector, value) {
  await evalValue(`(() => {
    const el = document.querySelector(${JSON.stringify(selector)});
    const proto = el.tagName === 'INPUT' ? HTMLInputElement.prototype : HTMLTextAreaElement.prototype;
    Object.getOwnPropertyDescriptor(proto, 'value').set.call(el, ${JSON.stringify(value)});
    el.dispatchEvent(new Event('input', { bubbles: true }));
    el.dispatchEvent(new Event('change', { bubbles: true }));
    return true;
  })()`);
}
async function clickContains(text) {
  await evalValue(`(() => {
    const button = Array.from(document.querySelectorAll('button')).find((node) => (node.textContent || '').includes(${JSON.stringify(text)}));
    if (button) button.click();
    return true;
  })()`);
}
try {
  await wait("http://127.0.0.1:9226/json/version");
  const targets = await wait("http://127.0.0.1:9226/json/list");
  const target = targets.find((item) => item.url.includes('/admin'));
  ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => {
    ws.addEventListener('open', resolve, { once: true });
    ws.addEventListener('error', reject, { once: true });
  });
  ws.addEventListener('message', (event) => {
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
  await send('Page.enable');
  await send('Runtime.enable');
  await waitFor("document.body && document.body.innerText.includes('Login')");
  await setValue("input[placeholder='Username']", 'admin');
  await setValue("input[placeholder='Password']", 'admin123');
  await clickContains('Login');
  await waitFor("document.body && (document.body.innerText.includes('Workspace') || document.body.innerText.includes('Refresh Data') || document.body.innerText.includes('Dashboard'))");
  await sleep(1500);
  const html = await evalValue('document.body.innerHTML');
  const text = await evalValue('document.body.innerText');
  writeFileSync('.codex-admin-ui-dump.html', html);
  writeFileSync('.codex-admin-ui-dump.txt', text);
} catch (error) {
  writeFileSync('.codex-admin-ui-dump.txt', String(error?.message || error));
} finally {
  try { ws?.close(); } catch {}
  try { browser.kill('SIGTERM'); } catch {}
  setTimeout(() => process.exit(0), 250);
}
