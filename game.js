// ゲームの状態を管理する変数
let playerNumber;
let npcNumber;
let turn;
let history = [];
let firstTurnPassed = false;

// ゲームの初期化
function initGame() {
    playerNumber = Math.floor(Math.random() * 10) + 1; // 1から10のランダムな数字
    npcNumber = Math.floor(Math.random() * 10) + 1;   // 1から10のランダムな数字
    turn = 'player';
    firstTurnPassed = false;
    document.getElementById('player-number').textContent = `あなたの数字: ${playerNumber}`;
    document.getElementById('turn').textContent = 'あなたのターン';
    document.getElementById('message').textContent = '';
    document.getElementById('choices').style.display = 'block';
}

// プレイヤーのターン処理
function handlePlayerTurn(choice) {
    if (turn !== 'player') return;

    if (choice === 'guess') {
        const guess = prompt('相手の数字を入力してください (1-10):');
        const guessNum = parseInt(guess);
        if (guess && !isNaN(guessNum) && guessNum >= 1 && guessNum <= 10) {
            if (guessNum === npcNumber) {
                endGame('win');
            } else {
                endGame('lose');
            }
        } else {
            alert('1から10までの数字を入力してください。');
        }
    } else if (choice === 'pass') {
        if (!firstTurnPassed) {
            firstTurnPassed = true; // 初回パスを記録
        }
        turn = 'npc';
        document.getElementById('turn').textContent = 'NPCのターン';
        setTimeout(npcTurn, 1000); // 1秒後にNPCのターンを実行
    }
}

// NPCのターン処理
function npcTurn() {
    let npcGuess;
    if (npcNumber === 1) {
        npcGuess = 2; // NPCが1ならプレイヤーは2と推理
    } else if (npcNumber === 10) {
        npcGuess = 9; // NPCが10ならプレイヤーは9と推理
    } else if (firstTurnPassed) {
        if (npcNumber === 2) {
            npcGuess = 3; // 初回パス後、NPCが2ならプレイヤーは3と推理
        } else if (npcNumber === 9) {
            npcGuess = 8; // 初回パス後、NPCが9ならプレイヤーは8と推理
        }
    }

    if (npcGuess) {
        document.getElementById('message').textContent = `NPCがあなたの数字を${npcGuess}と宣言しました。`;
        if (npcGuess === playerNumber) {
            endGame('lose');
        } else {
            turn = 'player';
            document.getElementById('turn').textContent = 'あなたのターン';
        }
    } else {
        // 推理ができない場合はパス
        document.getElementById('message').textContent = 'NPCがパスしました。';
        turn = 'player';
        document.getElementById('turn').textContent = 'あなたのターン';
    }
}

// ゲーム終了処理
function endGame(result) {
    let message;
    if (result === 'win') {
        message = 'あなたの勝利！';
    } else {
        message = 'あなたの敗北！';
    }
    document.getElementById('message').textContent = message;
    document.getElementById('choices').style.display = 'none'; // 選択肢を非表示
    recordHistory(result, playerNumber, npcNumber);
    setTimeout(initGame, 2000); // 2秒後にゲームを再初期化
}

// 戦歴を記録
function recordHistory(result, playerNum, npcNum) {
    history.push({ result, playerNum, npcNum });
}

// 戦歴を表示
function showHistory() {
    const historyList = document.getElementById('history-list');
    historyList.innerHTML = ''; // リストをクリア
    history.forEach((record, index) => {
        const li = document.createElement('li');
        li.textContent = `ゲーム${index + 1}: ${record.result === 'win' ? '勝利' : '敗北'} (あなた: ${record.playerNum}, NPC: ${record.npcNum})`;
        historyList.appendChild(li);
    });
    document.getElementById('history').style.display = 'block'; // 戦歴を表示
}

// イベントリスナーの設定
document.getElementById('guess-btn').addEventListener('click', () => handlePlayerTurn('guess'));
document.getElementById('pass-btn').addEventListener('click', () => handlePlayerTurn('pass'));
document.getElementById('history-btn').addEventListener('click', showHistory);

// ゲーム開始
initGame();
