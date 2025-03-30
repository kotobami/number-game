// ゲームの状態を管理するオブジェクト
let gameState = {
    round: 1,
    userNumber: null,
    npcNumber: null,
    userDeclaration: null,
    npcDeclaration: null,
    timer: null,
    records: JSON.parse(localStorage.getItem('records')) || []
};

// 画面の切り替え関数
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.style.display = 'none';
    });
    document.getElementById(screenId).style.display = 'flex';
}

// イベントリスナー
document.getElementById('start-game').addEventListener('click', startGame);
document.getElementById('show-records').addEventListener('click', showRecords);
document.getElementById('back-to-start').addEventListener('click', () => showScreen('start-screen'));
document.querySelector('.close').addEventListener('click', () => {
    document.getElementById('records-modal').style.display = 'none';
});
document.getElementById('declare').addEventListener('click', () => {
    document.getElementById('declare-form').style.display = 'block';
});
document.getElementById('submit-declare').addEventListener('click', submitDeclaration);
document.getElementById('pass').addEventListener('click', () => {
    gameState.userDeclaration = 'pass';
    document.getElementById('declare-message').textContent = 'パスを選択しました';
    document.getElementById('declare-message').style.display = 'block';
    document.getElementById('declare-form').style.display = 'none';
});

// ゲーム開始
function startGame() {
    showScreen('game-screen');
    gameState.round = 1;
    generateNumbers();
    resetRound();
}

// 数値の生成
function generateNumbers() {
    const n = Math.floor(Math.random() * 9) + 1; // 1~9
    const isUserLarger = Math.random() < 0.5;
    gameState.userNumber = isUserLarger ? n + 1 : n;
    gameState.npcNumber = isUserLarger ? n : n + 1;
}

// ラウンドのリセット
function resetRound() {
    gameState.userDeclaration = null;
    gameState.npcDeclaration = null;
    updateGameScreen();
    startCountdown();
}

// ゲーム画面の更新
function updateGameScreen() {
    document.getElementById('round').textContent = `第${gameState.round}回戦`;
    document.getElementById('user-number').textContent = gameState.userNumber;
    document.getElementById('declare-form').style.display = 'none';
    document.getElementById('declare-message').style.display = 'none';
    document.getElementById('declare-number').value = '';
}

// カウントダウン
function startCountdown() {
    let timeLeft = 20;
    document.getElementById('countdown').textContent = timeLeft;
    if (gameState.timer) clearInterval(gameState.timer);
    gameState.timer = setInterval(() => {
        timeLeft--;
        document.getElementById('countdown').textContent = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(gameState.timer);
            console.log('Countdown finished');
            processRound();
        }
    }, 1000);
}

// 宣言の送信
function submitDeclaration() {
    const declareNumber = parseInt(document.getElementById('declare-number').value);
    if (declareNumber >= 1 && declareNumber <= 10) {
        gameState.userDeclaration = declareNumber;
        document.getElementById('declare-message').textContent = `カウントダウン終了後に${declareNumber}を宣言します`;
        document.getElementById('declare-message').style.display = 'block';
        document.getElementById('declare-form').style.display = 'none';
    } else {
        alert('1から10の間で入力してください');
    }
}

// ラウンド処理
function processRound() {
    gameState.npcDeclaration = getNpcDeclaration();
    const result = determineWinner();
    console.log('determineWinner result:', result);
    if (result !== 'continue') {
        gameState.records.push({
            userNumber: gameState.userNumber,
            npcNumber: gameState.npcNumber,
            userDeclaration: gameState.userDeclaration || '未宣言',
            npcDeclaration: gameState.npcDeclaration || '未宣言',
            result: result,
            rounds: gameState.round
        });
        localStorage.setItem('records', JSON.stringify(gameState.records));
        showResult(result);
    }
    console.log('processRound finished');
}

// NPCの宣言ロジック
function getNpcDeclaration() {
    const x = gameState.npcNumber;
    if (gameState.round <= 5) {
        if (x < 6 && gameState.round === x) {
            return x + 1;
        } else if (x > 5 && gameState.round === 11 - x) {
            return x - 1;
        } else {
            return 'pass';
        }
    } else {
        const options = [x - 1, x + 1].filter(num => num >= 1 && num <= 10);
        return options[Math.floor(Math.random() * options.length)];
    }
}

// 勝敗判定
function determineWinner() {
    const userDeclare = gameState.userDeclaration;
    const npcDeclare = gameState.npcDeclaration;

    if (userDeclare === 'pass' && npcDeclare === 'pass') {
        gameState.round++;
        resetRound();
        return 'continue';
    }

    const userCorrect = userDeclare === gameState.npcNumber;
    const npcCorrect = npcDeclare === gameState.userNumber;

    if (userCorrect && !npcCorrect) return 'win';
    if (!userCorrect && npcCorrect) return 'lose';
    if (userCorrect && npcCorrect) return 'draw';
    if (!userCorrect && !npcCorrect) {
        if (userDeclare !== 'pass' && npcDeclare === 'pass') return 'lose';
        if (userDeclare === 'pass' && npcDeclare !== 'pass') return 'win';
        return 'draw';
    }
}

// リザルト表示
function showResult(result) {
    showScreen('result-screen');
    document.getElementById('result-message').textContent = result === 'win' ? 'Win' : result === 'lose' ? 'Lose' : 'Draw';
}

// 戦績表示
function showRecords() {
    const records = gameState.records;
    const summary = document.getElementById('records-summary');
    const list = document.getElementById('records-list');
    list.innerHTML = '';

    if (records.length === 0) {
        summary.textContent = 'まだゲームがありません。';
    } else {
        const wins = records.filter(r => r.result === 'win').length;
        const losses = records.filter(r => r.result === 'lose').length;
        const draws = records.filter(r => r.result === 'draw').length;
        const total = wins + losses + draws;
        const winRate = total > 0 ? ((wins / total) * 100).toFixed(1) : 0;
        summary.textContent = `勝: ${wins} 負: ${losses} 引: ${draws} 勝率: ${winRate}%`;

        records.forEach((record, index) => {
            const div = document.createElement('div');
            div.textContent = `ゲーム${index + 1} (${record.rounds}回戦): あなた: ${record.userNumber} (宣言: ${record.userDeclaration}), NPC: ${record.npcNumber} (宣言: ${record.npcDeclaration}), 結果: ${record.result}`;
            list.appendChild(div);
        });
    }
    document.getElementById('records-modal').style.display = 'block';
}
