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

 gc-cons-threshold 100000000
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


<x-color><param>#56B6C2</param>(</x-color><x-color><param>#E06C75</param>use-package</x-color> <x-color><param>#98C379</param>git-gutter</x-color>

  <x-color><param>#828997</param>:ensure</x-color> t

  <x-color><param>#828997</param>:config</x-color>

  <x-color><param>#D19A66</param>(</x-color>global-git-gutter-mode t<x-color><param>#D19A66</param>)</x-color>

  <x-color><param>#D19A66</param>(</x-color>git-gutter:linum-setup<x-color><param>#D19A66</param>)</x-color>

  <x-color><param>#D19A66</param>(</x-color>set-face-background 'git-gutter:modified <x-color><param>#98C379</param>"purple"</x-color><x-color><param>#D19A66</param>)</x-color> <x-color><param>#5C6370</param>;; </x-color><x-color><param>#5C6370</param>background color
</x-color>  <x-color><param>#D19A66</param>(</x-color>set-face-foreground 'git-gutter:added <x-color><param>#98C379</param>"green"</x-color><x-color><param>#D19A66</param>)</x-color>
  <x-color><param>#D19A66</param>(</x-color>set-face-foreground 'git-gutter:deleted <x-color><param>#98C379</param>"red"</x-color><x-color><param>#D19A66</param>)</x-color><x-color><param>#56B6C2</param>)</x-color>


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

<x-color><param>#56B6C2</param>(</x-color>add-to-map <x-color><param>#98C379</param>"<<SPC> w h"</x-color> 'windmove-left<x-color><param>#56B6C2</param>)</x-color>

<x-color><param>#56B6C2</param>(</x-color>add-to-map <x-color><param>#98C379</param>"<<SPC> w j"</x-color> 'windmove-down<x-color><param>#56B6C2</param>)</x-color>

<x-color><param>#56B6C2</param>(</x-color>add-to-map <x-color><param>#98C379</param>"<<SPC> w k"</x-color> 'windmove-up<x-color><param>#56B6C2</param>)</x-color>
<x-color><param>#56B6C2</param>(</x-color>add-to-map <x-color><param>#98C379</param>"<<SPC> w l"</x-color> 'windmove-right<x-color><param>#56B6C2</param>)</x-color>


<x-color><param>#5C6370</param>;; </x-color><x-color><param>#5C6370</param>Autoformatter
</x-color><x-color><param>#56B6C2</param>(</x-color><x-color><param>#E06C75</param>use-package</x-color> <x-color><param>#98C379</param>format-all</x-color>
	<x-color><param>#828997</param>:ensure</x-color> t
	<x-color><param>#828997</param>:hook</x-color> <x-color><param>#D19A66</param>(</x-color>before-save . format-all-buffer<x-color><param>#D19A66</param>)</x-color><x-color><param>#56B6C2</param>)</x-color>


<x-color><param>#5C6370</param>;; </x-color><x-color><param>#5C6370</param>Auto closes brackets
</x-color><x-color><param>#56B6C2</param>(</x-color><x-color><param>#E06C75</param>use-package</x-color> <x-color><param>#98C379</param>autopair</x-color>
	<x-color><param>#828997</param>:ensure</x-color> t
	<x-color><param>#828997</param>:config</x-color>

	<x-color><param>#D19A66</param>(</x-color>autopair-global-mode<x-color><param>#D19A66</param>)</x-color><x-color><param>#56B6C2</param>)</x-color>

<x-color><param>#5C6370</param>;; </x-color><x-color><param>#5C6370</param>ivy, counsel
</x-color><x-color><param>#56B6C2</param>(</x-color><x-color><param>#E06C75</param>use-package</x-color> <x-color><param>#98C379</param>counsel</x-color>
	<x-color><param>#828997</param>:ensure</x-color> t
	<x-color><param>#828997</param>:config</x-color>
	<x-color><param>#D19A66</param>(</x-color>add-to-map <x-color><param>#98C379</param>"<<SPC><<SPC>"</x-color> 'counsel-ag<x-color><param>#D19A66</param>)</x-color>
	<x-color><param>#D19A66</param>(</x-color>global-set-key <x-color><param>#61AFEF</param>(</x-color>kbd <x-color><param>#98C379</param>"C-x C-f"</x-color><x-color><param>#61AFEF</param>)</x-color> 'counsel-find-file<x-color><param>#D19A66</param>)</x-color>
	<x-color><param>#D19A66</param>(</x-color>global-set-key <x-color><param>#61AFEF</param>(</x-color>kbd <x-color><param>#98C379</param>"M-x"</x-color><x-color><param>#61AFEF</param>)</x-color> 'counsel-M-x<x-color><param>#D19A66</param>)</x-color><x-color><param>#56B6C2</param>)</x-color>

<x-color><param>#5C6370</param>;; </x-color><x-color><param>#5C6370</param>(use-package counsel-etags
</x-color><x-color><param>#5C6370</param>;; </x-color><x-color><param>#5C6370</param>	:ensure t
</x-color><x-color><param>#5C6370</param>;;   </x-color><x-color><param>#5C6370</param>:init
</x-color><x-color><param>#5C6370</param>;;   </x-color><x-color><param>#5C6370</param>(add-hook 'prog-mode-hook
</x-color><x-color><param>#5C6370</param>;; </x-color><x-color><param>#5C6370</param>						(lambda ()
</x-color><x-color><param>#5C6370</param>;; </x-color><x-color><param>#5C6370</param>							(add-hook 'after-save-hook
</x-color><x-color><param>#5C6370</param>;; </x-color><x-color><param>#5C6370</param>												'counsel-etags-virtual-update-tags 'append 'local)))
</x-color><x-color><param>#5C6370</param>;;   </x-color><x-color><param>#5C6370</param>:config
</x-color><x-color><param>#5C6370</param>;;   </x-color><x-color><param>#5C6370</param>(setq counsel-etags-update-interval 60)
</x-color><x-color><param>#5C6370</param>;;   </x-color><x-color><param>#5C6370</param>(push "build" counsel-etags-ignore-directories))

</x-color><x-color><param>#56B6C2</param>(</x-color><x-color><param>#E06C75</param>use-package</x-color> <x-color><param>#98C379</param>ivy</x-color>
	<x-color><param>#828997</param>:ensure</x-color> t
	<x-color><param>#828997</param>:config</x-color>
	<x-color><param>#D19A66</param>(</x-color>ivy-mode 1<x-color><param>#D19A66</param>)</x-color>
	<x-color><param>#D19A66</param>(</x-color><x-color><param>#E06C75</param>setq</x-color> ivy-use-virtual-buffers 1<x-color><param>#D19A66</param>)</x-color>
	<x-color><param>#D19A66</param>(</x-color><x-color><param>#E06C75</param>setq</x-color> enable-recursive-minibuffers t<x-color><param>#D19A66</param>)</x-color>
	<x-color><param>#D19A66</param>(</x-color>add-to-map <x-color><param>#98C379</param>"/"</x-color> 'swiper<x-color><param>#D19A66</param>)</x-color><x-color><param>#56B6C2</param>)</x-color>


<x-color><param>#56B6C2</param>(</x-color><x-color><param>#E06C75</param>use-package</x-color> <x-color><param>#98C379</param>ivy-rich</x-color>
	<x-color><param>#828997</param>:ensure</x-color> t
	<x-color><param>#828997</param>:config</x-color>
	<x-color><param>#D19A66</param>(</x-color>ivy-rich-mode 1<x-color><param>#D19A66</param>)</x-color><x-color><param>#56B6C2</param>)</x-color>

<x-color><param>#5C6370</param>;; </x-color><x-color><param>#5C6370</param>Commenting this out b/c it's freezing - not sure if due to indexing or other issues
</x-color><x-color><param>#5C6370</param>;; </x-color><x-color><param>#5C6370</param>(use-package ivy-posframe
</x-color><x-color><param>#5C6370</param>;; </x-color><x-color><param>#5C6370</param>	:ensure t
</x-color><x-color><param>#5C6370</param>;; </x-color><x-color><param>#5C6370</param>	:config
</x-color><x-color><param>#5C6370</param>;; </x-color><x-color><param>#5C6370</param>	(setq ivy-posframe-display-functions-alist '((t . ivy-posframe-display-at-frame-center)))
</x-color><x-color><param>#5C6370</param>;; </x-color><x-color><param>#5C6370</param>	(ivy-posframe-mode 1))

</x-color><x-color><param>#5C6370</param>;; </x-color><x-color><param>#5C6370</param>Key combination
</x-color><x-color><param>#56B6C2</param>(</x-color><x-color><param>#E06C75</param>use-package</x-color> <x-color><param>#98C379</param>key-chord</x-color>
  <x-color><param>#828997</param>:ensure</x-color> t
  <x-color><param>#828997</param>:config</x-color>
  <x-color><param>#D19A66</param>(</x-color>key-chord-mode 1<x-color><param>#D19A66</param>)</x-color>
  <x-color><param>#D19A66</param>(</x-color>key-chord-define-global <x-color><param>#98C379</param>"fd"</x-color> 'evil-normal-state<x-color><param>#D19A66</param>)</x-color><x-color><param>#56B6C2</param>)</x-color>

<x-color><param>#56B6C2</param>(</x-color><x-color><param>#E06C75</param>use-package</x-color> <x-color><param>#98C379</param>spaceline-config</x-color>
	<x-color><param>#828997</param>:ensure</x-color> spaceline
	<x-color><param>#828997</param>:config</x-color>
	<x-color><param>#D19A66</param>(</x-color>spaceline-emacs-theme<x-color><param>#D19A66</param>)</x-color><x-color><param>#56B6C2</param>)</x-color>

<x-color><param>#56B6C2</param>(</x-color><x-color><param>#E06C75</param>use-package</x-color> <x-color><param>#98C379</param>spaceline-all-the-icons</x-color>
	<x-color><param>#828997</param>:ensure</x-color> t
	<x-color><param>#828997</param>:after</x-color> spaceline
	<x-color><param>#828997</param>:config</x-color>
	<x-color><param>#D19A66</param>(</x-color>spaceline-all-the-icons-theme<x-color><param>#D19A66</param>)</x-color><x-color><param>#56B6C2</param>)</x-color>

<x-color><param>#56B6C2</param>(</x-color><x-color><param>#E06C75</param>use-package</x-color> <x-color><param>#98C379</param>magit</x-color>
	<x-color><param>#828997</param>:ensure</x-color> t<x-color><param>#56B6C2</param>)</x-color>

<x-color><param>#56B6C2</param>(</x-color><x-color><param>#E06C75</param>use-package</x-color> <x-color><param>#98C379</param>projectile</x-color>
	<x-color><param>#828997</param>:ensure</x-color> t
	<x-color><param>#828997</param>:config</x-color>
	<x-color><param>#D19A66</param>(</x-color>projectile-mode +1<x-color><param>#D19A66</param>)</x-color>
	<x-color><param>#D19A66</param>(</x-color><x-color><param>#E06C75</param>setq</x-color> projectile-search-path '<x-color><param>#61AFEF</param>(</x-color><x-color><param>#98C379</param>"~/Documents/"</x-color><x-color><param>#61AFEF</param>)</x-color><x-color><param>#D19A66</param>)</x-color>
	<x-color><param>#D19A66</param>(</x-color>add-to-map <x-color><param>#98C379</param>"<<SPC> s p"</x-color> 'projectile-find-file<x-color><param>#D19A66</param>)</x-color>
	<x-color><param>#D19A66</param>(</x-color>add-to-map <x-color><param>#98C379</param>"<<SPC> p p"</x-color> 'projectile-switch-project<x-color><param>#D19A66</param>)</x-color>
	<x-color><param>#D19A66</param>(</x-color><x-color><param>#E06C75</param>setq</x-color> projectile-indexing-method 'alien<x-color><param>#D19A66</param>)</x-color><x-color><param>#56B6C2</param>)</x-color>

<x-color><param>#56B6C2</param>(</x-color><x-color><param>#E06C75</param>use-package</x-color> <x-color><param>#98C379</param>counsel-projectile</x-color>
	<x-color><param>#828997</param>:ensure</x-color> t
	<x-color><param>#828997</param>:config</x-color>
	<x-color><param>#D19A66</param>(</x-color>counsel-projectile-mode 1<x-color><param>#D19A66</param>)</x-color><x-color><param>#56B6C2</param>)</x-color>

<x-color><param>#5C6370</param>;; </x-color><x-color><param>#5C6370</param>Auto complete
</x-color><x-color><param>#56B6C2</param>(</x-color><x-color><param>#E06C75</param>use-package</x-color> <x-color><param>#98C379</param>company</x-color>
	<x-color><param>#828997</param>:ensure</x-color> t
	<x-color><param>#828997</param>:config</x-color>
	<x-color><param>#D19A66</param>(</x-color>global-company-mode t<x-color><param>#D19A66</param>)</x-color><x-color><param>#56B6C2</param>)</x-color>


<x-color><param>#56B6C2</param>(</x-color><x-color><param>#E06C75</param>use-package</x-color> <x-color><param>#98C379</param>flycheck</x-color>

  <x-color><param>#828997</param>:ensure</x-color> t

  <x-color><param>#828997</param>:init</x-color> <x-color><param>#D19A66</param>(</x-color>global-flycheck-mode<x-color><param>#D19A66</param>)</x-color><x-color><param>#56B6C2</param>)</x-color>


<x-color><param>#56B6C2</param>(</x-color><x-color><param>#E06C75</param>use-package</x-color> <x-color><param>#98C379</param>dumb-jump</x-color>
	<x-color><param>#828997</param>:ensure</x-color> t
	<x-color><param>#828997</param>:config</x-color>
	<x-color><param>#D19A66</param>(</x-color><x-color><param>#E06C75</param>setq</x-color> dumb-jump-selector 'ivy<x-color><param>#D19A66</param>)</x-color>
	<x-color><param>#D19A66</param>(</x-color><x-color><param>#E06C75</param>setq</x-color> dumb-jump-force-searcher 'ag<x-color><param>#D19A66</param>)</x-color>
	<x-color><param>#D19A66</param>(</x-color>add-to-map <x-color><param>#98C379</param>"g n"</x-color> 'dumb-jump-go<x-color><param>#D19A66</param>)</x-color>
	<x-color><param>#D19A66</param>(</x-color>add-to-map <x-color><param>#98C379</param>"g f"</x-color> 'dumb-jump-back<x-color><param>#D19A66</param>)</x-color>
	<x-color><param>#D19A66</param>(</x-color>add-to-map <x-color><param>#98C379</param>"g q"</x-color> 'dumb-jump-quick-look<x-color><param>#D19A66</param>)</x-color><x-color><param>#56B6C2</param>)</x-color>

<x-color><param>#56B6C2</param>(</x-color><x-color><param>#E06C75</param>use-package</x-color> <x-color><param>#98C379</param>treemacs</x-color>
  <x-color><param>#828997</param>:ensure</x-color> t
  <x-color><param>#828997</param>:config</x-color>
  <x-color><param>#D19A66</param>(</x-color><x-color><param>#E06C75</param>setq</x-color> treemacs-silent-filewatch t<x-color><param>#D19A66</param>)</x-color>
  <x-color><param>#D19A66</param>(</x-color><x-color><param>#E06C75</param>setq</x-color> treemacs-git-mode 'extended<x-color><param>#D19A66</param>)</x-color>
  <x-color><param>#D19A66</param>(</x-color><x-color><param>#E06C75</param>setq</x-color> treemacs-silent-refresh t<x-color><param>#D19A66</param>)</x-color><x-color><param>#56B6C2</param>)</x-color>

<x-color><param>#56B6C2</param>(</x-color><x-color><param>#E06C75</param>use-package</x-color> <x-color><param>#98C379</param>treemacs-evil</x-color>
  <x-color><param>#828997</param>:after</x-color> treemacs evil
  <x-color><param>#828997</param>:ensure</x-color> t<x-color><param>#56B6C2</param>)</x-color>

<x-color><param>#56B6C2</param>(</x-color><x-color><param>#E06C75</param>use-package</x-color> <x-color><param>#98C379</param>treemacs-projectile</x-color>
  <x-color><param>#828997</param>:after</x-color> treemacs projectile
  <x-color><param>#828997</param>:ensure</x-color> t<x-color><param>#56B6C2</param>)</x-color>

<x-color><param>#56B6C2</param>(</x-color><x-color><param>#E06C75</param>use-package</x-color> <x-color><param>#98C379</param>treemacs-icons-dired</x-color>
  <x-color><param>#828997</param>:after</x-color> treemacs dired
  <x-color><param>#828997</param>:ensure</x-color> t
  <x-color><param>#828997</param>:config</x-color> <x-color><param>#D19A66</param>(</x-color>treemacs-icons-dired-mode<x-color><param>#D19A66</param>)</x-color><x-color><param>#56B6C2</param>)</x-color>

<x-color><param>#56B6C2</param>(</x-color><x-color><param>#E06C75</param>use-package</x-color> <x-color><param>#98C379</param>treemacs-magit</x-color>
  <x-color><param>#828997</param>:after</x-color> treemacs magit
  <x-color><param>#828997</param>:ensure</x-color> t<x-color><param>#56B6C2</param>)</x-color>

<x-color><param>#56B6C2</param>(</x-color><x-color><param>#E06C75</param>use-package</x-color> <x-color><param>#98C379</param>doom-themes</x-color>
  <x-color><param>#828997</param>:after</x-color> treemacs
  <x-color><param>#828997</param>:ensure</x-color> t
  <x-color><param>#828997</param>:config</x-color>
  <x-color><param>#D19A66</param>(</x-color><x-color><param>#E06C75</param>setq</x-color> doom-themes-treemacs-theme <x-color><param>#98C379</param>"doom-colors"</x-color><x-color><param>#D19A66</param>)</x-color>
  <x-color><param>#D19A66</param>(</x-color>doom-themes-treemacs-config<x-color><param>#D19A66</param>)</x-color><x-color><param>#56B6C2</param>)</x-color>


<x-color><param>#5C6370</param>;; </x-color><x-color><param>#5C6370</param>Languages Setup

</x-color>

<x-color><param>#5C6370</param>;; </x-color><x-color><param>#5C6370</param>LSP mode

</x-color>


<x-color><param>#5C6370</param>;;</x-color><x-color><param>#5C6370</param>JS/TS
</x-color><x-color><param>#56B6C2</param>(</x-color><x-color><param>#E06C75</param>use-package</x-color> <x-color><param>#98C379</param>rjsx-mode</x-color>
	<x-color><param>#828997</param>:ensure</x-color> t
	<x-color><param>#828997</param>:mode</x-color> <x-color><param>#98C379</param>"\\.js\\'"</x-color>
	<x-color><param>#56B6C2</param>)</x-color>

<x-color><param>#56B6C2</param>(</x-color><x-color><param>#E06C75</param>use-package</x-color> <x-color><param>#98C379</param>typescript-mode</x-color>
	<x-color><param>#828997</param>:ensure</x-color> t
	<x-color><param>#828997</param>:mode</x-color> <x-color><param>#98C379</param>"\\.ts\\'"</x-color><x-color><param>#56B6C2</param>)</x-color>

<x-color><param>#5C6370</param>;; </x-color><x-color><param>#5C6370</param>HTML/CSS/generic web stuffs
</x-color><x-color><param>#56B6C2</param>(</x-color><x-color><param>#E06C75</param>use-package</x-color> <x-color><param>#98C379</param>web-mode</x-color>
	<x-color><param>#828997</param>:ensure</x-color> t
	<x-color><param>#828997</param>:config</x-color>
	<x-color><param>#D19A66</param>(</x-color><x-color><param>#E06C75</param>setq</x-color> web-mode-markup-indent-offset 2<x-color><param>#D19A66</param>)</x-color>
	<x-color><param>#D19A66</param>(</x-color><x-color><param>#E06C75</param>setq</x-color> web-mode-css-indent-offset 2<x-color><param>#D19A66</param>)</x-color>
	<x-color><param>#D19A66</param>(</x-color><x-color><param>#E06C75</param>setq</x-color> web-mode-code-indent-offset 2<x-color><param>#D19A66</param>)</x-color>
	<x-color><param>#D19A66</param>(</x-color>add-to-list 'auto-mode-alist '<x-color><param>#61AFEF</param>(</x-color><x-color><param>#98C379</param>"\\.tsx\\'"</x-color> . web-mode<x-color><param>#61AFEF</param>)</x-color><x-color><param>#D19A66</param>)</x-color>
	<x-color><param>#D19A66</param>(</x-color>add-to-list 'auto-mode-alist '<x-color><param>#61AFEF</param>(</x-color><x-color><param>#98C379</param>"\\.html?\\'"</x-color> . web-mode<x-color><param>#61AFEF</param>)</x-color><x-color><param>#D19A66</param>)</x-color>
	<x-color><param>#D19A66</param>(</x-color>add-to-list 'auto-mode-alist '<x-color><param>#61AFEF</param>(</x-color><x-color><param>#98C379</param>"\\.?css\\'"</x-color> . web-mode<x-color><param>#61AFEF</param>)</x-color><x-color><param>#D19A66</param>)</x-color>
	<x-color><param>#D19A66</param>(</x-color>add-to-list 'auto-mode-alist '<x-color><param>#61AFEF</param>(</x-color><x-color><param>#98C379</param>"\\.erb\\'"</x-color> . web-mode<x-color><param>#61AFEF</param>)</x-color><x-color><param>#D19A66</param>)</x-color><x-color><param>#56B6C2</param>)</x-color>

<x-color><param>#56B6C2</param>(</x-color><x-color><param>#E06C75</param>use-package</x-color> <x-color><param>#98C379</param>tide</x-color>
	<x-color><param>#828997</param>:ensure</x-color> t
	<x-color><param>#828997</param>:after</x-color> <x-color><param>#D19A66</param>(</x-color>typescript-mode company flycheck rjsx web-mode<x-color><param>#D19A66</param>)</x-color>
	<x-color><param>#828997</param>:hook</x-color> <x-color><param>#D19A66</param>(</x-color><x-color><param>#61AFEF</param>(</x-color>typescript-mode . tide-setup<x-color><param>#61AFEF</param>)</x-color>
				 <x-color><param>#61AFEF</param>(</x-color>rjsx-mode . tide-setup<x-color><param>#61AFEF</param>)</x-color>
				 <x-color><param>#61AFEF</param>(</x-color>web-mode . tide-setup<x-color><param>#61AFEF</param>)</x-color>
				 <x-color><param>#61AFEF</param>(</x-color>typescript-mode . tide-hl-idenitifer-mode<x-color><param>#61AFEF</param>)</x-color><x-color><param>#D19A66</param>)</x-color>
	<x-color><param>#828997</param>:config</x-color>
	<x-color><param>#D19A66</param>(</x-color><x-color><param>#E06C75</param>interactive</x-color><x-color><param>#D19A66</param>)</x-color>
	<x-color><param>#D19A66</param>(</x-color>flycheck-mode +1<x-color><param>#D19A66</param>)</x-color>
	<x-color><param>#D19A66</param>(</x-color><x-color><param>#E06C75</param>setq</x-color> flycheck-check-syntax-automatically '<x-color><param>#61AFEF</param>(</x-color>save mode-enabled<x-color><param>#61AFEF</param>)</x-color><x-color><param>#D19A66</param>)</x-color>
	<x-color><param>#D19A66</param>(</x-color>eldoc-mode +1<x-color><param>#D19A66</param>)</x-color>
	<x-color><param>#D19A66</param>(</x-color><x-color><param>#E06C75</param>setq</x-color> company-tooltip-align-annotations t<x-color><param>#D19A66</param>)</x-color><x-color><param>#56B6C2</param>)</x-color>

<x-color><param>#56B6C2</param>(</x-color><x-color><param>#E06C75</param>use-package</x-color> <x-color><param>#98C379</param>kotlin-mode</x-color>
	<x-color><param>#828997</param>:ensure</x-color> t<x-color><param>#56B6C2</param>)</x-color>

<x-color><param>#5C6370</param>;; </x-color><x-color><param>#5C6370</param>Edit .zshrc files in sh-mode
</x-color><x-color><param>#56B6C2</param>(</x-color>add-to-list 'auto-mode-alist '<x-color><param>#D19A66</param>(</x-color><x-color><param>#98C379</param>"\\.zshrc\\'"</x-color> . sh-mode<x-color><param>#D19A66</param>)</x-color><x-color><param>#56B6C2</param>)</x-color>

<x-color><param>#56B6C2</param>(</x-color><x-color><param>#E06C75</param>use-package</x-color> <x-color><param>#98C379</param>ruby-mode</x-color>
	<x-color><param>#828997</param>:ensure</x-color> t<x-color><param>#56B6C2</param>)</x-color>

<x-color><param>#56B6C2</param>(</x-color><x-color><param>#E06C75</param>use-package</x-color> <x-color><param>#98C379</param>ruby-end</x-color>
	<x-color><param>#828997</param>:ensure</x-color> t<x-color><param>#56B6C2</param>)</x-color>

<x-color><param>#5C6370</param>;; </x-color><x-color><param>#5C6370</param>code completion for ruby
</x-color><x-color><param>#56B6C2</param>(</x-color><x-color><param>#E06C75</param>use-package</x-color> <x-color><param>#98C379</param>robe</x-color>
	<x-color><param>#828997</param>:ensure</x-color> t
	<x-color><param>#828997</param>:hook</x-color> <x-color><param>#D19A66</param>(</x-color>ruby-mode . robe-mode<x-color><param>#D19A66</param>)</x-color>
	<x-color><param>#828997</param>:config</x-color>
	<x-color><param>#D19A66</param>(</x-color><x-color><param>#E06C75</param>push</x-color> 'company-robe company-backends<x-color><param>#D19A66</param>)</x-color><x-color><param>#56B6C2</param>)</x-color>

<x-color><param>#56B6C2</param>(</x-color><x-color><param>#E06C75</param>use-package</x-color> <x-color><param>#98C379</param>elixir-mode</x-color>
	<x-color><param>#828997</param>:ensure</x-color> t<x-color><param>#56B6C2</param>)</x-color>

<x-color><param>#56B6C2</param>(</x-color><x-color><param>#E06C75</param>use-package</x-color> <x-color><param>#98C379</param>dockerfile-mode</x-color>
  <x-color><param>#828997</param>:ensure</x-color> t<x-color><param>#56B6C2</param>)</x-color>

<x-color><param>#56B6C2</param>(</x-color><x-color><param>#E06C75</param>use-package</x-color> <x-color><param>#98C379</param>yaml-mode</x-color>
  <x-color><param>#828997</param>:ensure</x-color> t<x-color><param>#56B6C2</param>)</x-color>

<x-color><param>#56B6C2</param>(</x-color><x-color><param>#E06C75</param>use-package</x-color> <x-color><param>#98C379</param>markdown-mode</x-color>
  <x-color><param>#828997</param>:ensure</x-color> t<x-color><param>#56B6C2</param>)</x-color>


<x-color><param>#56B6C2</param>(</x-color><x-color><param>#E06C75</param>use-package</x-color> <x-color><param>#98C379</param>handlebars-mode</x-color>

  <x-color><param>#828997</param>:ensure</x-color> t<x-color><param>#56B6C2</param>)</x-color>


<x-color><param>#56B6C2</param>(</x-color><x-color><param>#E06C75</param>use-package</x-color> <x-color><param>#98C379</param>lsp-mode</x-color>

  <x-color><param>#828997</param>:hook</x-color><x-color><param>#D19A66</param>(</x-color>

        <x-color><param>#61AFEF</param>(</x-color>rjsx-mode . lsp-deferred<x-color><param>#61AFEF</param>)</x-color>

        <x-color><param>#61AFEF</param>(</x-color>typescript-mode . lsp-deferred<x-color><param>#61AFEF</param>)</x-color>

        <x-color><param>#61AFEF</param>(</x-color>web-mode . lsp-deferred<x-color><param>#61AFEF</param>)</x-color>

        <x-color><param>#61AFEF</param>(</x-color>ruby-mode . lsp-deferred<x-color><param>#61AFEF</param>)</x-color>

        <x-color><param>#D19A66</param>)</x-color>

  <x-color><param>#828997</param>:commands</x-color> <x-color><param>#D19A66</param>(</x-color>lsp lsp-deferred<x-color><param>#D19A66</param>)</x-color><x-color><param>#56B6C2</param>)</x-color>


<x-color><param>#56B6C2</param>(</x-color><x-color><param>#E06C75</param>use-package</x-color> <x-color><param>#98C379</param>lsp-ui</x-color> <x-color><param>#828997</param>:commands</x-color> lsp-ui-mode<x-color><param>#56B6C2</param>)</x-color>

<x-color><param>#56B6C2</param>(</x-color><x-color><param>#E06C75</param>use-package</x-color> <x-color><param>#98C379</param>lsp-ivy</x-color> <x-color><param>#828997</param>:commands</x-color> lsp-ivy-workspace-symbol<x-color><param>#56B6C2</param>)</x-color>


<x-color><param>#5C6370</param>;; </x-color><x-color><param>#5C6370</param>Automatically guess tabs/spaces & how big the tab width is
</x-color><x-color><param>#56B6C2</param>(</x-color><x-color><param>#E06C75</param>use-package</x-color> <x-color><param>#98C379</param>dtrt-indent</x-color>
	<x-color><param>#828997</param>:ensure</x-color> t
	<x-color><param>#828997</param>:hook</x-color> <x-color><param>#D19A66</param>(</x-color>prog-mode . dtrt-indent-mode<x-color><param>#D19A66</param>)</x-color><x-color><param>#56B6C2</param>)</x-color>

<x-color><param>#56B6C2</param>(</x-color>custom-set-variables
 <x-color><param>#5C6370</param>;; </x-color><x-color><param>#5C6370</param>custom-set-variables was added by Custom.
</x-color> <x-color><param>#5C6370</param>;; </x-color><x-color><param>#5C6370</param>If you edit it by hand, you could mess it up, so be careful.
</x-color> <x-color><param>#5C6370</param>;; </x-color><x-color><param>#5C6370</param>Your init file should contain only one such instance.
</x-color> <x-color><param>#5C6370</param>;; </x-color><x-color><param>#5C6370</param>If there is more than one, they won't work right.
</x-color> '<x-color><param>#D19A66</param>(</x-color>package-selected-packages

   '<x-color><param>#61AFEF</param>(</x-color>git-gutter markdown-mode yaml-mode dockerfile-mode docker-mode doom-themes treemacs-magit treemacs-icons-dired treemacs-projectile treemacs-evil treemacs dtrt-indent elixir-mode dumb-jump counsel-etags evil-collection rjsx-mode tide company counsel-projectile projectile magit spaceline-all-the-icons spaceline spaceline-config telephone-line powerline-evil powerline ivy-posframe ivy-rich all-the-icons one-themes use-package rainbow-delimiters key-chord evil<x-color><param>#61AFEF</param>)</x-color><x-color><param>#D19A66</param>)</x-color><x-color><param>#56B6C2</param>)</x-color>
<x-color><param>#56B6C2</param>(</x-color>custom-set-faces
 <x-color><param>#5C6370</param>;; </x-color><x-color><param>#5C6370</param>custom-set-faces was added by Custom.
</x-color> <x-color><param>#5C6370</param>;; </x-color><x-color><param>#5C6370</param>If you edit it by hand, you could mess it up, so be careful.
</x-color> <x-color><param>#5C6370</param>;; </x-color><x-color><param>#5C6370</param>Your init file should contain only one such instance.
</x-color> <x-color><param>#5C6370</param>;; </x-color><x-color><param>#5C6370</param>If there is more than one, they won't work right.
</x-color> '<x-color><param>#D19A66</param>(</x-color>default <x-color><param>#61AFEF</param>(</x-color><x-color><param>#C678DD</param>(</x-color>t <x-color><param>#98C379</param>(</x-color><x-color><param>#828997</param>:inherit</x-color> nil <x-color><param>#828997</param>:stipple</x-color> nil <x-color><param>#828997</param>:background</x-color> <x-color><param>#98C379</param>"#282C34"</x-color> <x-color><param>#828997</param>:foreground</x-color> <x-color><param>#98C379</param>"#ABB2BF"</x-color> <x-color><param>#828997</param>:inverse-video</x-color> nil <x-color><param>#828997</param>:box</x-color> nil <x-color><param>#828997</param>:strike-through</x-color> nil <x-color><param>#828997</param>:overline</x-color> nil <x-color><param>#828997</param>:underline</x-color> nil <x-color><param>#828997</param>:slant</x-color> normal <x-color><param>#828997</param>:weight</x-color> normal <x-color><param>#828997</param>:height</x-color> 120 <x-color><param>#828997</param>:width</x-color> normal <x-color><param>#828997</param>:foundry</x-color> <x-color><param>#98C379</param>"nil"</x-color> <x-color><param>#828997</param>:family</x-color> <x-color><param>#98C379</param>"Source Code Pro"</x-color><x-color><param>#98C379</param>)</x-color><x-color><param>#C678DD</param>)</x-color><x-color><param>#61AFEF</param>)</x-color><x-color><param>#D19A66</param>)</x-color><x-color><param>#56B6C2</param>)</x-color>
