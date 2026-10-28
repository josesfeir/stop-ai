(() => {
  const BIA = self.BIA;
  const host = location.hostname.replace(/^www\.|^m\./, "");
  const platformId = Object.keys(BIA.PLATFORMS).find((id) =>
    BIA.PLATFORMS[id].hosts.some((h) => host === h || host.endsWith("." + h))
  );
  if (!platformId) return;
  const platform = BIA.PLATFORMS[platformId];
  const itemSelector = platform.items.map((i) => i.sel).join(",");

  let settings = BIA.DEFAULT_SETTINGS;
  let matcher = null;
  let lastText = new WeakMap();

  const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const B = "[^\\p{L}\\p{N}_]";

  function buildMatcher() {
    const parts = [];
    if (settings.detectLabels) {
      parts.push(`(?:^|${B})(?:${BIA.LABEL_PATTERNS.map(escapeRe).join("|")})(?=$|${B})`);
    }
    if (settings.detectHashtags) {
      parts.push(`(?:^|${B})#(?:${BIA.DEFAULT_HASHTAGS.map(escapeRe).join("|")})(?=$|${B})`);
    }
    const kw = settings.keywords.map((k) => k.trim()).filter(Boolean);
    if (kw.length) {
      parts.push(`(?:^|${B})(?:${kw.map(escapeRe).join("|")})(?=$|${B})`);
    }
    const text = parts.length ? new RegExp(parts.join("|"), "iu") : null;
    const accounts = settings.accounts
      .map((a) => a.trim().replace(/^@/, "").toLowerCase())
      .filter(Boolean);
    return { text, accounts };
  }

  function itemDef(el) {
    return platform.items.find((i) => el.matches(i.sel));
  }

  function collectText(el, def) {
    const src = def && def.textFrom ? document.querySelectorAll(def.textFrom) : [el];
    let out = "";
    for (const node of src) {
      let t = node.textContent || "";
      node.querySelectorAll(".bia-overlay").forEach((o) => {
        t = t.replace(o.textContent, "");
      });
      out += " " + t;
      node.querySelectorAll("[aria-label], img[alt], [title]").forEach((n) => {
        out += " " + (n.getAttribute("aria-label") || "") + " " + (n.getAttribute("alt") || "") + " " + (n.getAttribute("title") || "");
      });
      if (out.length > 8000) break;
    }
    return out.replace(/\s+/g, " ").slice(0, 8000);
  }

  function matchesAccount(el) {
    if (!matcher.accounts.length) return false;
    for (const a of el.querySelectorAll("a[href]")) {
      let path;
      try {
        path = new URL(a.href, location.href).pathname.toLowerCase();
      } catch {
        continue;
      }
      const first = decodeURIComponent(path.split("/")[1] || "").replace(/^@/, "");
      if (matcher.accounts.includes(first)) return true;
      if (path.startsWith("/channel/") && matcher.accounts.includes(path.split("/")[2])) return true;
    }
    return false;
  }

  function block(el, def, reason) {
    if (el.dataset.biaAllowed) return;
    if (el.classList.contains("bia-blocked")) return;
    el.classList.add("bia-blocked");
    const useHide = settings.mode === "hide" && !(def && def.overlayOnly);
    if (useHide) {
      el.classList.add("bia-hidden");
    } else {
      if (getComputedStyle(el).position === "static") el.classList.add("bia-relative");
      const ov = document.createElement("div");
      ov.className = "bia-overlay";
      ov.innerHTML = `<div class="bia-box"><strong>Contenido de IA bloqueado</strong><span></span><button type="button">Mostrar</button></div>`;
      ov.querySelector("span").textContent = reason;
      ov.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.target.tagName === "BUTTON") {
          el.dataset.biaAllowed = "1";
          el.dataset.biaAllowedKey = lastText.get(el) || "";
          unblock(el);
        }
      }, true);
      el.appendChild(ov);
    }
    el.querySelectorAll("video, audio").forEach((m) => {
      try { m.pause(); } catch {}
    });
  }

  function unblock(el) {
    if (!el.classList.contains("bia-blocked")) return;
    el.classList.remove("bia-blocked", "bia-hidden", "bia-relative");
    el.querySelectorAll(":scope > .bia-overlay").forEach((o) => o.remove());
  }

  function evaluate(el) {
    if (el.closest(".bia-blocked") && !el.classList.contains("bia-blocked")) return;
    const def = itemDef(el);
    const text = collectText(el, def);
    const key = text + "|" + el.querySelectorAll("a[href]").length;
    if (lastText.get(el) === key) return;
    lastText.set(el, key);
    // Elemento reciclado por la plataforma con contenido nuevo.
    if (el.dataset.biaAllowed && el.dataset.biaAllowedKey !== key) {
      delete el.dataset.biaAllowed;
      delete el.dataset.biaAllowedKey;
    }
    let reason = null;
    const m = matcher.text && text.match(matcher.text);
    if (m) reason = `Coincidencia: “${m[0].trim()}”`;
    else if (matchesAccount(el)) reason = "Cuenta en tu lista negra";
    if (reason) block(el, def, reason);
    else unblock(el);
  }

  function active() {
    return settings.enabled && settings.platforms[platformId] !== false;
  }

  function scan() {
    if (!active()) return;
    document.querySelectorAll(itemSelector).forEach(evaluate);
  }

  function resetAll() {
    lastText = new WeakMap();
    document.querySelectorAll(".bia-blocked").forEach(unblock);
    document.querySelectorAll("[data-bia-allowed]").forEach((el) => {
      delete el.dataset.biaAllowed;
      delete el.dataset.biaAllowedKey;
    });
  }

  let scheduled = false;
  function schedule() {
    if (scheduled) return;
    scheduled = true;
    setTimeout(() => {
      scheduled = false;
      scan();
    }, 250);
  }

  // Impide que un video bloqueado se reproduzca (autoplay de feeds).
  document.addEventListener("play", (e) => {
    const t = e.target;
    if (active() && t instanceof HTMLMediaElement && t.closest(".bia-blocked")) t.pause();
  }, true);

  new MutationObserver(schedule).observe(document.documentElement, {
    childList: true,
    subtree: true,
    characterData: true
  });

  function load(cb) {
    chrome.storage.sync.get(BIA.DEFAULT_SETTINGS, (s) => {
      settings = { ...BIA.DEFAULT_SETTINGS, ...s, platforms: { ...BIA.DEFAULT_SETTINGS.platforms, ...s.platforms } };
      matcher = buildMatcher();
      cb && cb();
    });
  }

  chrome.storage.onChanged.addListener((_, area) => {
    if (area !== "sync") return;
    load(() => {
      resetAll();
      scan();
    });
  });

  chrome.runtime.onMessage.addListener((msg, _, reply) => {
    if (msg && msg.type === "bia-count") {
      reply({ platform: platform.name, count: document.querySelectorAll(".bia-blocked").length, active: active() });
    }
  });

  load(scan);
})();
