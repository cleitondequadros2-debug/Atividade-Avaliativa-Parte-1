# 1. Cria um novo repositório Git limpo nesta pasta
git init

# 2. Conecta a pasta local ao link do seu repositório do GitHub
git remote add origin https://github.com

# 3. Define a ramificação principal como 'main'
git branch -M main

# 4. Adiciona todos os arquivos (o index.js, package.json e as pastas)
git add .

# 5. Salva as alterações com uma mensagem de envio
git commit -m "Envio completo dos arquivos da atividade"

# 6. Sobe tudo definitivamente para o GitHub
git push -u origin main --force

