# Quiet

A black, compact interface for [Voltius](https://github.com/VoltiusApp/voltius), inspired by Tabby.

- Vertical session tabs with a thin active indicator.
- Centered New session picker with a scrollable list that fits the window.
- Flat host, keychain, snippet, and folder rows with thin selection borders.
- Consistent editor sections and form controls.
- Vault navigation stays visible when switching to a terminal.
- Flat toolbars, menus, and docked tool panels.
- Uses your chosen application and terminal fonts.

Built for **Voltius 0.66.0 on Linux**. No build step or runtime dependencies.

## Install

```sh
git clone https://github.com/rejarevaldy/quiet.git
cd quiet
sh install.sh
```

In Voltius, open **Settings → Plugins → Installed → Scan for local plugins**.
Quiet should appear in the installed list. If its switch is off, turn it on.

The installer copies three files to `${XDG_CONFIG_HOME:-~/.config}/voltius/plugins/quiet-sidebar/`.
The internal ID stays `quiet-sidebar` for compatibility with earlier installations.
It backs up existing plugin files before replacing them and leaves your saved hosts,
credentials, themes, and terminal palette alone.

For a different location:

```sh
QUIET_PLUGIN_DIR=/path/to/voltius/plugins/quiet-sidebar sh install.sh
```

## Update without restarting

```sh
git pull --ff-only
sh install.sh
```

In **Settings → Plugins → Installed**, click the circular-arrow **Reload plugin** button
on the Quiet row. If the button is missing, click **Scan for local plugins** first.
The scan registers manually installed plugins so Voltius can show their reload controls.

## Optional: Quiet Black terminal theme

Quiet changes the application interface. The terminal palette remains your choice.

To use the matching palette, first export your existing themes from
**Settings → Appearance → Export All**. Then choose **Import**, open
[`quiet-black.voltius-user-data.json`](quiet-black.voltius-user-data.json), and apply the Themes section.
This selects Quiet Black and **replaces the custom theme list** with that theme;
keep your export if you want to restore other custom themes.

[`quiet-black.json`](quiet-black.json) is the raw theme definition for editing;
it is not the file to select in Voltius's Import dialog.

To change fonts, use **Settings → Appearance → Quiet Black → Edit**.
The editor has separate controls for the application font, terminal font, size,
and terminal line height.

## Remove

Use **Settings → Plugins → Installed → Quiet → Uninstall plugin**.
If you also imported Quiet Black, select another theme under Appearance.
Plugin backups are stored under `voltius/appearance-backups/` in the configuration directory.

## Compatibility and limits

Quiet depends on Voltius 0.66.0's desktop markup. Other versions and operating systems
have not been verified. Check the layout after upgrading Voltius.

Vertical drag reordering still needs a change in Voltius itself. Clicks, rename,
close, and context menus use the application's existing actions.

The automated checks cover plugin lifecycle, stable controls, SVG references,
view restoration, and installer backups. Browser layout checks used real Voltius
components with a mocked backend. They do not establish live SSH/SFTP behavior.

## Development

Use Node.js 20.19+, 22.13+, or 24+:

```sh
npm ci
npm test
```

## License

[MIT](LICENSE). Utility icon geometry is from Lucide; see [NOTICE](NOTICE).
Voltius is a separate project and is not included in this repository.
