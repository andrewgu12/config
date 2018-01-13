import * as Atom from "atom"
import view = require("./view")
// tslint:disable-next-line:no-var-requires
const html = require("../../../../views/renameView.html")
const $ = view.$

interface EditorViewzz extends JQuery {
  model: Atom.TextEditor
}

interface RenameViewOptions {
  autoSelect: boolean
  title: string
  text: string
  onCommit?: (newValue: string) => void
  onCancel?: () => void
  /** A truthy string return indicates a validation error */
  onValidate: (newValue: string) => string
}

export class RenameView extends view.View<Partial<RenameViewOptions>> {
  private newNameEditor: EditorViewzz
  private validationMessage: JQuery
  private panel: Atom.Panel
  private title: JQuery
  static content = html

  public init() {
    $(atom.views.getView(atom.workspace)).on("keydown", e => {
      if (e.keyCode === 27) {
        // escape
        if (this.options.onCancel) {
          this.options.onCancel()
          this.clearView()
        }
      }
    })

    this.newNameEditor.on("keydown", e => {
      const newText = this.newNameEditor.model.getText()
      if (e.keyCode === 13) {
        // enter
        const invalid = this.options.onValidate && this.options.onValidate(newText)
        if (invalid) {
          this.validationMessage.text(invalid)
          this.validationMessage.show()
          return
        }
        this.validationMessage.hide()

        if (this.options.onCommit) {
          this.options.onCommit(newText)
          this.clearView()
        }
      }
      if (e.keyCode === 27) {
        // escape
        if (this.options.onCancel) {
          this.options.onCancel()
          this.clearView()
        }
      }
    })
  }

  public setPanel(panel: Atom.Panel) {
    this.panel = panel
  }

  public editorAtRenameStart?: Atom.TextEditor
  public clearView() {
    if (this.editorAtRenameStart && !this.editorAtRenameStart.isDestroyed()) {
      const editorView = atom.views.getView(this.editorAtRenameStart)
      editorView.focus()
    }
    this.panel.hide()
    this.options = {}
    this.editorAtRenameStart = undefined
  }

  private renameThis(options: RenameViewOptions) {
    this.options = options
    this.editorAtRenameStart = atom.workspace.getActiveTextEditor()
    this.panel.show()

    this.newNameEditor.model.setText(options.text || "undefined")
    if (this.options.autoSelect) {
      this.newNameEditor.model.selectAll()
    } else {
      this.newNameEditor.model.getLastCursor().moveToEndOfScreenLine()
    }
    this.title.text(this.options.title || "undefined")
    this.newNameEditor.focus()

    this.validationMessage.hide()
  }

  // Show the dialog and resolve the promise with the entered string
  showRenameDialog(options: RenameViewOptions): Promise<string> {
    return new Promise((resolve, reject) => {
      this.renameThis({
        ...options,
        onCancel: reject,
        onCommit: resolve,
      })
    })
  }
}

export function attach(): {dispose(): void; renameView: RenameView} {
  const renameView = new RenameView({})
  const panel = atom.workspace.addModalPanel({
    item: renameView,
    priority: 1000,
    visible: false,
  })

  renameView.setPanel(panel)

  return {
    dispose() {
      console.log("TODO: Detach the rename view: ", panel)
    },
    renameView,
  }
}
