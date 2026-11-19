#!/usr/bin/env bash
# Waits until every helper given (Termi session ids) has reported or ended, then exits.
# Run it in the background right after opening helpers: its exit wakes the main session (R-40),
# so a finished helper is merged at once instead of waiting for Salem to ask.
#   bash .claude/scripts/watch-helpers.sh tab-57 tab-58
for id in "$@"; do
  until out=$(termi agent wait --session "$id" --timeout-seconds 300 --json 2>&1); echo "$out" | grep -q '"settled":true'; do :; done
  echo "$id finished: $(echo "$out" | grep -o '"summary":"[^"]*' | cut -c12- | head -c 600)"
done
