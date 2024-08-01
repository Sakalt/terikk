// アイテムの定義
const items = [
    { name: "剣", type: "weapon", attackPower: 15, attackSpeed: 1, element: "⚔️" },
    { name: "弓", type: "weapon", attackPower: 10, attackSpeed: 1.5, element: "🏹" },
    { name: "回復ポーション", type: "potion", healAmount: 20, element: "🍷" },
    { name: "食料", type: "food", healAmount: 10, element: "🍏" },
    { name: "アクセサリ", type: "accessory", effects: ["increaseDefense"], element: "💍" },
    { name: "スピードポーション", type: "potion", effect: "increaseSpeed", duration: 5000, element: "🏃‍♂️" },
    { name: "攻撃速度のリング", type: "accessory", effects: ["increaseAttackSpeed"], element: "⏩" }
];

const enemies = [
    { name: "ゴブリン", health: 30, speed: 2, element: "👹" },
    { name: "ゴースト", health: 25, speed: 1.5, element: "👻" }
];

// プレイヤーの状態
let player = {
    hp: 100,
    attackPower: 10,
    attackSpeed: 1,
    defense: 5,
    speed: 5,
    x: 50,
    y: 50,
    invincible: false,
    inventory: [],
    invincibleTimer: null,
    effectTimers: {}
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

// アイテムの使用
function useItem(item) {
    switch (item.type) {
        case 'potion':
            if (item.healAmount) {
                player.hp = Math.min(100, player.hp + item.healAmount);
                console.log(`プレイヤーが${item.healAmount}回復しました。HPは${player.hp}です`);
            }
            if (item.effect === "increaseSpeed") {
                applyEffect("speed", item.duration, () => player.speed *= 2, () => player.speed /= 2);
            }
            break;
        case 'food':
            if (item.healAmount) {
                player.hp = Math.min(100, player.hp + item.healAmount);
                console.log(`プレイヤーが${item.healAmount}回復しました。HPは${player.hp}です`);
            }
            break;
        case 'weapon':
            player.attackPower = item.attackPower;
            player.attackSpeed = item.attackSpeed;
            console.log(`プレイヤーの攻撃力が${item.attackPower}になり、攻撃速度が${item.attackSpeed}になりました`);
            break;
        case 'accessory':
            item.effects.forEach(effect => applyAccessoryEffect(effect));
            break;
        default:
            console.log("アイテムの効果が認識できません。");
    }
}

// アクセサリの効果を適用
function applyAccessoryEffect(effect) {
    switch (effect) {
        case 'increaseDefense':
            player.defense += 5;
            console.log("プレイヤーの防御力が5増加しました");
            break;
        case 'increaseAttackSpeed':
            player.attackSpeed *= 1.5;
            console.log("プレイヤーの攻撃速度が1.5倍になりました");
            break;
        default:
            console.log("アクセサリの効果が認識できません。");
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
        saveGameState(); // アイテム取得後に保存
    }
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

// 敵の動き
function moveEnemy(enemyElement, enemy) {
    const playerPosition = { x: player.x, y: player.y };
    let dx = playerPosition.x - parseFloat(enemyElement.style.left);
    let dy = playerPosition.y - parseFloat(enemyElement.style.bottom);
    const distance = Math.sqrt(dx * dx + dy * dy);
    dx /= distance;
    dy /= distance;
    enemyElement.style.left = `${parseFloat(enemyElement.style.left) + dx * enemy.speed}px`;
    enemyElement.style.bottom = `${parseFloat(enemyElement.style.bottom) + dy * enemy.speed}px`;
    if (distance < 10 && !player.invincible) {
        player.hp -= 10;
        setHp(player.hp);
        console.log(`プレイヤーが敵に攻撃されました。HPは${player.hp}です`);
        player.invincible = true;
        player.invincibleTimer = setTimeout(() => player.invincible = false, 600);
    }
}

// 敵の生成
function spawnEnemy(x, y, enemyName = null) {
    const enemy = enemyName ? enemies.find(e => e.name === enemyName) : enemies[Math.floor(Math.random() * enemies.length)];
    const enemyElement = document.createElement('div');
    enemyElement.className = 'enemy';
    enemyElement.dataset.name = enemy.name;
    enemyElement.style.left = `${x}px`;
    enemyElement.style.bottom = `${y}px`;
    enemyElement.innerText = enemy.element;
    document.getElementById('game-container').appendChild(enemyElement);
    setInterval(() => moveEnemy(enemyElement, enemy), 100); // 敵の動き
}

// 効果の適用
function applyEffect(effect, duration, apply, remove) {
    apply();
    const timerId = setTimeout(() => {
        remove();
        delete player.effectTimers[effect];
    }, duration);
    player.effectTimers[effect] = timerId;
}

// ジョイスティックの設定
const joystick = document.getElementById('joystick');
const handle = document.getElementById('joystick-handle');
let joystickActive = false;

joystick.addEventListener('mousedown', (e) => {
    joystickActive = true;
});

joystick.addEventListener('mouseup', () => {
    joystickActive = false;
    handle.style.left = '50%';
    handle.style.top = '50%';
});

joystick.addEventListener('mousemove', (e) => {
    if (joystickActive) {
        const rect = joystick.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        handle.style.left = `${x + rect.width / 2}px`;
        handle.style.top = `${y + rect.height / 2}px`;
        movePlayer(player.x + x / 10, player.y + y / 10); // 移動量を調整
    }
});

// 初期化
window.onload = () => {
    loadGameState();
    spawnItem(100, 100, "剣");
    spawnItem(200, 150, "回復ポーション");
    spawnItem(300, 200, "食料");
    spawnItem(400, 250, "アクセサリ");
    spawnItem(500, 300, "スピードポーション");
    spawnItem(600, 350, "攻撃速度のリング");
    spawnEnemy(700, 400, "ゴブリン");
    spawnEnemy(800, 450, "ゴースト");
};
