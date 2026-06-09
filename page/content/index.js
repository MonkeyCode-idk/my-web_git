// 轮播图逻辑 
const images = [
    "../../img/操场.jpg",
    "../../img/花朵.jpg",
    "../../img/毛.jpg",
    "../../img/图书馆.jpg",
    "../../img/学校大门.jpg",

];
let currentIndex = 0;
const imgElement = document.getElementById("carouselImg");
const dotsContainer = document.getElementById("dots");
let autoTimer = null;
// 更新图片和小圆点
function updateCarousel() {
    imgElement.src = images[currentIndex];
    document.querySelectorAll(".dot").forEach((dot, idx) => {
        if (idx === currentIndex) {
            dot.classList.add("active");
        } else {
            dot.classList.remove("active");
        }
    });
}
// 下一张
function nextSlide() {
    currentIndex = (currentIndex + 1) % images.length;
    updateCarousel();
}
// 上一张
function prevSlide() {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    updateCarousel();
}
// 跳转到指定张
function goToSlide(index) {
    currentIndex = index;
    updateCarousel();
}

// 生成小圆点
function initDots() {
    dotsContainer.innerHTML = "";
    for (let i = 0; i < images.length; i++) {
        const dot = document.createElement("div");
        dot.classList.add("dot");
        if (i === currentIndex) dot.classList.add("active");
        dot.addEventListener("click", () => goToSlide(i));
        dotsContainer.appendChild(dot);
    }
}

// 启动自动播放
function startAutoPlay() {
    if (autoTimer) clearInterval(autoTimer);
    autoTimer = setInterval(() => {
        nextSlide();
    }, 1500);  // 4秒切换一次
}

// 停止自动播放（鼠标移入时）
function stopAutoPlay() {
    if (autoTimer) {
        clearInterval(autoTimer);
        autoTimer = null;
    }
}

// 绑定事件
document.getElementById("prevBtn").addEventListener("click", () => {
    prevSlide();
    stopAutoPlay();
    startAutoPlay();  // 重新计时
});
document.getElementById("nextBtn").addEventListener("click", () => {
    nextSlide();
    stopAutoPlay();
    startAutoPlay();
});

// 鼠标悬停暂停自动播放
const carouselContainer = document.querySelector(".carousel-container");
carouselContainer.addEventListener("mouseenter", stopAutoPlay);
carouselContainer.addEventListener("mouseleave", startAutoPlay);

// 初始化
initDots();
updateCarousel();
startAutoPlay();

// 导航栏锚点滚动
const navLinks = document.querySelectorAll(".nav-tabs a");
navLinks.forEach(link => {
    link.addEventListener("click", (e) => {
        if (e.target.classList.contains('work')) {
            location.href = './项目负责/项目负责.html'
        }
        e.preventDefault();
        const sectionId = link.getAttribute("data-section");
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.scrollIntoView({ behavior: "smooth" });
        }
        // 更新active样式
        navLinks.forEach(l => l.classList.remove("active"));
        link.classList.add("active");
    });
});
// ==================== 走马灯美食卡片 ====================
// 美食数据
const foods = [
    { name: "倔强面(老餐厅二楼)", desc: "招牌拌面", price: "¥10/人", time: "校内", img: '../../FoodImg/倔强面老餐厅.jpg' },
    { name: "咸肉菜饭(新餐厅二楼)", desc: "肉菜汤饭", price: "¥12/人", time: "校内", img: '../../FoodImg/咸肉菜饭新餐厅.jpg' },
    { name: "天之福私房菜(老餐厅二楼)", desc: "回锅肉", price: "¥15/人", time: "校内", img: '../../FoodImg/天之福私房菜.jpg' },
    { name: "小炒盖浇饭(老餐厅二楼)", desc: "两荤一素", price: "¥10/人", time: "校内", img: '../../FoodImg/小炒盖浇饭老餐厅二楼.jpg' },
    { name: "南昌粉(新餐厅二楼)", desc: "山野菜浆面条", price: "¥8/人", time: "校内", img: '../../FoodImg/新餐厅老南昌粉.jpg' },
    { name: "烩面掉渣饼(新餐厅一楼)", desc: "掉渣饼", price: "¥7/份", time: "校内", img: '../../FoodImg/烩面掉渣饼.jpg' },
    { name: "私房热干面混沌(老餐厅二楼)", desc: "招牌热干面", price: "¥8/份", time: "校内", img: '../../FoodImg/私房热干面混沌.jpg' },
    { name: "美事堡(老餐厅二楼)", desc: "汉堡套餐", price: "¥12/份", time: "校内", img: '../../FoodImg/美事堡.jpg' }
];

// 生成卡片HTML
function generateFoodCards() {
    let html = '';
    // 复制两份实现无缝循环
    const allFoods = [...foods, ...foods];
    allFoods.forEach(food => {
        html += `
                    <div class="food-card">
                        <img class="food-img" src="${food.img}" alt="${food.name}">
                        <div class="food-info">
                            <div class="food-name">${food.name}</div>
                            <div class="food-desc">⭐ ${food.desc}</div>
                            <div class="food-price">💰 ${food.price}</div>
                            <div class="food-time">🚶 ${food.time}</div>
                        </div>
                    </div>
                `;
    });
    document.getElementById('marqueeTrack').innerHTML = html;
}


// 可选：点击卡片弹出提示（演示用，可以删掉）
document.addEventListener('click', (e) => {
    const card = e.target.closest('.food-card');
    if (card && document.getElementById('marqueeTrack').contains(card)) {
        const name = card.querySelector('.food-name')?.innerText || '这家店';
        alert(`🍽️ 你选中了 ${name}\n快去尝尝吧！`);
    }
});


generateFoodCards()

// 高德
// 学校经纬度
const schoolLocation = {
    lng: 113.526764,
    lat: 34.710879
};

// 获取用户选的值
let address
document.querySelector('.route-btn').addEventListener('click', () => {
    if (document.querySelector('.form-select').value === '选择乘坐起点') return
    address = document.querySelector('.form-select').value
    getAddressNum(address)


})
// 我的key
let myKey = ''
// 获取地理编码
async function getAddressNum(address) {
    if (!myKey) {
        return alert('请先在index.js文件中设置myKey变量为你的高德API Key')
    }
    try {
        const res = await axios({
            url: 'https://restapi.amap.com/v3/geocode/geo',
            method: 'GET',
            params: {
                key: myKey,
                address: address,
            }
        })
        console.log(res);
        // 经纬度坐标
        const locatcion = res.data.geocodes[0].location
        console.log(`当前经纬度是${locatcion}`);
        getBusRoute(locatcion, schoolLocation.lng, schoolLocation.lat)


    } catch (error) {
        console.dir(error);
    }
}
// 公交路线规划
async function getBusRoute(origin, destLng, destLat) {
    try {
        const res = await axios({
            url: 'https://restapi.amap.com/v3/direction/transit/integrated',
            method: 'GET',
            params: {
                key: myKey,
                origin: `${origin}`,      // 起点：经度,纬度
                destination: `${destLng},${destLat}`,      // 终点：经度,纬度
                city: '郑州',
                cityd: '郑州',
                strategy: 0  // 0最快捷，1最经济，2最少换乘，3最少步行
            }
        });
        // console.log('公交路线：', res.data.route.transits)
        // 当前方案
        const plants = res.data.route.transits
        console.log(plants);
        // 根据方案数量修改html元素
        renderPlants(plants)
        // return res.data;
    } catch (error) {
        console.dir(error);
    }
}


// 根据方案数量修改html元素
function renderPlants(plants) {
    // 清空并重新生成方案标签
    document.querySelector('.scheme-tag ul').innerHTML = '';
    for (let i = 1; i <= plants.length; i++) {
        document.querySelector('.scheme-tag ul').innerHTML += `<li data-id="${i - 1}">方案${i}</li>`;
    }
    // active逻辑
    const items = document.querySelectorAll('.scheme-tag ul li')
    // 默认显示第一个方案
    if (plants.length > 0) {
        renderRouteDetail(plants[0]);
        items[0].classList.add('Active')
    }
    // 给方案绑定点击事件
    const list = document.querySelector('.scheme-tag ul');
    list.addEventListener('click', e => {
        if (e.target.tagName === 'LI') {
            // 删除所有 li 的 Active 类
            document.querySelectorAll('.scheme-tag ul li').forEach(li => {
                li.classList.remove('Active')
            })
            e.target.classList.add('Active')
            const index = e.target.dataset.id;
            renderRouteDetail(plants[index]);
        }
    });
}

// 渲染路线详情
function renderRouteDetail(plantsData) {
    // 当前方案耗时（分钟）
    const costTime = Math.ceil(plantsData.duration / 60);
    // 当前方案花费
    const costMoney = plantsData.cost;
    // 当前方案总步行距离
    const walking = plantsData.walking_distance;

    // 更新头部信息
    document.querySelector('.route-header').innerHTML = `
        <div class="header-item"><span class="emoji">⏱️</span> 约${costTime}分钟</div>
        <div class="header-item"><span class="emoji">🚶</span> 步行${walking}米</div>
        <div class="header-item"><span class="emoji">💰</span> 约${costMoney}元</div>
    `;

    // 解析并生成步骤
    const segments = plantsData.segments;
    let stepsHtml = '';

    for (let i = 0; i < segments.length; i++) {
        const segment = segments[i];

        // 1. 步行路段
        if (segment.walking && segment.walking.distance && parseInt(segment.walking.distance) > 0) {
            const walkDist = segment.walking.distance;
            let walkInstruction = '';
            if (segment.walking.steps && segment.walking.steps.length > 0) {
                walkInstruction = segment.walking.steps[0].instruction || '';
                // 去掉HTML标签
                walkInstruction = walkInstruction.replace(/<[^>]*>/g, '');
            }
            stepsHtml += `
                <div class="step">
                    <div class="step-icon walk">🚶</div>
                    <div class="step-content">
                        <div class="step-title">步行 ${walkDist}米</div>
                        <div class="step-detail">${walkInstruction || '步行至下一站'}</div>
                    </div>
                </div>
            `;
        }

        // 2. 公交/地铁路段
        if (segment.bus && segment.bus.buslines && segment.bus.buslines.length > 0) {
            const busline = segment.bus.buslines[0];
            const lineName = busline.name;
            const startStop = busline.departure_stop?.name || '上车';
            const endStop = busline.arrival_stop?.name || '下车';
            const viaNum = busline.via_num || 0;
            const direction = busline.end_name || '';

            // 判断是地铁还是公交
            const isSubway = lineName.includes('地铁') || lineName.includes('号线');
            const badgeClass = isSubway ? 'badge-subway' : 'badge-bus';

            stepsHtml += `
                <div class="step">
                    <div class="step-icon ${isSubway ? 'subway' : 'bus'}">${isSubway ? '🚇' : '🚌'}</div>
                    <div class="step-content">
                        <div class="step-title">
                            <span class="badge-line ${badgeClass}">${lineName}</span>
                            乘坐 ${lineName}
                        </div>
                        <div class="step-detail">
                            在【${startStop}】上车 → 方向：${direction}<br>
                            途经 ${viaNum} 站 → 在【${endStop}】下车
                        </div>
                    </div>
                </div>
            `;
        }

        // 3. 换乘提示（不是最后一段，且下一段有公交）
        if (i < segments.length - 1) {
            const nextSegment = segments[i + 1];
            if (nextSegment.bus && nextSegment.bus.buslines) {
                stepsHtml += `
                    <div class="step">
                        <div class="step-icon">🔄</div>
                        <div class="step-content">
                            <div class="step-title">换乘</div>
                            <div class="step-detail">步行至下一站换乘</div>
                        </div>
                    </div>
                `;
            }
        }
    }

    // 更新步骤区域
    document.querySelector('.route-steps').innerHTML = stepsHtml;
}

// 模态框
const modalDom = document.querySelector('.modal')
const modal = new bootstrap.Modal(modalDom)
const zheng = document.querySelector('.zheng')
const live = document.querySelector('.live')
const thingInput = document.querySelector('.thing')
// 当前是哪种类型
let currentType = ''
zheng.addEventListener('click', () => {
    modal.show()
    currentType = 'zhengjian'
    document.querySelector('.modal-title').innerHTML = '证件类'
    thingInput.value = '' // 清空上次输入

})

live.addEventListener('click', () => {
    modal.show()
    currentType = 'shenghuo'
    document.querySelector('.modal-title').innerHTML = '生活类'
    thingInput.value = ''

})

// ✅ 监听器只注册一次
document.querySelector('.add').addEventListener('click', () => {
    const value = thingInput.value.trim()
    if (value === '') {
        alert('输入不能为空')
        return
    }

    if (currentType === 'zhengjian') {
        document.querySelector('#zhengjian').innerHTML +=
            `<li><input type="checkbox"> ${value}</li>`
    } else if (currentType === 'shenghuo') {
        const li = document.createElement('LI')
        li.innerHTML = `<input type="checkbox"> ${value}`
        document.querySelector('#shenghuo').appendChild(li)
    }

    modal.hide()
})

// ==================== 天气功能 ====================
async function fetchWeather() {
    const weatherDiv = document.getElementById('weatherWidget');
    if (!weatherDiv) return;

    try {
        const response = await fetch('https://api.oioweb.cn/api/weather/weather?city_name=郑州');
        const data = await response.json();

        if (data.code === 200 && data.result) {
            const weather = data.result;
            const temp = weather.current_temperature;
            const condition = weather.current_condition;

            // 根据天气状况选择合适的图标
            let icon = '☀️';
            if (condition.includes('雨')) icon = '🌧️';
            else if (condition.includes('雪')) icon = '❄️';
            else if (condition.includes('阴')) icon = '☁️';
            else if (condition.includes('云')) icon = '⛅';

            weatherDiv.innerHTML = `
                <span>${icon}</span>
                <span>郑州 ${temp}°C</span>
                <span style="font-size: 12px; color: #666;">${condition}</span>
            `;
        } else {
            throw new Error('API返回异常');
        }
    } catch (error) {
        console.error('天气API调用失败:', error);
        // 降级方案：显示默认天气
        weatherDiv.innerHTML = `
            <span>☀️</span>
            <span>郑州 24°C</span>
            <span style="font-size: 12px; color: #666;">晴</span>
        `;
    }
}

// 页面加载完成后获取天气
document.addEventListener('DOMContentLoaded', fetchWeather);
