// script.js
// DOMContentLoaded 이후 실행
document.addEventListener("DOMContentLoaded", function () {
  const swiper = new Swiper(".swiper-container", {
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
    },
    on: {
      init: function () {
        const paginationContainer = document.querySelector(".custom-swiper-pagination");
        paginationContainer.innerHTML = "";

        // ⚠️ 실제로 .swiper-slide-duplicate 제거하고 재계산
        const realSlides = this.slides; // 이미 loop로 설정된 상태에서 슬라이드 전체 접근
        const realSlideCount = this.wrapperEl.querySelectorAll(".swiper-slide:not(.swiper-slide-duplicate)").length;

        for (let i = 0; i < realSlideCount; i++) {
          const bar = document.createElement("div");
          bar.classList.add("bar");
          if (i === this.realIndex) bar.classList.add("fill");
          paginationContainer.appendChild(bar);
        }

        previousRealIndex = this.realIndex;
      },

      slideChangeTransitionStart: function () {
        if (this.realIndex === previousRealIndex) return;

        const bars = document.querySelectorAll(".bar");
        bars.forEach((bar, index) => {
          bar.classList.remove("fill");
          if (index === this.realIndex) {
            void bar.offsetWidth;
            bar.classList.add("fill");
          }
        });

        previousRealIndex = this.realIndex;
      },
    },
  });
});


// ➕ 이 부분이 bar를 만들어주는 핵심
const paginationContainer = document.querySelector('.custom-swiper-pagination');
swiper.slides.forEach((_, index) => {
  if (index === 0 || index === swiper.slides.length - 1) return; // loop 때문에 추가되는 가짜 슬라이드 제외
  const bar = document.createElement('div');
  bar.classList.add('bar');
  if (index === 1) {
    bar.classList.add('fill');
  }
  paginationContainer.appendChild(bar);
});

// 페이지네이션 애니메이션 초기화 재실행용 이벤트
swiper.on("slideChange", () => {
  const bars = document.querySelectorAll(".bar");
  bars.forEach(bar => bar.classList.remove("active"));
  setTimeout(() => {
    const active = document.querySelectorAll(".bar")[swiper.realIndex];
    if (active) active.classList.add("active");
  }, 10);
});

// ⏸ 일시정지 버튼 동작
const pauseBtn = document.querySelector(".pause");
pauseBtn.addEventListener("click", () => {
  swiper.autoplay.stop();
});

let currentIndex = 0;
const keywordList = document.querySelector('.keyword-slide-list');
const keywordItems = keywordList.querySelectorAll('li');
const keywordCount = keywordItems.length;

setInterval(() => {
  currentIndex = (currentIndex + 1) % keywordCount;
  keywordList.style.transform = `translateY(-${currentIndex * 24}px)`;
}, 3000);


// 로그인 비밀번호 보안
document.querySelectorAll('.show-password').forEach(btn => {
  btn.addEventListener('click', function () {
    const input = this.previousElementSibling;
    if (input.type === 'password') {
      input.type = 'text';
      this.textContent = '숨기기';
    } else {
      input.type = 'password';
      this.textContent = '비밀번호 표시';
    }
  });
});


// 로그인
const loginForm = document.querySelector('.login-form');

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = new FormData(loginForm);
  const data = {
    email: formData.get('username'),  // 로그인시 username 필드로 이메일 받는다고 가정
    password: formData.get('password'),
  };

  try {
    const res = await fetch('/auth/login', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(data),
    });

    const result = await res.json();

    if (res.ok) {
      // JWT 토큰 저장 (로컬스토리지에 저장하는 간단 예)
      localStorage.setItem('access_token', result.access_token);
      alert('로그인 성공!');
      window.location.href = '/'; // 홈으로 이동
    } else {
      alert(result.detail || '로그인 실패');
    }
  } catch (err) {
    alert('서버 오류가 발생했습니다.');
  }
});


// 회원가입
const registerForm = document.querySelector('.login-form');

registerForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  // 폼 데이터 추출
  const formData = new FormData(registerForm);
  const data = {
    username: formData.get('email'),  // username 대신 email로 바꾸려면 백엔드도 같이 맞춰야 함
    email: formData.get('email'),
    password: formData.get('password'),
  };

  // 비밀번호 확인 체크
  if (formData.get('password') !== formData.get('confirm_password')) {
    alert('비밀번호가 일치하지 않습니다.');
    return;
  }

  try {
    const res = await fetch('/auth/register', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (res.ok) {
      alert('회원가입이 완료되었습니다. 로그인 페이지로 이동합니다.');
      window.location.href = '/login';
    } else {
      alert(result.detail || '회원가입에 실패했습니다.');
    }
  } catch (err) {
    alert('서버 오류가 발생했습니다.');
  }
});