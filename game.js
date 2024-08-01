// アイテムの定義
const items = [
    { name: "剣", type: "weapon", attackPower: 15, element: "⚔️" },
    { name: "弓", type: "weapon", attackPower: 10, element: "🏹" },
    { name: "回復ポーション", type: "potion", healAmount: 20, element: "🍷" },
    { name: "ツール", type: "tool", effect: "useTool", element: "🔧" },
    { name: "ハンマー", type: "tool", effect: "build", element: "🔨" },
    { name: "木材", type: "material", element: "🪵" },
    { name: "鉱石", type: "material", hardness: 5, element: "🪙" },
    { name: "鉄鉱石", type: "material", hardness: 7, element: "⛓️" }
];

// クラフトレシピの定義
const recipes = {
    "鉄の剣": { type: "weapon", attackPower: 25, ingredients: { "木材": 2, "鉄鉱石": 3 } },
    "木の盾": { type: "shield", defense: 10, ingredients: { "木材": 5 } },
    "ポーションの強化": { type: "potion", healAmount: 40, ingredients: { "回復ポーション": 1, "鉄鉱石": 1 } }
};

// プレイヤーの状態
let player = {
    hp: 100,
    attackPower: 10,
    defense: 5,
    x: 50,
    y: 50,
    invincible: false,
    inventory: [],
    selectedItem: null,
    selectedItemElement: null,
};

// ローカルストレージにゲーム状態を保存
function saveGameState() {
    const gameState = {
        player: player,
        items: Array.from(document.querySelectorAll('.item')).map(item => ({
            name: item.dataset.name,
            x: parseFloat(item.style.left),
            y: parseFloat(item.style.bottom)
        })),
        enemies: Array.from(document.querySelectorAll('.enemy')).map(enemy => ({
            name: enemy.dataset.name,
            x: parseFloat(enemy.style.left),
            y: parseFloat(enemy.style.bottom)
        }))
    };
    localStorage.setItem('gameState', JSON.stringify(gameState));
    console.log("ゲームの状態が保存されました");
}

// ローカルストレージからゲーム状態を読み込み
function loadGameState() {
    const gameState = JSON.parse(localStorage.getItem('gameState'));
    if (gameState) {
        player = gameState.player;
        setHp(player.hp);
        movePlayer(player.x, player.y);
        gameState.items.forEach(item => spawnItem(item.x, item.y, item.name));
        gameState.enemies.forEach(enemy => spawnEnemy(enemy.x, enemy.y, enemy.name));
        console.log("ゲームの状態が読み込まれました");
    }
}

// HPの設定
function setHp(hp) {
    player.hp = hp;
    document.getElementById('hp-bar').style.width = `${hp}px`;
    if (player.hp <= 0) {
        die();
    }
}

// 死亡処理
function die() {
    alert("プレイヤーが死亡しました!");
    // ゲームオーバー処理
}

// 攻撃
function attack() {
    if (!player.invincible) {
        console.log("攻撃!");
        player.invincible = true;
        setTimeout(() => player.invincible = false, 600); // 0.6秒の無敵時間
    }
}

// アイテムの使用
function useItem(item) {
    switch (item.type) {
        case 'potion':
            if (item.healAmount) {
                player.hp = Math.min(100, player.hp + item.healAmount);
                console.log(`プレイヤーが${item.healAmount}回復しました。HPは${player.hp}です`);
            }
            break;
        case 'weapon':
            player.attackPower = item.attackPower;
            console.log(`プレイヤーの攻撃力が${item.attackPower}になりました`);
            break;
        case 'tool':
            console.log("ツールを使用しました。");
            break;
        case 'build':
            console.log("ハンマーで建築しました。");
            break;
        default:
            console.log("アイテムの効果が認識できません。");
    }
}

// プレイヤーの移動
function movePlayer(x, y) {
    player.x = x;
    player.y = y;
    document.getElementById('player').style.left = `${x}px`;
    document.getElementById('player').style.bottom = `${y}px`;
}

// アイテムの取得
function pickUpItem(itemElement) {
    const itemName = itemElement.dataset.name;
    const item = items.find(i => i.name === itemName);
    if (item) {
        player.inventory.push(item);
        itemElement.remove();
        console.log(`プレイヤーが${itemName}を取得しました`);
        updateInventoryDisplay();
        saveGameState(); // アイテム取得後に保存
    }
}

// アイテムのクラフト
function craftItem(craftedItemName) {
    const recipe = recipes[craftedItemName];
    if (!recipe) {
        console.log("そのアイテムのレシピはありません");
        return;
    }

    const hasIngredients = Object.entries(recipe.ingredients).every(([ingredientName, quantity]) => {
        const count = player.inventory.filter(i => i.name === ingredientName).length;
        return count >= quantity;
    });

    if (hasIngredients) {
        // 必要なアイテムを消費する
        Object.entries(recipe.ingredients).forEach(([ingredientName, quantity]) => {
            let remaining = quantity;
            player.inventory = player.inventory.filter(item => {
                if (item.name === ingredientName && remaining > 0) {
                    remaining--;
                    return false;
                }
                return true;
            });
        });

        // 新しいアイテムをインベントリに追加
        const craftedItem = { name: craftedItemName, ...recipe };
        player.inventory.push(craftedItem);
        console.log(`${craftedItemName} を作成しました`);
        updateInventoryDisplay();
    } else {
        console.log("必要な材料が足りません");
    }
}

// インベントリの表示更新
function updateInventoryDisplay() {
    const inventoryDiv = document.getElementById('inventory');
    inventoryDiv.innerHTML = '';
    player.inventory.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'inventory-item';
        itemElement.dataset.name = item.name;
        itemElement.innerText = `${item.element} ${item.name}`;
        itemElement.addEventListener('click', () => selectItem(item));
        inventoryDiv.appendChild(itemElement);
    });
}

// アイテムの選択
function selectItem(item) {
    player.selectedItem = item;
    console.log(`アイテム ${item.name} を選択しました`);
}

// アイテムの生成
function spawnItem(x, y, itemName = null) {
    const item = itemName ? items.find(i => i.name === itemName) : items[Math.floor(Math.random() * items.length)];
    const itemElement = document.createElement('div');
    itemElement.className = 'item';
    itemElement.dataset.name = item.name;
    itemElement.style.left = `${x}px`;
    itemElement.style.bottom = `${y}px`;
    itemElement.innerText = item.element;
    itemElement.addEventListener('click', () => pickUpItem(itemElement));
    document.getElementById('game-container').appendChild(itemElement);
}

// 敵の生成
function spawnEnemy(x = null, y = null, enemyName = null) {
    const enemy = enemyName ? enemies.find(e => e.name === enemyName) : enemies[Math.floor(Math.random() * enemies.length)];
    const enemyElement = document.createElement('div');
    enemyElement.className = 'enemy';
    enemyElement.dataset.name = enemy.name;
    enemyElement.style.left = `${x !== null ? x : Math.random() * 760}px`;
    enemyElement.style.bottom = `${y !== null ? y : Math.random() * 560}px`;
    enemyElement.innerText = enemy.element;
    document.getElementById('game-container').appendChild(enemyElement);
    setInterval(() => moveEnemy(enemyElement, enemy), 100);
}

// 敵の動き
function moveEnemy(enemyElement, enemy) {
    const playerPosition = { x: player.x, y: player.y };
    let dx = playerPosition.x - enemy.x;
    let dy = playerPosition.y - enemy.y;
    let distance = Math.sqrt(dx * dx + dy * dy);
    if (distance < 100) { // プレイヤーが近いと追いかける
        dx /= distance;
        dy /= distance;
        enemy.x += dx * 2;
        enemy.y += dy * 2;
        enemyElement.style.left = `${enemy.x}px`;
        enemyElement.style.bottom = `${enemy.y}px`;
    }
}

// ワールド生成
function generateWorld() {
    for (let i = 0; i < 10; i++) {
        const tree = document.createElement('div');
        tree.className = 'tree';
        tree.style.left = `${Math.random() * 760}px`;
        tree.style.bottom = `${Math.random() * 560}px`;
        tree.innerText = '🌳';
        document.getElementById('game-container').appendChild(tree);
    }
    for (let i = 0; i < 5; i++) {
        spawnItem(Math.random() * 760, Math.random() * 560);
    }
    for (let i = 0; i < 3; i++) {
        spawnOre(Math.random() * 760, Math.random() * 560);
    }
    for (let i = 0; i < 2; i++) {
        spawnEnemy();
    }
}

// プレイヤーの移動
function movePlayerByJoystick(dx, dy) {
    player.x += dx;
    player.y += dy;
    movePlayer(player.x, player.y);
}

// イベントリスナーの設定
document.addEventListener('keydown', (e) => {
    switch (e.code) {
        case 'ArrowUp':
            movePlayerByJoystick(0, 10);
            break;
        case 'ArrowDown':
            movePlayerByJoystick(0, -10);
            break;
        case 'ArrowLeft':
            movePlayerByJoystick(-10, 0);
            break;
        case 'ArrowRight':
            movePlayerByJoystick(10, 0);
            break;
        case 'Space':
            attack();
            break;
        case 'KeyI':
            // インベントリ表示
            document.getElementById('inventory').style.display = 'block';
            break;
    }
});

// ゲームの初期化
generateWorld();
updateInventoryDisplay();
createCraftingInterface();
loadGameState(); // ゲーム開始時に状態を読み込む
