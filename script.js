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
    ores: []
};

function generateWorld() {
    for (let x = 0; x < world.width; x += 50) {
        for (let y = 0; y < world.height; y += 50) {
            const blockIndex = Math.floor(Math.random() * blocks.length);
            const block = blocks[blockIndex];
            world.blocks.push({ ...block, x, y });
        }
    }

    for (let x = 0; x < world.width; x += 200) {
        for (let y = 0; y < world.height; y += 200) {
            const oreIndex = Math.floor(Math.random() * ores.length);
            const ore = ores[oreIndex];
            world.ores.push({ ...ore, x, y });
        }
    }
}

function createElement(tag, classes, text) {
    const element = document.createElement(tag);
    if (classes) element.className = classes;
    if (text) element.textContent = text;
    return element;
}

function displayWorld() {
    const container = document.getElementById('world-container');
    container.innerHTML = '';
    world.blocks.forEach(block => {
        const blockElement = createElement('div', 'block', block.element);
        blockElement.style.left = `${block.x}px`;
        blockElement.style.top = `${block.y}px`;
        container.appendChild(blockElement);
    });

    world.ores.forEach(ore => {
        const oreElement = createElement('div', 'block', ore.element);
        oreElement.style.left = `${ore.x}px`;
        oreElement.style.top = `${ore.y}px`;
        container.appendChild(oreElement);
    });
}

function displayInventory() {
    const inventoryContainer = document.getElementById('inventory');
    inventoryContainer.innerHTML = '';
    player.inventory.forEach(item => {
        const itemElement = createElement('div', 'inventory-item', item.element);
        inventoryContainer.appendChild(itemElement);
    });
}

function updateHpBar() {
    const hpBar = document.getElementById('hp-bar').firstElementChild;
    const hpPercentage = (player.hp / player.maxHp) * 100;
    hpBar.style.width = `${hpPercentage}%`;
}

function addItemToInventory(item) {
    player.inventory.push(item);
    displayInventory();
    saveGame();
}

function craftItem() {
    const selectedItem = document.getElementById('craft-select').value;
    if (craftingRecipes[selectedItem]) {
        const requiredItems = craftingRecipes[selectedItem];
        const inventoryItemNames = player.inventory.map(item => item.name);
        const canCraft = requiredItems.every(item => inventoryItemNames.includes(item));

        if (canCraft) {
            requiredItems.forEach(item => {
                const index = player.inventory.findIndex(invItem => invItem.name === item);
                if (index !== -1) player.inventory.splice(index, 1);
            });
            const craftedItem = items.find(item => item.name === selectedItem);
            addItemToInventory(craftedItem);
        } else {
            alert("必要なアイテムが不足しています。");
        }
    } else {
        alert("無効なアイテムです。");
    }
}

function addRandomItem() {
    const randomIndex = Math.floor(Math.random() * items.length);
    const randomItem = items[randomIndex];
    addItemToInventory(randomItem);
}

function setupCraftingOptions() {
    const craftSelect = document.getElementById('craft-select');
    craftSelect.innerHTML = '';
    Object.keys(craftingRecipes).forEach(itemName => {
        const option = createElement('option', '', itemName);
        craftSelect.appendChild(option);
    });
}

function movePlayer(dx, dy) {
    player.x = Math.max(0, Math.min(world.width - 30, player.x + dx));
    player.y = Math.max(0, Math.min(world.height - 30, player.y + dy));
    document.getElementById('player').style.left = `${player.x}px`;
    document.getElementById('player').style.top = `${player.y}px`;
    saveGame();
}

function saveGame() {
    const gameState = {
        player: {
            x: player.x,
            y: player.y,
            hp: player.hp,
            inventory: player.inventory
        },
        world: {
            blocks: world.blocks,
            ores: world.ores
        }
    };
    localStorage.setItem('gameState', JSON.stringify(gameState));
}

function loadGame() {
    const savedGame = localStorage.getItem('gameState');
    if (savedGame) {
        const gameState = JSON.parse(savedGame);
        player.x = gameState.player.x;
        player.y = gameState.player.y;
        player.hp = gameState.player.hp;
        player.inventory = gameState.player.inventory;
        world.blocks = gameState.world.blocks;
        world.ores = gameState.world.ores;
    }
}

function initializeGame() {
    loadGame();
    displayWorld();
    displayInventory();
    updateHpBar();
    setupCraftingOptions();

    const playerElement = document.getElementById('player');
    playerElement.style.left = `${player.x}px`;
    playerElement.style.top = `${player.y}px`;
}

document.addEventListener('DOMContentLoaded', () => {
    initializeGame();

    document.getElementById('add-item-button').addEventListener('click', addRandomItem);
    document.getElementById('craft-button').addEventListener('click', craftItem);

    window.addEventListener('keydown', (e) => {
        const step = 5;
        if (e.key === 'ArrowUp') movePlayer(0, -step);
        if (e.key === 'ArrowDown') movePlayer(0, step);
        if (e.key === 'ArrowLeft') movePlayer(-step, 0);
        if (e.key === 'ArrowRight') movePlayer(step, 0);
    });
});
