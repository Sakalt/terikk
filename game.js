// アイテムの定義
const items = [
    { name: "剣", type: "weapon", attackPower: 15, element: "⚔️" },
    { name: "弓", type: "weapon", attackPower: 10, element: "🏹" },
    { name: "回復ポーション", type: "potion", healAmount: 20, element: "🍷" },
    { name: "ツール", type: "tool", effect: "useTool", element: "🔧" },
    { name: "ハンマー", type: "tool", effect: "build", element: "🔨" }
];

const enemies = [
    { name: "ゴブリン", health: 30, speed: 2, element: "👹" },
    { name: "ゴースト", health: 25, speed: 1.5, element: "👻" }
];

// プレイヤーの状態
let player = {
    hp: 100,
    attackPower: 10,
    defense: 5,
    x: 50,
    y: 50,
    invincible: false,
    inventory: [],
    invincibleTimer: null
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
    let dx = playerPosition.x - enemy.x;
    let dy = playerPosition.y - enemy.y;
    let distance = Math.sqrt(dx * dx + dy * dy);
    if (distance < 100) { // プレイヤーが近いと追いかける
        dx /= distance;
        dy /= distance;
        enemy.x += dx * enemy.speed;
        enemy.y += dy * enemy.speed;
        enemyElement.style.left = `${enemy.x}px`;
        enemyElement.style.bottom = `${enemy.y}px`;
    }
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

// 世界生成
function generateWorld() {
    for (let i = 0; i < 10; i++) {
        const tree = document.createElement('div');
        tree.className = 'tree';
        tree.style.left = `${Math.random() * 760}px`;
        document.getElementById('game-container').appendChild(tree);
    }
    for (let i = 0; i < 5; i++) {
        spawnEnemy();
    }
    for (let i = 0; i < 5; i++) {
        spawnItem(Math.random() * 760, Math.random() * 560);
    }
}

// ゲームの初期化
function initializeGame() {
    loadGameState();
    generateWorld();
    setHp(player.hp); // プレイヤーの初期HP
    console.log("ゲームが開始されました");
}

// ジョイスティックの入力処理
const joystick = document.getElementById('joystick');
const joystickHandle = document.getElementById('joystick-handle');
let joystickActive = false;

joystick.addEventListener('touchstart', function(event) {
    joystickActive = true;
    handleJoystick(event.touches[0].clientX, event.touches[0].clientY);
});

joystick.addEventListener('touchmove', function(event) {
    if (joystickActive) {
        handleJoystick(event.touches[0].clientX, event.touches[0].clientY);
    }
});

joystick.addEventListener('touchend', function() {
    joystickActive = false;
    joystickHandle.style.left = '50%';
    joystickHandle.style.top = '50%';
});

function handleJoystick(clientX, clientY) {
    const rect = joystick.getBoundingClientRect();
    const x = clientX - rect.left - rect.width / 2;
    const y = clientY - rect.top - rect.height / 2;
    const distance = Math.sqrt(x * x + y * y);
    const maxDistance = rect.width / 2;
    if (distance < maxDistance) {
        joystickHandle.style.left = `${50 + (x / maxDistance) * 50}%`;
        joystickHandle.style.top = `${50 + (y / maxDistance) * 50}%`;
        movePlayer(player.x + (x / maxDistance) * 5, player.y + (y / maxDistance) * 5);
    }
}

initializeGame();
