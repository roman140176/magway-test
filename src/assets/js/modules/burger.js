export const toggleMenu = (e) => {
  const elem = document.getElementById(e.currentTarget.dataset.toggle);
  elem.classList.toggle('active');
 
}