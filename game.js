let playerNumber;
let npcNumber;
let history = [];
let isPlayerTurn = true;
let passedFirstTurn = false;

document.getElementById('start-button').addEventListener('click', startGame);
document.getElementById('history-button').addEventListener('click', showHistory);
document.getElementById('back-to-start').addEventListener('click', backToStart);

function startGame() {
    document.getElementById('start-screen').style.display = 'none';
    document.getElementById('game-screen').style.display = 'block';
    document.getElementById('message').textContent = '';

    // 数字の割り当て（ゲーム終了まで固定）
    if (!playerNumber || !npcNumber) {
        const n = Math.floor(Math.random() * 9) + 1; // 1-9
        const numbers = Math.random() < 0.5 ? [n, n + 1] : [n + 1, n];
        playerNumber = numbers[0];
        npcNumber = numbers[1];
    }
    document.getElementById('player-number').textContent = `あなたの数: ${playerNumber}`;

    // 20秒カウントダウン
    let countdown = 20;
    document.getElementById('countdown').textContent = `カウントダウン: ${countdown}秒`;
    const countdownInterval = setInterval(() => {
        countdown--;
        document.getElementById('countdown').textContent = `カウントダウン: ${countdown}秒`;
        if (countdown <= 0) {
            clearInterval(countdownInterval);
            showChoice();
        }
    }, 1000);
}

function showChoice() {
    document.getElementById('countdown').style.display = 'none';
    document.getElementById('choice').style.display = 'block';
    let timeLeft = 5;
    document.getElementById('timer').textContent = `残り時間: ${timeLeft}秒`;

    const timerInterval = setInterval(() => {
        timeLeft--;
        document.getElementById('timer').textContent = `残り時間: ${timeLeft}秒`;
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            passTurn();
        }
    }, 1000);

    document.getElementById('declare-button').onclick = () => {
        clearInterval(timerInterval);
        document.getElementById('choice').style.display = 'none';
        document.getElementById('input-number').style.display = 'block';
    };

    document.getElementById('pass-button').onclick = () => {
        clearInterval(timerInterval);
        passTurn();
    };

    document.getElementById('submit-guess').onclick = () => {
        const guess = parseInt(document.getElementById('guess-input').value);
        if (guess === npcNumber) {
            endGame('勝利');
        } else {
            document.getElementById('input-number').style.display = 'none';
            document.getElementById('message').textContent = `不正解です。NPCのターンへ。`;
            isPlayerTurn = false;
            setTimeout(npcTurn, 1000);
        }
    };
}

function passTurn() {
    document.getElementById('choice').style.display = 'none';
    document.getElementById('message').textContent = 'パスしました。NPCのターンへ。';
    if (isPlayerTurn && history.length === 0) {
        passedFirstTurn = true;
    }
    isPlayerTurn = false;
    setTimeout(npcTurn, 1000);
}

function npcTurn() {
    if (!isPlayerTurn) {
        document.getElementById('message').textContent = 'NPCのターン...';
        setTimeout(() => {
            let npcGuess;
            if (npcNumber === 1) {
                npcGuess = 2;
            } else if (npcNumber === 10) {
                npcGuess = 9;
            } else if (passedFirstTurn && npcNumber === 2) {
                npcGuess = 3;
            } else if (passedFirstTurn && npcNumber === 9) {
                npcGuess = 8;
            } else {
                // ランダム推測（フォールバック）
                npcGuess = Math.floor(Math.random() * 10) + 1;
            }
            document.getElementById('message').textContent = `NPCはあなたの数を${npcGuess}と推測しました。`;
            if (npcGuess === playerNumber) {
                endGame('敗北');
            } else {
                document.getElementById('message').textContent += ' 不正解です。あなたのターンへ。';
                isPlayerTurn = true;
                setTimeout(() => {
                    document.getElementById('choice').style.display = 'block';
                    showChoice();
                }, 1000);
            }
        }, 1000);
    }
}

function endGame(result) {
    document.getElementById('game-screen').style.display = 'none';
    document.getElementById('start-screen').style.display = 'block';
    history.push({
        result: result,
        playerNumber: playerNumber,
        npcNumber: npcNumber
    });
    alert(`ゲーム終了: ${result}`);
}

function showHistory() {
    document.getElementById('start-screen').style.display = 'none';
    document.getElementById('history-screen').style.display = 'block';
    const historyList = document.getElementById('history-list');
    historyList.innerHTML = '';
    history.forEach((game, index) => {
        const p = document.createElement('p');
        p.textContent = `ゲーム${index + 1}: ${game.result} - あなた: ${game.playerNumber}, NPC: ${game.npcNumber}`;
        historyList.appendChild(p);
    });
}

function backToStart() {
    document.getElementById('history-screen').style.display = 'none';
    document.getElementById('start-screen').style.display = 'block';
}
