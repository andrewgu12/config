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

;; Hide Emacs menu bar
(tool-bar-mode -1)

;; Emacs default settings
(setq-default
	      tab-width 2
	      inhibit-startup-message t
	      make-backup-file nil
	      vc-follow-symlinks t)

(set-face-attribute 'default t :font "Source Code Pro for Powerline 12")

;; One Dark Themes
(use-package one-themes
	:ensure t
	:init
	(load-theme 'one-dark t))

;; Delete trailing spaces on save
(add-hook 'before-save-hook 'delete-trailing-whitespace)

;; Auto indent
(define-key global-map (kbd "RET") 'newline-and-indent)

;; Show Matching Parens
(use-package rainbow-delimiters
	    :ensure t
	    :config
	    (add-hook 'prog-mode-hook #'rainbow-delimiters-mode))


;; Evil Mode
(use-package evil
  :ensure t
	     :config
	     (evil-mode 1))
;;	     define-key evil-motion-state-map (kbd ":") 'helm-M-x))

(use-package key-chord
  :ensure t
  :config
  (key-chord-mode 1)
  (key-chord-define-global "fd" 'evil-normal-state))
(custom-set-variables
 ;; custom-set-variables was added by Custom.
 ;; If you edit it by hand, you could mess it up, so be careful.
 ;; Your init file should contain only one such instance.
 ;; If there is more than one, they won't work right.
 '(package-selected-packages
	 (quote
		(one-themes use-package rainbow-delimiters key-chord evil))))
(custom-set-faces
 ;; custom-set-faces was added by Custom.
 ;; If you edit it by hand, you could mess it up, so be careful.
 ;; Your init file should contain only one such instance.
 ;; If there is more than one, they won't work right.
 )
