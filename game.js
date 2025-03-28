// 戦績の初期化
let results = JSON.parse(localStorage.getItem('results')) || { win: 0, lose: 0, draw: 0 };
let userNumber, npcNumber, timer, turn = 1, history = [];

// スタート画面に戻る
function backToStart() {
    document.getElementById('resultScreen').style.display = 'none';
    document.getElementById('startScreen').style.display = 'block';
    document.getElementById('gameScreen').style.display = 'none';
    turn = 1;
    history = [];
}

// 戦績の表示
function showResults() {
    const total = results.win + results.lose + results.draw;
    const winRate = total > 0 ? (results.win / total * 100).toFixed(2) : 0;
    const loseRate = total > 0 ? (results.lose / total * 100).toFixed(2) : 0;
    alert(`戦績: 勝ち ${results.win} / 負け ${results.lose} / 引き分け ${results.draw}\nユーザーの勝率: ${winRate}%\nNPCの勝率: ${loseRate}%`);
}

// ゲーム開始
function startGame() {
    document.getElementById('startScreen').style.display = 'none';
    document.getElementById('gameScreen').style.display = 'block';
    
    const n = Math.floor(Math.random() * 8) + 1; // 1から8
    userNumber = Math.random() < 0.5 ? n : n + 1;
    npcNumber = userNumber === n ? n + 1 : n;
    document.getElementById('userNumber').textContent = userNumber;
    
    startTimer();
}

// タイマー開始
function startTimer() {
    let timeLeft = 20;
    document.getElementById('timer').textContent = timeLeft;
    clearInterval(timer); // 既存のタイマーをクリア
    timer = setInterval(() => {
        timeLeft--;
        document.getElementById('timer').textContent = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(timer);
            endTurn();
        }
    }, 1000);
}

// 宣言ボタン押下時
function declareNumber() {
    document.getElementById('declareInput').style.display = 'block';
}

// パス選択時
function pass() {
    history.push(`ターン${turn}: あなた: パス`);
    endTurn();
}

// 宣言の決定
function submitGuess() {
    const guess = parseInt(document.getElementById('userGuess').value);
    if (guess >= 1 && guess <= 10) {
        history.push(`ターン${turn}: あなた: ${guess}を宣言`);
        document.getElementById('declareInput').style.display = 'none';
        endTurn(guess);
    } else {
        alert('1から10までの数字を入力してください');
    }
}

// ターン終了処理
function endTurn(userGuess = null) {
    const npcGuess = npcAction();
    history.push(`ターン${turn}: NPC: ${npcGuess === null ? 'パス' : npcGuess + 'を宣言'}`);
    updateHistory();

    if (userGuess === npcNumber && npcGuess !== userNumber) {
        showResult('win');
        results.win++;
    } else if (npcGuess === userNumber && userGuess !== npcNumber) {
        showResult('lose');
        results.lose++;
    } else if ((userGuess === npcNumber && npcGuess === userNumber) || 
               (userGuess !== null && userGuess !== npcNumber && npcGuess !== null && npcGuess !== userNumber)) {
        showResult('draw');
        results.draw++;
    } else {
        // 両者がパス、または片方がパスで片方が宣言したが当てられなかった場合
        turn++;
        startTimer();
    }
    localStorage.setItem('results', JSON.stringify(results));
}

// 履歴の更新
function updateHistory() {
    const historyList = document.getElementById('historyList');
    historyList.innerHTML = '';
    history.forEach(entry => {
        const li = document.createElement('li');
        li.textContent = entry;
        historyList.appendChild(li);
    });
}

// 結果表示
function showResult(result) {
    document.getElementById('gameScreen').style.display = 'none';
    document.getElementById('resultScreen').style.display = 'block';
    document.getElementById('resultText').textContent = result === 'win' ? 'win' : result === 'lose' ? 'lose' : 'draw';
}

// NPCの戦略
function npcAction() {
    if (turn === 1) {
        if (npcNumber === 1) return 2;
        if (npcNumber === 10) return 9;
    } else if (turn === 2 && history[0].includes('パス')) {
        if (npcNumber === 2) return 3;
        if (npcNumber === 9) return 8;
    } else if (turn === 3 && history[0].includes('パス') && history[2].includes('パス')) {
        if (npcNumber === 3) return 4;
        if (npcNumber === 8) return 7;
    } else if (turn === 4 && history.every(h => h.includes('パス'))) {
        if (npcNumber === 4) return 5;
        if (npcNumber === 7) return 6;
    } else if (turn === 5 && history.every(h => h.includes('パス'))) {
        if (npcNumber === 5) return 6;
        if (npcNumber === 6) return 5;
    } else if (turn >= 7) {
        return Math.random() < 0.5 ? 5 : 6;
    }
    return null; // パス
}
