import * as Atom from "atom"
import * as path from "path"
import {FileLocationQuery, Location} from "./ts"

// Return line/offset position in the editor using 1-indexed coordinates
function getEditorPosition(editor: Atom.TextEditor): Location {
  const pos = editor.getCursorBufferPosition()
  return {
    line: pos.row + 1,
    offset: pos.column + 1,
  }
}

export function isTypescriptFile(filePath: string | undefined): boolean {
  if (!filePath) return false
  return isAllowedExtension(path.extname(filePath))
}

export function isTypescriptEditorWithPath(editor: Atom.TextEditor) {
  return isTypescriptFile(editor.getPath()) && isTypescriptGrammar(editor)
}

function isTypescriptGrammar(editor: Atom.TextEditor): boolean {
  const [scopeName] = editor.getRootScopeDescriptor().getScopesArray()
  return ["source.ts", "source.tsx", "typescript"].includes(scopeName)
}

function isAllowedExtension(ext: string) {
  return [".ts", ".tst", ".tsx"].includes(ext)
}

export function getFilePathPosition(editor: Atom.TextEditor): FileLocationQuery | undefined {
  const file = editor.getPath()
  if (file) {
    return {file, ...getEditorPosition(editor)}
  }
}

/** Utility functions for commands */
export function commandForTypeScript(e: Atom.CommandEvent<Atom.TextEditorElement>) {
  const editor = e.currentTarget.getModel()
  if (isTypescriptEditorWithPath(editor)) {
    return true
  } else {
    e.abortKeyBinding()
    return false
  }
}
