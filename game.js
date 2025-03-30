// ゲームの状態を管理する変数
let userNumber;
let npcNumber;
let round = 1;
let maxRounds = 5;
let timer;
let countdown = 20;
let userAction = null; // 'declare' or 'pass'
let userDeclareNumber = null;
let npcAction = null;
let npcDeclareNumber = null;
let gameHistory = [];
let winCount = 0;
let loseCount = 0;
let drawCount = 0;

// 画面の切り替え
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.style.display = 'none';
    });
    document.getElementById(screenId).style.display = 'flex';
}

// ゲーム開始
document.getElementById('start-button').addEventListener('click', () => {
    startGame();
});

// 戦績表示
document.getElementById('record-button').addEventListener('click', () => {
    showRecord();
});

// 戦績閉じる
document.getElementById('close-record').addEventListener('click', () => {
    showScreen('start-screen');
});

// スタート画面に戻る
document.getElementById('back-to-start').addEventListener('click', () => {
    showScreen('start-screen');
});

// ゲーム開始処理
function startGame() {
    round = 1;
    assignNumbers();
    showScreen('game-screen');
    startRound();
}

// 数値の割り当て
function assignNumbers() {
    let n = Math.floor(Math.random() * 10) + 1; // 1から10
    let isUserLarger = Math.random() < 0.5;
    if (isUserLarger) {
        userNumber = n + 1;
        npcNumber = n;
    } else {
        userNumber = n;
        npcNumber = n + 1;
    }
    document.getElementById('user-number').textContent = userNumber;
}

// ラウンド開始
function startRound() {
    document.getElementById('round-display').textContent = `第${round}回戦`;
    document.getElementById('countdown').textContent = countdown;
    document.getElementById('declare-form').style.display = 'none';
    document.getElementById('declare-message').style.display = 'none';
    document.getElementById('declare-button').disabled = false;
    document.getElementById('pass-button').disabled = false;
    userAction = null;
    userDeclareNumber = null;
    npcAction = null;
    npcDeclareNumber = null;

    // イベントリスナーをリセット
    const declareButton = document.getElementById('declare-button');
    const passButton = document.getElementById('pass-button');
    declareButton.replaceWith(declareButton.cloneNode(true));
    passButton.replaceWith(passButton.cloneNode(true));

    document.getElementById('declare-button').addEventListener('click', showDeclareForm);
    document.getElementById('pass-button').addEventListener('click', () => {
        userAction = 'pass';
        document.getElementById('declare-button').disabled = true;
        document.getElementById('pass-button').disabled = true;
    });

    timer = setInterval(updateCountdown, 1000);
}

// カウントダウン更新
function updateCountdown() {
    countdown--;
    document.getElementById('countdown').textContent = countdown;
    if (countdown <= 0) {
        clearInterval(timer);
        processRound();
    }
}

// 宣言フォーム表示
function showDeclareForm() {
    document.getElementById('declare-form').style.display = 'block';
    document.getElementById('declare-button').disabled = true;
    document.getElementById('pass-button').disabled = true;

    const submitButton = document.getElementById('submit-declare');
    submitButton.replaceWith(submitButton.cloneNode(true));
    document.getElementById('submit-declare').addEventListener('click', () => {
        userDeclareNumber = parseInt(document.getElementById('declare-input').value);
        if (userDeclareNumber >= 1 && userDeclareNumber <= 10) {
            userAction = 'declare';
            document.getElementById('declare-message').textContent = `カウントダウン終了後に${userDeclareNumber}を宣言します`;
            document.getElementById('declare-message').style.display = 'block';
            document.getElementById('declare-form').style.display = 'none';
        }
    });
}

// ラウンド処理
function processRound() {
    // NPCの行動を決定
    npcAction = decideNpcAction();

    // 勝敗判定
    let result = determineResult();

    // ゲーム履歴に追加
    gameHistory.push({
        round: round,
        userNumber: userNumber,
        npcNumber: npcNumber,
        userAction: userAction,
        userDeclareNumber: userDeclareNumber,
        npcAction: npcAction,
        npcDeclareNumber: npcDeclareNumber,
        result: result
    });

    // 結果に応じて処理
    if (result === 'win') {
        winCount++;
        showResult('WIN');
    } else if (result === 'lose') {
        loseCount++;
        showResult('LOSE');
    } else if (result === 'draw') {
        drawCount++;
        showResult('DRAW');
    } else {
        // 両者パスで次のラウンドへ
        round++;
        countdown = 20;
        startRound();
    }
}

// NPCの行動決定
function decideNpcAction() {
    if (round <= maxRounds) {
        if (npcNumber < 6) {
            if (round === npcNumber) {
                npcDeclareNumber = npcNumber + 1;
                return 'declare';
            } else {
                return 'pass';
            }
        } else {
            let targetRound = 11 - npcNumber;
            if (round === targetRound) {
                npcDeclareNumber = npcNumber - 1;
                return 'declare';
            } else {
                return 'pass';
            }
        }
    } else {
        // 第6回戦以降
        npcDeclareNumber = Math.random() < 0.5 ? npcNumber - 1 : npcNumber + 1;
        return 'declare';
    }
}

// 勝敗判定
function determineResult() {
    if (userAction === 'declare' && userDeclareNumber === npcNumber) {
        if (npcAction === 'declare' && npcDeclareNumber === userNumber) {
            return 'draw';
        } else {
            return 'win';
        }
    } else if (npcAction === 'declare' && npcDeclareNumber === userNumber) {
        return 'lose';
    } else if (userAction === 'pass' && npcAction === 'pass') {
        return 'continue';
    } else {
        return 'draw';
    }
}

// 結果表示
function showResult(result) {
    document.getElementById('result-message').textContent = result;
    showScreen('result-screen');
}

// 戦績表示
function showRecord() {
    document.getElementById('win-count').textContent = winCount;
    document.getElementById('lose-count').textContent = loseCount;
    document.getElementById('draw-count').textContent = drawCount;
    let totalGames = winCount + loseCount + drawCount;
    let winRate = totalGames > 0 ? (winCount / totalGames * 100).toFixed(2) : 0;
    document.getElementById('win-rate').textContent = `${winRate}%`;

    let historyList = document.getElementById('game-history');
    historyList.innerHTML = '';
    gameHistory.forEach(game => {
        let li = document.createElement('li');
        li.textContent = `第${game.round}回戦: あなた(${game.userNumber}) vs NPC(${game.npcNumber}), 結果: ${game.result}`;
        historyList.appendChild(li);
    });
    showScreen('record-screen');
}
