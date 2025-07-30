document.addEventListener("DOMContentLoaded", function () {
  let previousRealIndex = 0;

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

  // 일시정지 버튼
  const pauseBtn = document.querySelector(".pause");
  if (pauseBtn) {
    pauseBtn.addEventListener("click", () => {
      swiper.autoplay.stop();
    });
  }

  // 키워드 슬라이드 (자동 스크롤)
  let currentIndex = 0;
  const keywordList = document.querySelector('.keyword-slide-list');
  if (keywordList) {
    const keywordItems = keywordList.querySelectorAll('li');
    const keywordCount = keywordItems.length;

    setInterval(() => {
      currentIndex = (currentIndex + 1) % keywordCount;
      keywordList.style.transform = `translateY(-${currentIndex * 24}px)`;
    }, 3000);
  }

  // 비밀번호 보이기/숨기기
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
});

// 로그인 상태에 따라 버튼 변경
function updateAuthButton() {
  const token = localStorage.getItem("access_token");
  const authButton = document.getElementById("auth-button");

  if (!authButton) return;

  if (token) {
    authButton.innerHTML = `<i class="ri-logout-box-line"></i><div>로그아웃</div>`;
    authButton.onclick = () => {
      localStorage.removeItem("access_token");
      alert("로그아웃 되었습니다.");
      updateAuthButton();  // 상태 갱신 (새로고침 없이)
    };
  } else {
    authButton.innerHTML = `<i class="ri-user-line"></i><div>로그인</div>`;
    authButton.onclick = () => window.location.href = "/login";
  }
}

document.addEventListener("DOMContentLoaded", updateAuthButton);
