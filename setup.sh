# Setup Emacs
ln -s .emacs.d ../.emacs.d
ln -s .emacs ../.emacs

# Setup .zshrc
ln -s .zshrc ../.zshrc

# Setup VSCode
mv .vscode/*.json ~/Library/Application\ Support/Code/User
ln -s .vscode ../.vscode

# Setup Vim
ln -s .vim/.vimrc ../.vimrc
ln -s .vim/ ../.vim