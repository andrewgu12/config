# tmux
if [ "$TMUX" = "" ]; then tmux; fi
#
# # zsh themes
export ZSH=$HOME/.oh-my-zsh
ZSH_THEME="agnoster"
DEFAULT_USER=`whoami`
source $ZSH/oh-my-zsh.sh

# rbenv
if which rbenv > /dev/null; then eval "$(rbenv init -)"; fi

# cowsay
fortune | cowsay

# nvm
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh" # This loads nvm

# aliases
alias mongodb_start="mongod --dbpath ~/data/db &"
alias naica="cd ~/Documents/NAICA"
alias school="cd ~/Documents/school/junior"
alias grace="ssh mgu123@grace.umd.edu"
alias work="cd ~/Documents/school/max_research"
alias csa="cd ~/Documents/CSA"


# OPAM configuration
alias opam_start="eval `opam config env`"
