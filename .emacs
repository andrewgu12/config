(package-initialize)
;; MELPA and ELPA packages repository
(setq package-archives      
      '(("gnu" . "http://elpa.gnu.org/packages/")
	("melpa" . "http://melpa.org/packages/")))

(add-to-list 'load-path "~/.emacs.d/custom-packages")
;(require 'custom-packages)

;; Load custom theme
(load-theme 'atom-one-dark t)

;; Set Font
(set-default-font "Source Code Pro 13")

;; Rebind Modifier key b/c OSX
(setq mac-command-modifier 'meta)

;;where to store backup files
(setq
 backup-by-copying t
 backup-directory-alist '(("." . "~/.emacs-backups")))

;; Autocomplete parantheses
(electric-pair-mode 1)

;; Line numbers
(require 'relative-linum)
(global-linum-mode t)

;; EditorConfig
(require 'editorconfig)
(editorconfig-mode 1)

;; Show Matching parens
(setq show-paren-delay 0) ; Quickly
(show-paren-mode t)

;; Enable Rainbow Delimiters mode
(add-hook 'prog-mode-hook #'rainbow-delimiters-mode)

;; Miscellaneous settings
(setq-default inhibit-startup-message t
	      frame-title-format  "%@%b%* - emacs")

;; Default tab width
(setq-default indent-tabs-mode nil)
(setq-default tab-width 2)

;; TODO: config helm, neotree, web dev stuff
(setq-default neo-show-hidden-files t)

;; Company Mode
(add-hook 'after-init-hook 'global-company-mode)

;; Tide setup
(defun setup-tide-mode ()
  (interactive)
  (tide-setup)
  (flycheck-mode +1)
  (setq flycheck-check-syntax-automatically '(save mode-enabled))
  (eldoc-mode +1)
  (tide-hl-identifier-mode +1)
  ;; company is an optional dependency. You have to
  ;; install it separately via package-install
  ;; `M-x package-install [ret] company`
  (company-mode +1))

;; aligns annotation to the right hand side
(setq company-tooltip-align-annotations t)

;; formats the buffer before saving
;;(add-hook 'before-save-hook 'tide-format-before-save)

(add-hook 'typescript-mode-hook #'setup-tide-mode)

;; helm settings
(global-set-key (kbd "M-x") 'helm-M-x)
(global-set-key (kbd "M-y") 'helm-show-kill-ring)
(global-set-key (kbd "C-x b") 'helm-mini)
(global-set-key (kbd "C-x C-f") 'helm-find-files)

;; Disable top bars
(menu-bar-mode -1)
(scroll-bar-mode -1)
(tool-bar-mode -1)

;; All the Icons
(require 'all-the-icons)

;; Spaceline (bottom bar)
(require 'spaceline-config)
(use-package spaceline-all-the-icons 
  :after spaceline
  :config (spaceline-all-the-icons-theme))

;; Neotree
(require 'neotree)
(global-set-key [f8] 'neotree-toggle)
(setq neo-theme (if (display-graphic-p) 'icons 'arrow))

;; Projectile
(setq projectile-require-project-root nil)
(global-set-key (kbd "C-t") 'projectile-find-file)

;; Dockerfile
(use-package dockerfile-mode
  :delight dockerfile-mode "Dockerfile"
  :mode "Dockerfile\\'")

;; YAML
(use-package yaml-mode
  :delight yaml-mode "YAML"
  :mode "\\.yml\\'")

;; Web-Mode
(require 'web-mode)
(add-to-list 'auto-mode-alist '("\\.html\\'" . web-mode))
(add-to-list 'auto-mode-alist '("\\.css\\'" . web-mode))
(add-to-list 'auto-mode-alist '("\\.scss\\'" . web-mode))
(add-to-list 'auto-mode-alist '("\\.erb\\'" . web-mode))

;; Pug-Mode
(require 'pug-mode)
(add-to-list 'auto-mode-alist '("\\.pug\\'" . pug-mode))

;; Markdown Mode
(use-package markdown-mode
  :delight markdown-mode "Markdown"
  :preface
  (defun me/markdown-set-ongoing-hydra-body ()
    (setq me/ongoing-hydra-body #'hydra-markdown/body))
  :mode
  ("INSTALL\\'"
   "CONTRIBUTORS\\'"
   "LICENSE\\'"
   "README\\'"
   "\\.markdown\\'"
   "\\.md\\'")
  :hook (markdown-mode . me/markdown-set-ongoing-hydra-body)
  :config
  (unbind-key "M-<down>" markdown-mode-map)
  (unbind-key "M-<up>" markdown-mode-map)
  (setq-default
   markdown-asymmetric-header t
   markdown-split-window-direction 'right)
  (me/unboldify '(markdown-header-face))
  (set-face-attribute 'markdown-table-face nil :height me/font-size-small))

(require 'yarn-mode)

;; Log files
(require 'logview)


(custom-set-variables
 ;; custom-set-variables was added by Custom.
 ;; If you edit it by hand, you could mess it up, so be careful.
 ;; Your init file should contain only one such instance.
 ;; If there is more than one, they won't work right.
 '(custom-safe-themes
   (quote
    ("a24c5b3c12d147da6cef80938dca1223b7c7f70f2f382b26308eba014dc4833a" "c90fd1c669f260120d32ddd20168343f5c717ca69e95d2f805e42e88430c340e" "d8f76414f8f2dcb045a37eb155bfaa2e1d17b6573ed43fb1d18b936febc7bbc2" "78496062ff095da640c6bb59711973c7c66f392e3ac0127e611221d541850de2" "b34636117b62837b3c0c149260dfebe12c5dad3d1177a758bb41c4b15259ed7e" default)))
 '(indent-tabs-mode nil)
 '(js-indent-level 2)
 '(package-selected-packages
   (quote
    (rainbow-delimiters material-theme pug-mode web-mode editorconfig flatland-theme spacegray-theme atom-one-dark-theme magit sql-indent logview yarn-mode markdown-mode yaml-mode dockerfile-mode helm-ag projectile neotree helm flycheck company tide use-package spaceline-all-the-icons all-the-icons spaceline subatomic-theme)))
 '(standard-indent 2)
 '(typescript-indent-level 2))
(custom-set-faces
 ;; custom-set-faces was added by Custom.
 ;; If you edit it by hand, you could mess it up, so be careful.
 ;; Your init file should contain only one such instance.
 ;; If there is more than one, they won't work right.
 )
(put 'upcase-region 'disabled nil)
(put 'downcase-region 'disabled nil)
