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
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh" # This loads nvm

# aliases
alias mongodb_start="mongod --dbpath ~/data/db &"
alias naica="cd ~/Documents/NAICA"
alias school="cd ~/Documents/school/senior"
alias research="cd ~/Documents/school/research"
alias textbooks="cd ~/Documents/school/textbooks"
alias grace="ssh mgu123@grace7.umd.edu"
alias glue="ssh mgu123@glue.umd.edu"
alias jetson="ssh -X nvidia@172.16.61.48"
alias csa="cd ~/Documents/CSA"
alias projects="cd ~/Documents/projects"

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
prompt spaceship
