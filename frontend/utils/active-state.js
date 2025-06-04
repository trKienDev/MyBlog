export function handleElementActiveState(htmlElement) {
      const sidebaritems = document.querySelectorAll(htmlElement);
      sidebaritems.forEach(item => {
            item.addEventListener('click', () =>  {
                  sidebaritems.forEach(el => el.classList.remove('active'));
                  item.classList.add('active');
            });
      });
}