;;; autopair-autoloads.el --- automatically extracted autoloads
;;
;;; Code:
(add-to-list 'load-path (directory-file-name (or (file-name-directory #$) (car load-path))))

;;;### (autoloads nil "autopair" "../../../../.emacs.d/elpa/autopair-20160304.437/autopair.el"
;;;;;;  "3e03ada29f79aeeaf6ef00f8816d8a28")
;;; Generated autoloads from ../../../../.emacs.d/elpa/autopair-20160304.437/autopair.el

(autoload 'autopair-mode "autopair" "\
Automagically pair braces and quotes like in TextMate.

\(fn &optional ARG)" t nil)

(defvar autopair-global-mode nil "\
Non-nil if Autopair-Global mode is enabled.
See the `autopair-global-mode' command
for a description of this minor mode.
Setting this variable directly does not take effect;
either customize it (see the info node `Easy Customization')
or call the function `autopair-global-mode'.")

(custom-autoload 'autopair-global-mode "autopair" nil)

(autoload 'autopair-global-mode "autopair" "\
Toggle Autopair mode in all buffers.
With prefix ARG, enable Autopair-Global mode if ARG is positive;
otherwise, disable it.  If called from Lisp, enable the mode if
ARG is omitted or nil.

Autopair mode is enabled in all buffers where
`autopair-on' would do it.
See `autopair-mode' for more information on Autopair mode.

\(fn &optional ARG)" t nil)

;;;***

;;;### (autoloads nil nil ("../../../../.emacs.d/elpa/autopair-20160304.437/autopair-autoloads.el"
;;;;;;  "../../../../.emacs.d/elpa/autopair-20160304.437/autopair.el")
;;;;;;  (23113 63816 957258 994000))

;;;***

;; Local Variables:
;; version-control: never
;; no-byte-compile: t
;; no-update-autoloads: t
;; End:
;;; autopair-autoloads.el ends here
