# pass

This is just a utility I whipped up in an afternoon yesterday as an alternative to more common password managers because I have trust issues and can't trust any code I didn't write myself. So, I guess, what's the harm in putting it on GitHub just incase anyone cares?

Seriously, though, it's mainly a convenience tool for me – As a developer/power user I _always_ have a terminal open, and being able to manage my passwords there saves me the hassle of having to have a separate app open all the time, because honestly, copy-pasting a password into a web app once every few hours is really all I need from a password manager. If you _do_ have trust issues like I do, however, you can read through the [Implementation details](#implementation-details) and I also encourage you to take a look at the code (Most of the interesting stuff happens in [`src/cryptography.js`](blob/master/src/cryptography.js))!

## Installation

You'll need [Node.js](https://nodejs.org) & NPM (which is bundled with nodejs) to run this utility. To install, run the following command in the shell of your choice:

```bash
npm install -g pass # Or, if you prefer yarn: yarn global add pass
```

Test that pass is properly installed with the following command

```bash
pass -v
```

Once you're done, run `pass init` to create a passfile in your home directory

## Usage

You can see the following help message by running `pass -h` or `pass --help`

```
Usage:

  $ pass [...options]

Options:

  -h, --help ........ Display this help message
  -v, --version ..... Display version information

Commands:

  init .............. Initiliase the passfile
  generate .......... Generate a new password for a service & keyword and save it in your passfile
  view .............. View a password
  remove ............ Delete a password
  store ............. Store an existing password in your passfile
```

### `pass init`

Usage: `pass init`

This command will create your passfile. The passfile is a file located at the path `<HOME_DIR>/.passfile` which stores your passwords in their encrypted form.

The command will prompt you for a master password. This password will be required everytime you want to view, generate or store a password and will be used as an encryption key for your passfile.

> **Important Notice:** If you forget your master password, all passwords in your passfile are _permanently_ lost. Make sure to choose a master password that you can remeber

Example: `pass init`

### `pass generate`

Usage: `pass generate <service> [<keyword>]`

This command will generate a new password and store it in your passfile. It command takes two parameters, `<service>` and `<keyword>`, of which only `service` is required.

`service` should be the name of the application or service you are creating a password for. `keyword` (optionally) contains an additional keyword like, for example an account name or wallet address that identifies this password. It allows you to have multiple passwords for the same service. For every combination of `service` and `keyword`, there may only be exactly one password stored.

The option `keyword` defaults to `"*"` when no value is specified.

Example: `pass generate reddit myusername`

### `pass view`

Usage: `pass view <service> [<keyword>]`

This command will print the specified password to standard output. Its two parameters are the same as the ones described in [`pass generate`](#pass-generate).

If no value is specified for `keyword`, a prompt listing available keywords will be displayed.

Example: `pass view reddit myusername` or `pass view reddit`

### `pass remove`

Usage: `pass remove <service> [<keyword>]`

This command deletes a password permanently from your passfile. The parameters are the same as described above (see [`pass generate`](#pass-generate)).

If no value is specified for `keyword`, a prompt listing available keywords will be displayed.

> **Important Notice:** The password will be delted _permanently_ from your passfile and _cannot be accessed again_ after it has been removed.

Example: `pass remove reddit myusername` or `pass remove reddit`

### `pass store`

Usage: `pass store <service> [<keyword>] <password>`

This command can be used to store an already existing password in your passfile. The parameters `service` and `keyword` are the same as described above (see [`pass generate`](#pass-generate)). `keyword` may be skipped

The parameter `password` contains the password that should be stored in the passfile.

If your password contains spaces, make sure to wrap it accordingly in `""` double quotes.

## Implementation details

### Master password

The key used to encrypt the passfile is derived from the master password using the [scrypt](https://en.wikipedia.org/wiki/Scrypt) key derivation function in the implementation provided by the Node.js core `crypto` library.

For the sake of simplicity, `pass` always uses the literal string `"salt"` as the salt for `scrypt`, although this may be changed in the future.

The first line in the passfile will always be the encrypted form of the string `"valid key"`, encrypted with the key generated from the master password. To test whether the master password is valid, `pass` will attempt to decrypt this first line with the given key, and display an error message if the algorithm a) throws an error or b) returns any value other than `"valid key"` as the result

### Encryption

For encryption, `pass` uses the `aes-192-cbc` algorithm provide by the Node.js core `crypto` library along with a unique 24-byte initialization vector (similar to a salt; see https://en.wikipedia.org/wiki/Initialization_vector)

Every line in the passfile, including the first line (see [Master password](#master-password)) has the following format:

```
<hex-encoded cyphertext (variable length)> <hex-encoded IV (24 bytes)>
```

Where the IV is unique for every line.

## Roadmap

- In the future, `pass view` will no longer require the option `service` and allow you to browse through a list of your services just like you can browse through a list of keywords

## Credits

Here are some of the libraries I used to make my life (and yours) a bit easier while I built this project (I highly recommend you check them out!):

- [`chalk`](https://npmjs.com/package/chalk): A super nifty utility that makes it easy to deal with ANSI color codes in the terminal
- [`enquirer`](https://npmjs.com/package/enquirer): A library with a huge variety of built-in user-friendly interactive prompts like the password prompt or the choice prompt I used in this project
- [`get-package-version`](https://npmjs.com/package/@jsbits/get-package-version) from JSBits: A utility for getting the current version of a package from `package.json` that handles all kinds of npm `package.json` weirdness
- [`tauris`](https://github.com/codemaster138/tauris): A super-easy and convenient library for parsing CLI arguments and generating help prompts. I use it in almost all of my CLI projects and I think it gets *way* to little credit
