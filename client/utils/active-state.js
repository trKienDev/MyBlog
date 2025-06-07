function handleElementActiveState(htmlElement, callbackFn) {
      const sidebaritems = document.querySelectorAll(htmlElement);
      sidebaritems.forEach(item => {
            item.addEventListener('click', function(event) {
                  if(this.classList.contains('active')) {
                        return;
                  }

                  const current_activeTab = document.querySelector(`${htmlElement}.active`);
                  if(current_activeTab) {
                        current_activeTab.classList.remove('active');
                  }

                  item.classList.add('active');
                  if (callbackFn && typeof callbackFn === 'function') {
                        callbackFn(item);
                  }
            });
      });
}

const activeState_utils = {
      handleElementActiveState,
}
export default activeState_utils;