import {addCommand} from "./registry"
import {commandForTypeScript, getFilePathPosition} from "../utils"

addCommand("atom-text-editor", "typescript:build", deps => ({
  description: "Compile all files in project related to current active text editor",
  async didDispatch(e) {
    if (!commandForTypeScript(e)) {
      return
    }

    const fpp = getFilePathPosition(e.currentTarget.getModel())
    if (!fpp) {
      e.abortKeyBinding()
      return
    }
    const {file} = fpp
    const client = await deps.getClient(file)

    const projectInfo = await client.execute("projectInfo", {
      file,
      needFileNameList: true,
    })

    const files = new Set(projectInfo.body!.fileNames)
    files.delete(projectInfo.body!.configFileName)
    let filesSoFar = 0
    const stp = deps.getStatusPanel()
    const promises = [...files.values()].map(f =>
      _finally(client.execute("compileOnSaveEmitFile", {file: f, forced: true}), () => {
        stp.update({progress: {max: files.size, value: (filesSoFar += 1)}})
        if (files.size <= filesSoFar) stp.update({progress: undefined})
      }),
    )

    try {
      const results = await Promise.all(promises)
      if (results.some(result => result.body === false)) {
        throw new Error("Emit failed")
      }
      stp.update({buildStatus: {success: true}})
    } catch (err) {
      console.error(err)
      stp.update({buildStatus: {success: false, message: err.message}})
    }
  },
}))

function _finally<T>(promise: Promise<T>, callback: (result: T) => void): Promise<T> {
  promise.then(callback, callback)
  return promise
}
