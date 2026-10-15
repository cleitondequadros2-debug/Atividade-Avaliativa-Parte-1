import express from "express";
const app = express();
app.use(express.json());

// Nome dos pets e dados
const pets = [
  {
    idPet: 1,
    dsNome: "Toby",
    dsEspecie: "cachorro",
    nuIdade: 4,
    fgAdotado: false,
  },
  {
    idPet: 2,
    dsNome: "Lola",
    dsEspecie: "raposa",
    nuIdade: 2,
    fgAdotado: true,
  },
  {
    idPet: 3,
    dsNome: "Loro",
    dsEspecie: "papagaio",
    nuIdade: 15,
    fgAdotado: false,
  },
];
// Controlador do ultimo id
let ultimoId = 3;

// Função pega todos os pets
function buscarTodos() {
  return pets;
}
// Função busca um pet pelo id
function buscarPorId(idPet) {
  return pets.find((pet) => pet.idPet === idPet);
}
// Função cria um novo pet
function criarPet(dados) {
  const novoPet = {
    idPet: ++ultimoId,
    dsNome: dados.dsNome.trim(),
    dsEspecie: dados.dsEspecie.trim(),
    nuIdade: dados.nuIdade,
    fgAdotado: false,
  };

  pets.push(novoPet);
  return novoPet;
}
// Função para atualizar pet
function atualizarPet(pet, alteracoes) {
  Object.assign(pet, alteracoes);
  return pet;
}
// Função para deletar pet
function deletarPet(idPet) {
  const indice = pets.findIndex((pet) => pet.idPet === idPet);

  if (indice === -1) {
    return false;
  }

  pets.splice(indice, 1);
  return true;
}

// get lista dos pets
app.get("/pets", (req, res) => {
  return res.status(200).json(buscarTodos());
});

// get /pets/:id — busca um pet pelo id
app.get("/pets/:id", (req, res) => {
  const idPet = Number(req.params.id);

  if (!Number.isInteger(idPet) || idPet <= 0) {
    return res.status(400).json({
      mensagem: "identificador deve ser um numero",
    });
  }

  const pet = buscarPorId(idPet);

  if (!pet) {
    return res.status(404).end();
  }

  return res.status(200).json(pet);
});

// post /pets — cadastra um novo pet
app.post("/pets", (req, res) => {
  const { dsNome, dsEspecie, nuIdade } = req.body ?? {};

  if (
    typeof dsNome !== "string" ||
    dsNome.trim() === "" ||
    typeof dsEspecie !== "string" ||
    dsEspecie.trim() === ""
  ) {
    return res.status(400).json({
      mensagem: "dsNome e dsEspecie são obrigatórios e não podem ser vazios",
    });
  }

  if (
    nuIdade === undefined ||
    typeof nuIdade !== "number" ||
    !Number.isFinite(nuIdade) ||
    nuIdade < 0
  ) {
    return res.status(400).json({
      mensagem: "nuIdade é obrigatória e deve ser um número maior ou igual a zero",
    });
  }

  const novoPet = criarPet({ dsNome, dsEspecie, nuIdade });

  return res.status(201).json(novoPet);
});

// patch /pets/:id — atualiza parcialmente um pet
app.patch("/pets/:id", (req, res) => {
  const idPet = Number(req.params.id);

  if (!Number.isInteger(idPet) || idPet <= 0) {
    return res.status(400).json({
      mensagem: "identificador deve ser um numero",
    });
  }

  const pet = buscarPorId(idPet);

  if (!pet) {
    return res.status(404).end();
  }

  const body = req.body;

  if (
    body === null ||
    typeof body !== "object" ||
    Array.isArray(body)
  ) {
    return res.status(400).json({
      mensagem: "o body deve ser um objeto com pelo menos um campo válido",
    });
  }

  const camposPermitidos = ["dsNome", "dsEspecie", "nuIdade", "fgAdotado"];
  const camposEnviados = Object.keys(body).filter((campo) =>
    camposPermitidos.includes(campo)
  );

  if (camposEnviados.length === 0) {
    return res.status(400).json({
      mensagem: "envie pelo menos um campo válido para atualizar",
    });
  }

  const alteracoes = {};

  if (body.dsNome !== undefined) {
    if (typeof body.dsNome !== "string" || body.dsNome.trim() === "") {
      return res.status(400).json({
        mensagem: "nome do pet deve ser um texto não vazio",
      });
    }
    alteracoes.dsNome = body.dsNome.trim();
  }

  if (body.dsEspecie !== undefined) {
    if (
      typeof body.dsEspecie !== "string" ||
      body.dsEspecie.trim() === ""
    ) {
      return res.status(400).json({
        mensagem: "a especie do pet deve ser um texto não vazio",
      });
    }
    alteracoes.dsEspecie = body.dsEspecie.trim();
  }

  if (body.nuIdade !== undefined) {
    if (
      typeof body.nuIdade !== "number" ||
      !Number.isFinite(body.nuIdade) ||
      body.nuIdade < 0
    ) {
      return res.status(400).json({
        mensagem: "a idade do pet deve ser um número maior ou igual a zero",
      });
    }
    alteracoes.nuIdade = body.nuIdade;
  }

  if (body.fgAdotado !== undefined) {
    if (typeof body.fgAdotado !== "boolean") {
      return res.status(400).json({
        mensagem: "fgAdotado deve ser true ou false",
      });
    }
    alteracoes.fgAdotado = body.fgAdotado;
  }

  atualizarPet(pet, alteracoes);

  return res.status(200).json(pet);
});

// delete /pets/:id — remove um pet
app.delete("/pets/:id", (req, res) => {
  const idPet = Number(req.params.id);

  if (!Number.isInteger(idPet) || idPet <= 0) {
    return res.status(400).json({
      mensagem: "identificador deve ser um numero",
    });
  }

  const removido = deletarPet(idPet);

  if (!removido) {
    return res.status(404).end();
  }

  return res.status(204).end();
});

// Iniciando o servidor
app.listen(3000, () => {
  console.log("Api, de gerenciamento de pets disponiveis para adotar rodando em http://localhost:3000");
});