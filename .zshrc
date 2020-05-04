#tmux
if [ "$TMUX" = "" ]; then tmux; fi
clear # clear tmux warning message

# zsh themes
export ZSH=$HOME/.oh-my-zsh
# ZSH_THEME="spaceship"
DEFAULT_USER=`whoami`
source $ZSH/oh-my-zsh.sh

# rbenv
#if which rbenv > /dev/null; then eval "$(rbenv init -)"; fi

# nvm
export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" # This loads nvm

# aliases
alias school="cd ~/Documents/school/senior"
alias projects="cd ~/Documents/projects"
alias ys="yarn start | pino-pretty"

# nice little cow thing
fortune | cowsay

# Set Spaceship ZSH as a prompt
autoload -U promptinit; promptinit
SPACESHIP_DIR_TRUNC_REPO=false
prompt spaceship

# Emacs DOOM
#export PATH="$HOME/.emacs.d/bin:$PATH"

# opam configuration
#test -r /Users/andrewgu/.opam/opam-init/init.zsh && . /Users/andrewgu/.opam/opam-init/init.zsh > /dev/null 2> /dev/null || true
#[ -s "$NVM_DIR/bash_completion" ] && . "$NVM_DIR/bash_completion"  # This loads nvm bash_completion
