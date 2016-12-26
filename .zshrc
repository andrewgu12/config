# tmux
if [ "$TMUX" = "" ]; then tmux; fi
#
# # zsh themes
export ZSH=$HOME/.oh-my-zsh
ZSH_THEME="agnoster"
source $ZSH/oh-my-zsh.sh

# rbenv
if which rbenv > /dev/null; then eval "$(rbenv init -)"; fi

# cowsay
fortune | cowsay

# nvm
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
source $(brew --prefix nvm)/nvm.sh

# root
# pushd $(brew --prefix root) >/dev/null; . libexec/thisroot.sh; popd >/dev/null


# aliases
alias mongodb_start="mongod --dbpath ~/data/db &"
alias naica="cd ~/Documents/NAICA"
alias school="cd ~/Documents/school/college/junior"
alias grace="ssh mgu123@grace.umd.edu"
alias work="cd ~/Documents/school/college/radiation_facilities"
alias csa="cd ~/Documents/CSA"
# alias source_root="cd /Applications/root_v6.06.08 && source bin/thisroot.sh"

# OPAM configuration
# eval `opam config env`
