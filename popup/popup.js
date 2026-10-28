const BIA = self.BIA;
const $ = (id) => document.getElementById(id);

const lines = (v) => v.split("\n").map((s) => s.trim()).filter(Boolean);

let lang = "auto";

function translate() {
  document.documentElement.lang = BIA.resolveLang(lang);
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    el.textContent = BIA.t(lang, el.dataset.i18n);
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
    el.placeholder = BIA.t(lang, el.dataset.i18nPlaceholder);
  });
  document.querySelectorAll("[data-i18n-title]").forEach((el) => {
    el.title = BIA.t(lang, el.dataset.i18nTitle);
  });
}

function render(s) {
  lang = s.lang;
  $("lang").value = s.lang;
  translate();
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
    lang: $("lang").value,
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
        $("status").textContent = BIA.t(lang, "unsupported");
        return;
      }
      $("status").textContent = res.active
        ? BIA.t(lang, "statusCount", { platform: res.platform, count: res.count })
        : BIA.t(lang, "statusOff", { platform: res.platform });
    });
  });
}

chrome.storage.sync.get(BIA.DEFAULT_SETTINGS, (s) => {
  render({ ...BIA.DEFAULT_SETTINGS, ...s, platforms: { ...BIA.DEFAULT_SETTINGS.platforms, ...s.platforms } });
  document.body.addEventListener("change", (e) => {
    if (e.target.id === "lang") {
      lang = e.target.value;
      translate();
    }
    save();
  });
  document.body.addEventListener("input", (e) => {
    if (e.target.tagName === "TEXTAREA") save();
  });
  refreshStatus();
});

$("donate").href = BIA.DONATE_URL;
