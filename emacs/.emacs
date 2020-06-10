Content-Type: text/enriched
Text-Width: 70

<x-color><param>#56B6C2</param>(</x-color>package-initialize<x-color><param>#56B6C2</param>)</x-color>
<x-color><param>#56B6C2</param>(</x-color><x-color><param>#E06C75</param>setq</x-color> package-archives
      '<x-color><param>#D19A66</param>(</x-color><x-color><param>#61AFEF</param>(</x-color><x-color><param>#98C379</param>"gnu"</x-color> . <x-color><param>#98C379</param>"http://elpa.gnu.org/packages/"</x-color><x-color><param>#61AFEF</param>)</x-color>
				<x-color><param>#61AFEF</param>(</x-color><x-color><param>#98C379</param>"melpa"</x-color> . <x-color><param>#98C379</param>"http://melpa.org/packages/"</x-color><x-color><param>#61AFEF</param>)</x-color><x-color><param>#D19A66</param>)</x-color><x-color><param>#56B6C2</param>)</x-color>

<x-color><param>#5C6370</param>;; </x-color><x-color><param>#5C6370</param>install use-package if not installed
</x-color><x-color><param>#56B6C2</param>(</x-color><x-color><param>#E06C75</param>unless</x-color> <x-color><param>#D19A66</param>(</x-color>package-installed-p 'use-package<x-color><param>#D19A66</param>)</x-color>
	<x-color><param>#D19A66</param>(</x-color>package-install 'use-package<x-color><param>#D19A66</param>)</x-color><x-color><param>#56B6C2</param>)</x-color>

<x-color><param>#56B6C2</param>(</x-color><x-color><param>#E06C75</param>eval-when-compile</x-color>
  <x-color><param>#D19A66</param>(</x-color><x-color><param>#E06C75</param>require</x-color> '<x-color><param>#98C379</param>use-package</x-color><x-color><param>#D19A66</param>)</x-color><x-color><param>#56B6C2</param>)</x-color>

<x-color><param>#5C6370</param>;; </x-color><x-color><param>#5C6370</param>Mac specific keybindings
</x-color><x-color><param>#56B6C2</param>(</x-color><x-color><param>#E06C75</param>when</x-color> <x-color><param>#D19A66</param>(</x-color>eq system-type 'darwin<x-color><param>#D19A66</param>)</x-color>
  <x-color><param>#D19A66</param>(</x-color><x-color><param>#E06C75</param>setq</x-color> mac-option-modifier 'alt<x-color><param>#D19A66</param>)</x-color>
  <x-color><param>#D19A66</param>(</x-color><x-color><param>#E06C75</param>setq</x-color> mac-command-modifier 'meta<x-color><param>#D19A66</param>)</x-color>
  <x-color><param>#56B6C2</param>)</x-color>

<x-color><param>#5C6370</param>;; </x-color><x-color><param>#5C6370</param>Hide Emacs menu bar
</x-color><x-color><param>#56B6C2</param>(</x-color>tool-bar-mode -1<x-color><param>#56B6C2</param>)</x-color>

<x-color><param>#5C6370</param>;; </x-color><x-color><param>#5C6370</param>Display line numbers everywhere
</x-color><x-color><param>#56B6C2</param>(</x-color>global-display-line-numbers-mode<x-color><param>#56B6C2</param>)</x-color>

<x-color><param>#5C6370</param>;; </x-color><x-color><param>#5C6370</param>Emacs default settings
</x-color><x-color><param>#56B6C2</param>(</x-color><x-color><param>#E06C75</param>setq-default</x-color>
 tab-width 2
 indent-tabs-mode nil
 inhibit-startup-message t
 make-backup-file nil
 vc-follow-symlinks t
 ring-bell-function 'ignore<x-color><param>#56B6C2</param>)</x-color>

<x-color><param>#56B6C2</param>(</x-color><x-color><param>#E06C75</param>use-package</x-color> <x-color><param>#98C379</param>one-themes</x-color>
	<x-color><param>#828997</param>:ensure</x-color> t
	<x-color><param>#828997</param>:init</x-color>
	<x-color><param>#D19A66</param>(</x-color>load-theme 'one-dark t<x-color><param>#D19A66</param>)</x-color><x-color><param>#56B6C2</param>)</x-color>

<x-color><param>#5C6370</param>;; </x-color><x-color><param>#5C6370</param>Delete trailing spaces on save
</x-color><x-color><param>#56B6C2</param>(</x-color>add-hook 'before-save-hook 'delete-trailing-whitespace<x-color><param>#56B6C2</param>)</x-color>

<x-color><param>#5C6370</param>;; </x-color><x-color><param>#5C6370</param>Auto indent
</x-color><x-color><param>#56B6C2</param>(</x-color>define-key global-map <x-color><param>#D19A66</param>(</x-color>kbd <x-color><param>#98C379</param>"RET"</x-color><x-color><param>#D19A66</param>)</x-color> 'newline-and-indent<x-color><param>#56B6C2</param>)</x-color>

<x-color><param>#5C6370</param>;; </x-color><x-color><param>#5C6370</param>Previous window
</x-color><x-color><param>#56B6C2</param>(</x-color>global-set-key <x-color><param>#D19A66</param>(</x-color>kbd <x-color><param>#98C379</param>"C-x O"</x-color><x-color><param>#D19A66</param>)</x-color> <x-color><param>#D19A66</param>(</x-color><x-color><param>#E06C75</param>lambda</x-color> <x-color><param>#61AFEF</param>()</x-color>
                                <x-color><param>#61AFEF</param>(</x-color><x-color><param>#E06C75</param>interactive</x-color><x-color><param>#61AFEF</param>)</x-color>
                                <x-color><param>#61AFEF</param>(</x-color>other-window -1<x-color><param>#61AFEF</param>)</x-color><x-color><param>#D19A66</param>)</x-color><x-color><param>#56B6C2</param>)</x-color>


<x-color><param>#5C6370</param>;; </x-color><x-color><param>#5C6370</param>Show Matching Paren
</x-color><x-color><param>#56B6C2</param>(</x-color><x-color><param>#E06C75</param>use-package</x-color> <x-color><param>#98C379</param>rainbow-delimiters</x-color>
	<x-color><param>#828997</param>:ensure</x-color> t
	<x-color><param>#828997</param>:hook</x-color> <x-color><param>#D19A66</param>(</x-color>prog-mode . rainbow-delimiters-mode<x-color><param>#D19A66</param>)</x-color><x-color><param>#56B6C2</param>)</x-color>

<x-color><param>#56B6C2</param>(</x-color><x-color><param>#E06C75</param>use-package</x-color> <x-color><param>#98C379</param>all-the-icons</x-color>
	<x-color><param>#828997</param>:ensure</x-color> t<x-color><param>#56B6C2</param>)</x-color>


<x-color><param>#5C6370</param>;; </x-color><x-color><param>#5C6370</param>Evil Mode
</x-color><x-color><param>#56B6C2</param>(</x-color><x-color><param>#E06C75</param>use-package</x-color> <x-color><param>#98C379</param>evil</x-color>
  <x-color><param>#828997</param>:ensure</x-color> t
	<x-color><param>#828997</param>:init</x-color>
	<x-color><param>#D19A66</param>(</x-color><x-color><param>#E06C75</param>setq</x-color> evil-want-keybinding nil<x-color><param>#D19A66</param>)</x-color>
	<x-color><param>#828997</param>:config</x-color>
	<x-color><param>#D19A66</param>(</x-color>evil-mode 1<x-color><param>#D19A66</param>)</x-color><x-color><param>#56B6C2</param>)</x-color>

<x-color><param>#56B6C2</param>(</x-color><x-color><param>#E06C75</param>use-package</x-color> <x-color><param>#98C379</param>evil-collection</x-color>
	<x-color><param>#828997</param>:after</x-color> evil
	<x-color><param>#828997</param>:ensure</x-color> t
	<x-color><param>#828997</param>:config</x-color>
	<x-color><param>#D19A66</param>(</x-color>evil-collection-init<x-color><param>#D19A66</param>)</x-color><x-color><param>#56B6C2</param>)</x-color>

<x-color><param>#5C6370</param>;; </x-color><x-color><param>#5C6370</param>Add in custom key bindings to evil modes
</x-color><x-color><param>#56B6C2</param>(</x-color><x-color><param>#E06C75</param>defun</x-color> <x-color><param>#61AFEF</param>add-to-map</x-color><x-color><param>#D19A66</param>(</x-color>keys func<x-color><param>#D19A66</param>)</x-color>
	<x-color><param>#D19A66</param>(</x-color>define-key evil-normal-state-map <x-color><param>#61AFEF</param>(</x-color>kbd keys<x-color><param>#61AFEF</param>)</x-color> func<x-color><param>#D19A66</param>)</x-color>
	<x-color><param>#D19A66</param>(</x-color>define-key evil-motion-state-map <x-color><param>#61AFEF</param>(</x-color>kbd keys<x-color><param>#61AFEF</param>)</x-color> func<x-color><param>#D19A66</param>)</x-color><x-color><param>#56B6C2</param>)</x-color>
<x-color><param>#56B6C2</param>(</x-color>add-to-map <x-color><param>#98C379</param>"<<SPC>"</x-color> nil<x-color><param>#56B6C2</param>)</x-color>

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
	(add-to-map "<<SPC><<SPC>" 'counsel-ag)
	(global-set-key (kbd "C-x C-f") 'counsel-find-file)
	(global-set-key (kbd "M-x") 'counsel-M-x))

;; (use-package counsel-etags
;; 	:ensure t
;;   :init
;;   (add-hook 'prog-mode-hook
;; 						(lambda ()
;; 							(add-hook 'after-save-hook
;; 												'counsel-etags-virtual-update-tags 'append 'local)))
;;   :config
;;   (setq counsel-etags-update-interval 60)
;;   (push "build" counsel-etags-ignore-directories))

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
	(add-to-map "<<SPC> s p" 'projectile-find-file)
	(add-to-map "<<SPC> p p" 'projectile-switch-project)
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

(use-package dumb-jump
	:ensure t
	:config
	(setq dumb-jump-selector 'ivy)
	(setq dumb-jump-force-searcher 'ag)
	(add-to-map "g n" 'dumb-jump-go)
	(add-to-map "g f" 'dumb-jump-back)
	(add-to-map "g q" 'dumb-jump-quick-look))

(use-package treemacs
  :ensure t
  :config
  (setq treemacs-silent-filewatch t)
  (setq treemacs-git-mode 'extended)
  (setq treemacs-silent-refresh t))

(use-package treemacs-evil
  :after treemacs evil
  :ensure t)

(use-package treemacs-projectile
  :after treemacs projectile
  :ensure t)

(use-package treemacs-icons-dired
  :after treemacs dired
  :ensure t
  :config (treemacs-icons-dired-mode))

(use-package treemacs-magit
  :after treemacs magit
  :ensure t)

(use-package doom-themes
  :after treemacs
  :ensure t
  :config
  (setq doom-themes-treemacs-theme "doom-colors")
  (doom-themes-treemacs-config))

;; Languages Setup

;;JS/TS
(use-package rjsx-mode
	:ensure t
	:mode "\\.js\\'"
	)

(use-package typescript-mode
	:ensure t
	:mode "\\.ts\\'")

;; HTML/CSS/generic web stuffs
(use-package web-mode
	:ensure t
	:config
	(setq web-mode-markup-indent-offset 2)
	(setq web-mode-css-indent-offset 2)
	(setq web-mode-code-indent-offset 2)
	(add-to-list 'auto-mode-alist '("\\.tsx\\'" . web-mode))
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

;; Edit .zshrc files in sh-mode
(add-to-list 'auto-mode-alist '("\\.zshrc\\'" . sh-mode))

(use-package ruby-mode
	:ensure t)

(use-package ruby-end
	:ensure t)

;; code completion for ruby
(use-package robe
	:ensure t
	:hook (ruby-mode . robe-mode)
	:config
	(push 'company-robe company-backends))

(use-package elixir-mode
	:ensure t)

(use-package dockerfile-mode
  :ensure t)

(use-package yaml-mode
  :ensure t)

(use-package markdown-mode
  :ensure t)
;; Automatically guess tabs/spaces & how big the tab width is
(use-package dtrt-indent
	:ensure t
	:hook (prog-mode . dtrt-indent-mode))

(custom-set-variables
 ;; custom-set-variables was added by Custom.
 ;; If you edit it by hand, you could mess it up, so be careful.
 ;; Your init file should contain only one such instance.
 ;; If there is more than one, they won't work right.
 '(package-selected-packages
   (quote
    (markdown-mode yaml-mode dockerfile-mode docker-mode doom-themes treemacs-magit treemacs-icons-dired treemacs-projectile treemacs-evil treemacs dtrt-indent elixir-mode dumb-jump counsel-etags evil-collection rjsx-mode tide company counsel-projectile projectile magit spaceline-all-the-icons spaceline spaceline-config telephone-line powerline-evil powerline ivy-posframe ivy-rich all-the-icons one-themes use-package rainbow-delimiters key-chord evil))))
(custom-set-faces
 ;; custom-set-faces was added by Custom.
 ;; If you edit it by hand, you could mess it up, so be careful.
 ;; Your init file should contain only one such instance.
 ;; If there is more than one, they won't work right.
 '(default ((t (:inherit nil :stipple nil :background "#282C34" :foreground "#ABB2BF" :inverse-video nil :box nil :strike-through nil :overline nil :underline nil :slant normal :weight normal :height 120 :width normal :foundry "nil" :family "Source Code Pro")))))
