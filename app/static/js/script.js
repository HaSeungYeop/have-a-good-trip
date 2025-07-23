const swiper = new Swiper('.swiper-container', {
    loop: true,
    autoplay: {
      delay: 3000,
      disableOnInteraction: false,
    },
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
});

let currentIndex = 0;
const keywordList = document.querySelector('.keyword-slide-list');
const keywordItems = keywordList.querySelectorAll('li');
const keywordCount = keywordItems.length;

setInterval(() => {
  currentIndex = (currentIndex + 1) % keywordCount;
  keywordList.style.transform = `translateY(-${currentIndex * 24}px)`;
}, 3000);