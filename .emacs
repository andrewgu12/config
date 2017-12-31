(require 'package)
;; add in MELPA and org packages
(add-to-list 'package-archives '("org" . "http://orgmode.org/elpa/"))
(add-to-list 'package-archives '("melpa" . "http://melpa.org/packages/"))
(add-to-list 'package-archives '("melpa-stable" . "http://stable.melpa.org/packages/"))
(add-to-list 'load-path "~/.emacs.d/custom-packages") ; either self written packages or downloaded

(setq package-enable-at-startup nil)
(package-initialize)
(setq mac-command-modifier 'meta)

;;where to store backup files
(setq
 backup-by-copying t
 backup-directory-alist '(("." . "~/.emacs-backups")))

;; default theme
(load-theme 'darktooth t)

;; Disable menu-bars, scroll-bars, and other nonsense
(menu-bar-mode -1)t
(scroll-bar-mode -1)
(tool-bar-mode -1)

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
(require 'relative-linum)
(setq linum-min-luminance 0.5)
(global-linum-mode t)

;; Projectile settings
(setq projectile-require-project-root nil)
(global-set-key (kbd "C-o") 'projectile-find-file)

;; Markdown Settings
(require 'markdown-mode)
(add-to-list 'auto-mode-alist '("\\.markdown\\'" . markdown-mode))
(add-to-list 'auto-mode-alist '("\\.md\\'" . markdown-mode))

;; helm settings
(global-set-key (kbd "M-x") 'helm-M-x)
(global-set-key (kbd "M-y") 'helm-show-kill-ring)
(global-set-key (kbd "C-x b") 'helm-mini)
(global-set-key (kbd "C-x C-f") 'helm-find-files)

;; Autopair
(require 'autopair)
(autopair-global-mode) ;; enable autopair in all buffers

(custom-set-variables
 ;; custom-set-variables was added by Custom.
 ;; If you edit it by hand, you could mess it up, so be careful.
 ;; Your init file should contain only one such instance.
 ;; If there is more than one, they won't work right.
 '(custom-safe-themes
   (quote
    ("a4d03266add9a1c8f12b5309612cbbf96e1291773c7bc4fb685bfdaf83b721c6" default)))
 '(global-linum-mode t)
 '(package-selected-packages
   (quote
    (autopair markdown-mode linum-relative spaceline projectile darktooth-theme helm helm-ebdb)))
 '(tramp-syntax (quote default) nil (tramp)))
(custom-set-faces
 ;; custom-set-faces was added by Custom.
 ;; If you edit it by hand, you could mess it up, so be careful.
 ;; Your init file should contain only one such instance.
 ;; If there is more than one, they won't work right.
 )
