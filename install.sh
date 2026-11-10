#!/bin/sh
set -eu
umask 077

source_dir=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
target=${QUIET_PLUGIN_DIR:-${XDG_CONFIG_HOME:-$HOME/.config}/voltius/plugins/quiet-sidebar}

for file in manifest.json index.js voltius.css; do
  test -f "$source_dir/$file" || { printf 'Missing file: %s\n' "$file" >&2; exit 1; }
done

if test -d "$target"; then
  config_dir=$(dirname -- "$(dirname -- "$target")")
  backup="$config_dir/appearance-backups/quiet-$(date -u +%Y%m%dT%H%M%SZ)-$$"
  mkdir -p -- "$backup"
  for file in manifest.json index.js voltius.css; do
    if test -f "$target/$file"; then cp -p -- "$target/$file" "$backup/$file"; fi
  done
  printf 'Backup: %s\n' "$backup"
fi

mkdir -p -- "$target"
for file in index.js voltius.css manifest.json; do
  cp -- "$source_dir/$file" "$target/.$file.tmp.$$"
  mv -f -- "$target/.$file.tmp.$$" "$target/$file"
done

printf 'Installed Quiet: %s\n' "$target"
printf 'First install: Settings > Plugins > Installed > Scan for local plugins.\n'
printf 'Update: use Reload plugin on the Quiet row. No application restart needed.\n'
