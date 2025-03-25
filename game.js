// ゲームの状態を管理する変数
let gameState = 'start'; // 'start', 'playing', 'choosing', 'declaring', 'result'
let yourNumber;  // ユーザーの数
let npcNumber;   // NPCの数
let countdownTimer;  // 20秒カウントダウンのタイマー
let choiceTimer;     // 10秒選択肢のタイマー

// スタートボタンのイベントリスナー
document.getElementById('start-button').addEventListener('click', startGame);

// 選択肢ボタンのイベントリスナー
document.getElementById('declare-button').addEventListener('click', () => {
    clearInterval(choiceTimer);
    startDeclaring();
});
document.getElementById('pass-button').addEventListener('click', () => {
    clearInterval(choiceTimer);
    npcAction();
});

// 宣言確定ボタンのイベントリスナー
document.getElementById('submit-guess').addEventListener('click', submitGuess);

// スタート画面に戻るボタンのイベントリスナー
document.getElementById('back-to-start').addEventListener('click', () => {
    gameState = 'start';
    document.getElementById('start-screen').classList.remove('hidden');
    document.getElementById('game-screen').classList.add('hidden');
    document.getElementById('result-screen').classList.add('hidden');
});

// ゲーム開始関数
function startGame() {
    gameState = 'playing';
    document.getElementById('start-screen').classList.add('hidden');
    document.getElementById('game-screen').classList.remove('hidden');
    document.getElementById('choice').classList.add('hidden');
    document.getElementById('declare-input').classList.add('hidden');

    // ランダムにnを選択 (1<=n<=9)
    const n = Math.floor(Math.random() * 9) + 1;
    const numbers = [n, n + 1];
    // ランダムにユーザーとNPCに割り当て
    if (Math.random() < 0.5) {
        yourNumber = numbers[0];
        npcNumber = numbers[1];
    } else {
        yourNumber = numbers[1];
        npcNumber = numbers[0];
    }
    document.getElementById('your-number').textContent = yourNumber;

    // 20秒のカウントダウン
    let timeLeft = 20;
    document.getElementById('countdown').textContent = timeLeft;
    countdownTimer = setInterval(() => {
        timeLeft--;
        document.getElementById('countdown').textContent = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(countdownTimer);
            startChoosing();
        }
    }, 1000);
}

// 選択肢表示関数
function startChoosing() {
    gameState = 'choosing';
    document.getElementById('choice').classList.remove('hidden');
    let timeLeft = 10;
    document.getElementById('choice-time').textContent = timeLeft;
    choiceTimer = setInterval(() => {
        timeLeft--;
        document.getElementById('choice-time').textContent = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(choiceTimer);
            // 時間切れで自動的にパス
            npcAction();
        }
    }, 1000);
}

// 宣言フェーズ開始関数
function startDeclaring() {
    gameState = 'declaring';
    document.getElementById('choice').classList.add('hidden');
    document.getElementById('declare-input').classList.remove('hidden');
    document.getElementById('guess-input').value = ''; // 入力欄をクリア
}

// ユーザーの宣言を処理する関数
function submitGuess() {
    const guess = parseInt(document.getElementById('guess-input').value);
    if (guess === npcNumber) {
        showResult('win');
    } else {
        showResult('lose');
    }
}

// NPCの行動を処理する関数
function npcAction() {
    // NPCが宣言するかパスするかを決定 (50%の確率で宣言)
    if (Math.random() < 0.5) {
        // 宣言する場合
        let possibleNumbers;
        if (npcNumber === 1) {
            possibleNumbers = [2];
        } else if (npcNumber === 10) {
            possibleNumbers = [9];
        } else {
            possibleNumbers = [npcNumber - 1, npcNumber + 1];
        }
        // 可能な数からランダムに選択
        const guess = possibleNumbers[Math.floor(Math.random() * possibleNumbers.length)];
        if (guess === yourNumber) {
            showResult('lose'); // NPCが当てた場合
        } else {
            showResult('win');  // NPCが外した場合
        }
    } else {
        // パスする場合、再度ゲーム開始
        startGame();
    }
}

// 結果表示関数
function showResult(result) {
    gameState = 'result';
    document.getElementById('game-screen').classList.add('hidden');
    document.getElementById('result-screen').classList.remove('hidden');
    if (result === 'win') {
        document.getElementById('result-message').textContent = 'win';
    } else {
        document.getElementById('result-message').textContent = 'lose';
    }
}
