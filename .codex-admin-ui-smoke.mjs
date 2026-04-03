import { spawn } from "node:child_process";
import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const baseUrl = "http://127.0.0.1:3100";
const chromePath = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const userDataDir = join(process.cwd(), `.codex-chrome-smoke-${Date.now()}`);
const resultPath = join(process.cwd(), ".codex-admin-ui-smoke-result.json");
mkdirSync(userDataDir, { recursive: true });

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const note = (message) => console.log(`[smoke] ${message}`);

const browser = spawn(chromePath, [
  "--headless=new",
  "--disable-gpu",
  "--no-first-run",
  "--no-default-browser-check",
  "--remote-debugging-port=9224",
  `--user-data-dir=${userDataDir}`,
  `${baseUrl}/admin`,
], { stdio: "ignore" });

async function waitForJson(url, timeoutMs = 15000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const response = await fetch(url);
      if (response.ok) return await response.json();
    } catch {}
    await sleep(250);
  }
  throw new Error(`Timed out waiting for ${url}`);
}

let ws;
let pending = new Map();
let id = 0;

function send(method, params = {}) {
  const messageId = ++id;
  ws.send(JSON.stringify({ id: messageId, method, params }));
  return new Promise((resolve, reject) => pending.set(messageId, { resolve, reject }));
}

async function evaluate(expression) {
  const result = await send("Runtime.evaluate", {
    expression,
    awaitPromise: true,
    returnByValue: true,
  });
  return result.result?.value;
}

async function waitFor(expression, timeoutMs = 15000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    const value = await evaluate(expression);
    if (value) return value;
    await sleep(200);
  }
  const bodyText = await evaluate("document.body ? document.body.innerText : ''");
  throw new Error(`Timed out waiting for expression: ${expression}\nCurrent body:\n${bodyText}`);
}

function quoted(value) {
  return JSON.stringify(value);
}

async function clickButtonByText(text) {
  const ok = await evaluate(`(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const normalize = (value) => (value || '').replace(/\s+/g, ' ').trim();
    const target = normalize(${quoted(text)});
    const match = buttons.find((button) => {
      const value = normalize(button.textContent);
      return value === target || value.includes(target);
    });
    if (!match) return false;
    match.click();
    return true;
  })()`);
  if (!ok) throw new Error(`Button not found: ${text}`);
}

async function setControlValue(selector, value) {
  const ok = await evaluate(`(() => {
    const element = document.querySelector(${quoted(selector)});
    if (!element) return false;
    const prototype = element.tagName === 'TEXTAREA'
      ? HTMLTextAreaElement.prototype
      : element.tagName === 'SELECT'
        ? HTMLSelectElement.prototype
        : HTMLInputElement.prototype;
    const descriptor = Object.getOwnPropertyDescriptor(prototype, 'value');
    descriptor?.set?.call(element, ${quoted(value)});
    element.dispatchEvent(new Event('input', { bubbles: true }));
    element.dispatchEvent(new Event('change', { bubbles: true }));
    return true;
  })()`);
  if (!ok) throw new Error(`Control not found: ${selector}`);
}

async function clickArticleButtonContaining(text, buttonText) {
  const ok = await evaluate(`(() => {
    const articles = Array.from(document.querySelectorAll('article'));
    const article = articles.find((node) => node.textContent?.includes(${quoted(text)}));
    if (!article) return false;
    const button = Array.from(article.querySelectorAll('button')).find((node) => node.textContent?.trim() === ${quoted(buttonText)});
    if (!button) return false;
    button.click();
    return true;
  })()`);
  if (!ok) throw new Error(`Article/button not found for ${text} / ${buttonText}`);
}

async function main() {
  note("waiting for Chrome DevTools");
  const version = await waitForJson("http://127.0.0.1:9224/json/version");
  let targets = await waitForJson("http://127.0.0.1:9224/json/list");
  let target = targets.find((item) => item.url.includes("/admin"));
  if (!target) {
    await sleep(1000);
    targets = await waitForJson("http://127.0.0.1:9224/json/list");
    target = targets.find((item) => item.url.includes("/admin"));
  }
  if (!target) throw new Error("Admin target not found.");

  ws = new WebSocket(target.webSocketDebuggerUrl || version.webSocketDebuggerUrl);
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
        if (message.error) entry.reject(new Error(message.error.message || "CDP error"));
        else entry.resolve(message.result);
      }
      return;
    }
    if (message.method === "Page.javascriptDialogOpening") {
      send("Page.handleJavaScriptDialog", { accept: true }).catch(() => undefined);
    }
  });

  await send("Page.enable");
  await send("Runtime.enable");

  note("login page ready");
  await waitFor("document.body && document.body.innerText.includes('Login')");
  await setControlValue("input[placeholder='Username']", "admin");
  await setControlValue("input[placeholder='Password']", "admin123");
  await clickButtonByText("Login");

  note("waiting for dashboard shell");
  await waitFor("document.body && (document.body.innerText.includes('Workspace') || document.body.innerText.includes('Refresh Data') || document.body.innerText.includes('Dashboard'))", 20000);

  note("opening inquiries");
  await clickButtonByText("Inquiries");
  await waitFor("document.body && document.body.innerText.includes('Inquiries masuk')", 15000);
  await clickArticleButtonContaining("UI Smoke Inquiry", "Open");
  await waitFor("document.body && document.body.innerText.includes('Edit inquiry')", 15000);
  await setControlValue("select", "replied");
  await setControlValue("textarea[placeholder='Internal note']", "UI smoke note saved via Chrome headless automation.");
  await clickButtonByText("Save Inquiry");
  await waitFor("document.body && document.body.innerText.includes('Inquiry updated.')", 15000);

  note("editing project");
  await clickButtonByText("Projects");
  await waitFor("document.body && document.body.innerText.includes('Published Projects')", 15000);
  const originalProjectTitle = await evaluate(`(() => {
    const articles = Array.from(document.querySelectorAll('article'));
    const article = articles.find((node) => node.querySelector('h3'));
    return article?.querySelector('h3')?.textContent?.trim() || '';
  })()`);
  if (!originalProjectTitle) throw new Error("Could not capture first project title.");
  await clickArticleButtonContaining(originalProjectTitle, "Edit");
  await waitFor("document.body && document.body.innerText.includes('Edit Project')", 15000);
  await setControlValue("input[placeholder='Project title']", `${originalProjectTitle} UI Smoke`);
  await clickButtonByText("Update Project");
  await waitFor("document.body && document.body.innerText.includes('Project updated.')", 15000);
  await clickArticleButtonContaining(`${originalProjectTitle} UI Smoke`, "Edit");
  await waitFor("document.body && document.body.innerText.includes('Edit Project')", 15000);
  await setControlValue("input[placeholder='Project title']", originalProjectTitle);
  await clickButtonByText("Update Project");
  await waitFor("document.body && document.body.innerText.includes('Project updated.')", 15000);

  note("creating and deleting service");
  await clickButtonByText("Services");
  await waitFor("document.body && document.body.innerText.includes('Service List')", 15000);
  const tempServiceTitle = `UI Smoke Service ${Date.now()}`;
  await setControlValue("input[placeholder='Service title']", tempServiceTitle);
  await setControlValue("textarea[placeholder='Description']", "Temporary service created during interactive admin smoke test.");
  await setControlValue("input[placeholder='Sort order']", "999");
  await clickButtonByText("Create Service");
  await waitFor(`document.body && document.body.innerText.includes(${quoted(tempServiceTitle)})`, 15000);
  await clickArticleButtonContaining(tempServiceTitle, "Delete");
  await waitFor(`document.body && !document.body.innerText.includes(${quoted(tempServiceTitle)})`, 15000);

  const result = {
    login: true,
    dashboardOpened: true,
    inquiryEdited: true,
    projectUpdatedAndReverted: true,
    serviceCreatedAndDeleted: true,
  };
  writeFileSync(resultPath, JSON.stringify(result, null, 2));
  note("completed");
  console.log(JSON.stringify(result, null, 2));
}

main()
  .then(() => {
    try { ws?.close(); } catch {}
    try { browser.kill('SIGTERM'); } catch {}
    process.exit(0);
  })
  .catch((error) => {
    try { writeFileSync(resultPath, JSON.stringify({ error: String(error?.message || error) }, null, 2)); } catch {}
    console.error(error);
    try { ws?.close(); } catch {}
    try { browser.kill('SIGTERM'); } catch {}
    process.exit(1);
  });



