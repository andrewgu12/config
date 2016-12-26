;MELPA
(require 'package) ;; You might already have this line
(add-to-list 'package-archives
             '("melpa" . "https://melpa.org/packages/"))
(when (< emacs-major-version 24)
  ;; For important compatibility libraries like cl-lib
  (add-to-list 'package-archives '("gnu" . "http://elpa.gnu.org/packages/")))
(package-initialize) ;; You might already have this line

;;Line numbering
(add-hook 'linum-before-numbering-hook
        (lambda ()
          (setq-local linum-format-fmt
              (let ((w (length (number-to-string
                        (count-lines (point-min) (point-max))))))
                (concat " %" (number-to-string w) "d ")))))

 ;; User initialization goes here
  ;;where to store backup files
  (setq
   backup-by-copying t
   backup-directory-alist '(("." . "~/.emacs-backups")))

(ac-config-default)
;; tuareg
(load "/Users/mingbo/.opam/system/share/emacs/site-lisp/tuareg-site-file")

;;
(setq gdb-many-windows t)
  ;;Mark return key to be a new line and autoindent
(global-set-key (kbd "RET") 'newline-and-indent)

;;Autopair
(require 'autopair)
(autopair-global-mode) ;; enable autopair in all buffers

;;Line numbering
(defun linum-format-func (line)
  (concat
   (propertize (format linum-format-fmt line) 'face 'linum)))

(setq linum-format 'linum-format-func)

;; ASM Mode Comments
(add-hook 'asm-mode-set-comment-hook
'(lambda ()
(setq asm-comment-char ?#)))

;;enable line numbering in most modes
(setq linum-disabled-modes-list
  '(shell-mode
    term-mode
    shell-mode
    speedbar-mode
    compilation-mode
    dired-mode))
(add-hook 'after-change-major-mode-hook
    '(lambda ()
       (if
           (or
                (minibufferp) ; We don't want line numbers in the minibuffer
                (member major-mode linum-disabled-modes-list))
           (progn
             (linum-mode -1)
             (setq left-margin-width 1)) ; Add a small margin if there is no
                                         ; line numbering
           (linum-mode t))))

;;Projectile Configuration
(setq projectile-require-project-root nil)
(global-set-key (kbd "s-p") 'projectile-find-file)

;;Font
(set-default-font "Source Code Pro Medium 11")

;;Default tab width
(setq-default indent-tabs-mode nil)
(setq-default tab-width 4)
(setq indent-line-function 'insert-tab)

(setq-default c-basic-offset 4)
;;Associate .js.erb files with javascript-mode
(add-to-list 'auto-mode-alist '("\\.js.erb\\'" . javascript-mode))


(add-to-list 'auto-mode-alist '("\\.pl\\'" . prolog-mode))

;;load theme
(load-theme 'material t)

;;Org mode recognize txt
(add-to-list 'auto-mode-alist '("\\.txt\\'" . org-mode))

;;ruby-end
(require 'ruby-end)

;;direx
(require 'direx)

;;web-mode
 (require 'web-mode)
  (add-to-list 'auto-mode-alist '("\\.html?\\'" . web-mode))

;;helmgrap
(add-to-list 'load-path "~/.emacs.d/elpa/helm-core-20150828.2325/helm.el")
(require 'helm)
(require 'helm-config)
(helm-autoresize-mode t)


;;Assembly
(setq auto-mode-alist (cons '("\\.ys" . asm-mode) auto-mode-alist))

 
(require 'toml-mode)

;;Haskell Mode
(add-hook 'haskell-mode-hook 'haskell-indentation-mode)

;;Whitespace max 80 characters
;; (require 'whitespace)
;; (setq whitespace-line-column 80)
;; (setq whitespace-style '(face lines-tail))

;; (add-hook 'prog-mode-hook 'whitespace-mode)

(global-set-key (kbd "s-x") 'helm-M-x)
(global-set-key (kbd "M-y") 'helm-show-kill-ring)
(global-set-key (kbd "C-x b") 'helm-mini)
(global-set-key (kbd "C-x C-f") 'helm-find-files)
(custom-set-variables
 ;; custom-set-variables was added by Custom.
 ;; If you edit it by hand, you could mess it up, so be careful.
 ;; Your init file should contain only one such instance.
 ;; If there is more than one, they won't work right.
 '(custom-safe-themes
   (quote
    ("72a81c54c97b9e5efcc3ea214382615649ebb539cb4f2fe3a46cd12af72c7607" "1e3b2c9e7e84bb886739604eae91a9afbdfb2e269936ec5dd4a9d3b7a943af7f" "5dc0ae2d193460de979a463b907b4b2c6d2c9c4657b2e9e66b8898d2592e3de5" "98cc377af705c0f2133bb6d340bf0becd08944a588804ee655809da5d8140de6" "0c311fb22e6197daba9123f43da98f273d2bfaeeaeb653007ad1ee77f0003037" "b34636117b62837b3c0c149260dfebe12c5dad3d1177a758bb41c4b15259ed7e" "a2e7b508533d46b701ad3b055e7c708323fb110b6676a8be458a758dd8f24e27" "0c29db826418061b40564e3351194a3d4a125d182c6ee5178c237a7364f0ff12" "9b59e147dbbde5e638ea1cde5ec0a358d5f269d27bd2b893a0947c4a867e14c1" "e97dbbb2b1c42b8588e16523824bc0cb3a21b91eefd6502879cf5baa1fa32e10" "e0d42a58c84161a0744ceab595370cbe290949968ab62273aed6212df0ea94b4" "959a77d21e6f15c5c63d360da73281fdc40db3e9f94e310fc1e8213f665d0278" "a1289424bbc0e9f9877aa2c9a03c7dfd2835ea51d8781a0bf9e2415101f70a7e" "d8f76414f8f2dcb045a37eb155bfaa2e1d17b6573ed43fb1d18b936febc7bbc2" "38ba6a938d67a452aeb1dada9d7cdeca4d9f18114e9fc8ed2b972573138d4664" "705f3f6154b4e8fac069849507fd8b660ece013b64a0a31846624ca18d6cf5e1" "96998f6f11ef9f551b427b8853d947a7857ea5a578c75aa9c4e7c73fe04d10b4" "b3775ba758e7d31f3bb849e7c9e48ff60929a792961a2d536edec8f68c671ca5" "46fd293ff6e2f6b74a5edf1063c32f2a758ec24a5f63d13b07a20255c074d399" "e9776d12e4ccb722a2a732c6e80423331bcb93f02e089ba2a4b02e85de1cf00e" "58c6711a3b568437bab07a30385d34aacf64156cc5137ea20e799984f4227265" "f77b66fa762568d66fc00a5e2013aae76d78f0142669c55b7eb3c8e5d4d41e7d" "7bde52fdac7ac54d00f3d4c559f2f7aa899311655e7eb20ec5491f3b5c533fe8" default)))
 '(inhibit-startup-screen t)
 '(menu-bar-mode nil)
 '(package-selected-packages
   (quote
    (web-mode toml-mode sublime-themes subatomic-theme spacegray-theme seq scss-mode s ruby-end projectile noctilux-theme multi monokai-theme material-theme markdown-mode let-alist helm haskell-mode flatland-theme dracula-theme direx deferred coffee-mode caml autopair auto-complete atom-one-dark-theme atom-dark-theme 2048-game)))
 '(tool-bar-mode nil)
 '(tool-bar-position (quote top))
 '(tooltip-mode t))
(custom-set-faces
 ;; custom-set-faces was added by Custom.
 ;; If you edit it by hand, you could mess it up, so be careful.
 ;; Your init file should contain only one such instance.
 ;; If there is more than one, they won't work right.
 )
