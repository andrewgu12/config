#tmux
if [ "$TMUX" = "" ]; then tmux; fi
clear # clear tmux warning message

#
# # zsh themes
export ZSH=$HOME/.oh-my-zsh
ZSH_THEME="spaceship"
DEFAULT_USER=`whoami`
source $ZSH/oh-my-zsh.sh

# rbenv
if which rbenv > /dev/null; then eval "$(rbenv init -)"; fi

# nvm
# export NVM_DIR="$HOME/.nvm"
# [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh" # This loads nvm

# aliases
alias mongodb_start="mongod --dbpath ~/data/db &"
alias naica="cd ~/Documents/NAICA"
alias school="cd ~/Documents/school/senior"
alias research="cd ~/Documents/school/research"
alias textbooks="cd ~/Documents/school/textbooks"
alias grace="ssh mgu123@grace7.umd.edu"
alias glue="ssh mgu123@glue.umd.edu"
# alias 459b1="ssh -Y mgu123@enee459b-1.ece.umd.edu"
# alias 459b2="ssh -Y mgu123@enee459b-2.ece.umd.edu"
# alias 459b3="ssh -Y mgu123@enee459b-3.ece.umd.edu"
# alias 459b4="ssh -Y mgu123@enee459b-4.ece.umd.edu"
#alias code="code-insiders"
alias csa="cd ~/Documents/CSA"
# alias junkfood="ssh mgu123@junkfood.cs.umd.edu"
alias projects="cd ~/Documents/projects"

# OPAM configuration
# alias opam_start="eval `opam config env`"


source "/Users/mingbo/.oh-my-zsh/custom/themes/spaceship.zsh-theme"
PATH=/Users/mingbo/.Pokemon-Terminal:$PATH

# pokemon
pokemon dialga
clear

# cowsay
fortune | cowsay
