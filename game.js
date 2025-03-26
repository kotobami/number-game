// グローバル変数
let userNumber, npcNumber;
let turn = 1;
let timerInterval;
let timeLeft = 20;
let userDecision = null; // { action: "guess" or "pass", value: 数値またはnull }
let npcDecision = null;  // { action: "guess" or "pass", value: 数値またはnull }
let gameEnded = false;

// DOM要素の取得
const startScreen = document.getElementById('start-screen');
const recordScreen = document.getElementById('record-screen');
const gameScreen = document.getElementById('game-screen');
const recordDisplay = document.getElementById('record-display');

const startGameBtn = document.getElementById('start-game-btn');
const recordBtn = document.getElementById('record-btn');
const backToStartBtn = document.getElementById('back-to-start-btn');

const userNumberSpan = document.getElementById('user-number');
const npcNumberSpan = document.getElementById('npc-number');
const turnCountSpan = document.getElementById('turn-count');
const timerSpan = document.getElementById('timer');

const guessBtn = document.getElementById('guess-btn');
const passBtn = document.getElementById('pass-btn');
const guessInputArea = document.getElementById('guess-input-area');
const guessInput = document.getElementById('guess-input');
const submitGuessBtn = document.getElementById('submit-guess-btn');

const resultArea = document.getElementById('result-area');
const resultMessage = document.getElementById('result-message');
const continueBtn = document.getElementById('continue-btn');

// イベントリスナーの設定
startGameBtn.addEventListener('click', startGame);
recordBtn.addEventListener('click', showRecord);
backToStartBtn.addEventListener('click', () => {
  recordScreen.classList.add('hidden');
  startScreen.classList.remove('hidden');
});
guessBtn.addEventListener('click', () => {
  guessInputArea.classList.remove('hidden');
});
passBtn.addEventListener('click', () => {
  userDecision = { action: "pass", value: null };
  guessInputArea.classList.add('hidden');
});
submitGuessBtn.addEventListener('click', () => {
  const guessValue = parseInt(guessInput.value);
  if (guessValue >= 1 && guessValue <= 10) {
    userDecision = { action: "guess", value: guessValue };
    guessInputArea.classList.add('hidden');
  } else {
    alert("1〜10の数字を入力してください。");
  }
});
continueBtn.addEventListener('click', () => {
  // 戻るときはスタート画面へ。戦績は記録済みなのでそのまま。
  resetGame();
  gameScreen.classList.add('hidden');
  startScreen.classList.remove('hidden');
});

// ゲーム開始時の初期化
function startGame() {
  startScreen.classList.add('hidden');
  gameScreen.classList.remove('hidden');
  gameEnded = false;
  turn = 1;
  userDecision = null;
  npcDecision = null;
  // 1~9のnをランダムに選び、nとn+1のペア（n<10となるようにする）
  const n = Math.floor(Math.random() * 9) + 1; // n: 1~9
  const pair = [n, n+1];
  // ただし n+1が10になった場合も含む
  if(n+1 > 10) {
    pair[1] = n; // 保険
  }
  // ランダムにユーザーとNPCへ割り当て
  if (Math.random() < 0.5) {
    userNumber = pair[0];
    npcNumber = pair[1];
  } else {
    userNumber = pair[1];
    npcNumber = pair[0];
  }
  userNumberSpan.textContent = userNumber;
  npcNumberSpan.textContent = "???"; // NPCの数字は隠す
  turnCountSpan.textContent = turn;
  timeLeft = 20;
  timerSpan.textContent = timeLeft;
  // カウンター開始
  startTimer();
}

// タイマーの開始
function startTimer() {
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    timeLeft--;
    timerSpan.textContent = timeLeft;
    if(timeLeft <= 0) {
      clearInterval(timerInterval);
      processTurn();
    }
  }, 1000);
}

// NPCの行動戦略
function getNPCDecision(turn, npcNum) {
  // NPCは、原則として「自分に隣接する数字（npcNum+1 または npcNum-1）」がユーザーの数字と推測する
  // ただし、ターンごとに条件が変わるとする。ここではシンプルな例を示す。
  let guess = null;
  if(turn === 1) {
    if(npcNum === 1) guess = 2;
    else if(npcNum === 10) guess = 9;
  } else if(turn === 2) {
    if(npcNum === 2) guess = 3;
    else if(npcNum === 9) guess = 8;
  } else if(turn === 3) {
    if(npcNum === 3) guess = 4;
    else if(npcNum === 8) guess = 7;
  } else if(turn === 4) {
    if(npcNum === 4) guess = 5;
    else if(npcNum === 7) guess = 6;
  } else if(turn === 5) {
    if(npcNum === 5) guess = 6;
    else if(npcNum === 6) guess = 5;
  } else if(turn >= 6) {
    // 6ターン目以降は、単純にnpcNumが5以下なら上側、6以上なら下側を推測
    guess = npcNum <= 5 ? npcNum + 1 : npcNum - 1;
  }
  // NPCは、推測できる状況でなければパスする
  if(guess !== null) {
    return { action: "guess", value: guess };
  } else {
    return { action: "pass", value: null };
  }
}

// ターン終了時の処理
function processTurn() {
  // NPCの判断を取得（ユーザーの行動は既にボタン等で設定済み）
  npcDecision = getNPCDecision(turn, npcNumber);
  
  // 判定処理
  let outcome = null; // "win", "lose", "draw", or null(継続)
  // 両者が「宣言」を選んだ場合
  if(userDecision && userDecision.action === "guess" && npcDecision.action === "guess") {
    const userCorrect = (userDecision.value === npcNumber);
    const npcCorrect = (npcDecision.value === userNumber);
    if(userCorrect && npcCorrect) outcome = "draw";
    else if(userCorrect && !npcCorrect) outcome = "win";
    else if(!userCorrect && npcCorrect) outcome = "lose";
    else outcome = "draw";
  }
  // ユーザーが宣言、NPCがパスの場合
  else if(userDecision && userDecision.action === "guess" && npcDecision.action === "pass") {
    if(userDecision.value === npcNumber) outcome = "win";
    else outcome = "lose"; // ユーザーの宣言が外れているので負け
  }
  // ユーザーがパス、NPCが宣言の場合
  else if(userDecision && userDecision.action === "pass" && npcDecision.action === "guess") {
    if(npcDecision.value === userNumber) outcome = "lose";
    else outcome = "win"; // NPCの宣言が外れているのでユーザーの勝ちとする
  }
  // 両者パスの場合
  else {
    // どちらも行動していない（タイムアウトもパスと同等とする）→ ターン継続
    outcome = null;
  }

  if(outcome) {
    endGame(outcome);
  } else {
    // ターン継続の場合、ターン数を増やし、再度カウントダウン
    turn++;
    turnCountSpan.textContent = turn;
    // リセット：ユーザーの判断は初期化
    userDecision = null;
    npcDecision = null;
    timeLeft = 20;
    timerSpan.textContent = timeLeft;
    startTimer();
  }
}

// ゲーム終了時の処理
function endGame(outcome) {
  clearInterval(timerInterval);
  gameEnded = true;
  // 結果画面にNPCの数字を表示
  npcNumberSpan.textContent = npcNumber;
  // 結果メッセージを表示
  if(outcome === "win") {
    resultMessage.textContent = "win";
  } else if(outcome === "lose") {
    resultMessage.textContent = "lose";
  } else if(outcome === "draw") {
    resultMessage.textContent = "draw";
  }
  resultArea.classList.remove("hidden");
  // 戦績を保存
  saveRecord(outcome);
}

// 戦績の保存（localStorageを利用）
function saveRecord(outcome) {
  let records = JSON.parse(localStorage.getItem("gameRecords")) || [];
  records.push(outcome);
  localStorage.setItem("gameRecords", JSON.stringify(records));
}

// 戦績画面の表示
function showRecord() {
  startScreen.classList.add("hidden");
  recordScreen.classList.remove("hidden");
  let records = JSON.parse(localStorage.getItem("gameRecords")) || [];
  if(records.length === 0) {
    recordDisplay.innerHTML = "<p>まだ戦績はありません。</p>";
    return;
  }
  let winCount = records.filter(r => r === "win").length;
  let loseCount = records.filter(r => r === "lose").length;
  let drawCount = records.filter(r => r === "draw").length;
  let total = records.length;
  let winRate = Math.round(winCount / total * 100);
  recordDisplay.innerHTML = `
    <p>全戦績: ${total}回</p>
    <p>win: ${winCount}回</p>
    <p>lose: ${loseCount}回</p>
    <p>draw: ${drawCount}回</p>
    <p>勝率: ${winRate}%</p>
  `;
}

// ゲームのリセット（続けるボタン時）
function resetGame() {
  // 結果表示エリアの非表示
  resultArea.classList.add("hidden");
  // 入力フォーム、各判断をリセット
  guessInputArea.classList.add("hidden");
  guessInput.value = "";
  userDecision = null;
  npcDecision = null;
  // NPCの数字を再び隠す
  npcNumberSpan.textContent = "???";
}
