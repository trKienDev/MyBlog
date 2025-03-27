export function InitDropdownElement() {
      const dropdowns = document.querySelectorAll('.custom-dropdown');

      dropdowns.forEach(dropdown => {
            const selectedDiv = dropdown.querySelector('.custom-dropdown_selected');
            const listDiv = dropdown.querySelector('.custom-dropdown_list');
            const items = listDiv.querySelectorAll('.cutom-dropdown_item');
            const hiddenInput = dropdown.querySelector('input[type="hidden"]');

            selectedDiv.addEventListener('click', () => {
                  if(listDiv.style.display === 'block') {
                        listDiv.style.display = 'none';
                  } else {
                        document.querySelectorAll('.custom-dropdown_list').forEach(otherList => {
                              otherList.style.display = 'none';
                        });
                        listDiv.style.display = 'block';
                  }
            });

            items.forEach(item => {
                  item.addEventListener('click', () => {
                        selectedDiv.textContent = item.dataset.value;
                        hiddenInput.value = item.dataset.value;
                        listDiv.style.display = 'none';
                  });
            });
      });

      window.addEventListener('click', (e) => {
            dropdowns.forEach(dropdown => {
                  const listDiv = dropdown.querySelector('.custom-dropdown_list');
                  if(!dropdown.contains(e.target)) {
                        listDiv.style.display = 'none';
                  }
            });
      });
}