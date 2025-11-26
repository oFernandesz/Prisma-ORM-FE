# 🧪 Guia de Testes - Módulo Público do Delivery

## Como Testar a Implementação

### 1️⃣ Preparação
```bash
# Instalar dependências (se necessário)
npm install

# Executar migrations do Prisma
npx prisma migrate dev

# Iniciar servidor de desenvolvimento
npm run dev
```

### 2️⃣ Criar Dados de Teste

#### A. Criar Categorias
Via API (POST):
```bash
curl -X POST http://localhost:3000/api/categorias \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Lanches",
    "slug": "lanches",
    "cor": "#FF6B6B",
    "foto": "https://via.placeholder.com/100?text=Lanches"
  }'
```

#### B. Criar Produtos
```bash
curl -X POST http://localhost:3000/api/produtos \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Hambúrguer Deluxe",
    "descricao": "Hambúrguer com queijo, bacon e vegetais",
    "preco": 25.90,
    "foto": "https://via.placeholder.com/200?text=Hamburger",
    "categoriaId": "[ID_DA_CATEGORIA]"
  }'
```

#### C. Criar Banner
Via Painel Admin:
1. Acesse: `http://localhost:3000/painel/banners`
2. Clique em "Novo Banner"
3. Preencha os dados:
   - Título: "Promoção de Lanches"
   - Descrição: "50% de desconto"
   - URL da Imagem: `https://via.placeholder.com/800x300?text=Banner`
   - Ordem: 0

### 3️⃣ Testar Fluxo Completo

#### ✅ Teste 1: Navegação
```
1. Abrir: http://localhost:3000/
2. Verificar:
   - ✓ Banner carregado no topo
   - ✓ Categorias exibidas
   - ✓ Cores dinâmicas das categorias
```

#### ✅ Teste 2: Página de Categoria
```
1. Clicar em uma categoria
2. Verificar:
   - ✓ URL mudou para /categoria/[slug]
   - ✓ Produtos da categoria listados
   - ✓ Foto, nome, descrição e preço visíveis
```

#### ✅ Teste 3: Detalhes do Produto
```
1. Clicar em um produto
2. Verificar:
   - ✓ URL mudou para /produto/[id]
   - ✓ Foto grande exibida
   - ✓ Nome, descrição completa e preço visíveis
   - ✓ Seletor de quantidade funciona
   - ✓ Botão "Adicionar ao Carrinho" ativo
```

#### ✅ Teste 4: Carrinho - Adicionar
```
1. Produto aberto
2. Mudar quantidade para 2
3. Clicar "Adicionar ao Carrinho"
4. Verificar:
   - ✓ Badge de carrinho no header atualizado (2)
   - ✓ Toast de sucesso aparece
   - ✓ Reload da página - carrinho persiste
```

#### ✅ Teste 5: Carrinho - Gerenciar
```
1. Abrir carrinho: http://localhost:3000/carrinho
2. Verificar:
   - ✓ Todos os produtos listados
   - ✓ Quantidade correta para cada
   - ✓ Botões + e - funcionam
   - ✓ Remover item funciona
   - ✓ Total calculado corretamente
```

#### ✅ Teste 6: Checkout - Validação
```
1. No carrinho, clicar "Finalizar Compra"
2. Não preencher campos
3. Clicar "Finalizar Pedido"
4. Verificar:
   - ✓ Mensagens de erro aparecem
   - ✓ Toast de erro exibido
   - ✓ Campos com erro destacados (vermelho)
```

#### ✅ Teste 7: Checkout - Sucesso
```
1. Preencher dados válidos:
   - Nome: "João Silva"
   - Email: "joao@email.com"
   - Telefone: "11988887777"
   - Endereço: "Rua das Flores, 123"
2. Clicar "Finalizar Pedido"
3. Verificar:
   - ✓ Toast de sucesso
   - ✓ Redirecionamento para /pedido/[id]
   - ✓ Carrinho limpo
```

#### ✅ Teste 8: Confirmação do Pedido
```
1. Página de confirmação carregada
2. Verificar:
   - ✓ Número do pedido exibido
   - ✓ Dados de entrega corretos
   - ✓ Produtos listados com quantidades
   - ✓ Total correto
   - ✓ Botão "Continuar Comprando" funciona
```

#### ✅ Teste 9: Persistência
```
1. Carrinho com itens
2. Recarregar página (F5)
3. Verificar:
   - ✓ Itens do carrinho ainda lá
   - ✓ Quantidades preservadas
   - ✓ Total intacto
```

#### ✅ Teste 10: Painel Admin
```
1. Abrir: http://localhost:3000/painel/banners
2. Verificar:
   - ✓ Banners listados em tabela
   - ✓ Botão "Novo Banner" funciona
   - ✓ Editar (ícone de lápis) funciona
   - ✓ Deletar (ícone de lixeira) com confirmação
   - ✓ Imagens dos banners exibidas
```

### 4️⃣ Casos de Erro (Teste de Robustez)

#### Teste de Validação
```
1. Email inválido: "emailinvalido"
   → Deve mostrar erro
   
2. Telefone curto: "1234567"
   → Deve mostrar erro
   
3. Nome vazio:
   → Deve mostrar erro
```

#### Teste de Produto Inexistente
```
1. URL: http://localhost:3000/produto/id-inexistente
2. Verificar:
   - ✓ Mensagem "Produto não encontrado"
   - ✓ Botão para voltar à home
```

#### Teste de Categoria Vazia
```
1. Criar categoria sem produtos
2. Acessar: http://localhost:3000/categoria/vazia
3. Verificar:
   - ✓ Mensagem "Nenhum produto disponível"
   - ✓ Botão para voltar funciona
```

### 5️⃣ Testes de Responsividade

#### Desktop (1920px)
```
✓ Header visível completo
✓ Sidebar com categorias expandida
✓ Grid de 4 colunas para produtos
```

#### Tablet (768px)
```
✓ Header com menu mobile
✓ Grid de 2 colunas para produtos
✓ Carrinho responsivo
```

#### Mobile (375px)
```
✓ Menu hamburger funciona
✓ Grid de 1 coluna para produtos
✓ Botões acessíveis (tamanho)
✓ Checkout legível
```

### 6️⃣ Testes de Performance

#### Carregamento
```
1. Home deve carregar em < 2 segundos
2. Categoria em < 1 segundo
3. Produto em < 1 segundo
```

#### Persistência
```
✓ localStorage não deve exceder 5MB
✓ Carrinho com 100 itens deve funcionar
```

### 7️⃣ Testes no Console

#### localStorage
```javascript
// Verificar carrinho
console.log(JSON.parse(localStorage.getItem('delivery_cart')))

// Simular carrinho
localStorage.setItem('delivery_cart', JSON.stringify([
  { produtoId: '1', nome: 'Produto', preco: 10, quantidade: 2 }
]))
```

### 8️⃣ Testes de API

#### GET Banners
```bash
curl http://localhost:3000/api/banners
```

#### GET Categorias
```bash
curl http://localhost:3000/api/categorias
```

#### GET Produtos
```bash
curl http://localhost:3000/api/produtos
curl http://localhost:3000/api/produtos?categoria=lanches
```

#### GET Pedidos
```bash
curl http://localhost:3000/api/pedidos?email=joao@email.com
```

---

## 📊 Checklist de Testes Completos

- [ ] Página home carrega banner e categorias
- [ ] Categoria exibe produtos corretamente
- [ ] Detalhes do produto funciona
- [ ] Adicionar ao carrinho persiste
- [ ] Carrinho atualiza corretamente
- [ ] Checkout valida dados
- [ ] Pedido é criado no banco
- [ ] Confirmação exibe dados corretos
- [ ] Painel admin CRUD completo
- [ ] Responsividade em todas as resoluções
- [ ] Validações funcionam
- [ ] localStorage persiste dados

---

## 🐛 Troubleshooting

### Carrinho não persiste
```
Solução: Verificar se localStorage está habilitado no navegador
```

### Banner não carrega
```
Solução: Verificar se URL da imagem é válida
```

### Pedido não salva
```
Solução: Verificar erro no console (F12 > Network)
```

### Prisma erro de migração
```
Solução: npx prisma migrate reset --force
```

---

✅ **Todos os testes passando = Implementação Concluída!**
