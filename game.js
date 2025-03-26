// ゲームの状態を管理する変数
let playerNumber, npcNumber, turn = 1, timer, playerChoice, npcChoice;

// 戦績をローカルストレージから取得
let stats = JSON.parse(localStorage.getItem('gameStats')) || {
    playerWins: 0,
    npcWins: 0,
    draws: 0
};

// 画面の切り替え
function showScreen(screenId) {
    document.getElementById('start-screen').classList.add('hidden');
    document.getElementById('game-screen').classList.add('hidden');
    document.getElementById('stats-screen').classList.add('hidden');
    document.getElementById(screenId).classList.remove('hidden');
}

// ゲーム開始
function startGame() {
    showScreen('game-screen');
    turn = 1;
    playerChoice = null;
    npcChoice = null;

    // ランダムにnを生成 (1~8)
    const n = Math.floor(Math.random() * 8) + 1;
    const numbers = [n, n + 1];
    // ユーザーとNPCにランダムに割り当て
    if (Math.random() < 0.5) {
        playerNumber = numbers[0];
        npcNumber = numbers[1];
    } else {
        playerNumber = numbers[1];
        npcNumber = numbers[0];
    }

    document.getElementById('player-number').textContent = playerNumber;
    document.getElementById('result').classList.add('hidden');
    document.getElementById('continue-btn').classList.add('hidden');
    document.getElementById('declare-form').classList.add('hidden');
    startTimer();
}

// 20秒タイマー
function startTimer() {
    let timeLeft = 20;
    document.getElementById('countdown').textContent = timeLeft;
    clearInterval(timer);
    timer = setInterval(() => {
        timeLeft--;
        document.getElementById('countdown').textContent = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(timer);
            npcChoose();
            judgeTurn();
        }
    }, 1000);
}

// 宣言ボタン押下時
function declareNumber() {
    document.getElementById('declare-form').classList.remove('hidden');
}

// ユーザー宣言の送信
function submitGuess() {
    const guess = parseInt(document.getElementById('player-guess').value);
    if (guess >= 1 && guess <= 10) {
        playerChoice = guess;
        document.getElementById('declare-form').classList.add('hidden');
    } else {
        alert('1から10までの数字を入力してください');
    }
}

// パス選択
function pass() {
    playerChoice = 'pass';
}

// NPCの選択ロジック
function npcChoose() {
    if (turn === 1) {
        if (npcNumber === 1) return npcChoice = 2;
        if (npcNumber === 10) return npcChoice = 9;
    }
    if (turn === 2 && playerChoice === 'pass') {
        if (npcNumber === 2) return npcChoice = 3;
        if (npcNumber === 9) return npcChoice = 8;
    }
    if (turn === 3 && playerChoice === 'pass') {
        if (npcNumber === 3) return npcChoice = 4;
        if (npcNumber === 8) return npcChoice = 7;
    }
    if (turn === 4 && playerChoice === 'pass') {
        if (npcNumber === 4) return npcChoice = 5;
        if (npcNumber === 7) return npcChoice = 6;
    }
    if (turn === 5 && playerChoice === 'pass') {
        if (npcNumber === 5) return npcChoice = 6;
        if (npcNumber === 6) return npcChoice = 5;
    }
    if (turn === 6 && playerChoice === 'pass') {
        if (npcNumber <= 4) return npcChoice = 5;
        if (npcNumber >= 7) return npcChoice = 6;
    }
    if (turn >= 7) {
        npcChoice = Math.random() < 0.5 ? 5 : 6;
        return;
    }
    // デフォルト: ランダムに+1か-1を推測
    npcChoice = Math.random() < 0.5 ? npcNumber - 1 : npcNumber + 1;
}

// 勝敗判定
function judgeTurn() {
    const resultEl = document.getElementById('result');
    resultEl.classList.remove('hidden');

    const playerCorrect = playerChoice === npcNumber;
    const npcCorrect = npcChoice === playerNumber;

    if (playerCorrect && !npcCorrect) {
        resultEl.textContent = 'win';
        stats.playerWins++;
    } else if (!playerCorrect && npcCorrect) {
        resultEl.textContent = 'lose';
        stats.npcWins++;
    } else {
        resultEl.textContent = 'draw';
        stats.draws++;
        turn++;
        setTimeout(() => {
            playerChoice = null;
            npcChoice = null;
            startTimer();
            resultEl.classList.add('hidden');
        }, 1000);
        return;
    }

    localStorage.setItem('gameStats', JSON.stringify(stats));
    document.getElementById('continue-btn').classList.remove('hidden');
}

// 戦績表示
function showStats() {
    showScreen('stats-screen');
    const total = stats.playerWins + stats.npcWins + stats.draws;
    const playerWinRate = total > 0 ? (stats.playerWins / total * 100).toFixed(2) : 0;
    const npcWinRate = total > 0 ? (stats.npcWins / total * 100).toFixed(2) : 0;

    document.getElementById('player-wins').textContent = stats.playerWins;
    document.getElementById('npc-wins').textContent = stats.npcWins;
    document.getElementById('draws').textContent = stats.draws;
    document.getElementById('player-win-rate').textContent = playerWinRate;
    document.getElementById('npc-win-rate').textContent = npcWinRate;
}

// スタート画面に戻る
function backToStart() {
    showScreen('start-screen');
}
