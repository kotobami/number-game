// 勝敗判定
function judgeTurn() {
    const resultEl = document.getElementById('result');
    resultEl.classList.remove('hidden');

    const playerDeclared = typeof playerChoice === 'number'; // ユーザーが宣言したか
    const npcDeclared = typeof npcChoice === 'number';      // NPCが宣言したか
    const playerCorrect = playerDeclared && playerChoice === npcNumber; // ユーザーの宣言が正しいか
    const npcCorrect = npcDeclared && npcChoice === playerNumber;      // NPCの宣言が正しいか

    if (playerDeclared && npcDeclared) {
        // 両方が宣言した場合
        if (playerCorrect && npcCorrect) {
            resultEl.textContent = 'draw';
            stats.draws++;
            endGame();
        } else if (playerCorrect) {
            resultEl.textContent = 'win';
            stats.playerWins++;
            endGame();
        } else if (npcCorrect) {
            resultEl.textContent = 'lose';
            stats.npcWins++;
            endGame();
        } else {
            resultEl.textContent = 'draw';
            stats.draws++;
            endGame();
        }
    } else if (playerDeclared) {
        // ユーザーが宣言し、NPCがパスの場合
        if (playerCorrect) {
            resultEl.textContent = 'win';
            stats.playerWins++;
            endGame();
        } else {
            continueGame();
        }
    } else if (npcDeclared) {
        // NPCが宣言し、ユーザーがパスの場合
        if (npcCorrect) {
            resultEl.textContent = 'lose';
            stats.npcWins++;
            endGame();
        } else {
            continueGame();
        }
    } else {
        // 両方がパスした場合
        continueGame();
    }
}

// ゲームを継続する処理
function continueGame() {
    turn++;
    playerChoice = null;
    npcChoice = null;
    startTimer();
    document.getElementById('result').classList.add('hidden');
}

// ゲームを終了する処理
function endGame() {
    localStorage.setItem('gameStats', JSON.stringify(stats));
    document.getElementById('continue-btn').classList.remove('hidden');
}
