const fs=require('node:fs'),path=require('node:path'),{spawnSync}=require('node:child_process');
function check(dir){for(const name of fs.readdirSync(dir)){const file=path.join(dir,name);if(fs.statSync(file).isDirectory())check(file);else if(file.endsWith('.js')){const result=spawnSync(process.execPath,['--check',file],{stdio:'inherit'});if(result.status)process.exit(result.status);}}}
check('assets');console.log('PASS JavaScript syntax');
