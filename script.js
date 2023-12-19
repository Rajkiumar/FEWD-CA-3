
  document.addEventListener('DOMContentLoaded', function () {
    // Fetch random meal
    fetch('https://www.themealdb.com/api/json/v1/1/random.php')
      .then(response => response.json())
      .then(data => {
        const randomMealDiv = document.getElementById('randomDish');
        // Update the content of the random meal div with name, image, and a data attribute for ingredients
        const meal = data.meals[0];
        randomMealDiv.innerHTML = `<p>${meal.strMeal}</p><img src="${meal.strMealThumb}" alt="${meal.strMeal}" data-mealid="${meal.idMeal}">`;
      })
      .catch(error => console.error('Error fetching random meal:', error));

    const searchedMealsDiv = document.getElementById('searchedMeals');
    const searchTitle = document.getElementById('searchTitle');

    // Function to update the searched meal div with name, image, and a data attribute for ingredients
    function updateSearchedMeals(meals) {
      searchTitle.classList.remove('hidden');
      const searchedMealsDiv = document.getElementById('searchedMeals');
      searchedMealsDiv.innerHTML = '';

      const mealChunks = chunkArray(meals, 4); // Split meals into arrays of 4 items each
      mealChunks.forEach(chunk => {
          const row = document.createElement('div');
          row.classList.add('searched-meal-row');
          chunk.forEach(meal => {
              const mealDiv = document.createElement('div');
              mealDiv.classList.add('searched-meal');
              mealDiv.innerHTML = `<img src="${meal.strMealThumb}" alt="${meal.strMeal}" data-mealid="${meal.idMeal}">
                                    <p>${meal.strMeal}</p>`;
              row.appendChild(mealDiv);
          });
          searchedMealsDiv.appendChild(row);
      });
    }

  function chunkArray(arr, size) {
      const chunkedArr = [];
      let index = 0;
      while (index < arr.length) {
          chunkedArr.push(arr.slice(index, size + index));
          index += size;
      }
      return chunkedArr;
  }

    // Function to handle search input
    function handleSearchInput() {
      const searchInput = document.getElementById('searchbox');
      const searchTerm = searchInput.value.trim();

      // Fetch meals based on search term
      if (searchTerm !== '') {
        fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchTerm}`)
          .then(response => response.json())
          .then(data => {
            const meals = data.meals;
            updateSearchedMeals(meals);
          })
          .catch(error => console.error('Error fetching searched meals:', error));
      } else {
        // Clear the searched meal div if the search term is empty
        searchedMealsDiv.innerHTML = '';
        searchTitle.classList.add('hidden');
      }
    }

    // Add event listener for search input
    const searchInput = document.getElementById('searchbox');
    searchInput.addEventListener('input', handleSearchInput);

    // Event listener for both random and searched meal images to display ingredients on click
    document.addEventListener('click', function (event) {
      if (event.target && event.target.tagName === 'IMG') {
        const mealId = event.target.getAttribute('data-mealid');
        if (mealId) {
          fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`)
            .then(response => response.json())
            .then(data => {
              const ingredients = [];
              // Collect ingredients and measures from the response
              for (let i = 1; i <= 20; i++) {
                if (data.meals[0][`strIngredient${i}`]) {
                  ingredients.push(`${data.meals[0][`strIngredient${i}`]} - ${data.meals[0][`strMeasure${i}`]}`);
                } else {
                  break;
                }
              }
              // Update the modal content with meal details
              const modalTitle = document.getElementById('modalTitle');
              const modalIngredients = document.getElementById('modalIngredients');
    
              modalTitle.textContent = `Ingredients for ${data.meals[0].strMeal}`;
              modalIngredients.innerHTML = `<p>${data.meals[0].strMeal}</p><p>${ingredients.join('</p><p>')}</p>`;
    
              // Display the modal
              const modal = document.getElementById('modal');
              modal.style.display = 'block';
    
              // Close the modal when the close button is clicked
              const closeModal = document.getElementsByClassName('close')[0];
              closeModal.onclick = function () {
                modal.style.display = 'none';
              };
    
              // Close the modal when clicking outside of it
              window.onclick = function (event) {
                if (event.target == modal) {
                  modal.style.display = 'none';
                }
              };
            })
            .catch(error => console.error('Error fetching meal details:', error));
        }
      }
    });
    
  });