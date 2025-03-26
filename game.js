// 戦績の記録（localStorageから取得）
let records = JSON.parse(localStorage.getItem('records')) || { win: 0, lose: 0, draw: 0 };
let userNumber, npcNumber, turn = 1, userAction = null, userGuess = null;

// 画面切り替え用関数
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => screen.classList.remove('active'));
    document.getElementById(screenId).classList.add('active');
}

// 戦績と勝率の表示
function showRecords() {
    const recordsText = `勝ち: ${records.win}, 負け: ${records.lose}, 引き分け: ${records.draw}`;
    const totalGames = records.win + records.lose + records.draw;
    const winRate = totalGames > 0 ? (records.win / totalGames * 100).toFixed(2) : 0;
    document.getElementById('records').textContent = recordsText;
    document.getElementById('win-rate').textContent = `勝率: ${winRate}%`;
    showScreen('records-screen');
}

// ゲームの初期化
function initGame() {
    const n = Math.floor(Math.random() * 8) + 1;
    userNumber = Math.random() < 0.5 ? n : n + 1;
    npcNumber = userNumber === n ? n + 1 : n;
    turn = 1;
    document.getElementById('user-number').textContent = userNumber;
    document.getElementById('turn-number').textContent = turn;
    showScreen('game-screen');
    startTurn();
}

// ターンの開始
function startTurn() {
    userAction = null;
    userGuess = null;
    document.getElementById('choices').style.display = 'none';
    document.getElementById('declare-input').style.display = 'none';
    startCountdown(10, 'countdown', () => {
        document.getElementById('choices').style.display = 'block';
        startCountdown(10, 'countdown', processTurn);
    });
}

// カウントダウン関数
function startCountdown(seconds, elementId, callback) {
    let timeLeft = seconds;
    const element = document.getElementById(elementId);
    element.textContent = timeLeft;
    const interval = setInterval(() => {
        timeLeft--;
        element.textContent = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(interval);
            callback();
        }
    }, 1000);
}

// ターン処理
function processTurn() {
    if (!userAction) userAction = 'pass';
    const npcAction = getNpcAction();
    console.log(`Turn ${turn}: UserAction=${userAction}, UserGuess=${userGuess}, NpcAction=${npcAction.action}, NpcGuess=${npcAction.guess}`); // デバッグ用
    const result = determineWinner(userAction, npcAction);
    
    if (result === 'continue') {
        turn++;
        document.getElementById('turn-number').textContent = turn;
        startTurn();
    } else {
        showResult(result);
        updateRecords(result);
    }
}

// NPCの行動を取得
function getNpcAction() {
    if (turn === 1) {
        if (npcNumber === 1) return { action: 'declare', guess: 2 };
        if (npcNumber === 10) return { action: 'declare', guess: 9 };
        return { action: 'pass' }; // 1ターン目は1か10以外なら必ずパス
    } else if (turn === 2) {
        if (npcNumber === 2) return { action: 'declare', guess: 3 };
        if (npcNumber === 9) return { action: 'declare', guess: 8 };
    } else if (turn === 3) {
        if (npcNumber === 3) return { action: 'declare', guess: 4 };
        if (npcNumber === 8) return { action: 'declare', guess: 7 };
    } else if (turn === 4) {
        if (npcNumber === 4) return { action: 'declare', guess: 5 };
        if (npcNumber === 7) return { action: 'declare', guess: 6 };
    } else if (turn === 5) {
        if (npcNumber === 5) return { action: 'declare', guess: 6 };
        if (npcNumber === 6) return { action: 'declare', guess: 5 };
    } else if (turn >= 6) {
        if (npcNumber <= 5) return { action: 'declare', guess: npcNumber + 1 };
        if (npcNumber >= 6) return { action: 'declare', guess: npcNumber - 1 };
    }
    return { action: 'pass' };
}

// 勝敗を判定
function determineWinner(userAction, npcAction) {
    const userDeclared = userAction === 'declare';
    const npcDeclared = npcAction.action === 'declare';
    const userCorrect = userDeclared && userGuess === npcNumber;
    const npcCorrect = npcDeclared && npcAction.guess === userNumber;

    if (userDeclared) {
        if (userCorrect) {
            if (npcDeclared && npcCorrect) return 'draw';
            return 'win'; // NPCがパスまたは外した場合
        } else {
            if (npcDeclared && npcCorrect) return 'lose';
            return 'lose'; // ユーザーが外し、NPCがパスまたは外した場合も負け
        }
    } else { // ユーザーがパス
        if (npcDeclared && npcCorrect) return 'lose';
        return 'continue'; // NPCがパスまたは外した場合、ゲーム継続
    }
}

// 結果を表示
function showResult(result) {
    const resultText = result === 'win' ? 'Win' : result === 'lose' ? 'Lose' : 'Draw';
    document.getElementById('result').textContent = resultText;
    showScreen('result-screen');
}

// 戦績を更新
function updateRecords(result) {
    if (result === 'win') records.win++;
    else if (result === 'lose') records.lose++;
    else if (result === 'draw') records.draw++;
    localStorage.setItem('records', JSON.stringify(records));
}

// イベントリスナー
document.getElementById('start-game').addEventListener('click', initGame);
document.getElementById('show-records').addEventListener('click', showRecords);
document.getElementById('back-to-start').addEventListener('click', () => showScreen('start-screen'));
document.getElementById('back-to-start-from-result').addEventListener('click', () => showScreen('start-screen'));
document.getElementById('declare').addEventListener('click', () => {
    document.getElementById('choices').style.display = 'none';
    document.getElementById('declare-input').style.display = 'block';
});
document.getElementById('pass').addEventListener('click', () => {
    userAction = 'pass';
    processTurn();
});
document.getElementById('submit-guess').addEventListener('click', () => {
    userAction = 'declare';
    userGuess = parseInt(document.getElementById('guess').value);
    processTurn();
});
