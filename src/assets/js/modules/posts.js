import smoothscroll from 'smoothscroll-polyfill';
smoothscroll.polyfill();

const API_URL = "https://dummyjson.com/posts";
const USERS_API_URL = "https://dummyjson.com/users";
const MAX_CARDS = 30;
const LOAD_COUNT = 5;
const TITLE_LIMIT = 54; // Ограничение длины заголовка
const BODY_LIMIT = 174; // Ограничение длины текста поста

let loadedCount = 0;
const container = document.querySelector(".posts__items");
export const loadMoreBtn = document.getElementById("load-more");

// Категории для постов
const CATEGORIES = ["Technology", "Nature", "Lifestyle"];

// Функция для выбора одной случайной категории
function getRandomCategory() {
  return CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];
}

// Функция для обрезки заголовка и тела поста
function truncateText(text, limit) {
  return text.length > limit ? text.slice(0, limit - 3) + "..." : text;
}

// Функция для получения случайной даты в прошлом
function getRandomDate() {
  const start = new Date(2015, 0, 1);
  const end = new Date();
  const randomDate = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));

  return {
    readable: randomDate.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "2-digit" }),
    iso: randomDate.toISOString().split("T")[0] // Формат YYYY-MM-DD для datetime
  };
}

// Функция получения постов и авторов
async function fetchPostsWithAuthors(start, limit) {
  const postsResponse = await fetch(`${API_URL}?limit=${limit}&skip=${start}`);
  const usersResponse = await fetch(USERS_API_URL);
  const postsData = await postsResponse.json();
  const usersData = await usersResponse.json();

  return postsData.posts.map(post => ({
    ...post,
    author: usersData.users.find(user => user.id === post.userId)?.firstName || "Unknown",
    date: getRandomDate(),
    category: getRandomCategory()
  }));
}

// Функция для генерации случайного изображения без VPN
function getRandomImage(postId) {
  return `https://placeholder.pagebee.io/api/plain/900/800?text=Post${postId}&bg=C2AB81&color=FFFFFF`;
}

// Функция создания карточки поста
function createCard(post) {
  const card = document.createElement("article");
  card.className = "posts__card";
  card.innerHTML = `
    <div class="posts__card-image">
      <img src="${getRandomImage(post.id)}" alt="Post image">
    </div>
    <div class="posts__card-content">
      <header>
        <span class="posts__card-category">${post.category}</span>
        <h3 class="posts__card-title">${truncateText(post.title, TITLE_LIMIT)}</h3>
      </header>
      <p class="posts__card-info">${truncateText(post.body, BODY_LIMIT)}</p>
      <footer class="posts__card-footer">
        <p class="posts__card-author"><strong>${post.author === "Unknown" ? "Anonymous" : post.author}</strong>, <time datetime="${post.date.iso}">${post.date.readable}</time></p>
        <a href="https://dummyjson.com/posts/${post.id}" target="_blank" rel="noopener noreferrer" class="posts__card-link read-btn">
          <span>Continue reading</span>
        </a>
      </footer>
    </div>
  `;

  return card;
}

// Функция загрузки постов (без автоскролла)
export const loadMorePosts = async (scroll = false) => {
  if (loadedCount >= MAX_CARDS) return;

  fetchPostsWithAuthors(loadedCount, LOAD_COUNT)
    .then(posts => {
      posts.forEach(post => container.appendChild(createCard(post)));
      loadedCount += LOAD_COUNT;

      if (loadedCount >= MAX_CARDS) {
        loadMoreBtn.disabled = true;
        loadMoreBtn.querySelector("span").textContent = "Больше нет постов";
      }
    })
    .finally(() => {
      if (scroll) {
        loadMoreBtn.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    });
}