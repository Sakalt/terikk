// アイテム、敵、鉱石、ブロックなどの定義
const items = [
    { name: "剣", type: "weapon", attackPower: 15, element: "⚔️" },
    { name: "弓", type: "weapon", attackPower: 10, element: "🏹" },
    { name: "回復ポーション", type: "potion", healAmount: 20, element: "🍷" },
    { name: "月ポーション", type: "potion", healAmount: 100, element: "🍷🌕" },
    { name: "ツール", type: "tool", effect: "useTool", element: "🔧" },
    { name: "ハンマー", type: "tool", effect: "build", element: "🔨" },
    { name: "つるはし", type: "tool", effect: "mine", element: "⛏️" }
];

const ores = [
    { name: "鉄鉱石", hardness: 5, element: "⛏️" },
    { name: "金鉱石", hardness: 7, element: "⛏️" },
    { name: "ダイヤ鉱石", hardness: 10, element: "⛏️" },
    { name: "銅鉱石", hardness: 3, element: "⛏️" },
    { name: "銀鉱石", hardness: 6, element: "⛏️" }
];

const blocks = [
    { name: "石", hardness: 2, element: "🧱" },
    { name: "木材", hardness: 1, element: "🪵" },
    { name: "土", hardness: 1, element: "🌿" },
    { name: "砂", hardness: 1, element: "🏖️" },
    { name: "月石", hardness: 25, element: "🌕" },
    { name: "コンクリート", hardness: 4, element: "🪨" }
];

const enemies = [
    { name: "ゴブリン", health: 30, speed: 2, element: "👹", poison: false },
    { name: "ゴースト", health: 25, speed: 1.5, element: "👻", poison: false },
    { name: "スライム", health: 15, speed: 1, element: "🪲", poison: true },
    { name: "毒蛇", health: 20, speed: 1.2, element: "🐍", poison: true },
    { name: "ドラゴン", health: 50, speed: 3, element: "🐉", poison: false }
];

const potions = [
    { name: "回復ポーション", healAmount: 20, element: "🍷" },
    { name: "マナポーション", manaAmount: 10, element: "🍻" },
    { name: "力のポーション", strengthAmount: 5, element: "💪" },
    { name: "スピードポーション", speedAmount: 5, element: "🚀" },
    { name: "毒消し", poisonAmount: -10, element: "💊" }
];

const accessories = [
    { name: "リング", effect: "attackBoost", value: 5, element: "💍" },
    { name: "帽子", effect: "defenseBoost", value: 3, element: "🧢" },
    { name: "マント", effect: "speedBoost", value: 5, element: "🧥" }
];

const effects = [
    { name: "輝き", type: "buff", element: "✨" },
    { name: "竜巻", type: "debuff", element: "🌪️" },
    { name: "煙", type: "debuff", element: "🌫️" }
];

// クラフトレシピ
const recipes = {
    "鉄の剣": ["鉄鉱石", "木材"],
    "金の弓": ["金鉱石", "木材"],
    "月石": ["砂", "石"],
    "リング": ["金鉱石", "ダイヤ鉱石"],
    "ダイヤのツルハシ": ["ダイヤ鉱石", "木材"]
};

// プレイヤーの状態
let player = {
    hp: 100,
    attackPower: 10,
    defense: 5,
    speed: 2,
    x: 50,
    y: 50,
    invincible: false,
    inventory: [],
    invincibleTimer: null,
    attackSpeed: 1000, // 攻撃速度（ミリ秒）
    lastAttackTime: 0,
    mana: 100 // 追加: マナ
};

// ランダムな位置にアイテムや敵をスポーン
function spawnRandomElement(elements, className) {
    const randomElement = elements[Math.floor(Math.random() * elements.length)];
    const newElement = document.createElement('div');
    newElement.className = className;
    newElement.textContent = randomElement.element;
    newElement.style.left = `${Math.random() * window.innerWidth}px`;
    newElement.style.top = `${Math.random() * window.innerHeight}px`;
    document.getElementById('game-container').appendChild(newElement);

    // アイテムを自動的に拾得するロジック
    newElement.addEventListener('click', () => {
        if (className === 'item') {
            player.inventory.push(randomElement);
            updateInventoryDisplay();
            newElement.remove();
        }
    });

    // 敵に攻撃を当てるロジック
    if (className === 'enemy') {
        newElement.addEventListener('click', () => {
            if (!player.invincible) {
                player.hp -= 10; // ダメージ
                updatePlayerStatus();
                newElement.remove();
            }
        });
    }
}

function spawnItem() {
    spawnRandomElement(items, 'item');
}

function spawnEnemy() {
    spawnRandomElement(enemies, 'enemy');
}

// プレイヤーの移動
function updatePlayerPosition() {
    const playerElement = document.getElementById('player');
    playerElement.style.left = `${player.x}px`;
    playerElement.style.top = `${player.y}px`;
}

// プレイヤーの状態を表示
function updatePlayerStatus() {
    document.getElementById('hp-bar').style.width = `${player.hp}%`;
    document.getElementById('mana-bar').style.width = `${player.mana}%`;
}

// インベントリの表示を更新する関数
function updateInventoryDisplay() {
    const inventoryContainer = document.getElementById('inventory');
    inventoryContainer.innerHTML = '';
    player.inventory.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.textContent = `${item.name} (${item.element})`;
        inventoryContainer.appendChild(itemElement);
    });
}

// ゲーム状態を保存する関数
function saveGameState() {
    localStorage.setItem('playerState', JSON.stringify(player));
}

// ゲーム状態をロードする関数
function loadGameState() {
    const savedState = localStorage.getItem('playerState');
    if (savedState) {
        Object.assign(player, JSON.parse(savedState));
        updatePlayerPosition();
        updateInventoryDisplay();
        updatePlayerStatus();
    }
}

// ジョイスティックの操作を管理する
const joystick = document.getElementById('joystick');
const joystickHandle = document.getElementById('joystick-handle');

joystick.addEventListener('mousemove', (e) => {
    const rect = joystick.getBoundingClientRect();
    const x = e.clientX - rect.left - joystick.offsetWidth / 2;
    const y = e.clientY - rect.top - joystick.offsetHeight / 2;
    joystickHandle.style.transform = `translate(${x}px, ${y}px)`;
    // プレイヤーの移動ロジック
    player.x += x / 10;
    player.y += y / 10;
    updatePlayerPosition();
});

// 攻撃機能
function attack() {
    const now = Date.now();
    if (now - player.lastAttackTime < player.attackSpeed) {
        return; // 攻撃速度制限
    }
    player.lastAttackTime = now;
    // 攻撃ロジック
    const enemies = document.querySelectorAll('.enemy');
    enemies.forEach(enemy => {
        // 攻撃範囲内の敵にダメージを与えるロジックを追加
    });
}

// クラフト機能
function craft(itemName) {
    const recipe = recipes[itemName];
    if (recipe) {
        const hasItems = recipe.every(itemName => player.inventory.some(item => item.name === itemName));
        if (hasItems) {
            // クラフト成功
            player.inventory.push({ name: itemName, element: "🔨" });
            updateInventoryDisplay();
        } else {
            alert('必要なアイテムが不足しています。');
        }
    } else {
        alert('クラフトレシピが見つかりません。');
    }
}

// クラフトメニューの表示
function showCraftMenu() {
    const craftMenu = document.getElementById('craft-menu');
    craftMenu.style.display = 'block';
    const craftItemsContainer = document.getElementById('craft-items');
    craftItemsContainer.innerHTML = '';
    for (const itemName in recipes) {
        const button = document.createElement('button');
        button.textContent = itemName;
        button.addEventListener('click', () => craft(itemName));
        craftItemsContainer.appendChild(button);
    }
}

// クラフトボタンのイベントリスナー
document.getElementById('craft-btn').addEventListener('click', showCraftMenu);

// 攻撃ボタンのイベントリスナー
document.getElementById('attack-btn').addEventListener('click', attack);

// ポーションの使用機能
document.getElementById('use-potion-btn').addEventListener('click', () => {
    const potion = player.inventory.find(item => item.type === 'potion');
    if (potion) {
        player.hp += potion.healAmount || 0;
        player.mana += potion.manaAmount || 0;
        updatePlayerStatus();
        player.inventory = player.inventory.filter(item => item !== potion);
        updateInventoryDisplay();
    } else {
        alert('ポーションがありません。');
    }
});

// 初期化
function init() {
    loadGameState();
    updatePlayerPosition();
    updateInventoryDisplay();
    updatePlayerStatus();
    startSpawning(); // アイテムと敵のスポーンを開始
}

// スポーン機能の開始
function startSpawning() {
    setInterval(spawnItem, 5000); // 5秒ごとにアイテムをスポーン
    setInterval(spawnEnemy, 10000); // 10秒ごとに敵をスポーン
}

// ゲーム開始
init();
