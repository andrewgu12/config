(require 'package)
;; add in MELPA and org packages
(add-to-list 'package-archives '("org" . "http://orgmode.org/elpa/"))
(add-to-list 'package-archives '("melpa" . "http://melpa.org/packages/"))
(add-to-list 'package-archives '("melpa-stable" . "http://stable.melpa.org/packages/"))
;; (add-to-list 'load-path "~/.emacs.d/custom-packages") ; either self written packages or downloaded

(setq package-enable-at-startup nil)
(package-initialize)
(setq mac-command-modifier 'meta)

;;where to store backup files
(setq
 backup-by-copying t
 backup-directory-alist '(("." . "~/.emacs-backups")))

;; default theme
(load-theme 'atom-one-dark t)

;; Disable menu-bars, scroll-bars, and other nonsense
(menu-bar-mode -1)
(scroll-bar-mode -1)
(tool-bar-mode -1)

;; helm settings
(global-set-key (kbd "M-x") 'helm-M-x)
(global-set-key (kbd "M-y") 'helm-show-kill-ring)
(global-set-key (kbd "C-x b") 'helm-mini)
(global-set-key (kbd "C-x C-f") 'helm-find-files)

;; Set Font
(set-default-font "Source Code Pro 13")

;; Mark return key to be a new line and autoindent
(global-set-key (kbd "RET") 'newline-and-indent)

;; Default tab width
(setq-default indent-tabs-mode nil)
(setq-default tab-width 2)

;; Spacemacs Mode Line
(require 'spaceline-config)
(spaceline-spacemacs-theme)

;; Line Numbers
;; (require 'relative-linum)
;; (setq linum-min-luminance 0.5)
(global-linum-mode t)

;; Projectile settings
(setq projectile-require-project-root nil)
(global-set-key (kbd "C-o") 'projectile-find-file)

;; Markdown Settings
(require 'markdown-mode)
(add-to-list 'auto-mode-alist '("\\.markdown\\'" . markdown-mode))
(add-to-list 'auto-mode-alist '("\\.md\\'" . markdown-mode))

;; Autopair
(require 'autopair)
(autopair-global-mode) ;; enable autopair in all buffers

;; Auto-Complete
(ac-config-default)

;; Go Mode
(require 'go-mode)
(add-to-list 'auto-mode-alist '("\\.go\\'" . go-mode))

;; Arduino Mode
(setq auto-mode-alist (cons '("\\.\\(pde\\|ino\\)$" . arduino-mode) auto-mode-alist))
(autoload 'arduino-mode "arduino-mode" "Arduino editing mode." t)

;; Web Dev Stuff

;; Coffee Mode
(require 'coffee-mode)
(add-to-list 'auto-mode-alist '("\\.coffee\\'" . coffee-mode))

;; Jade Mode
(require 'jade-mode)
(add-to-list 'auto-mode-alist '("\\.jade\\'" . jade-mode))

(custom-set-variables
 ;; custom-set-variables was added by Custom.
 ;; If you edit it by hand, you could mess it up, so be careful.
 ;; Your init file should contain only one such instance.
 ;; If there is more than one, they won't work right.
 '(custom-safe-themes
   (quote
    ("878497d07b1cb63d19c088031a189ba4edda845c7e0849ab68a4232ab4d6c0b7" "0ee3fc6d2e0fc8715ff59aed2432510d98f7e76fe81d183a0eb96789f4d897ca" "a4d03266add9a1c8f12b5309612cbbf96e1291773c7bc4fb685bfdaf83b721c6" default)))
 '(global-linum-mode t)
 '(inhibit-startup-screen t)
 '(package-selected-packages
   (quote
    (neotree matlab-mode arduino-mode auto-complete go-mode atom-one-dark-theme coffee-mode jade-mode helm-core helm-coreelm creamsody-theme darktooth-theme autopair markdown-mode linum-relative spaceline projectile helm helm-ebdb))))
(custom-set-faces
 ;; custom-set-faces was added by Custom.
 ;; If you edit it by hand, you could mess it up, so be careful.
 ;; Your init file should contain only one such instance.
 ;; If there is more than one, they won't work right.
 )
