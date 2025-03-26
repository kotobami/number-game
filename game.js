// ゲームの状態を管理する変数
let playerNumber, npcNumber, turn = 1, timer, playerChoice, npcChoice, gameLog = { turns: [] }, currentGameRecord = [];

// 戦績をローカルストレージから取得
let stats = JSON.parse(localStorage.getItem('gameStats')) || {
    playerWins: 0,
    npcWins: 0,
    draws: 0,
    records: []
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
    gameLog = { turns: [], userNumber: null, npcNumber: null, result: null };
    currentGameRecord = [];

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

    gameLog.userNumber = playerNumber;
    gameLog.npcNumber = npcNumber;

    document.getElementById('player-number').textContent = playerNumber;
    document.getElementById('result').classList.add('hidden');
    document.getElementById('continue-btn').classList.add('hidden');
    document.getElementById('declare-form').classList.add('hidden');
    document.getElementById('current-choice').textContent = "選択中: ";
    enableButtons();
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
            if (!playerChoice) playerChoice = 'pass'; // 選択がない場合はパス
            npcChoose();
            judgeTurn();
        }
    }, 1000);
}

// 宣言フォームを表示
function showDeclareForm() {
    document.getElementById('declare-form').classList.remove('hidden');
}

// ユーザー宣言の送信
function submitGuess() {
    const guess = parseInt(document.getElementById('player-guess').value);
    if (guess >= 1 && guess <= 10) {
        playerChoice = guess;
        document.getElementById('current-choice').textContent = `選択中: ${guess}を宣言`;
        document.getElementById('declare-form').classList.add('hidden');
        disableButtons();
    } else {
        alert('1から10までの数字を入力してください');
    }
}

// パス選択
function pass() {
    playerChoice = 'pass';
    document.getElementById('current-choice').textContent = "選択中: パス";
    disableButtons();
}

// ボタンを無効化
function disableButtons() {
    document.getElementById('declare-btn').disabled = true;
    document.getElementById('pass-btn').disabled = true;
}

// ボタンを有効化
function enableButtons() {
    document.getElementById('declare-btn').disabled = false;
    document.getElementById('pass-btn').disabled = false;
}

// NPCの選択ロジック
function npcChoose() {
    // 戦略に基づいてNPCの選択を決定
    if (turn === 1) {
        if (npcNumber === 1) npcChoice = 2;
        else if (npcNumber === 10) npcChoice = 9;
        else npcChoice = Math.random() < 0.5 ? npcNumber - 1 : npcNumber + 1;
    } else if (turn === 2 && playerChoice === 'pass') {
        if (npcNumber === 2) npcChoice = 3;
        else if (npcNumber === 9) npcChoice = 8;
        else npcChoice = Math.random() < 0.5 ? npcNumber - 1 : npcNumber + 1;
    } else if (turn === 3 && playerChoice === 'pass') {
        if (npcNumber === 3) npcChoice = 4;
        else if (npcNumber === 8) npcChoice = 7;
        else npcChoice = Math.random() < 0.5 ? npcNumber - 1 : npcNumber + 1;
    } else if (turn === 4 && playerChoice === 'pass') {
        if (npcNumber === 4) npcChoice = 5;
        else if (npcNumber === 7) npcChoice = 6;
        else npcChoice = Math.random() < 0.5 ? npcNumber - 1 : npcNumber + 1;
    } else if (turn === 5 && playerChoice === 'pass') {
        if (npcNumber === 5) npcChoice = 6;
        else if (npcNumber === 6) npcChoice = 5;
        else npcChoice = Math.random() < 0.5 ? npcNumber - 1 : npcNumber + 1;
    } else if (turn >= 6) {
        npcChoice = Math.random() < 0.5 ? 5 : 6;
    } else {
        npcChoice = Math.random() < 0.5 ? npcNumber - 1 : npcNumber + 1;
    }
}

// 勝敗判定
function judgeTurn() {
    const resultEl = document.getElementById('result');
    resultEl.classList.remove('hidden');

    const playerCorrect = playerChoice === npcNumber;
    const npcCorrect = npcChoice === playerNumber;

    // ログに記録
    currentGameRecord.push({
        turn: turn,
        userChoice: playerChoice === 'pass' ? 'パス' : `${playerChoice}を宣言`,
        npcChoice: npcChoice === 'pass' ? 'パス' : `${npcChoice}を宣言`
    });

    if (playerCorrect && !npcCorrect) {
        resultEl.textContent = 'win';
        gameLog.result = '勝利';
        stats.playerWins++;
        endGame();
    } else if (!playerCorrect && npcCorrect) {
        resultEl.textContent = 'lose';
        gameLog.result = '敗北';
        stats.npcWins++;
        endGame();
    } else if ((playerCorrect && npcCorrect) || (!playerCorrect && !npcCorrect && playerChoice !== 'pass' && npcChoice !== 'pass')) {
        resultEl.textContent = 'draw';
        gameLog.result = 'draw';
        stats.draws++;
        endGame();
    } else {
        // 次のターンへ
        turn++;
        playerChoice = null;
        npcChoice = null;
        document.getElementById('current-choice').textContent = "選択中: ";
        enableButtons();
        startTimer();
    }
}

// ゲーム終了処理
function endGame() {
    gameLog.turns = currentGameRecord;
    stats.records.push(gameLog);
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

    const recordsDiv = document.getElementById('game-records');
    recordsDiv.innerHTML = '';
    stats.records.forEach((record, index) => {
        const recordEl = document.createElement('p');
        recordEl.textContent = `ゲーム${index + 1}: ユーザーの数: ${record.userNumber}, NPCの数: ${record.npcNumber}, 結果: ${record.result}`;
        recordEl.addEventListener('click', () => showGameLog(record.turns));
        recordsDiv.appendChild(recordEl);
    });
}

// ゲームログ表示
function showGameLog(turns) {
    let logText = '';
    turns.forEach(turn => {
        logText += `ターン${turn.turn}: ユーザー: ${turn.userChoice}, NPC: ${turn.npcChoice}\n`;
    });
    alert(logText);
}

// スタート画面に戻る
function backToStart() {
    showScreen('start-screen');
}
