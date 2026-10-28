const BIA = self.BIA;
const $ = (id) => document.getElementById(id);

const lines = (v) => v.split("\n").map((s) => s.trim()).filter(Boolean);

function render(s) {
  $("enabled").checked = s.enabled;
  document.querySelector(`input[name=mode][value=${s.mode}]`).checked = true;
  $("detectLabels").checked = s.detectLabels;
  $("detectHashtags").checked = s.detectHashtags;
  $("keywords").value = s.keywords.join("\n");
  $("accounts").value = s.accounts.join("\n");
  const box = $("platforms");
  box.textContent = "";
  for (const [id, p] of Object.entries(BIA.PLATFORMS)) {
    const label = document.createElement("label");
    const cb = document.createElement("input");
    cb.type = "checkbox";
    cb.dataset.platform = id;
    cb.checked = s.platforms[id] !== false;
    label.append(cb, " " + p.name);
    box.append(label);
  }
}

function read() {
  const platforms = {};
  document.querySelectorAll("[data-platform]").forEach((cb) => {
    platforms[cb.dataset.platform] = cb.checked;
  });
  return {
    enabled: $("enabled").checked,
    mode: document.querySelector("input[name=mode]:checked").value,
    detectLabels: $("detectLabels").checked,
    detectHashtags: $("detectHashtags").checked,
    platforms,
    keywords: lines($("keywords").value),
    accounts: lines($("accounts").value)
  };
}

let timer;
function save() {
  clearTimeout(timer);
  timer = setTimeout(() => {
    chrome.storage.sync.set(read(), refreshStatus);
  }, 300);
}

function refreshStatus() {
  chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
    if (!tab) return;
    chrome.tabs.sendMessage(tab.id, { type: "bia-count" }, (res) => {
      if (chrome.runtime.lastError || !res) {
        $("status").textContent = "Esta página no es una plataforma compatible.";
        return;
      }
      $("status").textContent = res.active
        ? `${res.platform}: ${res.count} elemento(s) bloqueado(s) en esta página.`
        : `${res.platform}: bloqueo desactivado.`;
    });
  });
}

chrome.storage.sync.get(BIA.DEFAULT_SETTINGS, (s) => {
  render({ ...BIA.DEFAULT_SETTINGS, ...s, platforms: { ...BIA.DEFAULT_SETTINGS.platforms, ...s.platforms } });
  document.body.addEventListener("change", save);
  document.body.addEventListener("input", (e) => {
    if (e.target.tagName === "TEXTAREA") save();
  });
  refreshStatus();
});

$("donate").href = BIA.DONATE_URL;
