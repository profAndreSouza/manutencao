import { createClient } from "@libsql/client";

// Obter variáveis de ambiente
// Para Turso: TURSO_DATABASE_URL="libsql://seu-banco.turso.io" e TURSO_AUTH_TOKEN="seu-token"
// Fallback: banco local SQLite (file:local.db) para desenvolvimento local sem necessidade de configuração prévia
const url = process.env.TURSO_DATABASE_URL || "file:local.db";
const authToken = process.env.TURSO_AUTH_TOKEN;

export const db = createClient({
  url,
  authToken,
});

let isInitialized = false;

export async function initDb() {
  if (isInitialized) return;

  // Criação das tabelas
  await db.execute(`
    CREATE TABLE IF NOT EXISTS rooms (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      code TEXT NOT NULL,
      block TEXT NOT NULL,
      floor TEXT NOT NULL,
      capacity INTEGER NOT NULL,
      status TEXT NOT NULL DEFAULT 'operacional',
      description TEXT
    );
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS notebooks (
      id TEXT PRIMARY KEY,
      asset_tag TEXT NOT NULL UNIQUE,
      cart_group TEXT NOT NULL,
      slot_number TEXT NOT NULL,
      brand TEXT NOT NULL,
      model TEXT NOT NULL,
      processor TEXT,
      ram TEXT,
      storage TEXT,
      serial_number TEXT,
      charger_tag TEXT,
      battery_health TEXT DEFAULT '100%',
      status TEXT NOT NULL DEFAULT 'disponivel',
      notes TEXT
    );
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS equipment (
      id TEXT PRIMARY KEY,
      asset_tag TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      room_id TEXT,
      room_name TEXT,
      serial_number TEXT,
      status TEXT NOT NULL DEFAULT 'disponivel',
      description TEXT
    );
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS incidents (
      id TEXT PRIMARY KEY,
      code TEXT NOT NULL UNIQUE,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      target_type TEXT NOT NULL, -- 'notebook', 'sala', 'equipamento'
      target_id TEXT NOT NULL,
      target_name TEXT NOT NULL,
      category TEXT NOT NULL,
      priority TEXT NOT NULL DEFAULT 'media', -- 'baixa', 'media', 'alta', 'critica'
      status TEXT NOT NULL DEFAULT 'aberto', -- 'aberto', 'em_analise', 'em_atendimento', 'aguardando_peca', 'resolvido', 'fechado'
      requester_name TEXT NOT NULL,
      requester_email TEXT NOT NULL,
      requester_role TEXT NOT NULL,
      assigned_to TEXT,
      room_location TEXT,
      solution_notes TEXT,
      photo_url TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      resolved_at TEXT
    );
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS incident_history (
      id TEXT PRIMARY KEY,
      incident_id TEXT NOT NULL,
      author_name TEXT NOT NULL,
      author_role TEXT NOT NULL,
      action_type TEXT NOT NULL,
      message TEXT NOT NULL,
      created_at TEXT NOT NULL
    );
  `);

  // Verificar se há dados iniciais de notebooks
  const checkNotebooks = await db.execute("SELECT COUNT(*) as count FROM notebooks");
  const count = Number(checkNotebooks.rows[0].count);

  if (count === 0) {
    await seedInitialData();
  }

  isInitialized = true;
}

async function seedInitialData() {
  // 1. Salas e Laboratórios do UniSENAI
  const roomsData = [
    { id: "sala-101", name: "Sala de Aula 101", code: "S-101", block: "Bloco A", floor: "Térreo", capacity: 35, status: "operacional", description: "Sala com lousa interativa e projetor" },
    { id: "lab-info-1", name: "Lab de Informática 01 (Desenvolvimento)", code: "LAB-01", block: "Bloco B", floor: "1º Andar", capacity: 40, status: "operacional", description: "40 estações com ambiente de programação e IA" },
    { id: "lab-info-2", name: "Lab de Informática 02 (Redes & Cloud)", code: "LAB-02", block: "Bloco B", floor: "1º Andar", capacity: 36, status: "atencao", description: "Racks de switches e bancadas de testes" },
    { id: "lab-maker", name: "Laboratório Maker & Prototipagem", code: "MAKER", block: "Bloco C", floor: "Térreo", capacity: 25, status: "operacional", description: "Impressoras 3D, corte a laser e kits IoT" },
    { id: "lab-mecatronica", name: "Laboratório de Mecatrônica e Robótica", code: "MEC-01", block: "Bloco C", floor: "Térreo", capacity: 28, status: "operacional", description: "Braços robóticos industriais e bancadas CLP" },
    { id: "auditorio", name: "Auditório Principal UniSENAI", code: "AUD-01", block: "Bloco Central", floor: "Térreo", capacity: 180, status: "operacional", description: "Sonorização integrada, 2 telões e cabine de transmissão" }
  ];

  for (const r of roomsData) {
    await db.execute({
      sql: `INSERT INTO rooms (id, name, code, block, floor, capacity, status, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [r.id, r.name, r.code, r.block, r.floor, r.capacity, r.status, r.description],
    });
  }

  // 2. Notebooks (Foco principal pedido pelo usuário)
  // Criamos o Carrinho A (Carrinho Móvel TI 1) e Carrinho B (Carrinho Móvel TI 2) e Reserva Docente
  const notebooksList = [];

  // Carrinho A (20 Notebooks Lenovo ThinkPad)
  for (let i = 1; i <= 20; i++) {
    const pad = String(i).padStart(2, "0");
    const tag = `NOTE-SEN-01${pad}`;
    const slot = `Vaga ${pad}`;
    let status = "disponivel";
    let health = "98%";
    let notes = "Equipamento em excelente estado de conservação";

    if (i === 3) {
      status = "em_manutencao";
      health = "45% (Bateria estufando)";
      notes = "Encaminhado para troca do módulo de bateria";
    } else if (i === 7) {
      status = "danificado";
      health = "88%";
      notes = "Teclas W, A, S, D travando com resíduo";
    } else if (i === 12) {
      status = "em_uso";
      health = "92%";
      notes = "Empréstimo para aula de automação industrial";
    }

    notebooksList.push({
      id: `nb-cart-a-${i}`,
      asset_tag: tag,
      cart_group: "Carrinho Móvel A (Lab Informática)",
      slot_number: slot,
      brand: "Lenovo",
      model: "ThinkPad E14 Gen 4",
      processor: "Intel Core i5-1235U",
      ram: "16 GB DDR4",
      storage: "512 GB SSD NVMe",
      serial_number: `PF3${i}9X8A`,
      charger_tag: `FNT-SEN-01${pad}`,
      battery_health: health,
      status: status,
      notes: notes,
    });
  }

  // Carrinho B (15 Notebooks Dell Latitude)
  for (let i = 1; i <= 15; i++) {
    const pad = String(i).padStart(2, "0");
    const tag = `NOTE-SEN-02${pad}`;
    const slot = `Vaga ${pad}`;
    let status = "disponivel";
    let health = "100%";
    let notes = "Equipamento revisado no início do semestre";

    if (i === 4) {
      status = "aguardando_peca";
      health = "90%";
      notes = "Display com linha vertical azul, aguardando tela reposição";
    } else if (i === 9) {
      status = "em_uso";
      health = "95%";
      notes = "Empréstimo projeto integrador";
    }

    notebooksList.push({
      id: `nb-cart-b-${i}`,
      asset_tag: tag,
      cart_group: "Carrinho Móvel B (Maker / Projetos)",
      slot_number: slot,
      brand: "Dell",
      model: "Latitude 3420",
      processor: "Intel Core i7-1165G7",
      ram: "16 GB DDR4",
      storage: "512 GB SSD NVMe",
      serial_number: `8H7B${i}2`,
      charger_tag: `FNT-SEN-02${pad}`,
      battery_health: health,
      status: status,
      notes: notes,
    });
  }

  // Reserva de Notebooks Docentes (5 Unidades)
  for (let i = 1; i <= 5; i++) {
    const pad = String(i).padStart(2, "0");
    notebooksList.push({
      id: `nb-docente-${i}`,
      asset_tag: tagDocente(i),
      cart_group: "Armário de Reserva Docente",
      slot_number: `Gaveta ${pad}`,
      brand: "Lenovo",
      model: "ThinkPad L14 Gen 3",
      processor: "AMD Ryzen 5 PRO 5675U",
      ram: "32 GB DDR4",
      storage: "1 TB SSD NVMe",
      serial_number: `R90${i}DOC`,
      charger_tag: `FNT-DOC-0${i}`,
      battery_health: "99%",
      status: i === 2 ? "em_uso" : "disponivel",
      notes: "Configuração para professores e coordenadores de curso",
    });
  }

  function tagDocente(num) {
    return `NOTE-DOC-00${num}`;
  }

  for (const nb of notebooksList) {
    await db.execute({
      sql: `INSERT INTO notebooks (id, asset_tag, cart_group, slot_number, brand, model, processor, ram, storage, serial_number, charger_tag, battery_health, status, notes)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        nb.id,
        nb.asset_tag,
        nb.cart_group,
        nb.slot_number,
        nb.brand,
        nb.model,
        nb.processor,
        nb.ram,
        nb.storage,
        nb.serial_number,
        nb.charger_tag,
        nb.battery_health,
        nb.status,
        nb.notes,
      ],
    });
  }

  // 3. Equipamentos Gerais
  const equipmentList = [
    {
      id: "eq-proj-101",
      asset_tag: "PAT-SEN-00411",
      name: "Projetor Laser Epson PowerLite 4000 Lumens",
      category: "audiovisual",
      room_id: "sala-101",
      room_name: "Sala de Aula 101",
      serial_number: "EPS-98214-X",
      status: "disponivel",
      description: "Instalado no teto com cabo HDMI e adaptador Type-C",
    },
    {
      id: "eq-ar-lab1",
      asset_tag: "PAT-SEN-00582",
      name: "Ar-Condicionado Inverter Daikin 24.000 BTUs",
      category: "climatizacao",
      room_id: "lab-info-1",
      room_name: "Lab de Informática 01",
      serial_number: "DKN-24K-881",
      status: "disponivel",
      description: "Manutenção preventiva realizada no mês passado",
    },
    {
      id: "eq-3d-maker",
      asset_tag: "PAT-SEN-00690",
      name: "Impressora 3D Bambu Lab X1-Carbon Combo",
      category: "maker",
      room_id: "lab-maker",
      room_name: "Laboratório Maker & Prototipagem",
      serial_number: "BL-X1C-3391",
      status: "em_manutencao",
      description: "Bico extrusor entupido durante impressão de filamento ABS",
    },
    {
      id: "eq-switch-lab2",
      asset_tag: "PAT-SEN-00714",
      name: "Switch Cisco Catalyst 48 Portas PoE+",
      category: "rede",
      room_id: "lab-info-2",
      room_name: "Lab de Informática 02",
      serial_number: "CISCO-C9200-48P",
      status: "disponivel",
      description: "Alimenta bancadas de redes e pontos de acesso Wi-Fi 6",
    },
    {
      id: "eq-audio-auditorio",
      asset_tag: "PAT-SEN-00820",
      name: "Mesa de Som Digital Behringer X32",
      category: "audiovisual",
      room_id: "auditorio",
      room_name: "Auditório Principal UniSENAI",
      serial_number: "BEHR-X32-551",
      status: "disponivel",
      description: "Mesa principal da cabine com 32 canais e interface USB",
    },
  ];

  for (const eq of equipmentList) {
    await db.execute({
      sql: `INSERT INTO equipment (id, asset_tag, name, category, room_id, room_name, serial_number, status, description)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [eq.id, eq.asset_tag, eq.name, eq.category, eq.room_id, eq.room_name, eq.serial_number, eq.status, eq.description],
    });
  }

  // 4. Incidentes Iniciais Realistas
  const incidentsList = [
    {
      id: "inc-001",
      code: "INC-2026-001",
      title: "Bateria não carrega e carcaça deformada",
      description: "O notebook do Carrinho A (Vaga 03) não segura carga e a carcaça inferior apresenta leve estufamento na região da bateria. Retirado de circulação para segurança dos alunos.",
      target_type: "notebook",
      target_id: "nb-cart-a-3",
      target_name: "Notebook Lenovo ThinkPad (NOTE-SEN-0103) - Carrinho A",
      category: "hardware",
      priority: "critica",
      status: "em_atendimento",
      requester_name: "Prof. Marcos Oliveira",
      requester_email: "marcos.oliveira@sp.senai.br",
      requester_role: "professor",
      assigned_to: "Lucas Mendes (Suporte TI)",
      room_location: "Carrinho Móvel A - Lab 01",
      solution_notes: "Bateria original sobressalente requisitada ao almoxarifado de TI.",
      created_at: new Date(Date.now() - 36 * 3600 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
    },
    {
      id: "inc-002",
      code: "INC-2026-002",
      title: "Teclado com teclas travando e falhas no acionamento",
      description: "Notebook NOTE-SEN-0107 (Carrinho A - Vaga 07) com teclas W, A, S e Barra de Espaço travadas por sujeira/líquido. Alunos não conseguem digitar código nas aulas de programação.",
      target_type: "notebook",
      target_id: "nb-cart-a-7",
      target_name: "Notebook Lenovo ThinkPad (NOTE-SEN-0107) - Carrinho A",
      category: "hardware",
      priority: "alta",
      status: "aberto",
      requester_name: "Camila Rocha (Aluna Monitora)",
      requester_email: "camila.rocha@aluno.senai.br",
      requester_role: "aluno",
      assigned_to: null,
      room_location: "Carrinho Móvel A - Lab 01",
      solution_notes: null,
      created_at: new Date(Date.now() - 12 * 3600 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 12 * 3600 * 1000).toISOString(),
    },
    {
      id: "inc-003",
      code: "INC-2026-003",
      title: "Display LCD com linha vertical e artefatos",
      description: "Tela do NOTE-SEN-0204 (Dell Latitude) apresenta linha vertical azul espessa no centro da tela. Provável falha de flat cable ou painel LCD.",
      target_type: "notebook",
      target_id: "nb-cart-b-4",
      target_name: "Notebook Dell Latitude (NOTE-SEN-0204) - Carrinho B",
      category: "hardware",
      priority: "alta",
      status: "aguardando_peca",
      requester_name: "Prof. Alexandre Castro",
      requester_email: "alexandre.castro@sp.senai.br",
      requester_role: "professor",
      assigned_to: "Lucas Mendes (Suporte TI)",
      room_location: "Carrinho Móvel B - Maker",
      solution_notes: "Aguardando envio do painel de reposição pela garantia Dell.",
      created_at: new Date(Date.now() - 72 * 3600 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 10 * 3600 * 1000).toISOString(),
    },
    {
      id: "inc-004",
      code: "INC-2026-004",
      title: "Bico entupido e sensor de temperatura da Impressora 3D",
      description: "A impressora Bambu Lab do Lab Maker parou de extrusar filamento ABS durante a impressão e apresenta erro de leitura no termistor do hotend.",
      target_type: "equipamento",
      target_id: "eq-3d-maker",
      target_name: "Impressora 3D Bambu Lab X1-Carbon (PAT-SEN-00690)",
      category: "maker",
      priority: "media",
      status: "em_atendimento",
      requester_name: "Eng. Daniela Prado (Lab Maker)",
      requester_email: "daniela.prado@sp.senai.br",
      requester_role: "tecnico",
      assigned_to: "Eng. Daniela Prado",
      room_location: "Laboratório Maker",
      solution_notes: "Desmontagem do hotend para limpeza térmica e substituição do bocal 0.4mm.",
      created_at: new Date(Date.now() - 20 * 3600 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    },
    {
      id: "inc-005",
      code: "INC-2026-005",
      title: "Portas de rede inoperantes na bancada 04",
      description: "Quatro pontos de rede da bancada 04 no Lab 02 não estão estabelecendo link de 1Gbps, causando perda de conexão nas máquinas de teste.",
      target_type: "sala",
      target_id: "lab-info-2",
      target_name: "Lab de Informática 02 (Redes & Cloud)",
      category: "rede",
      priority: "media",
      status: "em_analise",
      requester_name: "Prof. Henrique Viana",
      requester_email: "henrique.viana@sp.senai.br",
      requester_role: "professor",
      assigned_to: "Equipe de Infraestrutura",
      room_location: "Bloco B - Lab 02",
      solution_notes: null,
      created_at: new Date(Date.now() - 18 * 3600 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 18 * 3600 * 1000).toISOString(),
    },
    {
      id: "inc-006",
      code: "INC-2026-006",
      title: "Projetor desliga após 10 minutos de exibição",
      description: "O projetor da Sala 101 desliga sozinho acusando aviso de superaquecimento na lâmpada laser. Filtro de poeira necessita higienização.",
      target_type: "equipamento",
      target_id: "eq-proj-101",
      target_name: "Projetor Laser Epson (PAT-SEN-00411)",
      category: "audiovisual",
      priority: "baixa",
      status: "resolvido",
      requester_name: "Profª. Silvia Neves",
      requester_email: "silvia.neves@sp.senai.br",
      requester_role: "professor",
      assigned_to: "Carlos Roberto (Manutenção)",
      room_location: "Sala 101 - Bloco A",
      solution_notes: "Filtros de ar higienizados e duto de ventilação desobstruído. Testado por 2 horas ininterruptas.",
      created_at: new Date(Date.now() - 120 * 3600 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
      resolved_at: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
    },
  ];

  for (const inc of incidentsList) {
    await db.execute({
      sql: `INSERT INTO incidents (id, code, title, description, target_type, target_id, target_name, category, priority, status, requester_name, requester_email, requester_role, assigned_to, room_location, solution_notes, created_at, updated_at, resolved_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        inc.id,
        inc.code,
        inc.title,
        inc.description,
        inc.target_type,
        inc.target_id,
        inc.target_name,
        inc.category,
        inc.priority,
        inc.status,
        inc.requester_name,
        inc.requester_email,
        inc.requester_role,
        inc.assigned_to,
        inc.room_location,
        inc.solution_notes,
        inc.created_at,
        inc.updated_at,
        inc.resolved_at || null,
      ],
    });

    // Adiciona log inicial
    await db.execute({
      sql: `INSERT INTO incident_history (id, incident_id, author_name, author_role, action_type, message, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
      args: [
        `hist-${inc.id}-1`,
        inc.id,
        inc.requester_name,
        inc.requester_role,
        "abertura",
        "Chamado registrado no sistema de manutenção.",
        inc.created_at,
      ],
    });

    if (inc.status === "resolvido") {
      await db.execute({
        sql: `INSERT INTO incident_history (id, incident_id, author_name, author_role, action_type, message, created_at)
              VALUES (?, ?, ?, ?, ?, ?, ?)`,
        args: [
          `hist-${inc.id}-2`,
          inc.id,
          inc.assigned_to,
          "tecnico",
          "resolucao",
          inc.solution_notes || "Problema solucionado com sucesso.",
          inc.resolved_at,
        ],
      });
    }
  }
}
