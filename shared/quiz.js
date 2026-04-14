/**
 * Fair Academy — Shared Quiz/Test Engine
 * Usage: include this script AFTER the question cards are in the DOM.
 *
 * Required DOM contract (page must provide):
 *   - Elements with class `question-card` and data attributes:
 *       data-q="<number>"   — 1-based question index
 *       data-correct="<val>" — correct answer value (e.g. "true"/"false"/a/b/c)
 *   - Each card has `.option` elements with `data-val="<val>"`
 *   - Each card has a `<div class="feedback" id="fb<N>">` element
 *   - `#progressFill` — the progress bar fill element
 *   - `#progressText` — the progress text element
 *   - `#prevBtn` / `#nextBtn` — navigation buttons
 *   - `#nav` — navigation wrapper
 *   - `#results` — results section
 *   - `#scoreNum` — score number span
 *   - `#verdict` — verdict text element
 *   - `#reviewList` — review list container
 *
 * Questions data must be defined BEFORE this script as:
 *   window.QUIZ_QUESTIONS = [ { q, type, correct, explanation: { correct, wrong } }, … ]
 *
 * Optionally define window.QUIZ_VERDICTS as array of [min, max, label] to customise verdicts.
 */
(function () {
  'use strict';

  const questions = window.QUIZ_QUESTIONS || [];
  const total = questions.length;

  const verdicts = window.QUIZ_VERDICTS || (function () {
    if (total <= 0) return [];
    const t = total;
    return [
      [0,            Math.floor(t * 0.3),  'Keep studying — revisit the material carefully.'],
      [Math.floor(t * 0.3) + 1, Math.floor(t * 0.5),  'Fair understanding — some areas need review.'],
      [Math.floor(t * 0.5) + 1, Math.floor(t * 0.7),  'Good grasp of the fundamentals.'],
      [Math.floor(t * 0.7) + 1, t - 1,                'Excellent — strong command of the subject.'],
      [t,            t,                                 'Perfect score — outstanding mastery.'],
    ];
  })();

  let current = 0;
  let answers = {};

  const cards = document.querySelectorAll('.question-card');

  function updateProgress() {
    const answered = Object.keys(answers).length;
    document.getElementById('progressFill').style.width = (answered / total * 100) + '%';
    document.getElementById('progressText').textContent = answered + ' / ' + total;
  }

  function updateNavButtons() {
    const prev = document.getElementById('prevBtn');
    const next = document.getElementById('nextBtn');
    prev.disabled = current === 0;
    const answered = answers[current + 1] !== undefined;
    if (current === total - 1 && answered) {
      next.textContent = 'See Results →';
      next.disabled = false;
    } else {
      next.textContent = 'Next →';
      next.disabled = !answered;
    }
  }

  function navigate(dir) {
    cards[current].classList.remove('active');
    current += dir;
    if (current < 0) current = 0;
    if (current >= total) { showResults(); return; }
    cards[current].classList.add('active');
    updateNavButtons();
  }

  function selectOption(card, option) {
    const qNum = parseInt(card.dataset.q);
    const val = option.dataset.val;
    const correct = card.dataset.correct;
    if (answers[qNum] !== undefined) return;

    answers[qNum] = val;
    const isCorrect = val === correct;
    const fb = document.getElementById('fb' + qNum);
    const qData = questions[qNum - 1];

    card.querySelectorAll('.option').forEach(function (o) {
      o.classList.add('disabled');
      if (o.dataset.val === correct) o.classList.add('correct');
      if (o.dataset.val === val && !isCorrect) o.classList.add('wrong');
      if (o.dataset.val === val && isCorrect) o.classList.add('correct');
    });

    fb.innerHTML = isCorrect ? qData.explanation.correct : qData.explanation.wrong;
    fb.className = 'feedback show ' + (isCorrect ? 'correct-fb' : 'wrong-fb');

    updateProgress();
    updateNavButtons();
  }

  function showResults() {
    document.getElementById('nav').style.display = 'none';
    cards.forEach(function (c) { c.style.display = 'none'; });
    const resultsEl = document.getElementById('results');
    resultsEl.style.display = 'block';

    let score = 0;
    questions.forEach(function (q) {
      if (answers[q.q] === q.correct) score++;
    });

    document.getElementById('scoreNum').textContent = score;

    let verdict = '';
    for (let i = 0; i < verdicts.length; i++) {
      const min = verdicts[i][0], max = verdicts[i][1], label = verdicts[i][2];
      if (score >= min && score <= max) { verdict = label; break; }
    }
    document.getElementById('verdict').textContent = verdict;

    const reviewList = document.getElementById('reviewList');
    reviewList.innerHTML = '';
    questions.forEach(function (q) {
      const userAns = answers[q.q];
      const isOk = userAns === q.correct;
      const item = document.createElement('div');
      item.className = 'review-item';

      const card = document.querySelector('[data-q="' + q.q + '"]');
      const qText = card.querySelector('.q-text').textContent.trim().substring(0, 80) + '…';

      let displayAns = userAns;
      let displayCorrect = q.correct;
      if (q.type === 'tf') {
        displayAns = userAns === 'true' ? 'True' : 'False';
        displayCorrect = q.correct === 'true' ? 'True' : 'False';
      } else {
        displayAns = 'Option ' + userAns.toUpperCase();
        displayCorrect = 'Option ' + q.correct.toUpperCase();
      }

      item.innerHTML =
        '<div class="review-dot ' + (isOk ? 'ok' : 'ko') + '">' + (isOk ? '✓' : '✗') + '</div>' +
        '<div>' +
          '<div class="review-q">Q' + q.q + ': ' + qText + '</div>' +
          '<div class="review-ans">' +
            'Your answer: <span style="color:' + (isOk ? 'var(--verde)' : 'var(--rosso)') + '">' + displayAns + '</span>' +
            (!isOk ? ' &nbsp;·&nbsp; Correct: <span style="color:var(--verde)">' + displayCorrect + '</span>' : '') +
          '</div>' +
        '</div>';
      reviewList.appendChild(item);
    });
  }

  function restartQuiz() {
    answers = {};
    current = 0;
    document.getElementById('results').style.display = 'none';
    document.getElementById('reviewList').innerHTML = '';
    document.getElementById('nav').style.display = 'flex';

    cards.forEach(function (card) {
      card.style.display = '';
      card.classList.remove('active');
      card.querySelectorAll('.option').forEach(function (o) {
        o.classList.remove('selected', 'correct', 'wrong', 'disabled');
      });
      const qNum = parseInt(card.dataset.q);
      const fb = document.getElementById('fb' + qNum);
      if (fb) { fb.className = 'feedback'; fb.innerHTML = ''; }
    });

    cards[0].classList.add('active');
    updateProgress();
    updateNavButtons();
  }

  // Attach listeners
  cards.forEach(function (card) {
    card.querySelectorAll('.option').forEach(function (opt) {
      opt.addEventListener('click', function () { selectOption(card, opt); });
    });
  });

  // Expose navigate and restartQuiz globally for inline onclick handlers
  window.quizNavigate = navigate;
  window.quizRestart  = restartQuiz;

  // Init
  updateNavButtons();
})();
