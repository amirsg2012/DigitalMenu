<!-- AdminPanel.svelte -->
<!-- AdminPanel.svelte -->
<script>
    // Import necessary functions and components
    import { onMount } from 'svelte';
    import { fly } from 'svelte/transition';
    import { MY_IP } from '../env.js' ;


    let menuItems = [];
    let newItem = {}; // Object to store new item data
    let categories = []; // Array to store unique categories
    let selectedCategory = ''; // Variable to store the selected category
    let selectedItemId = ''; // Variable to store the ID of the selected item for modification
    let selectedItem = {}; // Object to store the selected item for modification
    let imageFile; // Variable to store the selected image file
    let newCategory = {}; // Object to store new category data
    let selectedCategoryId = ''; // Variable to store the ID of the selected category for modification
    let selectedCategoryItem = {}; // Object to store the selected category for modification
    let categoryIconFile; // Variable to store the selected category icon file

    // Define session timeout duration (20 minutes)
    const SESSION_TIMEOUT = 20 * 60 * 1000; // in milliseconds

    let timeoutId; // Variable to store the timeout ID

    // Reset the session timeout on user activity
    function resetSessionTimeout() {
        clearTimeout(timeoutId); // Clear previous timeout
        timeoutId = setTimeout(logout, SESSION_TIMEOUT); // Set new timeout
    }

    // Function to logout the user (redirect to login page)
    function logout() {
        localStorage.removeItem('token'); // Remove token from localStorage
        window.location.href = '/login'; // Redirect to login page
    }


    // Check if the user is authenticated
    const isAuthenticated = () => {
        const token = localStorage.getItem('token'); // Assuming token is stored in localStorage
        return !!token;
    };

    // Redirect to login page if not authenticated
    onMount(() => {
        if (!isAuthenticated()) {
            window.location.href = '/login'; // Redirect to login page
        } else {

            // Start the session timeout countdown
            resetSessionTimeout();
            // Reset session timeout on user activity
            window.addEventListener('mousemove', resetSessionTimeout);
            window.addEventListener('mousedown', resetSessionTimeout);
            window.addEventListener('keypress', resetSessionTimeout);
            fetchMenuItems(); // Fetch menu items if authenticated
            fetchCategories(); // Fetch categories on mount
        }
    });

    async function fetchMenuItems() {
        try {
            const response = await fetch('http://'+ MY_IP +':5000/api/menu');
            if (!response.ok) {
                throw new Error('Failed to fetch menu items');
            }
            menuItems = await response.json();
        } catch (error) {
            console.error('Error fetching menu items:', error);
        }
    }

    async function fetchCategories() {
        try {
            const response = await fetch('http://'+ MY_IP +':5000/api/categories');
            if (!response.ok) {
                throw new Error('Failed to fetch categories');
            }
            categories = await response.json();
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    }

    // Function to handle adding new item
    function addNewItem() {
        const formData = new FormData();
        formData.append('data', JSON.stringify(newItem));
        formData.append('image', imageFile);

        // Send a request to the server to add the new item
        fetch('http://'+ MY_IP +':5000/api/menu/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newItem)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to add new item');
            }
            // Refresh the menu items after adding the new item
            fetchMenuItems();
        })
        .catch(error => {
            console.error('Error adding new item:', error);
        });
    }

    // Function to handle adding new category
    function addNewCategory() {
        const formData = new FormData();
        formData.append('data', JSON.stringify(newCategory));
        formData.append('icon', categoryIconFile);

        // Send a request to the server to add the new category
        fetch('http://'+ MY_IP +':5000/api/categories', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newCategory)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to add new category');
            }
            // Refresh the categories after adding the new category
            fetchCategories();
        })
        .catch(error => {
            console.error('Error adding new category:', error);
        });
    }

    
    // Function to handle updating the selected category
    function updateSelectedCategory() {
        const formData = new FormData();
        formData.append('data', JSON.stringify(selectedCategoryItem));
        formData.append('icon', categoryIconFile);
        // Send a request to the server to update the selected category
        fetch(`http://${MY_IP}:5000/api/categories/${selectedCategoryItem._id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(selectedCategoryItem)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to update category');
            }
            // Refresh the categories after updating the category
            fetchCategories();
        })
        .catch(error => {
            console.error('Error updating category:', error);
        });
    }

   // Function to handle category icon selection
function handleCategoryIconUpload(event) {
    categoryIconFile = event.target.files[0];
    const formData = new FormData();
    formData.append('icon', categoryIconFile);

    fetch('http://'+ MY_IP +':5000/api/categories/upload-icon', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (!data.iconUrl) {
            throw new Error('Icon URL not found in response');
        }
        newCategory.iconUrl = data.iconUrl; // Update newCategory's iconUrl
        selectedCategoryItem.iconUrl = data.iconUrl; // Update selectedCategoryItem's iconUrl
    })
    .catch(error => {
        console.error('Error uploading category icon:', error);
    });
}

// Function to handle image selection for menu items
function handleImageUpload(event) {
    const file = event.target.files[0];
    const formData = new FormData();
    imageFile = event.target.files[0];
    formData.append('image', file);

    fetch('http://'+ MY_IP +':5000/api/menu/upload', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (!data.imageUrl) {
            throw new Error('Image URL not found in response');
        }
        newItem.imageUrl = data.imageUrl; // Update newItem's imageUrl
        selectedItem.imageUrl = data.imageUrl; // Update selectedItem's imageUrl
    })
    .catch(error => {
        console.error('Error uploading image:', error);
    });
}


    // Function to handle deleting the selected category
    function deleteSelectedCategory() {
        if (confirm("Are you sure you want to delete this category?")) {
            // Send a request to the server to delete the selected category
            fetch(`http://${MY_IP}:5000/api/categories/${selectedCategoryItem._id}`, {
                method: 'DELETE'
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to delete category');
                }
                // Refresh the categories after deleting the category
                fetchCategories();
                // Clear selected category details
                selectedCategoryId = '';
                selectedCategoryItem = {};
            })
            .catch(error => {
                console.error('Error deleting category:', error);
            });
        }
    }
    function selectItemForModification(itemId) {
        selectedItemId = itemId;
        selectedItem = menuItems.find(item => item._id === itemId);
    }
    
    // Function to handle selecting a category for modification
    function selectCategoryForModification(categoryId) {
        selectedCategoryId = categoryId;
        selectedCategoryItem = categories.find(category => category._id === categoryId);
    }
    function deleteSelectedItem() {
        if (confirm("Are you sure you want to delete this item?")) {
            fetch(`http://${MY_IP}:5000/api/menu/${selectedItem._id}`, {
                method: 'DELETE'
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to delete item');
                }
                fetchMenuItems();
                selectedItemId = '';
                selectedItem = {};
            })
            .catch(error => {
                console.error('Error deleting item:', error);
            });
        }
    }

    function updateSelectedItem() {
        const formData = new FormData();
        formData.append('data', JSON.stringify(selectedItem));
        formData.append('image', imageFile);

        fetch(`http://${MY_IP}:5000/api/menu/${selectedItem._id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(selectedItem)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to update item');
            }
            fetchMenuItems();
        })
        .catch(error => {
            console.error('Error updating item:', error);
        });
    }


</script>
<style>
  /* Add styles for admin menu page */
  /* Same styling as MenuPage.svelte, adjust as necessary */
  .add-item-card {
      padding: 20px;
      border-radius: 10px;
      background-color: #fff;
      box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
      margin-bottom: 20px;
      justify-content: left;
      max-width: 300px;
      flex: 1;
  }

  .add-item-card label {
      display: block;
      margin-bottom: 10px;
  }

  .radio-container {
      display: flex;
      margin-bottom: 10px;
  }

  .add-item-card input,
  .add-item-card textarea,
  .add-item-card select {
      width: 100%;
      padding: 10px;
      border: 1px solid #ccc;
      border-radius: 5px;
      margin-bottom: 10px;
      box-sizing: border-box;
  }

  .add-item-card button {
      padding: 10px 20px;
      background-color: #007bff;
      color: #fff;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      transition: background-color 0.3s ease;
  }

  .add-item-card button:hover {
      background-color: #0056b3;
  }

  .container {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      max-width: auto;
      gap: 20px; /* Adjust the gap between cards */
  }

  .menu-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 20px;
  }

  .menu-item {
      padding: 20px;
      border-radius: 10px;
      background-color: #fff;
      box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  }

  .menu-item h2 {
      margin-top: 0;
  }

  .menu-item img {
      max-width: 100%;
  }

  .item-list {
      list-style: none;
      padding: 0;
      margin: 0;
  }

  .item-list li {
      cursor: pointer;
      padding: 5px 0;
  }
  .image-container {
  max-width: 300px; /* Adjust the width as needed */
  margin-bottom: 20px; /* Add some space below the image */
}

.image-container img {
  max-width: 100%; /* Ensure the image doesn't exceed the container width */
  height: auto; /* Maintain aspect ratio */
}

</style>





<!-- HTML structure -->
<div class="container">
    <div class="menu-page">
        <h1>Admin Menu Page</h1>
  
        <!-- Add new item form wrapped in a card -->
        <div class="add-item-card">
          <h2>Add New Item</h2>
          <form on:submit|preventDefault={addNewItem}>
              <label>
                  Category:
                  <select bind:value={newItem.category}>
                      {#each categories as category}
                          <option value={category.name}>{category.name}</option>
                      {/each}
                  </select>
              </label>
              <label>
                  Name:
                  <input type="text" bind:value={newItem.name}>
              </label>
              <label>
                  Description:
                  <textarea rows="3" bind:value={newItem.description}></textarea>
              </label>
              <label>
                  Price:
                  <input type="number" step="0.01" bind:value={newItem.price}>
              </label>
              <label>
                  Available:
                  <input type="checkbox" bind:checked={newItem.available}>
              </label>
              <label>
                  Image:
                  <div class="image-container">
                      <img src={newItem.imageUrl} alt="Selected Item Image" />
                  </div>
                  <input type="file" accept="image/*" name="image" on:change={handleImageUpload}>
              </label>
              <button type="submit">Apply</button>
          </form>
      </div>
  
      <!-- Filter by category -->
      <div class="add-item-card">
          <div class="filter-category">
              <h2>Filter by Category</h2>
              <select bind:value={selectedCategory}>
                  <option value="">All</option>
				{#each categories as category}
                  <option on:click={() => (selectedCategory = categories.find(cat => cat.name === category.name))} value={category}>{category.name}</option>
				  {/each}

              </select>
          </div>
  
          <!-- Item list -->
          <div class="add-item-list">
              {#each menuItems.filter(item => item.category === selectedCategory.name || selectedCategory === '') as item}
              <!-- svelte-ignore a11y-click-events-have-key-events -->
              <li on:click={() => selectItemForModification(item._id)}>{item.name}</li>
              {/each}
          </div>
      </div>
  
      <!-- Display selected item for modification -->
      {#if selectedItemId}
      <div class="add-item-card">
          <h2>Modify Item</h2>
          <!-- Form for modifying the selected item -->
          <form on:submit|preventDefault={updateSelectedItem}>
              <label>
                  Name:
                  <input type="text" bind:value={selectedItem.name}>
              </label>
              <label>
                  Description:
                  <textarea rows="3" bind:value={selectedItem.description}></textarea>
              </label>
              <label>
                  Price:
                  <input type="number" step="0.01" bind:value={selectedItem.price}>
              </label>
              <label>
                  Available:
                  <input type="checkbox" bind:checked={selectedItem.available}>
              </label>
              <!-- Container for the image -->
              <div class="image-container">
                  <label>
                      Current Image:
                  </label>
                  <img src={selectedItem.imageUrl} alt="Selected Item Image" />
              </div>
              <!-- Input for updating the image -->
              <label>
                  Update Image:
                  <input type="file" accept="image/*" name="image" on:change={handleImageUpload}>
              </label>
              <!-- Delete button -->
              <button type="button" on:click={deleteSelectedItem}>Delete</button>
              <!-- Submit button -->
              <button type="submit">Apply</button>
          </form>
      </div>
      {/if}
  
      <!-- Add new category form wrapped in a card -->
      <div class="add-item-card">
        <h2>Add New Category</h2>
        <form on:submit|preventDefault={addNewCategory}>
            <label>
                Name:
                <input type="text" bind:value={newCategory.name}>
            </label>
            <label>
                Description:
                <textarea rows="3" bind:value={newCategory.description}></textarea>
            </label>
            <label>
                Icon:
                <input type="file" accept="image/*" name="icon" on:change={handleCategoryIconUpload}>
            </label>
            <button type="submit">Add Category</button>
        </form>
    </div>
<!-- Filter by category -->
<div class="add-item-card">
    <div class="filter-category">
        <h2>Select Category</h2>
        <ul class="category-list">
            {#each categories as category}
                <li on:click={() => selectCategoryForModification(category._id)}>{category.name}</li>
            {/each}
        </ul>
    </div>
</div>
    <!-- Modify existing category form wrapped in a card -->
    {#if selectedCategoryId}
    <div class="add-item-card">
        <h2>Modify Category</h2>
        <form on:submit|preventDefault={updateSelectedCategory}>
            <label>
                Name:
                <input type="text" bind:value={selectedCategoryItem.name}>
            </label>
            <label>
                Description:
                <textarea rows="3" bind:value={selectedCategoryItem.description}></textarea>
            </label>
            <!-- Container for the category icon -->
            <div class="image-container">
                <label>
                    Current Icon:
                </label>
                <img src={selectedCategoryItem.iconUrl} alt="Selected Category Icon" />
            </div>
            <!-- Input for updating the category icon -->
            <label>
                Update Icon:
                <input type="file" accept="image/*" name="icon" on:change={handleCategoryIconUpload}>
            </label>
            <!-- Delete button -->
            <button type="button" on:click={deleteSelectedCategory}>Delete</button>
            <!-- Submit button -->
            <button type="submit">Apply</button>
        </form>
    </div>
    {/if}

    
</div>
</div>
