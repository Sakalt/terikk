const items = [
    { name: "剣", type: "weapon", attackPower: 15, element: "⚔️" },
    { name: "弓", type: "weapon", attackPower: 10, element: "🏹" },
    { name: "回復ポーション", type: "potion", healAmount: 20, element: "🍷" },
    { name: "ツール", type: "tool", effect: "useTool", element: "🔧" },
    { name: "ハンマー", type: "tool", effect: "build", element: "🔨" },
    { name: "つるはし", type: "tool", effect: "mine", element: "⛏️" },
    { name: "盾", type: "armor", defense: 10, element: "🛡️" },
    { name: "ローブ", type: "armor", defense: 5, element: "🧥" },
    { name: "弓矢", type: "weapon", attackPower: 8, element: "🏹" },
    { name: "爆弾", type: "explosive", damage: 30, element: "💣" },
    { name: "治療薬", type: "potion", healAmount: 50, element: "💊" },
    { name: "スピードポーション", type: "potion", speedAmount: 5, element: "🚀" },
    { name: "強化薬", type: "potion", strengthAmount: 5, element: "💪" },
    { name: "鉄鉱石", type: "ore", hardness: 5, element: "⛏️" },
    { name: "金鉱石", type: "ore", hardness: 7, element: "⛏️" },
    { name: "ダイヤ鉱石", type: "ore", hardness: 10, element: "⛏️" },
    { name: "木材", type: "material", hardness: 1, element: "🪵" },
    { name: "石材", type: "material", hardness: 2, element: "🧱" },
    { name: "砂", type: "material", hardness: 1, element: "🏖️" },
    { name: "鉄鉱", type: "material", hardness: 3, element: "⛏️" },
    { name: "金鉱", type: "material", hardness: 4, element: "⛏️" },
    { name: "魔法の杖", type: "weapon", attackPower: 25, element: "✨" },
    { name: "エリクサー", type: "potion", healAmount: 100, element: "🍹" },
    { name: "ドラゴンの鱗", type: "material", hardness: 15, element: "🪙" },
    { name: "エメラルド", type: "ore", hardness: 12, element: "💎" },
    { name: "ルビー", type: "ore", hardness: 14, element: "💎" },
    { name: "氷の弓", type: "weapon", attackPower: 20, element: "❄️" },
    { name: "雷の杖", type: "weapon", attackPower: 30, element: "⚡" }
];

const craftingRecipes = {
    "剣": ["鉄鉱石", "木材"],
    "弓": ["木材", "弓矢"],
    "回復ポーション": ["治療薬"],
    "ツール": ["木材"],
    "ハンマー": ["鉄鉱石", "木材"],
    "つるはし": ["鉄鉱石", "木材"],
    "盾": ["鉄鉱石"],
    "ローブ": ["布", "糸"],
    "爆弾": ["金鉱石", "鉄鉱石"],
    "弓矢": ["木材"],
    "スピードポーション": ["スピード薬"],
    "強化薬": ["強化薬"],
    "魔法の杖": ["ダイヤ鉱石", "木材"],
    "エリクサー": ["治療薬", "スピード薬"],
    "氷の弓": ["氷の結晶", "木材"],
    "雷の杖": ["雷の石", "木材"]
};

const ores = [
    { name: "鉄鉱石", hardness: 5, element: "⛏️" },
    { name: "金鉱石", hardness: 7, element: "⛏️" },
    { name: "ダイヤ鉱石", hardness: 10, element: "⛏️" },
    { name: "エメラルド", hardness: 12, element: "💎" },
    { name: "ルビー", hardness: 14, element: "💎" }
];

const blocks = [
    { name: "石材", hardness: 2, element: "🧱" },
    { name: "木材", hardness: 1, element: "🪵" },
    { name: "砂", hardness: 1, element: "🏖️" }
];

const enemies = [
    { name: "ゴブリン", health: 30, speed: 2, element: "👹", poison: false },
    { name: "ゴースト", health: 25, speed: 1.5, element: "👻", poison: false },
    { name: "ドラゴン", health: 100, speed: 3, element: "🐉", poison: true }
];

const player = {
    x: 100,
    y: 100,
    hp: 100,
    inventory: [],
    maxHp: 100
};

const world = {
    width: 1000,
    height: 800,
    blocks: [],
    ores: [],
    enemies: []
};

function generateWorld() {
    for (let x = 0; x < world.width; x += 30) {
        for (let y = 0; y < world.height; y += 30) {
            if (Math.random() < 0.1) {
                const ore = ores[Math.floor(Math.random() * ores.length)];
                world.ores.push({ ...ore, x, y });
            } else if (Math.random() < 0.2) {
                const block = blocks[Math.floor(Math.random() * blocks.length)];
                world.blocks.push({ ...block, x, y });
            }
        }
    }
    renderWorld();
}

function renderWorld() {
    const gameContainer = document.getElementById('game-container');
    gameContainer.innerHTML = ''; // Clear the container before rendering
    world.blocks.forEach(block => {
        const blockElement = createElement('div', 'block', block.element);
        setPosition(blockElement, block.x, block.y);
        gameContainer.appendChild(blockElement);
    });
    world.ores.forEach(ore => {
        const oreElement = createElement('div', 'item', ore.element);
        setPosition(oreElement, ore.x, ore.y);
        gameContainer.appendChild(oreElement);
    });
    world.enemies.forEach(enemy => {
        const enemyElement = createElement('div', 'enemy', enemy.element);
        setPosition(enemyElement, enemy.x, enemy.y);
        gameContainer.appendChild(enemyElement);
    });
}

function createElement(tag, className, textContent) {
    const element = document.createElement(tag);
    element.className = className;
    element.textContent = textContent;
    return element;
}

function setPosition(element, x, y) {
    element.style.left = `${x}px`;
    element.style.top = `${y}px`;
}

function movePlayer(dx, dy) {
    player.x += dx;
    player.y += dy;
    const playerElement = document.getElementById('player');
    setPosition(playerElement, player.x, player.y);
}

function updateHpBar() {
    const hpBar = document.getElementById('hp-bar').firstElementChild;
    const hpPercent = (player.hp / player.maxHp) * 100;
    hpBar.style.width = `${hpPercent}%`;
}

function updateInventory() {
    const inventory = document.getElementById('inventory');
    inventory.innerHTML = '';
    player.inventory.forEach(item => {
        const itemElement = createElement('div', 'inventory-item', item.element);
        inventory.appendChild(itemElement);
    });
}

function setupJoystick() {
    const joystick = document.getElementById('joystick');
    const handle = document.getElementById('joystick-handle');
    let isDragging = false;
    let startX, startY, currentX, currentY;

    function onDragStart(e) {
        isDragging = true;
        startX = e.clientX;
        startY = e.clientY;
    }

    function onDragMove(e) {
        if (isDragging) {
            currentX = e.clientX;
            currentY = e.clientY;
            const dx = currentX - startX;
            const dy = currentY - startY;
            movePlayer(dx / 10, dy / 10);
            startX = currentX;
            startY = currentY;
        }
    }

    function onDragEnd() {
        isDragging = false;
    }

    joystick.addEventListener('mousedown', onDragStart);
    document.addEventListener('mousemove', onDragMove);
    document.addEventListener('mouseup', onDragEnd);
}

function craftItem(itemName) {
    const recipe = craftingRecipes[itemName];
    if (recipe) {
        const hasAllIngredients = recipe.every(ingredient => 
            player.inventory.some(item => item.name === ingredient)
        );
        if (hasAllIngredients) {
            player.inventory.push(items.find(item => item.name === itemName));
            updateInventory();
            alert(`${itemName} を作成しました！`);
        } else {
            alert(`材料が不足しています。`);
        }
    } else {
        alert(`レシピが存在しません。`);
    }
}

function setupEnemySpawner() {
    setInterval(() => {
        if (world.enemies.length < 5) {
            const enemy = enemies[Math.floor(Math.random() * enemies.length)];
            const x = Math.random() * world.width;
            const y = Math.random() * world.height;
            world.enemies.push({ ...enemy, x, y });
            renderWorld();
        }
    }, 5000);
}

function setupCombat() {
    document.addEventListener('keydown', (event) => {
        if (event.key === ' ') {
            world.enemies.forEach((enemy) => {
                const distance = Math.hypot(player.x - enemy.x, player.y - enemy.y);
                if (distance < 50) {
                    enemy.health -= 10;
                    player.hp -= 5;
                    if (enemy.health <= 0) {
                        world.enemies = world.enemies.filter(e => e !== enemy);
                        player.inventory.push({ name: "アイテム", type: "loot", element: "🎁" });
                    }
                    if (player.hp <= 0) {
                        alert('ゲームオーバー');
                        player.hp = player.maxHp;
                        player.x = 100;
                        player.y = 100;
                    }
                    updateHpBar();
                }
            });
        }
    });
}

function saveGame() {
    localStorage.setItem('gameState', JSON.stringify({
        player,
        world
    }));
}

function loadGame() {
    const savedState = JSON.parse(localStorage.getItem('gameState'));
    if (savedState) {
        Object.assign(player, savedState.player);
        Object.assign(world, savedState.world);
        renderWorld();
        updateInventory();
        updateHpBar();
    }
}

// Initialize game
document.addEventListener('DOMContentLoaded', () => {
    generateWorld();
    setupJoystick();
    setupEnemySpawner();
    setupCombat();
    loadGame();
});
