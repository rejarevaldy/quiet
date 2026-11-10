// Native controls keep their React handlers; one persistent rail owns the visible UI.
export default function register(api) {
  if (!api.isActive()) return;
  const root = document.documentElement;
  root.classList.add("quiet-sidebar");
  const attributes = ["data-quiet-title", "data-quiet-navigation", "data-quiet-group", "data-quiet-tabs", "data-quiet-home", "data-quiet-native-rail", "data-quiet-selected"];
  let lastActive;
  let pendingAction;
  let disposed = false;
  let iconSequence = 0;
  let restoringView;
  let initialized = false;
  const controls = new Map();
  const rail = document.createElement("aside");
  rail.setAttribute("data-quiet-rail", "");
  rail.setAttribute("aria-label", "Vault navigation");
  const top = document.createElement("div");
  const vaults = document.createElement("div");
  const tools = document.createElement("div");
  top.className = "quiet-rail-home";
  vaults.className = "quiet-rail-vaults";
  tools.className = "quiet-rail-tools";
  rail.append(top, vaults, tools);
  const fallback = document.createElement("button");
  fallback.textContent = "V";
  fallback.title = "Vaults";
  fallback.onclick = () => document.querySelector("[data-quiet-navigation] > button")?.click();
  top.append(fallback);
  document.body.append(rail);

  function nativeRail() {
    return document.querySelector("[data-shell-body] > aside");
  }
  function forwardAction() {
    const native = nativeRail();
    if (!pendingAction || !native) return;
    const action = pendingAction;
    pendingAction = undefined;
    const buttons = [...native.querySelectorAll("button")];
    const target = buttons.find((button) => action.testId
      ? button.getAttribute("data-testid") === action.testId
      : action.title && button.title === action.title) ?? (!action.testId && !action.title ? buttons[action.index] : undefined);
    if (!target) return;
    if (action.context) target.dispatchEvent(new MouseEvent("contextmenu", { bubbles: true, cancelable: true, clientX: action.x, clientY: action.y, button: 2 }));
    else target.click();
  }
  function onRailAction(event) {
    const button = event.target.closest("button[data-quiet-proxy]");
    if (!button || !rail.contains(button)) return;
    event.preventDefault();
    pendingAction = { index: Number(button.dataset.quietProxy), testId: button.dataset.quietTestid, title: button.title, context: event.type === "contextmenu", x: event.clientX, y: event.clientY };
    // Voltius unmounts its rail in terminals; mount it before invoking its action.
    if (nativeRail()) forwardAction();
    else document.querySelector("[data-quiet-navigation] > button")?.click();
  }
  rail.addEventListener("click", onRailAction);
  rail.addEventListener("contextmenu", onRailAction);

  function copyIcon(source, index) {
    const svg = source.cloneNode(true);
    const ids = new Map();
    svg.querySelectorAll("[id]").forEach((element) => {
      const old = element.id;
      const id = `quiet-sidebar-svg-${index}-${old}`;
      ids.set(old, id);
      element.id = id;
    });
    for (const element of [svg, ...svg.querySelectorAll("*")]) {
      for (const attribute of [...element.attributes]) {
        let value = attribute.value.replace(/url\(\s*(['"]?)#([^\s)'";]+)\1\s*\)/g,
          (match, quote, id) => ids.has(id) ? `url(#${ids.get(id)})` : match);
        if (value.startsWith("#") && ids.has(value.slice(1))) value = `#${ids.get(value.slice(1))}`;
        if (attribute.name === "aria-labelledby" || attribute.name === "aria-describedby") {
          value = value.split(/\s+/).map((id) => ids.get(id) ?? id).join(" ");
        }
        if (value !== attribute.value) element.setAttribute(attribute.name, value);
      }
    }
    return svg;
  }
  function syncRail(native) {
    native.setAttribute("data-quiet-native-rail", "");
    native.setAttribute("aria-hidden", "true");
    const live = new Set();
    const ordered = new Map([[top, []], [vaults, []], [tools, []]]);
    const buttons = [...native.querySelectorAll("button")];
    const utilities = buttons.filter((button, index) => index > 0 && !button.closest('[data-testid="vault-sidebar-scroll-area"]'));
    const icons = [
      '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="9" r="3"/><path d="M5.5 19a7 7 0 0 1 13 0"/>',
      '<path d="m3 11 18-5v12L3 13zM7 14l2 7h3l-2-6"/>',
      '<path d="M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915"/><circle cx="12" cy="12" r="3"/>',
    ];
    buttons.forEach((source, index) => {
      const testId = source.getAttribute("data-testid");
      const key = testId || source.title || `button-${index}`;
      live.add(key);
      let entry = controls.get(key);
      if (!entry) {
        entry = { button: document.createElement("button"), icon: null, svgId: iconSequence++ };
        entry.button.type = "button";
        controls.set(key, entry);
      }
      const button = entry.button;
      button.title = source.title || source.textContent.trim();
      button.setAttribute("aria-label", button.title);
      button.dataset.quietProxy = String(index);
      if (testId) button.dataset.quietTestid = testId;
      else delete button.dataset.quietTestid;
      button.disabled = source.disabled;
      const active = source.style.background.includes("linear-gradient") || (index === 0 && source.parentElement?.querySelector('span[style*="height: 40px"]'));
      if (active) button.setAttribute("aria-current", "true");
      else button.removeAttribute("aria-current");
      const group = index === 0 ? top : source.closest('[data-testid="vault-sidebar-scroll-area"]') ? vaults : tools;
      let svg = source.querySelector("svg");
      // Utility icons must not disappear while Iconify's first render is still pending.
      const geometry = group === tools ? icons[utilities.indexOf(source)] : group === vaults && !source.textContent.trim() ? '<path d="M12 5v14M5 12h14"/>' : null;
      if (geometry) {
        svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        for (const [name, value] of Object.entries({ viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", "stroke-width": "1.8", "stroke-linecap": "round", "stroke-linejoin": "round", "aria-hidden": "true" })) svg.setAttribute(name, value);
        svg.innerHTML = geometry;
      }
      const icon = svg?.outerHTML ?? source.textContent.trim();
      if (entry.icon !== icon) {
        entry.icon = icon;
        if (svg) button.replaceChildren(copyIcon(svg, entry.svgId));
        else button.textContent = icon;
      }
      ordered.get(group).push(button);
    });
    fallback.remove();
    for (const [key, entry] of controls) {
      if (!live.has(key)) { entry.button.remove(); controls.delete(key); }
    }
    for (const [group, buttons] of ordered) {
      buttons.forEach((button, index) => {
        if (group.children[index] !== button) group.insertBefore(button, group.children[index] ?? null);
      });
    }
    if (restoringView) {
      const target = restoringView;
      restoringView = undefined;
      queueMicrotask(() => { if (!disposed && target.isConnected) target.click(); });
    }
  }
  function mark(element, name) {
    if (element && !element.hasAttribute(name)) element.setAttribute(name, "");
  }
  function annotate() {
    const shell = document.querySelector(".chrome-frame:has([data-shell-body])");
    if (!shell) return;
    const title = shell.firstElementChild;
    // shortcut: shell structure is pinned to 0.66.0; recheck after app upgrades.
    if (!title?.classList.contains("select-none")) return;
    mark(title, "data-quiet-title");
    const navigation = title.firstElementChild;
    mark(navigation, "data-quiet-navigation");
    for (const button of navigation?.querySelectorAll(":scope > button") ?? []) {
      button.setAttribute("data-quiet-selected", String(button.style.background === "var(--t-vault-tab-active-bg)"));
    }
    const group = navigation?.querySelector("div.flex-1");
    mark(group, "data-quiet-group");
    mark(group?.firstElementChild, "data-quiet-tabs");
    mark(shell.querySelector(".chrome-canvas > .max-w-4xl"), "data-quiet-home");
    const native = nativeRail();
    if (native) syncRail(native);
    else if (!initialized && !controls.size && !pendingAction) {
      // Populate the rail on reload while keeping the existing terminal/SFTP selected.
      const sftp = navigation?.querySelector(":scope > button:nth-child(2)");
      const active = group?.querySelector('[data-strip-active="true"]');
      const target = sftp?.getAttribute("data-quiet-selected") === "true" ? sftp : active;
      if (target) {
        initialized = true;
        restoringView = target;
        navigation?.querySelector(":scope > button")?.click();
        const mounted = nativeRail();
        if (mounted) syncRail(mounted);
      }
    }
    const active = group?.querySelector('[data-strip-active="true"]');
    if (active || navigation?.querySelector(':scope > button:nth-child(2)[data-quiet-selected="true"]')) {
      top.querySelector("button")?.removeAttribute("aria-current");
    }
    if (active && active !== lastActive && matchMedia("(min-width: 681px)").matches) active.scrollIntoView({ block: "nearest", inline: "nearest" });
    lastActive = active;
  }
  const observer = new MutationObserver((records) => {
    if (disposed || records.every((record) => rail.contains(record.target))) return;
    forwardAction();
    annotate();
  });
  annotate();
  observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ["data-strip-active"] });
  return () => {
    disposed = true;
    observer.disconnect();
    root.classList.remove("quiet-sidebar");
    rail.remove();
    for (const native of document.querySelectorAll("[data-quiet-native-rail]")) native.removeAttribute("aria-hidden");
    for (const name of attributes) for (const element of document.querySelectorAll(`[${name}]`)) element.removeAttribute(name);
  };
}
