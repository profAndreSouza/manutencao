import { createClient } from "@libsql/client";

const url = process.env.TURSO_DATABASE_URL || "file:local.db";
const authToken = process.env.TURSO_AUTH_TOKEN;

export const db = createClient({
  url,
  authToken,
});

let isInitialized = false;

export async function initDb(force = false) {
  if (isInitialized && !force) return;

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
      room_name TEXT NOT NULL,
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
      notes TEXT,
      last_user TEXT,
      last_turma TEXT,
      last_periodo TEXT
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
      target_type TEXT NOT NULL, -- 'notebook', 'computador', 'sala', 'equipamento'
      target_id TEXT NOT NULL,
      target_name TEXT NOT NULL,
      category TEXT NOT NULL,
      priority TEXT NOT NULL DEFAULT 'media',
      status TEXT NOT NULL DEFAULT 'aberto',
      requester_name TEXT NOT NULL,
      requester_email TEXT NOT NULL,
      requester_role TEXT NOT NULL, -- 'aluno', 'professor', 'tecnico', 'coordenador'
      periodo TEXT, -- 'manha', 'tarde', 'noite'
      modalidade TEXT, -- 'CAI', 'CT', 'CST', 'FIC'
      turma TEXT, -- Ex: 'CST ADS 3º Termo', 'CT Mecatrônica 2A'
      is_retirada INTEGER DEFAULT 1, -- 1 se reportado na retirada do equipamento
      assigned_to TEXT,
      room_location TEXT,
      solution_notes TEXT,
      orientacao_formal TEXT,
      orientacao_gerada_em TEXT,
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

  // Se a tabela rooms estiver vazia ou forçarmos, recria com a estrutura solicitada
  const checkRooms = await db.execute("SELECT COUNT(*) as count FROM rooms");
  const count = Number(checkRooms.rows[0].count);

  if (count === 0 || force) {
    await seedSchoolData();
  }

  isInitialized = true;
}

export async function resetAndSeed() {
  await db.execute("DELETE FROM incident_history");
  await db.execute("DELETE FROM incidents");
  await db.execute("DELETE FROM equipment");
  await db.execute("DELETE FROM notebooks");
  await db.execute("DELETE FROM rooms");
  await seedSchoolData();
}

async function seedSchoolData() {
  // =========================================================================
  // 1. SALAS CONFORME SOLICITADO PELO USUÁRIO:
  // Salas: 1, 2, 3, 4, 5, Informática 4, Projetos, CNC
  // =========================================================================
  const roomsData = [
    {
      id: "sala-1",
      name: "Sala 1",
      code: "SALA-01",
      block: "Bloco A",
      floor: "Térreo",
      capacity: 35,
      status: "operacional",
      description: "Sala de aula equipada com carrinho móvel contendo 32 notebooks Lenovo ThinkPad.",
    },
    {
      id: "sala-2",
      name: "Sala 2",
      code: "SALA-02",
      block: "Bloco A",
      floor: "Térreo",
      capacity: 35,
      status: "operacional",
      description: "Sala de aula equipada com carrinho móvel contendo 32 notebooks Lenovo ThinkPad.",
    },
    {
      id: "sala-3",
      name: "Sala 3",
      code: "SALA-03",
      block: "Bloco A",
      floor: "1º Andar",
      capacity: 35,
      status: "operacional",
      description: "Sala de aula teórica com projetor interativo, lousa e climatização.",
    },
    {
      id: "sala-4",
      name: "Sala 4",
      code: "SALA-04",
      block: "Bloco B",
      floor: "1º Andar",
      capacity: 35,
      status: "atencao",
      description: "Sala de aula equipada com carrinho móvel contendo 32 notebooks Dell Latitude.",
    },
    {
      id: "sala-5",
      name: "Sala 5",
      code: "SALA-05",
      block: "Bloco B",
      floor: "1º Andar",
      capacity: 35,
      status: "operacional",
      description: "Sala de aula equipada com carrinho móvel contendo 32 notebooks Dell Latitude.",
    },
    {
      id: "lab-inf-4",
      name: "Informática 4",
      code: "INF-04",
      block: "Bloco B",
      floor: "2º Andar",
      capacity: 25,
      status: "operacional",
      description: "Laboratório de computação de alto desempenho com 21 computadores desktops i7.",
    },
    {
      id: "lab-projetos",
      name: "Laboratório de Projetos",
      code: "PROJ-LAB",
      block: "Bloco C",
      floor: "Térreo",
      capacity: 20,
      status: "atencao",
      description: "Ambiente maker e de prototipagem com 10 computadores, multímetros, fontes de bancada e caixas de kits didáticos.",
    },
    {
      id: "lab-cnc",
      name: "Laboratório CNC",
      code: "CNC-MEC",
      block: "Oficinas Mecânicas",
      floor: "Térreo",
      capacity: 25,
      status: "operacional",
      description: "Laboratório de usinagem computadorizada com 21 estações CAD/CAM e tornos/fresadoras CNC.",
    },
  ];

  for (const r of roomsData) {
    await db.execute({
      sql: `INSERT OR REPLACE INTO rooms (id, name, code, block, floor, capacity, status, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [r.id, r.name, r.code, r.block, r.floor, r.capacity, r.status, r.description],
    });
  }

  // =========================================================================
  // 2. NOTEBOOKS DAS SALAS 1, 2, 4 e 5 (32 notebooks cada = 128 notebooks)
  // =========================================================================
  const notebookRooms = [
    { roomId: "sala-1", roomName: "Sala 1", cartName: "Carrinho Sala 1 (32 Notebooks)", brand: "Lenovo", model: "ThinkPad E14 Gen 4", codePrefix: "S01" },
    { roomId: "sala-2", roomName: "Sala 2", cartName: "Carrinho Sala 2 (32 Notebooks)", brand: "Lenovo", model: "ThinkPad E14 Gen 4", codePrefix: "S02" },
    { roomId: "sala-4", roomName: "Sala 4", cartName: "Carrinho Sala 4 (32 Notebooks)", brand: "Dell", model: "Latitude 3420", codePrefix: "S04" },
    { roomId: "sala-5", roomName: "Sala 5", cartName: "Carrinho Sala 5 (32 Notebooks)", brand: "Dell", model: "Latitude 3420", codePrefix: "S05" },
  ];

  for (const roomConfig of notebookRooms) {
    for (let i = 1; i <= 32; i++) {
      const pad = String(i).padStart(2, "0");
      const assetTag = `NOTE-${roomConfig.codePrefix}-${pad}`;
      const slotNumber = `Vaga ${pad}`;
      const id = `nb-${roomConfig.codePrefix.toLowerCase()}-${i}`;

      let status = "disponivel";
      let battery = "98%";
      let notes = "Equipamento disponível para retirada de alunos.";
      let lastUser = "Uso compartilhado regular";
      let lastTurma = "CT Mecatrônica 2A";
      let lastPeriodo = "Tarde";

      // Criar casos reais de irregularidade relatada entre períodos conforme a narrativa do usuário:
      if (roomConfig.codePrefix === "S01" && i === 14) {
        status = "danificado";
        battery = "85%";
        notes = "Barra de espaço emperrada e tecla Enter sem resposta. Registrado por aluno do CST Noturno na retirada.";
        lastUser = "Matheus Santos (CAI Usinagem)";
        lastTurma = "CAI Usinagem 1º Semestre";
        lastPeriodo = "Tarde";
      } else if (roomConfig.codePrefix === "S01" && i === 5) {
        status = "em_uso";
        battery = "92%";
        notes = "Em uso pelo aluno Gabriel Rocha.";
        lastUser = "Gabriel Rocha";
        lastTurma = "CST ADS 3º Termo";
        lastPeriodo = "Noite";
      } else if (roomConfig.codePrefix === "S02" && i === 8) {
        status = "aguardando_peca";
        battery = "40% (Viciada)";
        notes = "Fonte de alimentação com cabo rompido. Aguardando reposição da fonte.";
        lastUser = "Turma FIC Elétrica";
        lastTurma = "FIC Instalador Residencial";
        lastPeriodo = "Manhã";
      } else if (roomConfig.codePrefix === "S04" && i === 22) {
        status = "danificado";
        battery = "94%";
        notes = "Display com linha vertical azul no canto direito. Aluno registrou na retirada para não levar a culpa.";
        lastUser = "Lucas Pereira (CT Automação)";
        lastTurma = "CT Automação 3A";
        lastPeriodo = "Tarde";
      } else if (roomConfig.codePrefix === "S05" && i === 3) {
        status = "em_manutencao";
        battery = "76%";
        notes = "Sistema operacional travado em loop de recuperação do Windows. Reinstalação de imagem em andamento.";
        lastUser = "Felipe Nogueira (CT DS)";
        lastTurma = "CT Desenvolvimento de Sistemas 1B";
        lastPeriodo = "Manhã";
      }

      await db.execute({
        sql: `INSERT OR REPLACE INTO notebooks (
          id, asset_tag, cart_group, room_name, slot_number, brand, model,
          processor, ram, storage, serial_number, charger_tag, battery_health,
          status, notes, last_user, last_turma, last_periodo
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [
          id,
          assetTag,
          roomConfig.cartName,
          roomConfig.roomName,
          slotNumber,
          roomConfig.brand,
          roomConfig.model,
          roomConfig.brand === "Lenovo" ? "Intel Core i5-1235U" : "Intel Core i5-1135G7",
          "16 GB DDR4",
          "512 GB SSD NVMe",
          `SN-${roomConfig.codePrefix}-${pad}88X`,
          `FNT-${roomConfig.codePrefix}-${pad}`,
          battery,
          status,
          notes,
          lastUser,
          lastTurma,
          lastPeriodo,
        ],
      });
    }
  }

  // =========================================================================
  // 3. COMPUTADORES DESKTOPS:
  // - Informática 4: 21 computadores
  // - CNC: 21 computadores
  // - Projetos: 10 computadores
  // =========================================================================

  // Informática 4 (21 computadores)
  for (let i = 1; i <= 21; i++) {
    const pad = String(i).padStart(2, "0");
    const tag = `PC-INF4-${pad}`;
    let status = "disponivel";
    let desc = "Estação de trabalho Core i7, 32GB RAM, SSD 512GB com monitor Dell 24 polegadas.";

    if (i === 9) {
      status = "defeituoso";
      desc = "Porta de rede Ethernet da bancada 3 sem sinal de link de 1Gbps.";
    }

    await db.execute({
      sql: `INSERT OR REPLACE INTO equipment (id, asset_tag, name, category, room_id, room_name, serial_number, status, description)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        `pc-inf4-${i}`,
        tag,
        `Computador Desktop Estação ${pad}`,
        "computador",
        "lab-inf-4",
        "Informática 4",
        `DELL-INF4-${pad}`,
        status,
        desc,
      ],
    });
  }

  // CNC (21 computadores)
  for (let i = 1; i <= 21; i++) {
    const pad = String(i).padStart(2, "0");
    const tag = `PC-CNC-${pad}`;
    await db.execute({
      sql: `INSERT OR REPLACE INTO equipment (id, asset_tag, name, category, room_id, room_name, serial_number, status, description)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        `pc-cnc-${i}`,
        tag,
        `Estação CAD/CAM CNC ${pad}`,
        "computador",
        "lab-cnc",
        "Laboratório CNC",
        `HP-CNC-${pad}`,
        "disponivel",
        "Estação dedicada para programação de centros de usinagem e torno CNC com software Edgecam/SolidWorks.",
      ],
    });
  }

  // Sala de Projetos (10 computadores)
  for (let i = 1; i <= 10; i++) {
    const pad = String(i).padStart(2, "0");
    const tag = `PC-PROJ-${pad}`;
    await db.execute({
      sql: `INSERT OR REPLACE INTO equipment (id, asset_tag, name, category, room_id, room_name, serial_number, status, description)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        `pc-proj-${i}`,
        tag,
        `Computador de Projetos ${pad}`,
        "computador",
        "lab-projetos",
        "Laboratório de Projetos",
        `PROJ-PC-${pad}`,
        "disponivel",
        "Estação de bancada para desenvolvimento de projetos integradores e testes eletrônicos.",
      ],
    });
  }

  // =========================================================================
  // 4. EQUIPAMENTOS ADICIONAIS DO LAB DE PROJETOS:
  // Multímetros, Fontes de bancada e Caixas de Kits Didáticos
  // =========================================================================
  const projetosExtras = [
    // Multímetros
    { id: "mult-proj-01", tag: "PAT-PROJ-MULT-01", name: "Multímetro Digital True RMS Minipa ET-2082C", cat: "multimetro", room: "lab-projetos", rName: "Laboratório de Projetos", sn: "MIN-0104", st: "disponivel", desc: "Multímetro com cabos banana-jacaré e pontas de prova CAT III." },
    { id: "mult-proj-02", tag: "PAT-PROJ-MULT-02", name: "Multímetro Digital True RMS Minipa ET-2082C", cat: "multimetro", room: "lab-projetos", rName: "Laboratório de Projetos", sn: "MIN-0105", st: "defeituoso", desc: "Ponta de prova vermelha partida no borne positivo durante a aula anterior." },
    { id: "mult-proj-03", tag: "PAT-PROJ-MULT-03", name: "Multímetro Digital True RMS Minipa ET-2082C", cat: "multimetro", room: "lab-projetos", rName: "Laboratório de Projetos", sn: "MIN-0106", st: "disponivel", desc: "Calibrado com aviso sonoro de continuidade ativo." },
    { id: "mult-proj-04", tag: "PAT-PROJ-MULT-04", name: "Multímetro Digital Hikari HM-2090", cat: "multimetro", room: "lab-projetos", rName: "Laboratório de Projetos", sn: "HIK-0321", st: "disponivel", desc: "Multímetro de bancada de alta precisão." },

    // Fontes de Bancada
    { id: "fnt-proj-01", tag: "PAT-PROJ-FNT-01", name: "Fonte de Bancada DC Ajustável 0-30V 5A Hikari", cat: "fonte_bancada", room: "lab-projetos", rName: "Laboratório de Projetos", sn: "HF-3005-A", st: "disponivel", desc: "Fonte estabilizada com display digital duplo para tensão e corrente." },
    { id: "fnt-proj-02", tag: "PAT-PROJ-FNT-02", name: "Fonte de Bancada DC Ajustável 0-30V 5A Hikari", cat: "fonte_bancada", room: "lab-projetos", rName: "Laboratório de Projetos", sn: "HF-3005-B", st: "em_manutencao", desc: "Knob de ajuste fino de tensão com folga mecânica no potenciômetro." },
    { id: "fnt-proj-03", tag: "PAT-PROJ-FNT-03", name: "Fonte de Bancada Simétrica Minipa MPS-3005", cat: "fonte_bancada", room: "lab-projetos", rName: "Laboratório de Projetos", sn: "MIN-FNT-09", st: "disponivel", desc: "Fonte com 2 saídas variáveis e 1 saída fixa 5V 3A." },

    // Caixas de Kits Didáticos
    { id: "kit-proj-01", tag: "KIT-SENAI-01", name: "Caixa de Kit Didático Arduino & Sensores IoT 01", cat: "kit_didatico", room: "lab-projetos", rName: "Laboratório de Projetos", sn: "KIT-IOT-01", st: "disponivel", desc: "Contém 1x Arduino Uno R3, 1x ESP32, 2x Protoboards, cabos jumper e módulo relé." },
    { id: "kit-proj-02", tag: "KIT-SENAI-02", name: "Caixa de Kit Didático Arduino & Sensores IoT 02", cat: "kit_didatico", room: "lab-projetos", rName: "Laboratório de Projetos", sn: "KIT-IOT-02", st: "disponivel", desc: "Contém sensores ultrassônico, DHT22 de temperatura, display LCD 16x2 I2C." },
    { id: "kit-proj-03", tag: "KIT-SENAI-03", name: "Caixa de Kit Didático Arduino & Sensores IoT 03", cat: "kit_didatico", room: "lab-projetos", rName: "Laboratório de Projetos", sn: "KIT-IOT-03", st: "defeituoso", desc: "Faltando cabo USB-B de comunicação e display OLED com pino quebrado." },
    { id: "kit-proj-04", tag: "KIT-SENAI-04", name: "Caixa de Kit Didático CLP & Automação Compacta", cat: "kit_didatico", room: "lab-projetos", rName: "Laboratório de Projetos", sn: "KIT-CLP-04", st: "disponivel", desc: "Kit didático para treinamento de lógica ladder e botoeiras industriais." },
  ];

  for (const eq of projetosExtras) {
    await db.execute({
      sql: `INSERT OR REPLACE INTO equipment (id, asset_tag, name, category, room_id, room_name, serial_number, status, description)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [eq.id, eq.tag, eq.name, eq.cat, eq.room, eq.rName, eq.sn, eq.st, eq.desc],
    });
  }

  // =========================================================================
  // 5. INCIDENTES REALISTAS EXEMPLIFICANDO A SITUAÇÃO NARRADA
  // =========================================================================
  const incidentsList = [
    {
      id: "inc-001",
      code: "INC-2026-001",
      title: "Barra de espaço solta e tecla Enter inoperante (Identificado na Retirada)",
      description: "Ao retirar o notebook no início da aula das 19h no Carrinho da Sala 1 (Vaga 14), o aluno notou que a barra de espaço estava solta e a tecla Enter não responde. Ocorrência registrada imediatamente para resguardar o aluno da turma noturna e orientar a turma anterior da tarde.",
      target_type: "notebook",
      target_id: "nb-s01-14",
      target_name: "Notebook NOTE-S01-14 (Sala 1 - Vaga 14)",
      category: "hardware",
      priority: "alta",
      status: "em_atendimento",
      requester_name: "Lucas Silva",
      requester_email: "lucas.silva@aluno.senai.br",
      requester_role: "aluno",
      periodo: "noite",
      modalidade: "CST",
      turma: "CST ADS 3º Termo",
      is_retirada: 1,
      assigned_to: "Lucas Mendes (Suporte TI)",
      room_location: "Sala 1 - Bloco A",
      solution_notes: "Constatado resíduo plástico travando a mola da tecla. Alinhado com a coordenação pedagógica para orientação por escrito à turma de Mecatrônica da tarde.",
      orientacao_formal: "Orientação Formal Pedagógica: Notificado o representante de turma do CAI/CT da tarde sobre o zelo com os teclados na Sala 1.",
      orientacao_gerada_em: new Date(Date.now() - 10 * 3600 * 1000).toISOString(),
      created_at: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    },
    {
      id: "inc-002",
      code: "INC-2026-002",
      title: "Linha vertical no display e adesivo na carcaça (Identificado na Retirada)",
      description: "Notebook NOTE-S04-22 (Sala 4 - Vaga 22) retirado no início da aula matutina já apresentava linha vertical azul no LCD e adesivo colado na carcaça. Registro de irregularidade para não responsabilizar o aluno atual.",
      target_type: "notebook",
      target_id: "nb-s04-22",
      target_name: "Notebook NOTE-S04-22 (Sala 4 - Vaga 22)",
      category: "hardware",
      priority: "alta",
      status: "aberto",
      requester_name: "Mariana Costa",
      requester_email: "mariana.costa@aluno.senai.br",
      requester_role: "aluno",
      periodo: "manha",
      modalidade: "CT",
      turma: "CT Desenvolvimento de Sistemas 1A",
      is_retirada: 1,
      assigned_to: null,
      room_location: "Sala 4 - Bloco B",
      solution_notes: null,
      orientacao_formal: null,
      orientacao_gerada_em: null,
      created_at: new Date(Date.now() - 14 * 3600 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 14 * 3600 * 1000).toISOString(),
    },
    {
      id: "inc-003",
      code: "INC-2026-003",
      title: "Fonte de alimentação com isolamento rompido na saída",
      description: "Carregador FNT-S02-08 do notebook 08 da Sala 2 com fios expostos próximo ao conector P4. Retirado de circulação por risco de choque elétrico e curto.",
      target_type: "notebook",
      target_id: "nb-s02-8",
      target_name: "Notebook NOTE-S02-08 (Sala 2 - Vaga 08)",
      category: "eletrica",
      priority: "critica",
      status: "aguardando_peca",
      requester_name: "Prof. Carlos Roberto",
      requester_email: "carlos.eduardo@sp.senai.br",
      requester_role: "professor",
      periodo: "manha",
      modalidade: "CT",
      turma: "CT Automação Industrial 2A",
      is_retirada: 0,
      assigned_to: "Carlos Roberto (Manutenção)",
      room_location: "Sala 2 - Bloco A",
      solution_notes: "Aguardando chegada do lote de fontes de reposição 65W.",
      orientacao_formal: null,
      orientacao_gerada_em: null,
      created_at: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 6 * 3600 * 1000).toISOString(),
    },
    {
      id: "inc-004",
      code: "INC-2026-004",
      title: "Ponta de prova partida do Multímetro Minipa da Bancada 2",
      description: "Ponta de prova vermelha do multímetro PAT-PROJ-MULT-02 quebrada no conector banana ao final da aula de eletrônica analógica.",
      target_type: "equipamento",
      target_id: "mult-proj-02",
      target_name: "Multímetro Digital Minipa (PAT-PROJ-MULT-02)",
      category: "eletrica",
      priority: "media",
      status: "em_atendimento",
      requester_name: "Prof. Carlos Roberto",
      requester_email: "carlos.eduardo@sp.senai.br",
      requester_role: "professor",
      periodo: "tarde",
      modalidade: "CAI",
      turma: "CAI Eletricista de Manutenção 1A",
      is_retirada: 0,
      assigned_to: "Lucas Mendes (Suporte TI)",
      room_location: "Laboratório de Projetos",
      solution_notes: "Substituição do par de pontas de prova por kit reserva.",
      orientacao_formal: null,
      orientacao_gerada_em: null,
      created_at: new Date(Date.now() - 8 * 3600 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 1 * 3600 * 1000).toISOString(),
    },
    {
      id: "inc-005",
      code: "INC-2026-005",
      title: "Falta de cabos USB e display OLED quebrado no Kit Didático 03",
      description: "Caixa do kit didático KIT-SENAI-03 devolvida ao armário sem o cabo de comunicação USB e com o display OLED danificado.",
      target_type: "equipamento",
      target_id: "kit-proj-03",
      target_name: "Kit Didático Arduino (KIT-SENAI-03)",
      category: "maker",
      priority: "media",
      status: "aberto",
      requester_name: "Lucas Silva",
      requester_email: "lucas.silva@aluno.senai.br",
      requester_role: "aluno",
      periodo: "noite",
      modalidade: "CST",
      turma: "CST ADS 3º Termo",
      is_retirada: 1,
      assigned_to: null,
      room_location: "Laboratório de Projetos",
      solution_notes: null,
      orientacao_formal: null,
      orientacao_gerada_em: null,
      created_at: new Date(Date.now() - 5 * 3600 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 5 * 3600 * 1000).toISOString(),
    },
  ];

  for (const inc of incidentsList) {
    await db.execute({
      sql: `INSERT OR REPLACE INTO incidents (
        id, code, title, description, target_type, target_id, target_name,
        category, priority, status, requester_name, requester_email, requester_role,
        periodo, modalidade, turma, is_retirada, assigned_to, room_location,
        solution_notes, orientacao_formal, orientacao_gerada_em, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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
        inc.periodo,
        inc.modalidade,
        inc.turma,
        inc.is_retirada,
        inc.assigned_to,
        inc.room_location,
        inc.solution_notes,
        inc.orientacao_formal,
        inc.orientacao_gerada_em,
        inc.created_at,
        inc.updated_at,
      ],
    });

    await db.execute({
      sql: `INSERT OR REPLACE INTO incident_history (id, incident_id, author_name, author_role, action_type, message, created_at)
            VALUES (?, ?, ?, ?, 'registro_retirada', ?, ?)`,
      args: [
        `hist-${inc.id}-1`,
        inc.id,
        inc.requester_name,
        inc.requester_role,
        `Ocorrência registrada no momento da retirada pelo ${inc.requester_role}: ${inc.title} (Turma: ${inc.turma} - ${inc.periodo?.toUpperCase()}).`,
        inc.created_at,
      ],
    });

    if (inc.orientacao_formal) {
      await db.execute({
        sql: `INSERT OR REPLACE INTO incident_history (id, incident_id, author_name, author_role, action_type, message, created_at)
              VALUES (?, ?, ?, 'professor', 'orientacao_formal', ?, ?)`,
        args: [
          `hist-${inc.id}-2`,
          inc.id,
          "Prof. Carlos Roberto",
          inc.orientacao_formal,
          inc.orientacao_gerada_em,
        ],
      });
    }
  }
}
