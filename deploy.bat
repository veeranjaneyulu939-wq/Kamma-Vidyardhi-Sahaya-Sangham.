call npm run build
cd dist
git init
git config user.email "bot@example.com"
git config user.name "bot"
git add .
git commit -m "Manual Deploy"
git push -f https://github.com/veeranjaneyulu939-wq/Kamma-Vidyardhi-Sahaya-Sangham..git master:gh-pages
