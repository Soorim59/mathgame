import fs from 'fs';
import path from 'path';

const content = `import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Skull, 
  Box, 
  Cylinder, 
  Cuboid, 
  Triangle, 
  Circle, 
  Cone,
  Hexagon,
  Pentagon,
  HelpCircle,
  X
} from 'lucide-react';

// --- Types ---
type SolidType = 'Cubo' | 'Cilindro' | 'Paralelepípedo' | 'Pirâmide' | 'Esfera' | 'Cone' | 'Tetraedro' | 'Prisma Pentagonal' | 'Prisma Hexagonal' | 'Cilindro-Cone';

interface Problem {
  type: SolidType;
  dimensions: Record<string, number>;
  correctAnswer: number;
}

interface Character {
  id: string;
  name: string;
  role: string;
  xp: number;
  color: string;
  bgColor: string;
}

interface DamageText {
  id: number;
  value: number | string;
  type: 'damage' | 'miss';
}

// --- Constants ---
const MAX_BOSS_HP = 100000;
const MAX_BOSS_2_HP = 10000;
const PI = 3.14;

const BASE_SOLIDS: SolidType[] = ['Cubo', 'Cilindro', 'Paralelepípedo', 'Pirâmide', 'Esfera', 'Cone', 'Tetraedro', 'Prisma Pentagonal', 'Prisma Hexagonal'];

const INITIAL_CHARACTERS: Character[] = [
  { id: 'c1', name: 'Arthur', role: 'Cavaleiro', xp: 0, color: 'text-blue-400', bgColor: 'bg-blue-950/50' },
  { id: 'c2', name: 'Merlin', role: 'Mago', xp: 0, color: 'text-purple-400', bgColor: 'bg-purple-950/50' },
  { id: 'c3', name: 'Robin', role: 'Arqueiro', xp: 0, color: 'text-green-400', bgColor: 'bg-green-950/50' },
  { id: 'c4', name: 'Loki', role: 'Ladino', xp: 0, color: 'text-red-400', bgColor: 'bg-red-950/50' },
  { id: 'c5', name: 'Elora', role: 'Clériga', xp: 0, color: 'text-yellow-400', bgColor: 'bg-yellow-950/50' },
];

// --- Helper Functions ---
const generateProblem = (validTypes: SolidType[] = BASE_SOLIDS, prevType?: SolidType): Problem => {
  let types = [...validTypes];
  if (prevType && types.length > 1) {
    types = types.filter(t => t !== prevType);
  }
  const type = types[Math.floor(Math.random() * types.length)];
  const dims: Record<string, number> = {};
  let ans = 0;

  const rand = () => Math.floor(Math.random() * 40) + 1;

  switch(type) {
    case 'Cubo':
      dims.a = rand();
      ans = Math.pow(dims.a, 3);
      break;
    case 'Cilindro':
      dims.r = rand();
      dims.h = rand();
      ans = PI * Math.pow(dims.r, 2) * dims.h;
      break;
    case 'Paralelepípedo':
      dims.c = rand(); // comprimento
      dims.l = rand(); // largura
      dims.h = rand(); // altura
      ans = dims.c * dims.l * dims.h;
      break;
    case 'Pirâmide':
      dims.b = rand(); // aresta da base
      dims.h = rand(); // altura
      ans = (Math.pow(dims.b, 2) * dims.h) / 3;
      break;
    case 'Esfera':
      dims.r = rand();
      ans = (4 * PI * Math.pow(dims.r, 3)) / 3;
      break;
    case 'Cone':
      dims.r = rand();
      dims.h = rand();
      ans = (PI * Math.pow(dims.r, 2) * dims.h) / 3;
      break;
    case 'Tetraedro':
      dims.a = rand();
      ans = (Math.pow(dims.a, 3) * 1.41) / 12;
      break;
    case 'Prisma Pentagonal':
      dims.l = rand();
      dims.ap = rand();
      dims.h = rand();
      ans = (5 * dims.l * dims.ap * dims.h) / 2;
      break;
    case 'Prisma Hexagonal':
      dims.l = rand();
      dims.ap = rand();
      dims.h = rand();
      ans = 3 * dims.l * dims.ap * dims.h;
      break;
    case 'Cilindro-Cone':
      dims.r = rand();
      dims.hcil = rand();
      dims.hcon = rand();
      ans = (PI * Math.pow(dims.r, 2) * dims.hcil) + ((PI * Math.pow(dims.r, 2) * dims.hcon) / 3);
      break;
  }

  return { type, dimensions: dims, correctAnswer: Math.trunc(ans * 100) / 100 };
};

const getSolidIcon = (type: SolidType) => {
  switch(type) {
    case 'Cubo': return <Box size={64} className="text-stone-300" />;
    case 'Cilindro': return <Cylinder size={64} className="text-stone-300" />;
    case 'Paralelepípedo': return <Cuboid size={64} className="text-stone-300" />;
    case 'Pirâmide': return <Triangle size={64} className="text-stone-300" />;
    case 'Esfera': return <Circle size={64} className="text-stone-300" />;
    case 'Cone': return <Cone size={64} className="text-stone-300" />;
    case 'Tetraedro': return <Triangle size={64} className="text-stone-300" />;
    case 'Prisma Pentagonal': return <Pentagon size={64} className="text-stone-300" />;
    case 'Prisma Hexagonal': return <Hexagon size={64} className="text-stone-300" />;
    case 'Cilindro-Cone': return (
      <div className="flex flex-col items-center">
        <Cone size={48} className="text-stone-300 -mb-2 z-10" />
        <Cylinder size={64} className="text-stone-300" />
      </div>
    );
  }
};

const getDimensionLabel = (key: string) => {
  const labels: Record<string, string> = {
    a: 'Aresta',
    r: 'Raio',
    h: 'Altura',
    c: 'Comprimento',
    l: 'Lado da Base / Largura',
    b: 'Aresta da Base',
    ap: 'Apótema da Base',
    hcil: 'Altura Cilindro',
    hcon: 'Altura Cone'
  };
  return labels[key] || key;
};

const CharacterAvatar = ({ role, className }: { role: string, className?: string }) => {
  const imageMap: Record<string, string> = {
    'Arqueiro': '/arqueiro.jpg',
    'Cavaleiro': '/cavaleiro.jpg',
    'Mago': '/mago.jpg',
    'Ladino': '/ladino.jpg',
    'Clériga': '/cleriga.jpg'
  };

  const imgSrc = imageMap[role] || '/cavaleiro.jpg';

  return (
    <img 
      src={imgSrc} 
      alt={role} 
      className={\`object-cover rounded-full \${className}\`} 
      style={{ filter: 'drop-shadow(0px 4px 4px rgba(0,0,0,0.5))' }}
      onError={(e) => {
        // Fallback if image is not uploaded yet
        (e.target as HTMLImageElement).src = \`https://api.dicebear.com/7.x/pixel-art/svg?seed=\${role}\`;
      }}
    />
  );
};

const PixelBoss = ({ stage, className }: { stage: 1 | 2, className?: string }) => (
  <img 
    src={stage === 1 ? "/boss.png" : "/boss2.png"} 
    alt={\`Boss \${stage}\`} 
    className={\`object-contain \${className}\`} 
    style={{ filter: 'drop-shadow(0px 15px 10px rgba(0,0,0,0.9))' }}
    onError={(e) => {
      (e.target as HTMLImageElement).src = \`https://api.dicebear.com/7.x/pixel-art/svg?seed=boss\${stage}\`;
    }}
  />
);

const DungeonBackground = () => (
  <div className="fixed inset-0 z-0 overflow-hidden bg-[#0a0a1a] pointer-events-none flex items-center justify-center">
    <img 
      src="/background.jpg" 
      alt="Dungeon Background" 
      className="w-full h-full object-cover opacity-90" 
      style={{ filter: 'drop-shadow(0px 0px 20px rgba(0,0,0,0.8))' }}
      onError={(e) => {
        (e.target as HTMLImageElement).style.display = 'none';
      }}
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/50" />
  </div>
);

// --- Main Component ---
export default function App() {
  const [bossStage, setBossStage] = useState<1 | 2>(1);
  const [bossHp, setBossHp] = useState(MAX_BOSS_HP);
  const [characters, setCharacters] = useState<Character[]>(INITIAL_CHARACTERS);
  const [currentProblem, setCurrentProblem] = useState<Problem | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [selectedCharId, setSelectedCharId] = useState<string>(INITIAL_CHARACTERS[0].id);
  const [damageTexts, setDamageTexts] = useState<DamageText[]>([]);
  const [bossShake, setBossShake] = useState(false);
  const [isVictory, setIsVictory] = useState(false);
  const [showHints, setShowHints] = useState(false);

  useEffect(() => {
    setCurrentProblem(generateProblem(BASE_SOLIDS));
  }, []);

  const handleAttack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentProblem || isVictory) return;

    const parsedInput = parseFloat(inputValue.replace(',', '.'));
    
    if (isNaN(parsedInput)) {
      showDamageText('Inválido!', 'miss');
      return;
    }

    // Check answer (allowing small float precision differences)
    const isCorrect = Math.abs(parsedInput - currentProblem.correctAnswer) <= 0.01;

    if (isCorrect) {
      const damage = bossStage === 1 ? 5000 : 10000;
      const newHp = Math.max(0, bossHp - damage); // Ensure HP doesn't go below 0
      
      setBossHp(newHp);
      showDamageText(damage, 'damage');
      triggerBossShake();

      // Grant XP
      setCharacters(prev => prev.map(char => 
        char.id === selectedCharId 
          ? { ...char, xp: char.xp + damage }
          : char
      ));

      if (newHp <= 0) {
        if (bossStage === 1) {
          // Boss 1 defeated! Transition to Boss 2
          setTimeout(() => {
            setBossStage(2);
            setBossHp(MAX_BOSS_2_HP);
            setCurrentProblem(generateProblem(['Cilindro-Cone']));
            setInputValue('');
          }, 1500);
        } else {
          // Boss 2 defeated!
          setTimeout(() => setIsVictory(true), 1500);
        }
      } else {
        // Next problem
        const validTypes = bossStage === 1 ? BASE_SOLIDS : ['Cilindro-Cone'];
        setCurrentProblem(generateProblem(validTypes, currentProblem.type));
        setInputValue('');
      }
    } else {
      showDamageText('Errou!', 'miss');
    }
  };

  const showDamageText = (value: number | string, type: 'damage' | 'miss') => {
    const id = Date.now();
    setDamageTexts(prev => [...prev, { id, value, type }]);
    setTimeout(() => {
      setDamageTexts(prev => prev.filter(dt => dt.id !== id));
    }, 1500);
  };

  const triggerBossShake = () => {
    setBossShake(true);
    setTimeout(() => setBossShake(false), 500);
  };

  if (isVictory) {
    return (
      <div className="min-h-screen bg-stone-950 flex flex-col items-center justify-center font-pixel text-stone-200 p-4 relative">
        <DungeonBackground />
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="content-layer text-center bg-stone-900/95 border-4 border-yellow-600 p-8 shadow-[0_0_50px_rgba(202,138,4,0.5)] z-10"
        >
          <h1 className="text-3xl md:text-5xl text-yellow-500 mb-6">VITÓRIA!</h1>
          <p className="text-sm md:text-base mb-8 leading-relaxed">Os Monstros foram derrotados<br/>pelos Mestres do Volume!</p>
          
          <div className="flex flex-row flex-wrap justify-center gap-4 mb-8">
            {characters.map(char => (
              <div key={char.id} className="flex flex-col items-center">
                <CharacterAvatar role={char.role} className="w-20 h-20 md:w-24 md:h-24 bg-stone-800/80 border-4 border-stone-600 p-2 drop-shadow-xl" />
                <span className="mt-3 text-xs">{char.name}</span>
                <span className="text-yellow-500 text-[10px] mt-1">{Math.round(char.xp)} XP</span>
              </div>
            ))}
          </div>

          <button 
            onClick={() => window.location.reload()}
            className="bg-yellow-600 hover:bg-yellow-500 text-stone-950 py-4 px-8 text-sm md:text-base transition-colors border-b-4 border-yellow-800 active:border-b-0 active:translate-y-1"
          >
            JOGAR NOVAMENTE
          </button>
        </motion.div>
      </div>
    );
  }

  const currentMaxHp = bossStage === 1 ? MAX_BOSS_HP : MAX_BOSS_2_HP;

  return (
    <div className="min-h-screen bg-stone-950 text-stone-200 font-pixel flex flex-col overflow-hidden relative">
      <DungeonBackground />

      {/* Help Button */}
      <button 
        onClick={() => setShowHints(true)}
        className="fixed top-6 right-6 z-50 text-yellow-500 hover:text-yellow-400 transition-colors drop-shadow-lg"
        title="Fórmulas de Volume"
      >
        <HelpCircle size={32} />
      </button>

      {/* Hints Overlay */}
      <AnimatePresence>
        {showHints && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4"
            onClick={() => setShowHints(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-stone-900 border-4 border-yellow-600 p-8 md:p-12 max-w-2xl w-full shadow-[0_0_50px_rgba(202,138,4,0.4)]"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-10 border-b-4 border-stone-800 pb-6">
                <h2 className="text-xl md:text-3xl text-yellow-500 uppercase tracking-widest">Pergaminho de Fórmulas</h2>
                <button 
                  onClick={() => setShowHints(false)}
                  className="text-stone-500 hover:text-yellow-500 transition-colors"
                >
                  <X size={32} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 overflow-y-auto max-h-[60vh] pr-2 custom-scrollbar">
                <div className="bg-stone-950 p-6 border-4 border-stone-800 flex flex-col justify-center min-h-[100px] shadow-inner">
                  <p className="text-yellow-500 mb-2 font-bold tracking-wider text-sm">CUBO</p>
                  <p className="text-stone-300 font-sans text-xl">V = a³</p>
                </div>
                <div className="bg-stone-950 p-6 border-4 border-stone-800 flex flex-col justify-center min-h-[100px] shadow-inner">
                  <p className="text-yellow-500 mb-2 font-bold tracking-wider text-sm">CILINDRO</p>
                  <p className="text-stone-300 font-sans text-xl">V = π · r² · h</p>
                </div>
                <div className="bg-stone-950 p-6 border-4 border-stone-800 flex flex-col justify-center min-h-[100px] shadow-inner">
                  <p className="text-yellow-500 mb-2 font-bold tracking-wider text-sm">PARALELEPÍPEDO</p>
                  <p className="text-stone-300 font-sans text-xl">V = c · l · h</p>
                </div>
                <div className="bg-stone-950 p-6 border-4 border-stone-800 flex flex-col justify-center min-h-[100px] shadow-inner">
                  <p className="text-yellow-500 mb-2 font-bold tracking-wider text-sm">PIRÂMIDE</p>
                  <p className="text-stone-300 font-sans text-xl">V = (Ab · h) / 3</p>
                </div>
                <div className="bg-stone-950 p-6 border-4 border-stone-800 flex flex-col justify-center min-h-[100px] shadow-inner">
                  <p className="text-yellow-500 mb-2 font-bold tracking-wider text-sm">ESFERA</p>
                  <p className="text-stone-300 font-sans text-xl">V = (4 · π · r³) / 3</p>
                </div>
                <div className="bg-stone-950 p-6 border-4 border-stone-800 flex flex-col justify-center min-h-[100px] shadow-inner">
                  <p className="text-yellow-500 mb-2 font-bold tracking-wider text-sm">CONE</p>
                  <p className="text-stone-300 font-sans text-xl">V = (π · r² · h) / 3</p>
                </div>
                <div className="bg-stone-950 p-6 border-4 border-stone-800 flex flex-col justify-center min-h-[100px] shadow-inner">
                  <p className="text-yellow-500 mb-2 font-bold tracking-wider text-sm">TETRAEDRO REGULAR</p>
                  <p className="text-stone-300 font-sans text-xl">V = (a³ · √2) / 12</p>
                </div>
                <div className="bg-stone-950 p-6 border-4 border-stone-800 flex flex-col justify-center min-h-[100px] shadow-inner">
                  <p className="text-yellow-500 mb-2 font-bold tracking-wider text-sm">PRISMA PENTAGONAL</p>
                  <p className="text-stone-300 font-sans text-xl">V = (5 · l · ap · h) / 2</p>
                </div>
                <div className="bg-stone-950 p-6 border-4 border-stone-800 flex flex-col justify-center min-h-[100px] shadow-inner">
                  <p className="text-yellow-500 mb-2 font-bold tracking-wider text-sm">PRISMA HEXAGONAL</p>
                  <p className="text-stone-300 font-sans text-xl">V = 3 · l · ap · h</p>
                </div>
                <div className="bg-stone-950 p-6 border-4 border-stone-800 flex flex-col justify-center min-h-[100px] shadow-inner">
                  <p className="text-yellow-500 mb-2 font-bold tracking-wider text-sm">CHEFÃO: CILINDRO + CONE</p>
                  <p className="text-stone-300 font-sans text-xl">V = (π·r²·hCil) + (π·r²·hCon)/3</p>
                </div>
              </div>
              
              <div className="mt-10 pt-6 border-t-2 border-stone-800 text-xs md:text-sm text-stone-500 text-center italic">
                Nota: Use π = 3,14, √2 = 1,41 e lembre-se do truncamento (2 casas decimais).
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="content-layer text-center py-6 border-b-4 border-stone-800 bg-stone-900/95 shadow-lg z-10">
        <h1 className="text-xl md:text-3xl text-yellow-500 mb-3 drop-shadow-md">
          {bossStage === 1 ? "MESTRES DO VOLUME" : "O DESAFIO FINAL"}
        </h1>
        <p className="text-stone-400 text-[10px] md:text-xs leading-relaxed">
          {bossStage === 1 ? "Derrote o monstro calculando o volume!" : "Um novo chefão apareceu com uma forma combinada!"}<br/>(Use π = 3,14)
        </p>
      </header>

      {/* Main Battle Area */}
      <main className="content-layer flex-1 grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-12 p-4 lg:p-8 relative">
        
        {/* Left: Decorative / Status */}
        <div className="hidden lg:flex flex-col items-center justify-center lg:col-span-1">
          <div className="w-full max-w-sm bg-stone-900/95 border-4 border-stone-600 p-8 text-center shadow-2xl flex flex-col items-center">
            <h2 className="text-sm md:text-base text-yellow-500 mb-8 border-b-4 border-stone-700 pb-4 w-full uppercase">INSTRUÇÕES</h2>
            <ul className="text-left text-stone-300 space-y-8 text-xs md:text-sm leading-relaxed w-full">
              <li>1. Observe o sólido à direita.</li>
              <li>2. Calcule o volume usando as medidas.</li>
              <li>3. Considere <span className="text-yellow-500 font-bold">π = 3,14</span> e <span className="text-yellow-500 font-bold">√2 = 1,41</span>.</li>
              <li>4. Utilize o truncamento (2 casas decimais).</li>
              <li>{bossStage === 1 ? "5. Escolha o herói e ataque!" : "5. Derrote o chefão com uma resposta épica!"}</li>
            </ul>
          </div>
        </div>

        {/* Center: Boss & Action */}
        <div className="flex flex-col items-center justify-between relative lg:col-span-2">
          
          {/* Boss Area */}
          <div className="flex-1 flex flex-col items-center justify-center w-full relative mt-4">
            {/* HP Bar */}
            <div className="w-full max-w-md bg-stone-950 border-4 border-stone-700 h-8 mb-12 relative shadow-2xl">
              <motion.div 
                className={\`h-full \${bossStage === 1 ? "bg-red-600" : "bg-purple-600"}\`}
                initial={{ width: '100%' }}
                animate={{ width: \`\${(bossHp / currentMaxHp) * 100}%\` }}
                transition={{ duration: 0.5 }}
              />
              <div className="absolute inset-0 flex items-center justify-center text-white drop-shadow-md text-[10px] md:text-xs">
                {Math.round(bossHp).toLocaleString()} / {currentMaxHp.toLocaleString()} HP
              </div>
            </div>

            {/* Boss Sprite */}
            <div className="relative">
              <motion.div
                animate={bossShake ? { x: [-10, 10, -10, 10, 0], filter: 'brightness(2) drop-shadow(0 0 30px red)' } : { y: [0, -10, 0] }}
                transition={bossShake ? { duration: 0.4 } : { duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className={bossStage === 1 ? "drop-shadow-[0_0_20px_rgba(220,38,38,0.4)]" : "drop-shadow-[0_0_30px_rgba(147,51,234,0.6)]"}
              >
                <PixelBoss stage={bossStage} className="w-80 h-80 md:w-96 md:h-96 drop-shadow-[0_20px_50px_rgba(220,38,38,0.5)]" />
              </motion.div>

              {/* Floating Damage Numbers */}
              <AnimatePresence>
                {damageTexts.map(dt => (
                  <motion.div
                    key={dt.id}
                    initial={{ opacity: 1, y: 0, scale: 0.5 }}
                    animate={{ opacity: 0, y: -100, scale: 1.5 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className={\`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-xl md:text-3xl pointer-events-none drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)] \${
                      dt.type === 'damage' ? 'text-yellow-400' : 'text-stone-400'
                    }\`}
                  >
                    {dt.type === 'damage' ? \`-\${dt.value}\` : dt.value}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* Action Panel */}
          <div className="w-full md:w-max min-w-[300px] max-w-3xl bg-stone-900/95 border-4 border-stone-700 p-4 sm:p-6 shadow-2xl mt-8 z-10">
            <form onSubmit={handleAttack} className="flex flex-col items-center gap-4">
              
              {/* Character Selector */}
              <div className="w-full">
                <p className="text-center text-stone-400 mb-3 text-[10px] md:text-xs">QUEM RECEBERÁ O XP?</p>
                <div className="flex flex-row justify-center gap-2 sm:gap-4 w-full">
                  {characters.map(char => (
                    <button
                      key={char.id}
                      type="button"
                      onClick={() => setSelectedCharId(char.id)}
                      className={\`relative overflow-hidden border-2 transition-all \${selectedCharId === char.id ? 'border-yellow-400 scale-110 drop-shadow-[0_0_10px_rgba(250,204,21,0.5)]' : 'border-stone-700 opacity-70 hover:opacity-100 hover:border-stone-500'}\`}
                    >
                      <CharacterAvatar role={char.role} className="w-12 h-12 sm:w-16 sm:h-16" />
                      {selectedCharId === char.id && (
                        <div className="absolute inset-0 bg-yellow-400/20" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-row items-center gap-4 w-full mt-4">
                <input
                  type="text"
                  inputMode="decimal"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Seu cálculo..."
                  className="flex-1 bg-stone-950 border-4 border-stone-600 px-4 py-4 text-center text-stone-200 focus:outline-none focus:border-yellow-600 font-pixel text-xs md:text-sm shadow-inner"
                />
                <button 
                  type="submit"
                  className="bg-red-700 hover:bg-red-600 active:bg-red-800 text-stone-100 px-6 py-4 border-b-4 border-red-900 active:border-b-0 active:translate-y-1 transition-all h-full shadow-lg"
                >
                  <Skull size={24} />
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right: Problem Display */}
        <div className="flex flex-col items-center justify-center lg:col-span-1">
          {currentProblem && (
            <div className="bg-stone-900/95 border-4 border-stone-600 p-8 w-full max-w-sm shadow-2xl flex flex-col items-center">
              <p className="text-yellow-500 text-sm md:text-base mb-6 text-center border-b-4 border-stone-700 pb-4 w-full uppercase">
                {currentProblem.type}
              </p>
              
              <div className="mb-10 drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">
                {getSolidIcon(currentProblem.type)}
              </div>
              
              <div className="w-full space-y-4 text-xs md:text-sm">
                {Object.entries(currentProblem.dimensions).map(([key, value]) => (
                  <div key={key} className="flex justify-between items-center bg-stone-950 p-4 border-2 border-stone-800">
                    <span className="text-stone-400">{getDimensionLabel(key)}</span>
                    <span className="text-stone-200 text-base">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

      </main>
    </div>
  );
}
`;

fs.writeFileSync(path.join(process.cwd(), 'patch.mjs'), '');
fs.writeFileSync(path.join(process.cwd(), 'src/App.tsx'), content);
console.log('App.tsx overwritten successfully');
