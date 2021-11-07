#!/usr/bin/env node
var $3PBb8$os = require("os");
var $3PBb8$tauris = require("tauris");
var $3PBb8$jsbitsgetpackageversion = require("@jsbits/get-package-version");
var $3PBb8$fs = require("fs");
var $3PBb8$path = require("path");
var $3PBb8$chalk = require("chalk");
var $3PBb8$enquirer = require("enquirer");
var $3PBb8$crypto = require("crypto");

function $parcel$interopDefault(a) {
  return a && a.__esModule ? a.default : a;
}














function $fa4a0f1a9948ca07$export$d01b444bafb1a792(password) {
    const key = $3PBb8$crypto.scryptSync(password, 'salt', 24);
    return key;
}
function $fa4a0f1a9948ca07$export$5b0f6292f11d1d18(data, key) {
    const iv = $3PBb8$crypto.randomFillSync(new Uint8Array(16));
    const cipher = $3PBb8$crypto.createCipheriv('aes-192-cbc', key, iv);
    const _c = cipher.update(JSON.stringify(data), 'utf8', 'hex');
    const encrypted = _c + cipher.final('hex');
    const ivBuffer = Buffer.from(iv.buffer);
    return encrypted + ' ' + ivBuffer.toString('hex');
}
function $fa4a0f1a9948ca07$export$e85a0c9a1067c5d3(data, key) {
    const content = data.split(' ')[0];
    const ivString = data.split(' ')[1];
    const ivBuffer = Buffer.from(ivString, 'hex');
    const iv = $fa4a0f1a9948ca07$var$uint8arrayFromBuffer(ivBuffer);
    const cipher = $3PBb8$crypto.createDecipheriv('aes-192-cbc', key, iv);
    const _c = cipher.update(content, 'hex', 'utf8');
    const decrypted = _c + cipher.final('utf8');
    return decrypted;
}
function $fa4a0f1a9948ca07$var$uint8arrayFromBuffer(buffer) {
    const a = new Uint8Array(buffer.length);
    for(let i = 0; i < buffer.length; i++)a[i] = buffer[i];
    return a;
}


function $d2b65bc95cfc6f60$export$5af9a6f9a4e6c38f(file) {
    if (!$parcel$interopDefault($3PBb8$fs).existsSync($parcel$interopDefault($3PBb8$path).resolve(file))) {
        console.log($parcel$interopDefault($3PBb8$chalk)`{red.bold Error:} No passfile exists. Please run {cyan pass init} first.`);
        process.exit(1);
    }
}
function $d2b65bc95cfc6f60$export$60baa3fe16af0010(password, file) {
    $d2b65bc95cfc6f60$export$5af9a6f9a4e6c38f(file);
    const key = $fa4a0f1a9948ca07$export$d01b444bafb1a792(password);
    const testLine = $parcel$interopDefault($3PBb8$fs).readFileSync($parcel$interopDefault($3PBb8$path).resolve(file)).toString().split('\n')[0];
    try {
        const output = $fa4a0f1a9948ca07$export$e85a0c9a1067c5d3(testLine, key);
        if (output !== '"valid key"') throw new Error();
    } catch (e) {
        console.log($parcel$interopDefault($3PBb8$chalk)`{red.bold Error:} Invalid password. Please try again`);
        process.exit(1);
    }
}
function $d2b65bc95cfc6f60$export$e87e8c0464eec82b() {
    const data = $3PBb8$crypto.randomFillSync(Buffer.alloc(8));
    return data.toString('hex');
}
function $d2b65bc95cfc6f60$export$557aad609b00e57(passwords, service, keyword, key) {
    const dec_passwords = passwords.map((p)=>JSON.parse($fa4a0f1a9948ca07$export$e85a0c9a1067c5d3(p, key))
    );
    return dec_passwords.find((p)=>p.startsWith(`${service} ${keyword}`)
    ) || null;
}
function $d2b65bc95cfc6f60$export$fcbe5dc665614b5f(passwords, service, key) {
    const dec_passwords = passwords.map((p)=>JSON.parse($fa4a0f1a9948ca07$export$e85a0c9a1067c5d3(p, key))
    );
    const r = dec_passwords.filter((p)=>p.startsWith(service)
    ).map((p)=>p.split(' ')[1]
    );
    return r.length === 0 ? null : r;
}
function $d2b65bc95cfc6f60$var$_write(passfile, r) {
    $parcel$interopDefault($3PBb8$fs).writeFileSync($parcel$interopDefault($3PBb8$path).resolve(passfile), r.join('\n'));
}
function $d2b65bc95cfc6f60$export$bf41c13c2df4475c(passwords, service, keyword, key, passfile) {
    const dec_passwords = passwords.map((p)=>JSON.parse($fa4a0f1a9948ca07$export$e85a0c9a1067c5d3(p, key))
    );
    const r = dec_passwords.reduce((acc, v)=>v.startsWith(`${service} ${keyword}`) ? acc : acc.concat(v)
    , []);
    const e = r.map((p)=>$fa4a0f1a9948ca07$export$5b0f6292f11d1d18(p, key)
    );
    $d2b65bc95cfc6f60$var$_write(passfile, e);
}
function $d2b65bc95cfc6f60$export$bfe833e59aa823e8(passwords, service, keyword, password, key, passfile) {
    $d2b65bc95cfc6f60$var$_write(passfile, passwords.concat($fa4a0f1a9948ca07$export$5b0f6292f11d1d18(`${service} ${keyword} ${password}`, key)));
}



function $9515060d57d3951c$export$2e2bcd8739ae039(options) {
    options = {
        PASSFILE_PATH: `${$parcel$interopDefault($3PBb8$os).homedir()}/.passfile`,
        ...options
    };
    return new $3PBb8$tauris.Command('generate').describe('Generate a new password for a service & keyword and save it in your passfile').handler((argv)=>{
        (async ()=>{
            var ref;
            if (!((ref = argv.parameters) === null || ref === void 0 ? void 0 : ref[0])) {
                console.log($parcel$interopDefault($3PBb8$chalk)`{red.bold Error:} You must provide a service (and optionally a keyword) to generate a password`);
                process.exit(1);
            }
            const service = argv.parameters[0];
            const keyword = argv.parameters[1] || '*';
            if (service.includes(' ') || keyword.includes(' ')) console.log($parcel$interopDefault($3PBb8$chalk)`{red.bold Error:} Keywords and services may not contain spaces`);
            $d2b65bc95cfc6f60$export$5af9a6f9a4e6c38f(options.PASSFILE_PATH);
            const { password: password  } = await $3PBb8$enquirer.prompt({
                type: 'password',
                name: 'password',
                message: 'Master password:'
            });
            $d2b65bc95cfc6f60$export$60baa3fe16af0010(password, options.PASSFILE_PATH);
            const passFile = $parcel$interopDefault($3PBb8$fs).readFileSync($parcel$interopDefault($3PBb8$path).resolve(options.PASSFILE_PATH)).toString();
            const passwords = passFile.split('\n');
            if ($d2b65bc95cfc6f60$export$557aad609b00e57(passwords.slice(1), service, keyword, $fa4a0f1a9948ca07$export$d01b444bafb1a792(password))) {
                console.log($parcel$interopDefault($3PBb8$chalk)`{red.bold Error:} There's already a password with this service and keyword. Try a different keyword.`);
                process.exit(1);
            }
            const generated = $d2b65bc95cfc6f60$export$e87e8c0464eec82b();
            $d2b65bc95cfc6f60$export$bfe833e59aa823e8(passwords, service, keyword, generated, $fa4a0f1a9948ca07$export$d01b444bafb1a792(password), options.PASSFILE_PATH);
            console.log($parcel$interopDefault($3PBb8$chalk)`Generated password: {cyan ${generated}}`);
        })().then((_v)=>{
        }).catch((err)=>{
            console.log($parcel$interopDefault($3PBb8$chalk)`{red.bold Error:} ${err.message} {gray (unhandled exception)}`);
        });
    });
}









function $e6a36c4d365743b7$export$2e2bcd8739ae039(options) {
    options = {
        PASSFILE_PATH: `${$parcel$interopDefault($3PBb8$os).homedir()}/.passfile`,
        ...options
    };
    return new $3PBb8$tauris.Command('init').describe('Initiliase the passfile').handler((argv)=>{
        (async ()=>{
            if ($parcel$interopDefault($3PBb8$fs).existsSync($parcel$interopDefault($3PBb8$path).resolve(options.PASSFILE_PATH))) {
                console.log($parcel$interopDefault($3PBb8$chalk)`{red.bold Error:} There already is an initialised passfile`);
                process.exit(1);
            }
            const { password: password  } = await $3PBb8$enquirer.prompt({
                type: 'password',
                name: 'password',
                message: 'Choose a master password:'
            });
            $parcel$interopDefault($3PBb8$fs).writeFileSync($parcel$interopDefault($3PBb8$path).resolve(options.PASSFILE_PATH), $fa4a0f1a9948ca07$export$5b0f6292f11d1d18('valid key', $fa4a0f1a9948ca07$export$d01b444bafb1a792(password)));
        })().then((_v)=>{
        }).catch((err)=>{
            console.log($parcel$interopDefault($3PBb8$chalk)`{red.bold Error:} ${err.message} {gray (unhandled exception)}`);
        });
    });
}













async function $eb81d726244796cb$export$ba52aae3a6723688(passwords, service, keyword, key) {
    if (keyword) {
        const pass = $d2b65bc95cfc6f60$export$557aad609b00e57(passwords.slice(1), service, keyword, key);
        if (!pass) {
            console.log($parcel$interopDefault($3PBb8$chalk)`{red.bold Error:} Password not found`);
            process.exit(1);
        }
        return {
            service: service,
            keyword: keyword
        };
    } else {
        const passwordsForService = $d2b65bc95cfc6f60$export$fcbe5dc665614b5f(passwords.slice(1), service, key);
        if (!passwordsForService) {
            console.log($parcel$interopDefault($3PBb8$chalk)`{red.bold Error:} Service not found`);
            process.exit(1);
        }
        if (passwordsForService.length === 1 && passwordsForService[0] === '*') return {
            service: service,
            keyword: '*'
        };
        const { choice: choice  } = await $3PBb8$enquirer.prompt({
            type: 'select',
            name: 'choice',
            message: 'There are multiple passwords for this service:',
            choices: passwordsForService
        });
        return {
            service: service,
            keyword: choice
        };
    }
}


function $6cf07dfe980b53a9$export$2e2bcd8739ae039(options) {
    options = {
        PASSFILE_PATH: `${$parcel$interopDefault($3PBb8$os).homedir()}/.passfile`,
        ...options
    };
    return new $3PBb8$tauris.Command('view').describe('View a password').handler((argv)=>{
        (async ()=>{
            var ref;
            if (!((ref = argv.parameters) === null || ref === void 0 ? void 0 : ref[0])) {
                console.log($parcel$interopDefault($3PBb8$chalk)`{red.bold Error:} You must provide a service (and optionally a keyword) to view a password`);
                process.exit(1);
            }
            const service = argv.parameters[0];
            const keyword = argv.parameters[1] || '';
            if (service.includes(' ') || keyword.includes(' ')) console.log($parcel$interopDefault($3PBb8$chalk)`{red.bold Error:} Keywords and services may not contain spaces`);
            $d2b65bc95cfc6f60$export$5af9a6f9a4e6c38f(options.PASSFILE_PATH);
            const { password: password  } = await $3PBb8$enquirer.prompt({
                type: 'password',
                name: 'password',
                message: 'Master password:'
            });
            $d2b65bc95cfc6f60$export$60baa3fe16af0010(password, options.PASSFILE_PATH);
            const passFile = $parcel$interopDefault($3PBb8$fs).readFileSync($parcel$interopDefault($3PBb8$path).resolve(options.PASSFILE_PATH)).toString();
            const passwords = passFile.split('\n');
            const { service: p_service , keyword: p_keyword  } = await $eb81d726244796cb$export$ba52aae3a6723688(passwords, service, keyword, $fa4a0f1a9948ca07$export$d01b444bafb1a792(password));
            const pass = $d2b65bc95cfc6f60$export$557aad609b00e57(passwords, p_service, p_keyword, $fa4a0f1a9948ca07$export$d01b444bafb1a792(password));
            if (!pass) {
                console.log($parcel$interopDefault($3PBb8$chalk)`{red.bold Error:} Could not find password for {cyan ${p_service} ${p_keyword}}`);
                process.exit(1);
            }
            console.log($parcel$interopDefault($3PBb8$chalk)`Password: {cyan ${pass.split(' ').slice(2).join(' ')}}`);
        })().then((_v)=>{
        }).catch((err)=>{
            console.log($parcel$interopDefault($3PBb8$chalk)`{red.bold Error:} ${err.message} {gray (unhandled exception)}`);
        });
    });
}











function $037abce4081a75fa$export$2e2bcd8739ae039(options) {
    options = {
        PASSFILE_PATH: `${$parcel$interopDefault($3PBb8$os).homedir()}/.passfile`,
        ...options
    };
    return new $3PBb8$tauris.Command('remove').describe('Delete a password').handler((argv)=>{
        (async ()=>{
            var ref;
            if (!((ref = argv.parameters) === null || ref === void 0 ? void 0 : ref[0])) {
                console.log($parcel$interopDefault($3PBb8$chalk)`{red.bold Error:} You must provide a service (and optionally a keyword) to remove a password`);
                process.exit(1);
            }
            const service = argv.parameters[0];
            const keyword = argv.parameters[1] || '';
            if (service.includes(' ') || keyword.includes(' ')) console.log($parcel$interopDefault($3PBb8$chalk)`{red.bold Error:} Keywords and services may not contain spaces`);
            $d2b65bc95cfc6f60$export$5af9a6f9a4e6c38f(options.PASSFILE_PATH);
            const { password: password  } = await $3PBb8$enquirer.prompt({
                type: 'password',
                name: 'password',
                message: 'Master password:'
            });
            $d2b65bc95cfc6f60$export$60baa3fe16af0010(password, options.PASSFILE_PATH);
            const passFile = $parcel$interopDefault($3PBb8$fs).readFileSync($parcel$interopDefault($3PBb8$path).resolve(options.PASSFILE_PATH)).toString();
            const passwords = passFile.split('\n');
            const { service: p_service , keyword: p_keyword  } = await $eb81d726244796cb$export$ba52aae3a6723688(passwords, service, keyword, $fa4a0f1a9948ca07$export$d01b444bafb1a792(password));
            const { confirm: confirm  } = await $3PBb8$enquirer.prompt({
                name: 'confirm',
                type: 'confirm',
                message: $parcel$interopDefault($3PBb8$chalk)`Are you sure you want to delete your password for ${p_service} ${p_keyword}?`
            });
            if (confirm) {
                $d2b65bc95cfc6f60$export$bf41c13c2df4475c(passwords, p_service, p_keyword, $fa4a0f1a9948ca07$export$d01b444bafb1a792(password), options.PASSFILE_PATH);
                console.log($parcel$interopDefault($3PBb8$chalk)`{green ✔} Password deleted`);
            } else console.log($parcel$interopDefault($3PBb8$chalk)`{red.bold ×} Operation aborted`);
        })().then((_v)=>{
        }).catch((err)=>{
            console.log($parcel$interopDefault($3PBb8$chalk)`{red.bold Error:} ${err.message} {gray (unhandled exception)}`);
        });
    });
}










function $0fbdded1ad216e24$export$2e2bcd8739ae039(options) {
    options = {
        PASSFILE_PATH: `${$parcel$interopDefault($3PBb8$os).homedir()}/.passfile`,
        ...options
    };
    return new $3PBb8$tauris.Command('store').describe('Store an existing password in your passfile').usage('pass store <service> [<keyword>] <password>').handler((argv)=>{
        (async ()=>{
            var ref;
            if (((ref = argv.parameters) === null || ref === void 0 ? void 0 : ref.length) < 2) {
                console.log($parcel$interopDefault($3PBb8$chalk)`{red.bold Error:} You must provide a service, optional keyword and password to run this command`);
                process.exit(1);
            }
            const service = argv.parameters[0];
            const keyword = argv.parameters.length === 3 ? argv.parameters[1] : '*';
            if (service.includes(' ') || keyword.includes(' ')) console.log($parcel$interopDefault($3PBb8$chalk)`{red.bold Error:} Keywords and services may not contain spaces`);
            $d2b65bc95cfc6f60$export$5af9a6f9a4e6c38f(options.PASSFILE_PATH);
            const { password: password  } = await $3PBb8$enquirer.prompt({
                type: 'password',
                name: 'password',
                message: 'Master password:'
            });
            $d2b65bc95cfc6f60$export$60baa3fe16af0010(password, options.PASSFILE_PATH);
            const passFile = $parcel$interopDefault($3PBb8$fs).readFileSync($parcel$interopDefault($3PBb8$path).resolve(options.PASSFILE_PATH)).toString();
            const passwords = passFile.split('\n');
            if ($d2b65bc95cfc6f60$export$557aad609b00e57(passwords.slice(1), service, keyword, $fa4a0f1a9948ca07$export$d01b444bafb1a792(password))) {
                console.log($parcel$interopDefault($3PBb8$chalk)`{red.bold Error:} There's already a password with this service and keyword. Try a different keyword.`);
                process.exit(1);
            }
            $d2b65bc95cfc6f60$export$bfe833e59aa823e8(passwords, service, keyword, argv.parameters[argv.parameters.length - 1], $fa4a0f1a9948ca07$export$d01b444bafb1a792(password), options.PASSFILE_PATH);
            console.log($parcel$interopDefault($3PBb8$chalk)`{green ✔️} Added your password`);
        })().then((_v)=>{
        }).catch((err)=>{
            console.log($parcel$interopDefault($3PBb8$chalk)`{red.bold Error:} ${err.message} {gray (unhandled exception)}`);
        });
    });
}


const $0446593f2d35b6f8$var$PASSFILE_PATH = `${$parcel$interopDefault($3PBb8$os).homedir()}/.passfile`;
const $0446593f2d35b6f8$var$argv = new $3PBb8$tauris.Command('pass').describe('CLI password manager').option('v', {
    alias: [
        'version'
    ],
    type: 'boolean',
    description: 'Display version information'
}).command($e6a36c4d365743b7$export$2e2bcd8739ae039({
    PASSFILE_PATH: $0446593f2d35b6f8$var$PASSFILE_PATH
})).command($9515060d57d3951c$export$2e2bcd8739ae039({
    PASSFILE_PATH: $0446593f2d35b6f8$var$PASSFILE_PATH
})).command($6cf07dfe980b53a9$export$2e2bcd8739ae039({
    PASSFILE_PATH: $0446593f2d35b6f8$var$PASSFILE_PATH
})).command($037abce4081a75fa$export$2e2bcd8739ae039({
    PASSFILE_PATH: $0446593f2d35b6f8$var$PASSFILE_PATH
})).command($0fbdded1ad216e24$export$2e2bcd8739ae039({
    PASSFILE_PATH: $0446593f2d35b6f8$var$PASSFILE_PATH
})).demandArgument().parse(process.argv.slice(2));
if ($0446593f2d35b6f8$var$argv && $0446593f2d35b6f8$var$argv.v) console.log($parcel$interopDefault($3PBb8$jsbitsgetpackageversion)(__dirname));


//# sourceMappingURL=index.js.map
