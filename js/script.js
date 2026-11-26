/*
 * 12주차 인터랙티브반 공통 실습 시작 파일
 *
 * 현재 구현됨: 페이지 진입 애니메이션, Hero 숫자 카운트업, 연도별 콘텐츠 전환.
 *
 * Copilot Agent 실습에서 수정할 부모: .compare-section
 * 선택 버튼: .year-button-a / .year-button-b
 * 변경 대상: .year-rate / .year-description / .year-chart
 */

// 기존에 정상 작동하는 화면 진입 효과. 기능 추가 시 유지한다.
document.documentElement.classList.add('has-js');
const revealSections = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  revealSections.forEach((section) => observer.observe(section));
} else {
  revealSections.forEach((section) => section.classList.add('is-visible'));
}

const heroNumber = document.querySelector('.hero-big-number');
if (heroNumber) {
  const valueNode = heroNumber.firstChild;
  if (valueNode) {
    const duration = 1500;
    let startTime;
    const updateCount = (timestamp) => {
      if (startTime === undefined) startTime = timestamp;

      const progress = Math.min((timestamp - startTime) / duration, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      const tenths = progress === 1 ? 42 : Math.floor(easedProgress * 42);
      valueNode.textContent = (tenths / 10).toFixed(1);

      if (progress < 1) requestAnimationFrame(updateCount);
    };

    requestAnimationFrame(updateCount);
  }
}

const compareSection = document.querySelector('#unemployment-compare-section');
if (compareSection) {
  const buttonA = compareSection.querySelector('.year-button-a');
  const buttonB = compareSection.querySelector('.year-button-b');
  const yearContent = compareSection.querySelector('.year-content');

  if (buttonA && buttonB && yearContent) {
    const yearLabel = compareSection.querySelector('.year-label');
    const rate = compareSection.querySelector('.year-rate');
    const title = compareSection.querySelector('.metric-title');
    const description = compareSection.querySelector('.year-description');
    const chart = compareSection.querySelector('.year-chart');
    const chartYear = compareSection.querySelector('.chart-footer span:first-child');
    const chartStatus = compareSection.querySelector('.chart-status');
    const practiceStatus = compareSection.querySelector('.practice-status');
    const yearData = {
      A: {
        rate: '4.2',
        title: '연도 A의 실업률 변화',
        description: '연도 A를 선택한 초기 화면입니다. 학습용 수치를 기반으로 그래프와 설명이 표시됩니다.',
        image: 'images/year-a.svg',
        imageAlt: '가상 데이터 연도 A 실업률 추이 그래프',
        chartStatus: '초기 그래프가 표시 중입니다.'
      },
      B: {
        rate: '3.6',
        title: '연도 B의 실업률 변화',
        description: '연도 B를 선택한 화면입니다.',
        image: 'images/year-b.svg',
        imageAlt: '가상 데이터 연도 B 실업률 추이 그래프',
        chartStatus: '연도 B의 그래프가 표시 중입니다.'
      }
    };
    let selectedYear = 'A';
    let contentUpdateTimeout;

    const selectYear = (year) => {
      if (year === selectedYear) return;

      selectedYear = year;
      buttonA.classList.toggle('active', year === 'A');
      buttonA.setAttribute('aria-pressed', String(year === 'A'));
      buttonB.classList.toggle('active', year === 'B');
      buttonB.setAttribute('aria-pressed', String(year === 'B'));
      yearContent.classList.add('is-changing');
      window.clearTimeout(contentUpdateTimeout);
      contentUpdateTimeout = window.setTimeout(() => {
        const data = yearData[year];
        const rateValue = rate.firstChild;
        if (rateValue) rateValue.textContent = data.rate;
        yearLabel.textContent = `YEAR ${year}`;
        title.textContent = data.title;
        description.textContent = data.description;
        chart.src = data.image;
        chart.alt = data.imageAlt;
        chartYear.textContent = `연도 ${year}`;
        chartStatus.textContent = data.chartStatus;
        practiceStatus.lastChild.textContent = ` 현재 연도 ${year}의 가상 데이터가 표시 중입니다.`;
        requestAnimationFrame(() => yearContent.classList.remove('is-changing'));
      }, 150);
    };

    buttonA.addEventListener('click', () => selectYear('A'));
    buttonB.addEventListener('click', () => selectYear('B'));
  }
}

