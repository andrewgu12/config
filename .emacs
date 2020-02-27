(package-initialize)

(setq package-archives
      '(("gnu" . "http://elpa.gnu.org/packages/")
	("melpa" . "http://melpa.org/packages/")))

(eval-when-compile
  (require 'use-package))

;; Mac specific keybindings
(when (eq system-type 'darwin)
  (setq mac-option-modifier 'alt)
  (setq mac-command-modifier 'meta)
  )

;; Hide Emacs's menu bar
(tool-bar-mode -1)

;; One dark theme
(use-package one-themes
  :ensure t
  :init
  (load-theme 'one-dark t))

;; Show matching parens
(setq show-paren-delay 0)
(show-paren-mode t)

;; default settings
(setq-default tab-width 2
	      inhibit-startup-message t
	      make-backup-file nil
				vc-follow-symlinks t)

;; auto indent
(define-key global-map (kbd "RET") 'newline-and-indent)

;; Relative line numbers
(use-package linum-relative
	:ensure t
	:config
	(linum-relative-on))
(global-linum-mode)

;; Helm settings
(use-package helm-config
	:config
	(global-set-key (kbd "M-x") 'helm-M-x))

;; auto completion
(use-package company
	:ensure t
	:config
	(global-company-mode))

;; Lanugage specific libraries
(use-package markdown-mode
  :ensure t
  :mode (("\\.md\\' " . markdown-mode))
  :init (setq markdown-command "multimarkdown"))

(use-package tide
	:ensure t
	:after (typescript-mode company flycheck)
	:hook ((typescript-mode . tide-setup)
				 (typescript-mode . tide-hl-identifier-mode)))
	
;; evil mode
(use-package evil
	:ensure t
	:config
	(evil-mode 1))
;;	(define-key evil-motion-state-map (kbd ":") 'helm-M-x))

;; (use-package ag
;; 	:ensure t)

;; projectile
(use-package projectile
	:ensure t
	:config
	(projectile-mode +1)
	(define-key projectile-mode-map (kbd "C-x C-f") 'projectile-find-file))

(setq projectile-completion-system 'helm)

;; (use-package helm-projectile
;; 	:ensure t
;; 	:config
;; 	(helm-projectile-on))

;; keyboard mappings
(use-package key-chord
	:ensure t
	:config
	(key-chord-mode 1)	
	(key-chord-define-global "fd" 'evil-normal-state))


(custom-set-faces
 ;; custom-set-faces was added by Custom.
 ;; If you edit it by hand, you could mess it up, so be careful.
 ;; Your init file should contain only one such instance.
 ;; If there is more than one, they won't work right.
 '(font-lock-string-face ((t (:family "Source Code Pro")))))
(custom-set-variables
 ;; custom-set-variables was added by Custom.
 ;; If you edit it by hand, you could mess it up, so be careful.
 ;; Your init file should contain only one such instance.
 ;; If there is more than one, they won't work right.
 '(package-selected-packages
	 (quote
		(helm-projectile tide company helm-ag use-package one-themes markdown-mode linum-relative key-chord helm evil atom-dark-theme))))
