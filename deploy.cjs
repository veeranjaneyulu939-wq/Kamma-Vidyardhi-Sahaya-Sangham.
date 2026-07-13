const { execSync } = require('child_process');
const path = require('path');

try {
  console.log("Building...");
  execSync('npm run build', {stdio: 'inherit'});
  
  console.log("Git init in dist...");
  const distPath = path.join(__dirname, 'dist');
  
  execSync('git init', {cwd: distPath, stdio: 'inherit'});
  execSync('git config user.name "bot"', {cwd: distPath, stdio: 'inherit'});
  execSync('git config user.email "bot@example.com"', {cwd: distPath, stdio: 'inherit'});
  execSync('git add .', {cwd: distPath, stdio: 'inherit'});
  execSync('git commit -m "Deploy to gh-pages"', {cwd: distPath, stdio: 'inherit'});
  
  console.log("Pushing...");
  execSync('git push -f https://github.com/veeranjaneyulu939-wq/Kamma-Vidyardhi-Sahaya-Sangham..git master:gh-pages', {cwd: distPath, stdio: 'inherit'});
  
  console.log("Deployed successfully!");
} catch (e) {
  console.error("Error:", e);
}
