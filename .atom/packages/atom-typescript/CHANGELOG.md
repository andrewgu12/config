## 12.3.8

-   Accept tree-sitter grammar

## 12.3.7

-   Avoid duplicate `open` command (which confuses tsserver)
-   Normalize errorPusher path on storage

## 12.3.6

-   Fix #1413

## 12.3.5

-   Fix semantic view display on initial creation

## 12.3.4

-   Track exprTypeTooltip globally

    This should help with tooltips getting "stuck" occasionally.

## 12.3.3

-   [Bufgix] invalid comparison

## 12.3.2

-   Fix TypeScript dependency

## 12.3.1

-   Use external highlighter in tsView instead of MiniEditor
    -   Should be a little bit more efficient and avoids flickering due
        to asynchronous tokenization
-   Remove \$ from find-references line number
-   Do not update selectView after resolution
    -   Avoids unexpected behavior when selectView is canceled before it
        loads
-   Fix symbols-view offset
    -   Going to an item from symbols-view was offset by 1 character to
        the right
-   Updates for Atom 1.24

## 12.3.0

-   Added an alternative to symbols-view (by russa)
    -   For file symbols, the same engine is used as for outline view
    -   For project symbols, `nav-to` tsserver command is used. It
        requires at least one symbol to search for.
-   Improvements to `typescript:return-from-declaration`
    -   All navigation commands (`find-references`, `go-to-declaration`,
        etc) save current editor position
    -   Added new command `typescript:show-editor-position-history` to
        show backlog of editor positions, that `return-from-declaration`
        will go back to
    -   Editor position history is persisted across Atom restarts (per
        project). To avoid bloating, total number of history items is
        limited to 100
-   Added `typescript:reload-projects` command
    -   Useful when tsserver isn't aware of new or removed files --
        previously this required Atom restart
-   Matched substring is highlighted in all select views (like Atom's
    bundled symbols-view)
-   Streamlined TypeScript file detection
    -   TypeScript file extension is assumed to be one of ".ts", ".tst",
        ".tsx"
    -   If it's open in editor, grammar is assumed to be one of
        "source.ts", "source.tsx"
    -   A file has to be saved (i.e. have a file path)
-   Many internal improvements
    -   Completely reworked tooltip management
    -   Most commands are bound to text-editor instead of the workspace
    -   Object lifetime management improvements
    -   Removed duplicate and obsolete code
-   Fix README link to CHANGELOG (by Fedde Schaeffer)

## 12.2.0

-   Merge pull request \#1402 "Center cursor after open in
    goToDeclaration" by Kai Curtis
-   Merge pull request \#1280 "Re-adding semantic view" by russaa

## 12.1.2

-   Use BufferedNodeProcess to spawn tsc (fixes 'init tsconfig' on
    Windows)

## 12.1.1

-   Fix occurrence markers

## 12.1.0

-   Show build error when "Emit failed" is clicked
-   Re-add progress bar for emit
-   Hide successful build status report "Emit success" after a
    configurable delay
-   Use [Etch](https://github.com/atom/etch) as the GUI framework
    instead of deprecated space-pen or direct DOM manipulation
-   Switch to ES2017 target
-   Update dependencies
-   Add `typescript:initialize-config` command
    ([\#1248](https://github.com/TypeStrong/atom-typescript/issues/1248))
    (by Paul Ermolin)

    Command is `typescript:initialize-config`, and it uses `tsc init`
    under the hood. Note that this is also an activation command,
    meaning you can use it without opening a TypeScript file first.
    However, it determines the project path from currently-active text
    editor -- if there aren't any text editors open, command doesn't do
    anything.

    No keybinding is assigned by default, since this is not a command
    one would use often.

-   Documentation updates
-   Remove obsolete `filesGlob` snippet
-   Don't use deprecated `.editor` class in grammar style
-   Add locale setting to control TypeScript's message locale
    ([\#1371](https://github.com/TypeStrong/atom-typescript/issues/1371))

## 12.0.0

-   **Switch to Atom's TypeScript grammar** (potentially
    compatibility-breaking)

    We're discontinuing our own grammar in favor of language-typescript,
    which is bundled with Atom. **Please make sure that
    language-typescript package is activated, we have no way of
    activating it for you.**

-   Cache constructed TypescriptBuffers by TextBuffers.

    Hopefully this helps with issues like \#1300 and \#1332

-   Show tooltip command

    Closes \#957. Adds `typescript:show-tooltip` command to show type
    tooltip at current text cursor position.

-   Configurable autocomplete-plus `suggestionPriority`

    Closes \#1185. Exactly what it says on the tin, allows configuring
    priority of TypeScript's autocompletion suggestions.

-   Moved config schema to package.json

    This should speed up Atom start-up times, since it doesn't need to
    load package source until needed.

-   Change target to ES7/2016

    Atom supports full ES7 now, so no reason not to, really.

-   Support for atom-ide-ui

    No installation prompt if atom-ide-ui or linter is detected, support
    for atom-ide-ui code fixes.

-   Do not show progress bar for emit

    This never worked properly, and a progress bar would get stuck in
    the panel after emit, so this is treated as a bug and removed for
    now.

-   Updated installation instructions in README

## 11.0.10

-   Hide Remove redundant autocomplete label text
-   Update the grammar to fix several highlighting issues
-   Add a framework for writing specs

## 11.0.9

-   Handle multiple directories in NODE\_PATH
-   TypeScript 2.5: exclude tsconfig.json from project files on emit

## 11.0.8

-   Speed up autocomplete and fix a disposable leak

# Older changes

Please note only breaking changes are logged beyond this point. You can
use GitHub's branch/tag comparison tool to get a full changeset, for
example,
<https://github.com/TypeStrong/atom-typescript/compare/v7.0.0...v8.0.0>
shows all changes since v7.0.0 until v8.0.0

## v11.0.0

-   Major rewrite using `tsserver` API for the best compatibility with
    the current versions of Typescript.

## v7.0.0

-   Removed the (already ignored in any significant way) `version`
    option from tsconfig.
    [More](https://github.com/TypeStrong/atom-typescript/issues/617)

## v6.0.0

-   Bring back `dts-generator` as using the other mechanism has a few
    gotchas that might surprise new users. We will remove this feature
    once <https://github.com/Microsoft/TypeScript/issues/2338> is
    officially supported.

## v5.0.0

-   We no longer *automatically* create a `tsconfig.json`. However we
    provide a *command* "TypeScript: Create tsconfig.json project file".

## v4.8.0

-   Feature: Added ReactJS / `.tsx` support

## v4

-   Removed `dts-generator` support. Reason is that it pollutes the
    global namespace and is no longer the recommended way for sharing
    TypeScript code. See
    <https://github.com/Microsoft/TypeScript/issues/2338> for the way
    forward.

## v3

-   We will now resolve a parent `package.json` for you *automatically*
    so that its *one less thing you need to configure*. :rose:

## v2

-   New default shortcuts for `build` : `F6` an `goto definition`:
    `F12`. Because I don't want to mess with your atom defaults and a
    major use base is VS users. [Link
    \#145](https://github.com/TypeStrong/atom-typescript/issues/145)

## v1

-   `format` → `formatCodeOptions`
    https://github.com/TypeStrong/atom-typescript/issues/178
-   `compileOnSave` is now a tsconfig option :
    https://github.com/TypeStrong/atom-typescript/issues/187

## 0.x

-   Initial releases
