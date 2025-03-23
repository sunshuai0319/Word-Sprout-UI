/**
 * WordSprout - 单词萌芽
 * 主要JavaScript文件
 */

// 全局应用状态
const appState = {
  currentUser: null,
  learningProgress: {},
  settings: {
    soundEnabled: true,
    vibrationEnabled: true, 
    dailyGoal: 20,
    notificationsEnabled: true
  }
};

// 页面初始化处理
document.addEventListener('DOMContentLoaded', function() {
  // 检测当前页面，执行对应初始化
  const currentPage = getCurrentPage();
  console.log('当前页面:', currentPage);

  initializeCommonElements();
  
  // 页面特定的初始化
  switch (currentPage) {
    case 'home':
      initHomePage();
      break;
    case 'word-learning':
      initWordLearningPage();
      break;
    case 'difficulty-selection':
      initDifficultyPage();
      break;
    case 'speech-training':
      initSpeechTrainingPage();
      break;
    case 'game-center':
      initGameCenterPage();
      break;
    case 'learning-report':
      initLearningReportPage();
      break;
    case 'personal-center':
      initPersonalCenterPage();
      break;
    case 'settings':
      initSettingsPage();
      break;
    case 'wrong-words':
      initWrongWordsPage();
      break;
  }

  hideScrollbars();

  /**
   * Preview页面脚本
   */
  if (document.getElementById('pageSelector')) {
    // 页面选择器改变事件
    document.getElementById('pageSelector').addEventListener('change', function() {
      document.getElementById('mobileFrame').src = this.value;
    });

    // 刷新按钮点击事件
    document.getElementById('refreshBtn')?.addEventListener('click', function() {
      const frame = document.getElementById('mobileFrame');
      frame.src = frame.src;
    });
  }

  /* ====================
   * Navbar组件脚本
   * ==================== */
  // 根据当前页面路径激活对应的导航项
  const navItems = document.querySelectorAll('.nav-footer a');
  if (navItems.length > 0) {
    const currentPath = window.location.pathname;
    
    navItems.forEach(item => {
      const href = item.getAttribute('href');
      if (currentPath.includes(href)) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });
  }

  setupWordImages();
});

// 获取当前页面名称
function getCurrentPage() {
  const path = window.location.pathname;
  const pageMatch = path.match(/([^\/]+)\.html$/);
  return pageMatch ? pageMatch[1] : 'home';
}

// 初始化公共元素
function initializeCommonElements() {
  // 添加返回按钮功能
  const backButtons = document.querySelectorAll('.back-button');
  backButtons.forEach(button => {
    button.addEventListener('click', handleBackNavigation);
  });

  // 添加底部导航功能
  const navButtons = document.querySelectorAll('.nav-item');
  navButtons.forEach(button => {
    button.addEventListener('click', function() {
      const target = this.getAttribute('data-target');
      if (target) {
        navigateTo(target);
      }
    });
  });
}

// 处理返回导航
function handleBackNavigation() {
  // 根据当前页面决定返回行为
  const currentPage = getCurrentPage();
  
  // 返回逻辑
  if (window.history.length > 1) {
    window.history.back();
  } else {
    // 默认返回首页
    navigateTo('home.html');
  }
}

// 页面导航
function navigateTo(page) {
  // 添加过渡动画
  document.body.classList.add('page-transition');
  
  // 延迟跳转，让动画有时间播放
  setTimeout(() => {
    window.location.href = page;
  }, 300);
}

// 首页初始化
function initHomePage() {
  console.log('初始化首页');
  // 加载学习进度
  updateLearningProgress();
  
  // 绑定主要功能按钮
  const learningButton = document.querySelector('.feature-item[data-feature="learning"]');
  if (learningButton) {
    learningButton.addEventListener('click', () => navigateTo('difficulty-selection.html'));
  }
  
  const speechButton = document.querySelector('.feature-item[data-feature="speech"]');
  if (speechButton) {
    speechButton.addEventListener('click', () => navigateTo('speech-training.html'));
  }
  
  const gameButton = document.querySelector('.feature-item[data-feature="game"]');
  if (gameButton) {
    gameButton.addEventListener('click', () => navigateTo('game-center.html'));
  }
  
  const reportButton = document.querySelector('.feature-item[data-feature="report"]');
  if (reportButton) {
    reportButton.addEventListener('click', () => navigateTo('learning-report.html'));
  }
}

// 更新学习进度展示
function updateLearningProgress() {
  // 模拟数据 - 实际应用中从服务器或本地存储获取
  const progress = {
    wordsLearned: 120,
    streakDays: 7,
    dailyGoal: appState.settings.dailyGoal,
    todayLearned: 15
  };
  
  // 更新进度展示
  const wordsLearnedEl = document.querySelector('.stats-item[data-stat="words-learned"] .stat-value');
  if (wordsLearnedEl) {
    wordsLearnedEl.textContent = progress.wordsLearned;
  }
  
  const streakDaysEl = document.querySelector('.stats-item[data-stat="streak"] .stat-value');
  if (streakDaysEl) {
    streakDaysEl.textContent = progress.streakDays;
  }
  
  // 更新进度条
  const progressBar = document.querySelector('.progress-bar-inner');
  if (progressBar) {
    const percentage = Math.min(100, Math.round((progress.todayLearned / progress.dailyGoal) * 100));
    progressBar.style.width = `${percentage}%`;
    
    // 更新进度文本
    const progressText = document.querySelector('.progress-text');
    if (progressText) {
      progressText.textContent = `${progress.todayLearned}/${progress.dailyGoal}`;
    }
  }
}

// 单词学习页面初始化
function initWordLearningPage() {
  console.log('初始化单词学习页面');
  
  // 模拟单词数据
  const words = [
    { word: 'apple', translation: '苹果', phonetic: '/ˈæpl/', image: 'assets/images/apple.jpg', examples: ['I eat an apple every day.', 'The apple is red.'] },
    { word: 'banana', translation: '香蕉', phonetic: '/bəˈnɑːnə/', image: 'assets/images/banana.jpg', examples: ['Monkeys like bananas.', 'The banana is yellow.'] },
    { word: 'cat', translation: '猫', phonetic: '/kæt/', image: 'assets/images/cat.jpg', examples: ['The cat is sleeping.', 'I have a pet cat.'] },
    // 更多单词...
  ];
  
  let currentWordIndex = 0;
  
  // 显示当前单词
  function showCurrentWord() {
    const currentWord = words[currentWordIndex];
    
    // 更新界面元素
    const wordEl = document.getElementById('current-word');
    const phoneticEl = document.getElementById('word-phonetic');
    const translationEl = document.getElementById('word-translation');
    const imageEl = document.getElementById('word-image');
    const examplesEl = document.getElementById('word-examples');
    
    if (wordEl) wordEl.textContent = currentWord.word;
    if (phoneticEl) phoneticEl.textContent = currentWord.phonetic;
    if (translationEl) translationEl.textContent = currentWord.translation;
    if (imageEl) imageEl.src = currentWord.image;
    
    // 更新例句
    if (examplesEl) {
      examplesEl.innerHTML = '';
      currentWord.examples.forEach(example => {
        const li = document.createElement('li');
        li.textContent = example;
        examplesEl.appendChild(li);
      });
    }
    
    // 更新进度
    const progressEl = document.querySelector('.learning-progress-text');
    if (progressEl) {
      progressEl.textContent = `${currentWordIndex + 1}/${words.length}`;
    }
  }
  
  // 绑定按钮事件
  const prevButton = document.getElementById('prev-word-btn');
  const nextButton = document.getElementById('next-word-btn');
  
  if (prevButton) {
    prevButton.addEventListener('click', () => {
      if (currentWordIndex > 0) {
        currentWordIndex--;
        showCurrentWord();
      }
    });
  }
  
  if (nextButton) {
    nextButton.addEventListener('click', () => {
      if (currentWordIndex < words.length - 1) {
        currentWordIndex++;
        showCurrentWord();
      } else {
        // 学习完成，显示完成界面或返回
        alert('恭喜！本组单词学习完成！');
        navigateTo('home.html');
      }
    });
  }
  
  // 初始化显示第一个单词
  showCurrentWord();
  
  // 朗读功能
  const speakButton = document.getElementById('speak-word-btn');
  if (speakButton) {
    speakButton.addEventListener('click', () => {
      const currentWord = words[currentWordIndex].word;
      speakText(currentWord);
    });
  }
}

// 文本朗读功能
function speakText(text) {
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    speechSynthesis.speak(utterance);
  } else {
    console.log('您的浏览器不支持语音合成');
  }
}

// 难度选择页面初始化
function initDifficultyPage() {
  console.log('初始化难度选择页面');
  
  // 绑定难度选择事件
  const difficultyItems = document.querySelectorAll('.difficulty-item');
  
  difficultyItems.forEach(item => {
    item.addEventListener('click', function() {
      const difficulty = this.getAttribute('data-difficulty');
      // 保存所选难度
      localStorage.setItem('selectedDifficulty', difficulty);
      // 导航到单词学习页
      navigateTo('word-learning.html');
    });
  });
}

// 语音训练页面初始化
function initSpeechTrainingPage() {
  console.log('初始化语音训练页面');
  
  // 模拟待训练单词
  const trainingWords = [
    { word: 'hello', translation: '你好', phonetic: '/həˈləʊ/', audioUrl: 'assets/audio/hello.mp3' },
    { word: 'goodbye', translation: '再见', phonetic: '/ɡʊdˈbaɪ/', audioUrl: 'assets/audio/goodbye.mp3' },
    { word: 'thank you', translation: '谢谢', phonetic: '/θæŋk juː/', audioUrl: 'assets/audio/thank_you.mp3' },
    // 更多单词...
  ];
  
  let currentTrainingIndex = 0;
  
  // 显示当前训练单词
  function showTrainingWord() {
    const currentWord = trainingWords[currentTrainingIndex];
    
    // 更新界面元素
    const wordEl = document.getElementById('training-word');
    const phoneticEl = document.getElementById('training-phonetic');
    const translationEl = document.getElementById('training-translation');
    
    if (wordEl) wordEl.textContent = currentWord.word;
    if (phoneticEl) phoneticEl.textContent = currentWord.phonetic;
    if (translationEl) translationEl.textContent = currentWord.translation;
    
    // 更新进度
    const progressEl = document.querySelector('.training-progress-text');
    if (progressEl) {
      progressEl.textContent = `${currentTrainingIndex + 1}/${trainingWords.length}`;
    }
  }
  
  // 绑定按钮事件
  // 播放标准发音
  const playButton = document.getElementById('play-pronunciation');
  if (playButton) {
    playButton.addEventListener('click', () => {
      const currentWord = trainingWords[currentTrainingIndex];
      // 在实际应用中，这里会播放音频文件
      speakText(currentWord.word);
    });
  }
  
  // 录音按钮
  let isRecording = false;
  const recordButton = document.getElementById('record-pronunciation');
  if (recordButton) {
    recordButton.addEventListener('click', () => {
      isRecording = !isRecording;
      
      if (isRecording) {
        // 开始录音
        recordButton.innerHTML = '<i class="fas fa-stop"></i> 停止录音';
        recordButton.classList.add('recording');
        // 实际应用中，这里会调用录音API
        console.log('开始录音...');
      } else {
        // 停止录音
        recordButton.innerHTML = '<i class="fas fa-microphone"></i> 开始录音';
        recordButton.classList.remove('recording');
        console.log('停止录音，准备分析...');
        
        // 模拟分析过程
        setTimeout(() => {
          showRecordingResult();
        }, 1000);
      }
    });
  }
  
  // 显示录音结果
  function showRecordingResult() {
    // 模拟评分结果
    const score = Math.floor(Math.random() * 30) + 70; // 70-100之间的随机分数
    
    const resultEl = document.querySelector('.pronunciation-result');
    if (resultEl) {
      resultEl.classList.remove('hidden');
      
      const scoreEl = document.getElementById('pronunciation-score');
      if (scoreEl) {
        scoreEl.textContent = score;
        
        // 根据分数显示不同的反馈
        const feedbackEl = document.getElementById('pronunciation-feedback');
        if (feedbackEl) {
          if (score >= 90) {
            feedbackEl.textContent = '太棒了！发音非常标准！';
          } else if (score >= 80) {
            feedbackEl.textContent = '很好！发音比较标准！';
          } else {
            feedbackEl.textContent = '不错！再多练习几次吧！';
          }
        }
      }
    }
  }
  
  // 下一个单词
  const nextButton = document.getElementById('next-training-word');
  if (nextButton) {
    nextButton.addEventListener('click', () => {
      // 隐藏结果区域
      const resultEl = document.querySelector('.pronunciation-result');
      if (resultEl) {
        resultEl.classList.add('hidden');
      }
      
      // 加载下一个单词
      if (currentTrainingIndex < trainingWords.length - 1) {
        currentTrainingIndex++;
        showTrainingWord();
      } else {
        // 训练完成
        alert('恭喜！本组单词语音训练完成！');
        navigateTo('home.html');
      }
    });
  }
  
  // 初始化显示第一个单词
  showTrainingWord();
}

// 游戏中心页面初始化
function initGameCenterPage() {
  console.log('初始化游戏中心页面');
  
  // 绑定游戏选择事件
  const gameItems = document.querySelectorAll('.game-item');
  
  gameItems.forEach(item => {
    item.addEventListener('click', function() {
      const gameType = this.getAttribute('data-game');
      
      // 根据选择的游戏类型进行导航
      switch(gameType) {
        case 'matching':
          alert('即将开始单词匹配游戏');
          // navigateTo('word-matching-game.html');
          break;
        case 'listening':
          alert('即将开始听力选择游戏');
          // navigateTo('listening-game.html');
          break;
        case 'spelling':
          alert('即将开始拼写挑战游戏');
          // navigateTo('spelling-game.html');
          break;
        default:
          console.log('未知的游戏类型');
      }
    });
  });
}

// 学习报告页面初始化
function initLearningReportPage() {
  console.log('初始化学习报告页面');
  
  // 这里应该包含图表初始化代码
  // 在实际应用中，需要引入图表库，如Chart.js或ECharts
  
  // 以下是模拟数据
  const weeklyData = {
    labels: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
    values: [15, 20, 8, 25, 12, 30, 22]
  };
  
  const accuracyData = {
    correct: 85,
    wrong: 15
  };
  
  // 更新周学习数据
  const weeklyStatsEl = document.getElementById('weekly-stats');
  if (weeklyStatsEl) {
    // 在实际应用中，这里会使用图表库绘制条形图
    let weeklyHTML = '<div class="weekly-bars">';
    
    weeklyData.labels.forEach((day, index) => {
      const height = weeklyData.values[index] * 2; // 将数值转换为高度
      weeklyHTML += `
        <div class="weekly-bar-item">
          <div class="weekly-bar" style="height: ${height}px;"></div>
          <div class="weekly-day">${day}</div>
          <div class="weekly-value">${weeklyData.values[index]}</div>
        </div>
      `;
    });
    
    weeklyHTML += '</div>';
    weeklyStatsEl.innerHTML = weeklyHTML;
  }
  
  // 更新正确率数据
  const accuracyEl = document.getElementById('accuracy-stats');
  if (accuracyEl) {
    // 在实际应用中，这里会使用图表库绘制饼图
    const accuracyHTML = `
      <div class="accuracy-circle">
        <svg width="120" height="120" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r="54" fill="none" stroke="#e6e6e6" stroke-width="12" />
          <circle cx="60" cy="60" r="54" fill="none" stroke="#4CAF50" stroke-width="12" 
                  stroke-dasharray="${accuracyData.correct * 3.39} ${accuracyData.wrong * 3.39}" 
                  stroke-dashoffset="0" />
        </svg>
        <div class="accuracy-text">${accuracyData.correct}%</div>
      </div>
      <div class="accuracy-label">正确率</div>
    `;
    
    accuracyEl.innerHTML = accuracyHTML;
  }
}

// 个人中心页面初始化
function initPersonalCenterPage() {
  console.log('初始化个人中心页面');
  
  // 模拟用户数据
  const userData = {
    name: '小萌芽',
    avatar: 'assets/images/avatar.jpg',
    level: 5,
    totalWords: 120,
    streakDays: 7,
    achievements: [
      { name: '初次学习', description: '完成第一次单词学习', icon: 'fa-star', unlocked: true },
      { name: '连续七天', description: '连续学习七天', icon: 'fa-calendar-check', unlocked: true },
      { name: '词汇达人', description: '掌握100个单词', icon: 'fa-book', unlocked: true },
      { name: '发音专家', description: '语音训练获得90分以上', icon: 'fa-microphone', unlocked: false },
      { name: '游戏高手', description: '在游戏中获得满分', icon: 'fa-gamepad', unlocked: false }
    ]
  };
  
  // 更新用户信息
  const userNameEl = document.getElementById('user-name');
  const userAvatarEl = document.getElementById('user-avatar');
  const userLevelEl = document.getElementById('user-level');
  
  if (userNameEl) userNameEl.textContent = userData.name;
  if (userAvatarEl) userAvatarEl.src = userData.avatar;
  if (userLevelEl) userLevelEl.textContent = userData.level;
  
  // 更新统计数据
  const wordsLearnedEl = document.querySelector('.stat-item[data-stat="words-learned"] .stat-value');
  const streakDaysEl = document.querySelector('.stat-item[data-stat="streak-days"] .stat-value');
  
  if (wordsLearnedEl) wordsLearnedEl.textContent = userData.totalWords;
  if (streakDaysEl) streakDaysEl.textContent = userData.streakDays;
  
  // 更新成就列表
  const achievementsEl = document.getElementById('achievements-list');
  if (achievementsEl) {
    let achievementsHTML = '';
    
    userData.achievements.forEach(achievement => {
      const lockedClass = achievement.unlocked ? '' : 'locked';
      achievementsHTML += `
        <div class="achievement-item ${lockedClass}">
          <div class="achievement-icon">
            <i class="fas ${achievement.icon}"></i>
          </div>
          <div class="achievement-info">
            <div class="achievement-name">${achievement.name}</div>
            <div class="achievement-description">${achievement.description}</div>
          </div>
          <div class="achievement-status">
            ${achievement.unlocked ? 
              '<i class="fas fa-check-circle text-green-500"></i>' : 
              '<i class="fas fa-lock text-gray-400"></i>'}
          </div>
        </div>
      `;
    });
    
    achievementsEl.innerHTML = achievementsHTML;
  }
}

// 设置页面初始化
function initSettingsPage() {
  console.log('初始化设置页面');
  
  // 获取设置
  const settings = appState.settings;
  
  // 更新设置UI
  const soundToggle = document.getElementById('sound-toggle');
  const vibrationToggle = document.getElementById('vibration-toggle');
  const notificationToggle = document.getElementById('notification-toggle');
  const dailyGoalInput = document.getElementById('daily-goal-input');
  
  if (soundToggle) {
    soundToggle.checked = settings.soundEnabled;
    soundToggle.addEventListener('change', function() {
      settings.soundEnabled = this.checked;
      saveSettings();
    });
  }
  
  if (vibrationToggle) {
    vibrationToggle.checked = settings.vibrationEnabled;
    vibrationToggle.addEventListener('change', function() {
      settings.vibrationEnabled = this.checked;
      saveSettings();
    });
  }
  
  if (notificationToggle) {
    notificationToggle.checked = settings.notificationsEnabled;
    notificationToggle.addEventListener('change', function() {
      settings.notificationsEnabled = this.checked;
      saveSettings();
    });
  }
  
  if (dailyGoalInput) {
    dailyGoalInput.value = settings.dailyGoal;
    
    // 保存按钮
    const saveGoalBtn = document.getElementById('save-goal-btn');
    if (saveGoalBtn) {
      saveGoalBtn.addEventListener('click', function() {
        const newGoal = parseInt(dailyGoalInput.value);
        if (newGoal > 0) {
          settings.dailyGoal = newGoal;
          saveSettings();
          alert('每日目标已更新!');
        } else {
          alert('请输入有效的目标数值');
        }
      });
    }
  }
  
  // 绑定退出登录按钮
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', function() {
      if (confirm('确定要退出登录吗？')) {
        // 清除登录状态
        appState.currentUser = null;
        // 返回首页
        navigateTo('home.html');
      }
    });
  }
}

// 保存设置
function saveSettings() {
  // 在实际应用中，这里会将设置保存到localStorage或发送到服务器
  localStorage.setItem('wordSproutSettings', JSON.stringify(appState.settings));
  console.log('设置已保存', appState.settings);
}

// 初始化错题本页面
function initWrongWordsPage() {
  console.log('初始化错题本页面');
  
  // 模拟错题数据
  const wrongWords = [
    { word: 'necessary', translation: '必要的', wrongCount: 3, lastWrong: '2023-05-15' },
    { word: 'restaurant', translation: '餐厅', wrongCount: 2, lastWrong: '2023-05-14' },
    { word: 'beautiful', translation: '美丽的', wrongCount: 2, lastWrong: '2023-05-12' },
    { word: 'experience', translation: '经验', wrongCount: 5, lastWrong: '2023-05-16' },
    { word: 'dictionary', translation: '字典', wrongCount: 1, lastWrong: '2023-05-10' }
  ];
  
  // 更新错题列表
  const wrongWordsListEl = document.getElementById('wrong-words-list');
  if (wrongWordsListEl) {
    let wrongWordsHTML = '';
    
    wrongWords.forEach(item => {
      wrongWordsHTML += `
        <div class="wrong-word-item">
          <div class="word-info">
            <div class="word-text">${item.word}</div>
            <div class="word-translation">${item.translation}</div>
          </div>
          <div class="word-stats">
            <div class="wrong-count" title="错误次数">
              <i class="fas fa-times-circle text-red-500"></i> ${item.wrongCount}
            </div>
            <div class="last-wrong" title="最后一次错误">
              <i class="fas fa-calendar text-gray-500"></i> ${item.lastWrong}
            </div>
          </div>
          <div class="word-actions">
            <button class="review-btn" data-word="${item.word}">
              <i class="fas fa-sync-alt"></i> 复习
            </button>
            <button class="remove-btn" data-word="${item.word}">
              <i class="fas fa-check"></i> 移除
            </button>
          </div>
        </div>
      `;
    });
    
    wrongWordsListEl.innerHTML = wrongWordsHTML;
    
    // 绑定复习按钮事件
    const reviewButtons = document.querySelectorAll('.review-btn');
    reviewButtons.forEach(button => {
      button.addEventListener('click', function() {
        const word = this.getAttribute('data-word');
        alert(`开始复习单词: ${word}`);
        // 实际应用中，导航到单词学习页面
      });
    });
    
    // 绑定移除按钮事件
    const removeButtons = document.querySelectorAll('.remove-btn');
    removeButtons.forEach(button => {
      button.addEventListener('click', function() {
        const word = this.getAttribute('data-word');
        if (confirm(`确定要从错题本中移除 "${word}" 吗？`)) {
          // 移除单词
          this.closest('.wrong-word-item').remove();
          // 实际应用中，需要更新后端数据
        }
      });
    });
  }
  
  // 绑定一键复习按钮
  const reviewAllBtn = document.getElementById('review-all-btn');
  if (reviewAllBtn) {
    reviewAllBtn.addEventListener('click', function() {
      alert('开始复习所有错题');
      // 实际应用中，导航到专门的错题复习页面
    });
  }
  
  // 绑定清空错题本按钮
  const clearAllBtn = document.getElementById('clear-all-btn');
  if (clearAllBtn) {
    clearAllBtn.addEventListener('click', function() {
      if (confirm('确定要清空错题本吗？此操作不可恢复！')) {
        // 清空错题本
        const wrongWordsListEl = document.getElementById('wrong-words-list');
        if (wrongWordsListEl) {
          wrongWordsListEl.innerHTML = '<div class="empty-message">错题本为空</div>';
        }
        // 实际应用中，需要更新后端数据
      }
    });
  }
}

// 更新状态栏时间
function updateStatusTime() {
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const timeElement = document.querySelector('.status-time');
  if (timeElement) {
    timeElement.textContent = `${hours}:${minutes}`;
  }
}

// 初始更新时间并设置定时器每分钟更新一次
if (document.querySelector('.status-time')) {
  updateStatusTime();
  setInterval(updateStatusTime, 60000);
}

// 隐藏所有滚动条
function hideScrollbars() {
  // 创建一个样式元素
  const style = document.createElement('style');
  
  // 添加滚动条隐藏规则
  style.textContent = `
    html, body, div, main, section, article, aside, nav {
      scrollbar-width: none !important;
      -ms-overflow-style: none !important;
    }
    
    html::-webkit-scrollbar, 
    body::-webkit-scrollbar, 
    div::-webkit-scrollbar, 
    main::-webkit-scrollbar, 
    section::-webkit-scrollbar, 
    article::-webkit-scrollbar, 
    aside::-webkit-scrollbar, 
    nav::-webkit-scrollbar {
      display: none !important;
      width: 0 !important;
      height: 0 !important;
    }
  `;
  
  // 将样式添加到head
  document.head.appendChild(style);
  
  // 对所有有overflow样式的元素添加滚动条隐藏类
  const scrollableElements = document.querySelectorAll('[class*="overflow"]');
  scrollableElements.forEach(el => {
    el.style.scrollbarWidth = 'none';
    el.style.msOverflowStyle = 'none';
  });
}

// 模拟单词发音功能
function playPronunciation(word) {
  console.log(`播放单词发音: ${word}`);
  // 实际项目中应该连接到语音API
}

// 单词卡片翻转效果
function initFlipCards() {
  const flipCards = document.querySelectorAll('.flip-card');
  flipCards.forEach(card => {
    card.addEventListener('click', function() {
      this.classList.toggle('flipped');
    });
  });
}

// 处理难度选择
function initDifficultySelection() {
  const difficultyCards = document.querySelectorAll('.difficulty-card');
  difficultyCards.forEach(card => {
    card.addEventListener('click', function() {
      // 移除其他卡片的选中状态
      difficultyCards.forEach(c => c.classList.remove('selected'));
      // 添加当前卡片的选中状态
      this.classList.add('selected');
    });
  });
}

// 窗口大小变化时重新应用滚动条隐藏
window.addEventListener('resize', hideScrollbars);

// 页面完全加载后再次确保滚动条隐藏（捕获懒加载内容）
window.addEventListener('load', hideScrollbars);

// 单词图片处理 - 学习页面功能
function setupWordImages() {
  const wordImages = document.querySelectorAll('.word-image img');
  if (wordImages.length > 0) {
    wordImages.forEach(img => {
      img.addEventListener('click', function() {
        // 创建模态框显示大图
        const modal = document.createElement('div');
        modal.classList.add('image-modal');
        modal.style.position = 'fixed';
        modal.style.top = '0';
        modal.style.left = '0';
        modal.style.width = '100%';
        modal.style.height = '100%';
        modal.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        modal.style.display = 'flex';
        modal.style.alignItems = 'center';
        modal.style.justifyContent = 'center';
        modal.style.zIndex = '9999';
        
        const modalImg = document.createElement('img');
        modalImg.src = this.src;
        modalImg.style.maxWidth = '90%';
        modalImg.style.maxHeight = '90%';
        modalImg.style.borderRadius = '8px';
        
        modal.appendChild(modalImg);
        document.body.appendChild(modal);
        
        // 点击模态框关闭
        modal.addEventListener('click', function() {
          document.body.removeChild(modal);
        });
      });
    });
  }
} 