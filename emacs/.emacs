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

;; Display line numbers everywhere
(global-display-line-numbers-mode)

;; Emacs default settings
(setq-default
 tab-width 2
 inhibit-startup-message t
 make-backup-file nil
 vc-follow-symlinks t
 ring-bell-function 'ignore)

(use-package one-themes
	:ensure t
	:init
	(load-theme 'one-dark t))

;; Delete trailing spaces on save
(add-hook 'before-save-hook 'delete-trailing-whitespace)

;; Auto indent
(define-key global-map (kbd "RET") 'newline-and-indent)

;; Show Matching Paren
(use-package rainbow-delimiters
	:ensure t
	:hook (prog-mode . rainbow-delimiters-mode))

(use-package all-the-icons
	:ensure t)

;; Evil Mode
(use-package evil
  :ensure t
	:init
	(setq evil-want-keybinding nil)
	:config
	(evil-mode 1))

(use-package evil-collection
	:after evil
	:ensure t
	:config
	(evil-collection-init))

;; Add in custom key bindings to evil modes
(defun add-to-map(keys func)
	(define-key evil-normal-state-map (kbd keys) func)
	(define-key evil-motion-state-map (kbd keys) func))
(add-to-map "<SPC>" nil)

;; Autoformatter
(use-package format-all
	:ensure t
	:hook (before-save . format-all-buffer))

;; Auto closes brackets
(use-package autopair
	:ensure t
	:config
	(autopair-global-mode))

;; ivy, counsel
(use-package counsel
	:ensure t
	:config
	(add-to-map "<SPC><SPC>" 'counsel-ag)
	(global-set-key (kbd "C-x C-f") 'counsel-find-file)
	(global-set-key (kbd "M-x") 'counsel-M-x))

(use-package counsel-etags
	:ensure t
  :init
  (add-hook 'prog-mode-hook
						(lambda ()
							(add-hook 'after-save-hook
												'counsel-etags-virtual-update-tags 'append 'local)))
  :config
  (setq counsel-etags-update-interval 60)
  (push "build" counsel-etags-ignore-directories))

(use-package ivy
	:ensure t
	:config
	(ivy-mode 1)
	(setq ivy-use-virtual-buffers 1)
	(setq enable-recursive-minibuffers t)
	(add-to-map "/" 'swiper))

(use-package ivy-rich
	:ensure t
	:config
	(ivy-rich-mode 1))

;; Commenting this out b/c it's freezing - not sure if due to indexing or other issues
;; (use-package ivy-posframe
;; 	:ensure t
;; 	:config
;; 	(setq ivy-posframe-display-functions-alist '((t . ivy-posframe-display-at-frame-center)))
;; 	(ivy-posframe-mode 1))

;; Key combination
(use-package key-chord
  :ensure t
  :config
  (key-chord-mode 1)
  (key-chord-define-global "fd" 'evil-normal-state))

(use-package spaceline-config
	:ensure spaceline
	:config
	(spaceline-emacs-theme))

(use-package spaceline-all-the-icons
	:ensure t
	:after spaceline
	:config
	(spaceline-all-the-icons-theme))

(use-package magit
	:ensure t)

(use-package projectile
	:ensure t
	:config
	(projectile-mode +1)
	(setq projectile-search-path '("~/Documents/"))
	(add-to-map "<SPC> s p" 'projectile-find-file)
	(add-to-map "<SPC> p p" 'projectile-switch-project)
	(setq projectile-indexing-method 'alien))

(use-package counsel-projectile
	:ensure t
	:config
	(counsel-projectile-mode 1))

;; Auto complete
(use-package company
	:ensure t
	:config
	(global-company-mode t))

;; Languages Setup

;;JS/TS
(use-package rjsx-mode
	:ensure t
	:mode "\\.js\\"
	)

(use-package typescript-mode
	:ensure t
	:mode "\\.ts\\")

;; HTML/CSS/generic web stuffs
(use-package web-mode
	:ensure t
	:config
	(setq web-mode-markup-indent-offset 2)
	(setq web-mode-css-indent-offset 2)
	(setq web-mode-code-indent-offset 2)
	(add-to-list 'auto-mode-alist '("\\.tsx\\"))
	(add-to-list 'auto-mode-alist '("\\.html?\\'" . web-mode))
	(add-to-list 'auto-mode-alist '("\\.?css\\'" . web-mode))
	(add-to-list 'auto-mode-alist '("\\.erb\\'" . web-mode)))

(use-package tide
	:ensure t
	:after (typescript-mode company flycheck rjsx web-mode)
	:hook ((typescript-mode . tide-setup)
				 (rjsx-mode . tide-setup)
				 (web-mode . tide-setup)
				 (typescript-mode . tide-hl-idenitifer-mode))
	:config
	(interactive)
	(flycheck-mode +1)
	(setq flycheck-check-syntax-automatically '(save mode-enabled))
	(eldoc-mode +1)
	(setq company-tooltip-align-annotations t))



(use-package kotlin-mode
	:ensure t)

;; (use-package ruby-mode
;; 	:ensure t)

;; (use-package ruby-end
;; 	:ensure t)

;; ;; code completion for ruby
;; (use-package robe
;; 	:ensure t
;; 	:hook (ruby-mode . robe-mode)
;; 	:config
;; 	(push 'company-robe company-backends))

(custom-set-variables
 ;; custom-set-variables was added by Custom.
 ;; If you edit it by hand, you could mess it up, so be careful.
 ;; Your init file should contain only one such instance.
 ;; If there is more than one, they won't work right.
 '(package-selected-packages
	 (quote
		(counsel-etags evil-collection rjsx-mode tide company counsel-projectile projectile magit spaceline-all-the-icons spaceline spaceline-config telephone-line powerline-evil powerline ivy-posframe ivy-rich all-the-icons one-themes use-package rainbow-delimiters key-chord evil))))
(custom-set-faces
 ;; custom-set-faces was added by Custom.
 ;; If you edit it by hand, you could mess it up, so be careful.
 ;; Your init file should contain only one such instance.
 ;; If there is more than one, they won't work right.
 '(default ((t (:inherit nil :stipple nil :background "#282C34" :foreground "#ABB2BF" :inverse-video nil :box nil :strike-through nil :overline nil :underline nil :slant normal :weight normal :height 120 :width normal :foundry "nil" :family "Source Code Pro")))))
