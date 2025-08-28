import express from 'express';

const app = express();
app.use(express.json());

let ultimoId = 1;
const usuario_admin = {
    id: ultimoId,
    nome: "admin",
    email: "admin@admin",
};

let usuarios = [usuario_admin];

// JÁ EXISTE - GET todos usuários
app.get('/usuarios', (req, res) => {
    res.json(usuarios).status(200);
});

// JÁ EXISTE - POST criar usuário
app.post('/usuarios', (req, res) => {
    const { nome, email } = req.body;
    
    if (!nome || !email) {
        return res.status(400).json({ erro: "Nome e email são obrigatórios" });
    }

    const emailExiste = usuarios.find(usuario => usuario.email === email);
    if (emailExiste) {
        return res.status(400).json({ erro: "Email já cadastrado" });
    }

    ultimoId++;
    const novoUsuario = {
        id: ultimoId,
        nome,
        email
    };

    usuarios.push(novoUsuario);
    return res.status(201).json(novoUsuario);
});

// DELETE - Deletar usuário
app.delete('/usuarios/:id', (req, res) => {
    const id = parseInt(req.params.id);
    
    const index = usuarios.findIndex(usuario => usuario.id === id);
    
    if (index === -1) {
        return res.status(404).json({ erro: "Usuário não encontrado" });
    }
    
    usuarios.splice(index, 1);
    return res.status(200).json({ mensagem: "Usuário deletado com sucesso" });
});

// PUT - Atualizar usuário
app.put('/usuarios/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const { nome, email } = req.body;
    
    if (!nome || !email) {
        return res.status(400).json({ erro: "Nome e email são obrigatórios" });
    }
    
    const usuario = usuarios.find(u => u.id === id);
    
    if (!usuario) {
        return res.status(404).json({ erro: "Usuário não encontrado" });
    }
    
    // Verificar se email já existe (em outro usuário)
    const emailExiste = usuarios.find(u => u.email === email && u.id !== id);
    if (emailExiste) {
        return res.status(400).json({ erro: "Email já está em uso" });
    }
    
    // Atualizar dados
    usuario.nome = nome;
    usuario.email = email;
    
    return res.status(200).json(usuario);
});

// GET - Buscar usuário por ID
app.get('/usuarios/:id', (req, res) => {
    const id = parseInt(req.params.id);
    
    const usuario = usuarios.find(u => u.id === id);
    
    if (!usuario) {
        return res.status(404).json({ erro: "Usuário não encontrado" });
    }
    
    return res.status(200).json(usuario);
});

app.listen(3000, () => {
    console.log('🚀 Servidor rodando na porta 3000');
});