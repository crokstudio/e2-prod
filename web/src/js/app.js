const gallery = document.querySelector('.grid-layout__gallery');
const filters = Array.from(document.querySelectorAll('input[name="projects-filter"]'));
const allFilter = filters.find(input => input.id === 'filter-all');
const categoryFilters = filters.filter(input => input !== allFilter);

// Store original nodes + order ONCE
const originalItems = Array.from(gallery.children);

// Helper: restore full gallery in original order
function restoreAll() {
  originalItems.forEach(item => gallery.appendChild(item));
}

let areCategoriesChecked = false;

// Main filter function
function applyFilter(input) {

    if(input.id != 'filter-all') {
        for (let i = 0; i < categoryFilters.length; i++) {
            if (categoryFilters[i].checked) {
                areCategoriesChecked = true;
            }
        }
        if(areCategoriesChecked === false){
            input.checked = true; // Prevent unchecking last category
        }else{
            areCategoriesChecked = false;
            allFilter.checked = false;
            restoreAll();
    
            for (let i = 0; i < originalItems.length; i++) {
                if (window.getComputedStyle(originalItems[i]).display === "none") {
                    gallery.removeChild(originalItems[i]);
                }
            }
        }

    }else{
        if(input.checked === false){
            input.checked = true;
            return; // No action needed
        }else{
            restoreAll();
            categoryFilters.forEach(input => input.checked = false);
        }
    }

}

// Listen to filter changes
filters.forEach(input => {
  input.addEventListener('change', () => {
    applyFilter(input);
  });
});