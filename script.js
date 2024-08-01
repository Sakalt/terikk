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
    // 追加のアイテム
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

// ワールド生成
function generateWorld() {
    for (let x = 0; x < world.width; x += 30) {
        for (let y = 0; y < world.height; y += 30) {
            if (Math.random() < 0.2) {
                world.blocks.push({ x, y, ...blocks[Math.floor(Math.random() * blocks.length)] });
            }
            if (Math.random() < 0.1) {
                world.ores.push({ x, y, ...ores[Math.floor(Math.random() * ores.length)] });
            }
        }
    }
    drawWorld();
}

// ワールド描画
function drawWorld() {
    const worldContainer = document.getElementById('world-container');
    worldContainer.innerHTML = '';

    world.blocks.forEach(block => {
        const blockElement = document.createElement('div');
        blockElement.className = 'block';
        blockElement.style.left = `${block.x}px`;
        blockElement.style.bottom = `${block.y}px`;
        blockElement.textContent = block.element;
        worldContainer.appendChild(blockElement);
    });

    world.ores.forEach(ore => {
        const oreElement = document.createElement('div');
        oreElement.className = 'item';
        oreElement.style.left = `${ore.x}px`;
        oreElement.style.bottom = `${ore.y}px`;
        oreElement.textContent = ore.element;
        worldContainer.appendChild(oreElement);
    });
}

// プレイヤー位置の更新
function updatePlayerPosition() {
    const playerElement = document.getElementById('player');
    playerElement.style.left = `${player.x}px`;
    playerElement.style.bottom = `${player.y}px`;
    document.getElementById('hp-bar').children[0].style.width = `${(player.hp / player.maxHp) * 100}%`;
}

// インベントリの表示更新
function updateInventoryDisplay() {
    const inventoryDiv = document.getElementById('inventory');
    inventoryDiv.innerHTML = '';
    player.inventory.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.classList.add('inventory-item');
        itemDiv.textContent = item.element;
        inventoryDiv.appendChild(itemDiv);
    });
    updateCraftingMenu();
}

// クラフトメニューの更新
function updateCraftingMenu() {
    const craftSelect = document.getElementById('craft-select');
    craftSelect.innerHTML = '<option value="">アイテムを選択</option>';
    Object.keys(craftingRecipes).forEach(itemName => {
        const option = document.createElement('option');
        option.value = itemName;
        option.textContent = itemName;
        craftSelect.appendChild(option);
    });
}

// アイテムのクラフト
function craftItem() {
    const selectedItem = document.getElementById('craft-select').value;
    if (!selectedItem) return;

    const requiredItems = craftingRecipes[selectedItem];
    if (!requiredItems) return;

    const inventoryItemCounts = player.inventory.reduce((counts, item) => {
        counts[item.name] = (counts[item.name] || 0) + 1;
        return counts;
    }, {});

    const canCraft = requiredItems.every(item => inventoryItemCounts[item] >= 1);

    if (canCraft) {
        player.inventory.push({ name: selectedItem, ...items.find(i => i.name === selectedItem) });
        requiredItems.forEach(item => {
            const itemIndex = player.inventory.findIndex(i => i.name === item);
            if (itemIndex > -1) {
                player.inventory.splice(itemIndex, 1);
            }
        });
        updateInventoryDisplay();
    } else {
        alert('素材が足りません!');
    }
}

// アイテムをインベントリに追加
function addItemToInventory(item) {
    player.inventory.push(item);
    updateInventoryDisplay();
}

// アイテムを削除
function removeItemFromInventory(itemName) {
    const itemIndex = player.inventory.findIndex(item => item.name === itemName);
    if (itemIndex > -1) {
        player.inventory.splice(itemIndex, 1);
        updateInventoryDisplay();
    }
}

// プレイヤーのHPを回復
function healPlayer(amount) {
    player.hp = Math.min(player.maxHp, player.hp + amount);
    updatePlayerPosition();
}

// ダメージを与える
function damagePlayer(amount) {
    player.hp = Math.max(0, player.hp - amount);
    if (player.hp <= 0) {
        alert('ゲームオーバー');
    }
    updatePlayerPosition();
}

// 敵のスポーン
function spawnEnemy() {
    const enemy = enemies[Math.floor(Math.random() * enemies.length)];
    const enemyElement = document.createElement('div');
    enemyElement.className = 'enemy';
    enemyElement.textContent = enemy.element;
    document.getElementById('world-container').appendChild(enemyElement);
    // 敵の動きや攻撃などのロジックはここに追加
}

// イベントリスナー
document.getElementById('craft-btn').addEventListener('click', craftItem);
document.getElementById('heal-btn').addEventListener('click', () => healPlayer(20));
document.getElementById('damage-btn').addEventListener('click', () => damagePlayer(10));

// アイテムをインベントリに追加
function addItemToInventory(itemName) {
    const item = items.find(i => i.name === itemName);
    if (item) {
        player.inventory.push(item);
        updateInventoryDisplay();
    } else {
        alert('アイテムが見つかりません!');
    }
}

// アイテムを削除
function removeItemFromInventory(itemName) {
    const itemIndex = player.inventory.findIndex(item => item.name === itemName);
    if (itemIndex > -1) {
        player.inventory.splice(itemIndex, 1);
        updateInventoryDisplay();
    } else {
        alert('アイテムがインベントリにありません!');
    }
}

// アイテムをなんでもゲットボタンの処理
document.getElementById('get-any-item-btn').addEventListener('click', () => {
    const itemName = prompt('追加するアイテムの名前を入力してください:');
    addItemToInventory(itemName);
});

// ワールドとインベントリの初期化
generateWorld();
updateInventoryDisplay();
updatePlayerPosition();
