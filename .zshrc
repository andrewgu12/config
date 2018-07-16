#tmux
if [ "$TMUX" = "" ]; then tmux; fi
clear # clear tmux warning message

# zsh themes
export ZSH=$HOME/.oh-my-zsh
# ZSH_THEME="spaceship"
DEFAULT_USER=`whoami`
source $ZSH/oh-my-zsh.sh

# rbenv
if which rbenv > /dev/null; then eval "$(rbenv init -)"; fi

# nvm
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion
alias cd='cdnvm(){ cd $@; if [[ -f .nvmrc && -s .nvmrc && -r .nvmrc ]]; then <.nvmrc nvm install; elif [[ $(nvm current) != $(nvm version default) ]]; then nvm use default; fi; };cdnvm' # Checks for .nvmrc file and changes to that version

# aliases
alias mongodb_start="mongod --dbpath ~/data/db &"
alias school="cd ~/Documents/school/senior"
alias projects="cd ~/Documents/projects"

# colorls
source $(dirname $(gem which colorls))/tab_complete.sh
alias lc="colorls -lA --sd"
alias lt="colorls --tree"
# OPAM configuration
# alias opam_start="eval `opam config env`"


# source "/Users/mingbo/.oh-my-zsh/custom/themes/spaceship.zsh-theme"
# PATH=/Users/mingbo/.Pokemon-Terminal:$PATH

# pokemon
# pokemon dialga
# clear

# cowsay
fortune | cowsay
# [ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion

# Set Spaceship ZSH as a prompt
autoload -U promptinit; promptinit
SPACESHIP_DIR_TRUNC_REPO=false
prompt spaceship
