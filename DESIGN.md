Voltius desktop is a tool for opening hosts, managing files, and working in terminals.
This plugin follows the user's side-tab reference: pure black sidebars and near-black content, muted green selection,
compact rows, thin separators, and familiar controls. Operate mode.

Keep existing actions and session nodes. No gradients, glass, decorative shadows,
metric cards, greetings added by the plugin, or invented server data. Use the existing
theme's font family and Lucide icons. Keep terminal font and ANSI colors under user control.

Follow Tabby's compact terminal chrome: a 200px session sidebar, a 44px vault rail,
a 38px title bar, 38px session rows and 4px control corners. Session rows are flat,
with a thin active edge. Keep the user's black-and-muted-green palette and chosen font.
Dock terminal tools flush to the terminal, with no floating inset card or slide animation.
Give menus, settings and SFTP the same opaque surfaces and thin separators.
Reference: https://github.com/Eugeny/tabby/blob/master/tabby-core/src/components/tabHeader.component.scss
Flatten the dashboard vault cards into a list. Keep labels and native dialogs.
Below 680px return to horizontal tabs. Keep visible focus, readable muted text,
status colors, and reduced-motion support.

CSS selectors depend on the desktop shell shipped in 0.66.0. Native drag ordering
uses horizontal coordinates; vertical drag reordering needs a core app change.
