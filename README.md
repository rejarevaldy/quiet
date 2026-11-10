# Quiet

A compact, black interface for **Voltius 0.66.0**, inspired by Tabby. Vertical tabs, persistent vault navigation, and flat controls. No build step or runtime dependencies.

Download this repository, then copy `manifest.json`, `index.js`, and `voltius.css` into
`~/.config/voltius/plugins/quiet-sidebar/`. Open Settings → Plugins → Installed and
choose **Scan for local plugins**, or restart Voltius.

The internal plugin ID remains `quiet-sidebar` so existing installations keep their settings. Its displayed name is **Quiet**.

Vault navigation stays available in terminals and its position stays fixed between
views. Version 1.4 uses one persistent rail with stable controls, rather than
swapping the native rail and a snapshot. It forwards actions to Voltius's own controls.
Reloading while a terminal or SFTP view is open populates the controls and restores
the selected view. Later plugin changes can be applied with Settings → Plugins → Installed
→ Quiet → Reload plugin, without restarting the application.

Change fonts in Settings → Appearance → Quiet Black → Edit (pencil). The native
theme editor has separate App Font and Terminal Font controls, font sizes, and
terminal line height. Save to apply. Quiet inherits the chosen font.

The design follows Tabby's compact tab layout: 38px flat session rows in a 200px
sidebar, with a thin active edge. Local and SSH sessions share the same tab style.
Terminal tool panels dock flush to the content; popovers, settings and file tools
use opaque, flat surfaces. The user-selected font and terminal palette stay intact.
Vaults, SFTP and sessions share the same selected treatment. The rail uses 32px
controls without copied hover pips or inline native styles. Menus and toolbar
controls stay flat; New session sits above the tabs so its popup fits on screen.

The plugin flattens the app chrome, changes UI colors to black and muted green,
and lays out the original session tabs vertically. It keeps React nodes, click
handlers, menus, rename fields, and session close actions in place. It does not
read credentials, change hosts, run terminal commands, or change the terminal palette.

`quiet-black.json` is the companion theme. It uses a pure-black terminal, muted ANSI
colors, 13px system UI text, and 14px JetBrains Mono terminal text. Import it through
the theme editor when installing this bundle on another machine. Select Quiet Black after importing it. Installing the plugin does not change your saved terminal palette.

To remove it, uninstall Quiet in Settings → Plugins, or close Voltius,
remove its `quiet-sidebar` plugin folder, then reopen Voltius. UI color overrides
apply while the plugin is active; your saved theme remains unchanged.

The layout depends on 0.66.0 shell markup. Recheck after upgrades. Native tab drag
ordering still assumes a horizontal strip; use session clicks and context menus
in this version. Vertical drag ordering needs an app source change.

## Development

Use Node.js 20.19+, 22.13+, or 24+. Run `npm ci` followed by `npm test`. The checks cover control identity, view switching, SVG references, cleanup, and reload from an existing terminal. Browser previews used real Voltius components with a mocked backend; real SSH/SFTP sessions and desktop WebKit behavior still need verification.

## License

MIT. See [NOTICE](NOTICE) for the Lucide icon license. Voltius is a separate project; this repository contains only the plugin.
