<script>
  import { onMount } from 'svelte';
  import { navigate } from 'svelte-routing';
  import { fly } from 'svelte/transition';
  import { createEventDispatcher } from 'svelte';
  import { MY_IP } from '../env.js' ;

  let menuItems = [];
  let selectedCategory = 'All';
  let categories = [];

  const dispatch = createEventDispatcher(); // Create event dispatcher

    // Function to dispatch the 'imageClicked' event when an image is clicked
    function handleClick(imageUrl) {
    dispatch('imageClicked', {
      imageUrl: imageUrl
    });
  }
  // Function to check if it's breakfast time
  function isBreakfastTime() {
    const now = new Date();
    const hours = now.getHours();
    // Example: If breakfast time is between 7 AM and 10 AM
    return (hours >= 18 && hours < 21 || hours >= 8 && hours < 11);
  }

  async function fetchMenuItems() {
    try {
      const response = await fetch('https://'+ MY_IP +':5000/api/menu');
      if (!response.ok) {
        throw new Error('Failed to fetch menu items');
      }
      menuItems = await response.json();
      menuItems = menuItems.slice().sort((a, b) => a.order - b.order);
      // Set selectedCategory to the first category in menuItems array
    } catch (error) {
      console.error('Error fetching menu items:', error);
    }
  }
// Function to fetch categories
async function fetchCategories() {
    try {
      const response = await fetch('https://'+ MY_IP +':5000/api/categories');
      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }
      categories = await response.json();
      categories = categories.slice().sort((a, b) => a.order - b.order);

      // Set selectedCategory to the first category in categories array
        selectedCategory = categories[0].name;
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  }

  onMount(() => {
    fetchMenuItems();
    fetchCategories();
  });

  // Prevent default behavior when scrolling tabs
  function preventScroll(event) {
    event.preventDefault();
  }
</script>


<style>
  /* Add styles for menu items */
  .menu-grid {
    direction: rtl;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); /* Adjust the minmax value as needed */
    grid-gap: 20px; /* Adjust the gap between items */
  }

  .menu-item {
    padding: 20px;
    border-radius: 10px;
    background-color: #fff;
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  }

  .menu-item h2 {
    margin-bottom: 10px;
  }

  .menu-item p {
    margin-bottom: 5px;
	lineHeight: 0.8;
  }

  /* Styling for the image viewer */
  .image-viewer {
    width: 100%; /* 2/3 of the card width */
    height: auto; /* Maintain aspect ratio */
    margin-bottom: 20px;
    cursor: pointer; /* Change cursor to pointer when hovered */
    overflow: hidden; /* Hide overflow to prevent image distortion */
  }

  .image-viewer img {
    width: 100%; /* Fill the container */
    height: auto; /* Maintain aspect ratio */
    transition: transform 0.3s ease; /* Smooth transition when scaling */
  }

  /* Hover effect: Scale up the image on hover */
  .image-viewer:hover img {
    transform: scale(1.1); /* Scale up by 10% on hover */
  }
  /* Styling for category tabs */
  .category-tabs {
    padding-bottom: 10px ;
    overflow: hidden;
    display: flex;
    margin-bottom: 20px;
    direction: rtl;
    /* Prevent scrolling when using the mouse wheel */
    overflow-x: auto;
    overflow-y: hidden;
    padding-left: calc((100% - 100vw) / 2); /* Adjust as needed */
    padding-right: calc((100% - 100vw) / 2); /* Adjust as needed */
    /* Remove white-space: nowrap; */
}
/* Hide the default scrollbar for WebKit-based browsers */
.category-tabs::-webkit-scrollbar {
  width: 8px; /* Width of the scrollbar */
  height: 10px;
  margin-top: 10px; /* Top margin for the scrollbar */
}

/* Track */
.category-tabs::-webkit-scrollbar-track {
  background: #f1f1f1; /* Color of the track */
}

/* Handle */
.category-tabs::-webkit-scrollbar-thumb {
  background: #888; /* Color of the handle */
  border-radius: 6px; /* Rounded corners of the handle */
}

/* Handle on hover */
.category-tabs::-webkit-scrollbar-thumb:hover {
  background: #555; /* Color of the handle on hover */
}

/* Smaller scrollbar in responsive mode */
@media (max-width: 768px) {
  .category-tabs::-webkit-scrollbar {
    width: 6px; /* Adjusted width for smaller screens */
    height: 10px;
  }
}

.category-tab {
    padding: 10px 20px;
    margin: 0 10px; /* Add margin between tabs */
    border-radius: 5px;
    background-color: #ffffff;
	min-width : 150px;
    cursor: pointer;
    transition: background-color 0.3s ease;
    display: flex;
    align-items: center;
    box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.1);
}

/* Add media query to adjust margin for smaller screens */
@media (max-width: 768px) {
    .category-tab {
			min-width : 200px;
        margin: 0 2px; /* Adjust margin for smaller screens */
    }
}
  .category-tab.selected {
    background-color: #b9ffb6;
    
  }

  .tab-icon {
    margin-right: 5px;
  }
   .button_1 {
      padding: 10px 20px;
      background-color: #DFFFD2;
      color: #0E2E00;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      transition: background-color 0.3s ease;
	  margin-top: 5px;
  }
  .button_2 {
      padding: 10px 20px;
      background-color: #FFEDED;
      color: #0E2E00;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      transition: background-color 0.3s ease;
  }
  .topper {
    max-width: 120px;
  }
</style>

<div class="menu-page">
  <img class ='topper' src='/logologo.png' alt="Logo Icon" width=300px/>

  <!-- Add event handler for wheel event to prevent scrolling -->
  <div class="category-tabs">
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    
    <!-- Loop through categories to create tabs -->
    {#each categories as category}
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <div
      class="category-tab {selectedCategory === category.name ? 'selected' : ''}"
      transition:fly="{{y: -10, duration: 300}}"
      on:click={() => selectedCategory = category.name}>
      <img src={category.iconUrl} alt="{category.name} Icon" width=50px/>
      <span class="tab-icon">{category.name}</span>
    </div>
  {/each}
  
  </div>

  <div class="menu-grid">
    {#each menuItems as item}
    {#if selectedCategory === 'All' || selectedCategory === item.category}
      <div class="menu-item" transition:fly="{{y: -10, duration: 300}}">
        <div class="image-viewer" on:click={() => handleClick(item.imageUrl)}>
          <img src={item.imageUrl} alt="{item.name}">
        </div>
        <h2>{item.name}</h2>
        {#if item.description != undefined}
          <p>{item.description}</p>
        {/if}
        <p>{item.price}T</p>
        {#if item.category === 'صبحانه و میان وعده|BREAKFAST & BRUNCH' && isBreakfastTime()}
        <p> صبحانه و میان وعده در ساعات ۸-۱۱ و ۱۸-۲۱ سرو میشد</p>
        {:else if item.available}
          <button class="button_1">موجود</button>
        {:else if item.available === false}
          <button class="button_2">ناموجود</button>  
        {/if}
      </div>
    {/if}
  {/each}
  </div>
</div>
