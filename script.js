// 等待DOM加载完成
document.addEventListener('DOMContentLoaded', function() {
    // 获取DOM元素
    const controlButton = document.getElementById('control-button');
    const mailboxDoor = document.getElementById('mailbox-door');
    const loveLetter = document.getElementById('love-letter');
    const loveMessage = document.getElementById('love-message');
    const playButton = document.getElementById('play-button');
    const backgroundMusic = document.getElementById('background-music');
    const doorSound = document.getElementById('door-sound');
    const paperSound = document.getElementById('paper-sound');

    // 情话内容库
    const loveQuotes = [
        { text: "永远都像初次见你那样，使我心荡漾", song: "《程艾影》" },
        { text: "我给你非正式的表白，但这是我最赤诚的爱", song: "《非正式主题曲》" },
        { text: "相信有纯白，会越过山海，<br>闯进你心怀，不辜负等待，<br>勇敢的人，才没放开", song: "《相爱》" },
        { text: "艾蜜莉，艾蜜莉，夕阳掉进我心里，我要带你去寻找，散落的星星", song: "《艾蜜莉》" },
        { text: "有谁能比我知道，你的温柔像羽毛，<br>秘密躺在我怀抱，只有你能听得到", song: "《你听得到》" },
        { text: "教堂里举行着婚礼，我路过感到甜蜜，<br>也让我想到我和你", song: "《海鸥》" },
        { text: "愿爱无忧", song: "《愿爱无忧》" },
        { text: "五颜六色的花丛，没有一个特别喜欢的颜色，<br>我爱天上的云朵，但我手脏不能将它触摸", song: "《朵》" },
        { text: "你如此美丽，而且你可爱至极", song: "《灰姑娘》" },
        { text: "脑袋都是你 心里都是你，小小的爱在大城里好甜蜜，<br>念的都是你 全部都是你，小小的爱在大城里只为你倾心", song: "《大城小爱》" },
        { text: "我真得爱你，每人能比拟", song: "《唯一》" }
    ];

    // 已显示过的情话索引
    let displayedQuotes = [];
    // 是否正在播放音乐
    let isPlaying = false;
    // 信箱是否已打开
    let mailboxOpen = false;

    // 初始化页面
    initPage();

    // 初始化函数
    function initPage() {
        // 为黄铜元素添加发光效果
        const brassElements = document.querySelectorAll('.bg-brass');
        brassElements.forEach(el => el.classList.add('brass-glow'));

        // 为背景添加动画
        const bgElements = document.querySelectorAll('.bg-cover');
        bgElements.forEach(el => el.classList.add('animate-bg'));

        // 添加按钮点击事件
        controlButton.addEventListener('click', handleControlButtonClick);
        playButton.addEventListener('click', toggleMusic);

        // 设置音频音量
        backgroundMusic.volume = 0.5;
        
        // 初始化信纸状态 - 确保在信箱门下方且不可见
        loveLetter.style.zIndex = '5'; // 设置为比信箱门低的z-index
        loveLetter.style.opacity = '0'; // 初始透明度为0
    }

    // 处理控制按钮点击
    function handleControlButtonClick() {
        if (mailboxOpen) {
            resetMailbox();
        } else {
            openMailbox();
        }
    }

    // 打开信箱函数
    function openMailbox() {
        // 按钮按压动画
        controlButton.classList.add('button-press');
        controlButton.disabled = true;

        // 短暂延迟后触发信箱开启动画
        setTimeout(() => {
            // 播放信箱开门音效
            try {
                doorSound.currentTime = 0;
                doorSound.play();
            } catch (e) {
                console.log('音效播放失败:', e);
            }

            // 信箱门打开动画
            mailboxDoor.classList.add('mailbox-door-open');

            // 创建粒子效果
            createParticles();

            // 延迟后情书飞出
            setTimeout(() => {
                // 播放纸张翻动音效
                try {
                    paperSound.currentTime = 0;
                    paperSound.play();
                } catch (e) {
                    console.log('音效播放失败:', e);
                }

                // 确保情书元素重置状态并设置初始位置
                loveLetter.style.zIndex = '100'; // 打开时设置高z-index，确保显示在最上层
                loveLetter.style.transform = 'translateX(-50%) translateY(0) scale(0.8)';
                
                // 先移除可能存在的动画类
                loveLetter.classList.remove('letter-fly', 'letter-open');
                
                // 强制重排，确保动画能够重新触发
                void loveLetter.offsetWidth;
                
                // 添加情书飞出和展开动画
                loveLetter.classList.add('letter-fly', 'letter-open');

                // 延迟后显示随机情话
                setTimeout(() => {
                    showRandomQuote();
                    // 更新按钮状态和文本
                    mailboxOpen = true;
                    controlButton.textContent = '重新开启';
                    controlButton.disabled = false;
                    controlButton.classList.remove('button-press');
                }, 800); // 减少到0.8秒后显示文字
            }, 150); // 减少到150毫秒后情书飞出
        }, 200); // 200毫秒按钮按压动画
    }

    // 重置信箱函数
    function resetMailbox() {
        // 隐藏情书
        loveLetter.classList.remove('letter-fly', 'letter-open');
        loveLetter.style.opacity = '0';
        loveLetter.style.zIndex = '5'; // 重置为初始z-index，确保在信箱门下方
        loveMessage.innerHTML = '';
        loveMessage.classList.remove('text-fade-in');

        // 关闭信箱门
        mailboxDoor.classList.remove('mailbox-door-open');

        // 更新按钮状态和文本
        mailboxOpen = false;
        controlButton.textContent = '打开信箱';
        controlButton.disabled = false;
        controlButton.classList.remove('button-press');

        // 停止音乐
        if (isPlaying) {
            toggleMusic();
        }
    }

    // 显示随机情话函数
    function showRandomQuote() {
        // 如果所有情话都已显示，则重置显示记录
        if (displayedQuotes.length >= loveQuotes.length) {
            displayedQuotes = [];
        }

        // 随机选择一个未显示过的情话
        let availableQuotes = loveQuotes.filter((_, index) => !displayedQuotes.includes(index));
        let randomIndex = Math.floor(Math.random() * availableQuotes.length);
        let selectedQuote = availableQuotes[randomIndex];
        let originalIndex = loveQuotes.indexOf(selectedQuote);
        
        // 添加到已显示记录
        displayedQuotes.push(originalIndex);

        // 先移除动画类，确保下次能重新触发动画
        loveMessage.classList.remove('text-fade-in');
        
        // 强制重排，确保动画能够重新触发
        void loveMessage.offsetWidth;

        // 先设置文字内容，但确保初始状态不可见
        loveMessage.innerHTML = `
            <p>${selectedQuote.text}</p>
            <p class="mt-2 text-sm opacity-80">——${selectedQuote.song}</p>
        `;
        
        // 确保文字初始状态为透明并位于下方位置
        loveMessage.style.opacity = '0';
        loveMessage.style.transform = 'translateY(20px)';
        
        // 强制重排，确保初始样式被应用
        void loveMessage.offsetWidth;
        
        // 添加动画类，触发文字渐入效果
        loveMessage.classList.add('text-fade-in');
    }

    // 切换音乐播放状态函数
    function toggleMusic() {
        if (isPlaying) {
            // 暂停音乐
            backgroundMusic.pause();
            playButton.innerHTML = '<i class="fa fa-music text-white text-xs"></i>';
            isPlaying = false;
        } else {
            // 播放音乐
            try {
                // 重置音乐到开始位置
                backgroundMusic.currentTime = 0;
                
                // 使用Promise处理播放操作
                const playPromise = backgroundMusic.play();
                
                if (playPromise !== undefined) {
                    playPromise.then(_ => {
                        // 播放成功，更新按钮状态
                        playButton.innerHTML = '<i class="fa fa-pause text-white text-xs"></i>';
                        isPlaying = true;
                    }).catch(error => {
                        console.log('音乐播放失败:', error);
                        // 播放失败，恢复按钮状态
                        playButton.innerHTML = '<i class="fa fa-music text-white text-xs"></i>';
                        isPlaying = false;
                        
                        // 显示用户友好的提示
                        if (error.name === 'AbortError') {
                            console.log('播放请求被中断，可能是由于快速连续点击');
                        } else if (error.name === 'NotAllowedError') {
                            console.log('浏览器阻止了自动播放，需要用户交互');
                            // 可以在这里添加一个提示，告诉用户需要点击页面来启用音频
                        }
                    });
                }
            } catch (e) {
                console.log('音乐播放失败:', e);
                playButton.innerHTML = '<i class="fa fa-music text-white text-xs"></i>';
                isPlaying = false;
            }
        }
    }

    // 创建粒子效果函数
    function createParticles() {
        const mailboxBody = document.getElementById('mailbox-body');
        const containerRect = mailboxBody.getBoundingClientRect();
        const containerTop = containerRect.top + window.scrollY;
        const containerLeft = containerRect.left + window.scrollX;
        const centerX = containerLeft + containerRect.width / 2;
        const centerY = containerTop + containerRect.height / 4;

        // 创建20个粒子
        for (let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            particle.classList.add('particle');
            document.body.appendChild(particle);

            // 随机粒子位置和大小
            const size = Math.random() * 3 + 1;
            const angle = Math.random() * Math.PI * 2;
            const distance = Math.random() * 50 + 20;
            const finalX = centerX + Math.cos(angle) * distance;
            const finalY = centerY + Math.sin(angle) * distance;

            // 设置初始位置
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.left = `${centerX - size/2}px`;
            particle.style.top = `${centerY - size/2}px`;

            // 添加动画
            setTimeout(() => {
                particle.style.transition = 'all 1s ease-out';
                particle.style.opacity = '0.8';
                particle.style.transform = `translate(${finalX - centerX}px, ${finalY - centerY}px)`;

                // 动画结束后移除粒子
                setTimeout(() => {
                    particle.style.transition = 'opacity 0.5s ease-out';
                    particle.style.opacity = '0';
                    setTimeout(() => {
                        document.body.removeChild(particle);
                    }, 500);
                }, 1000);
            }, 10);
        }
    }

    // 为移动设备添加触摸优化
    const touchSupported = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const clickEvent = touchSupported ? 'touchstart' : 'click';

    // 重新绑定按钮事件以支持触摸
    controlButton.removeEventListener('click', handleControlButtonClick);
    playButton.removeEventListener('click', toggleMusic);

    controlButton.addEventListener(clickEvent, handleControlButtonClick);
    playButton.addEventListener(clickEvent, toggleMusic);

    // 禁止按钮的默认触摸行为
    controlButton.addEventListener('touchstart', function(e) { e.preventDefault(); }, { passive: false });
    playButton.addEventListener('touchstart', function(e) { e.preventDefault(); }, { passive: false });

    // 确保情书内容区域在不同屏幕尺寸下都能正确显示
    function adjustLayout() {
        const viewportWidth = window.innerWidth;
        const mailboxContainer = document.querySelector('.mailbox-container');
        
        if (viewportWidth < 768) {
            mailboxContainer.style.height = '400px';
            mailboxContainer.style.width = '360px'; // 按比例缩小
        } else if (viewportWidth < 480) {
            mailboxContainer.style.height = '350px';
            mailboxContainer.style.width = '315px'; // 按比例缩小
        } else {
            mailboxContainer.style.height = '500px';
            mailboxContainer.style.width = '450px'; // 更新为新的宽度
        }
    }

    // 初始调整和窗口大小变化时调整布局
    adjustLayout();
    window.addEventListener('resize', adjustLayout);

    // 音频播放错误处理 - 为所有音频元素添加错误处理
    function handleAudioError(audioElement, type) {
        audioElement.addEventListener('error', function(e) {
            console.log(`${type}音频加载错误:`, e);
            // 音频加载失败不影响核心功能，仅在控制台记录错误
            // 可以根据需要添加用户友好的提示
        });
    }

    // 为所有音频元素应用错误处理
    handleAudioError(backgroundMusic, '背景音乐');
    handleAudioError(doorSound, '开门音效');
    handleAudioError(paperSound, '纸张音效');

    // 防止页面滚动干扰体验
    document.body.style.overflow = 'hidden';
});