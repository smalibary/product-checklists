// Refuses actions that have hurt before (bimvit lessons L-44 and L-48):
// - anything that would print a secrets file (.env, .env.local ...; .env.example is fine, it holds no secret);
// - stopping programs by name (taskkill /IM, Stop-Process -Name, pkill, killall), which closes Salem's own windows too.
// Exit code 2 refuses the action and tells Claude why.
let raw = '';
process.stdin.on('data', d => raw += d).on('end', () => {
  const { tool_name: tool, tool_input: input = {} } = JSON.parse(raw || '{}');
  const secret = /(^|[\\/\s"'=])\.env(\.(?!example\b)[\w.-]+)?(?=$|[\s"'|;&)>])/i;
  const refuse = why => { process.stderr.write('Refused: ' + why + '\n'); process.exit(2); };

  if (tool === 'Read' && secret.test(input.file_path || '')) refuse('secrets files are never read. Ask Salem which setting you need, by name only.');
  if (tool === 'Grep' && input.output_mode !== 'count' && (secret.test(input.path || '') || /env/i.test(input.glob || '')))
    refuse('searching inside secrets files can print a key. Search with output_mode "count", or ask Salem.');
  if (tool === 'Bash' || tool === 'PowerShell') {
    const cmd = input.command || '';
    if (secret.test(cmd) && /\b(cat|type|gc|get-content|head|tail|less|more|grep|rg|sls|select-string|findstr|sed|awk|node|python|echo)\b/i.test(cmd))
      refuse('this command could print a secrets file.');
    if (/taskkill[^|;&]*\/\/?im\b/i.test(cmd) || /\b(pkill|killall)\b/.test(cmd) ||
        /\b(stop-process|spps)\b[^|;&]*-n(a(m(e)?)?)?\b/i.test(cmd) || /get-process[^|;&]*\|\s*(where[^|]*\|\s*)?(stop-process|spps|kill)\b(?![^|;&]*-id)/i.test(cmd))
      refuse('stopping programs by name also closes Salem\'s own windows. Stop the exact process by its id instead.');
    // p44 (sweep 2026-10-06): saving "everything" swept a helper's half-done work into a commit
    if (/\bgit(?:\s+-C\s+\S+)?\s+add\b[^|;&]*\s(?:-A|--all|\.)(?=$|[\s|;&])/.test(cmd) ||
        /\bgit(?:\s+-C\s+\S+)?\s+commit\b[^|;&"']*\s(?:-[a-zA-Z]*a[a-zA-Z]*|--all)(?=$|[\s|;&])/.test(cmd))
      refuse('saving everything at once is blocked (p44). Name the files: git add <file> <file>, then git commit -m.');
  }
  process.exit(0);
});
