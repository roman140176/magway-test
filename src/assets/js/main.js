import 'virtual:svg-icons-register'
import { loadMorePosts,loadMoreBtn } from './modules/posts.js'
import { toggleMenu } from './modules/burger.js'
// Поддержка HMR
if (import.meta.hot) {
  import.meta.hot.accept()
}

const burger = document.querySelector('.header__burger')
burger.addEventListener('click', toggleMenu)

// Загружаем первые 5 карточек при загрузке страницы (без скролла)
window.addEventListener("DOMContentLoaded", () => loadMorePosts(false));

// Подгрузка карточек при нажатии на кнопку (со скроллом)
loadMoreBtn.addEventListener("click", () => loadMorePosts(true));
