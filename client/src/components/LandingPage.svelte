<!-- src/components/LandingPage.svelte -->
<script>
    import { navigate } from 'svelte-routing';
    import { MY_IP } from '../env.js' ;

  
    const goToMenuPage = () => {
      navigate('/menu');
    };
  
    const goToInstagram = () => {
      window.open('https://www.instagram.com/monjay/', '_blank');
    };
  </script>


  
  <style>
    .landing-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh; /* Height of the viewport */
  max-height: 100%; /* Set maximum height to 100% of viewport height */
  width: 100%; /* Ensure the content takes up full width */
  overflow: hidden; /* Hide any overflow content */
  text-align: center;
  font-family: Arial, sans-serif;
}

h1 {
  font-size: 2.5rem;
  margin-bottom: 20px;
  color: #333;
}

p {
  font-size: 1.2rem;
  color: #666;
  margin-bottom: 30px;
}

button {
  padding: 10px 20px;
  font-size: 1rem;
  border-radius: 5px;
  cursor: pointer;
  width: 170px;
  background-color: #DFFFD2;
  border-color: #5a0000;
  color: #5a0000;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #dbffff;
}

.button-container {
  display: flex;
  gap: 20px;
}

.container {
  width: 100%; /* Set container width to 100% */
}

.container img {
  width: 100%; /* Set image width to 100% of its container */
  height: auto; /* Maintain aspect ratio */
}

/* Media queries for responsive design */
@media (max-width: 768px) {
  h1 {
    font-size: 2rem;
  }
  p {
    font-size: 1rem;
  }
  button {
    font-size: 0.8rem;
  }
}

@media (max-width: 576px) {
  h1 {
    font-size: 1.5rem;
  }
  p {
    font-size: 0.8rem;
  }
  button {
    font-size: 1rem;
  }
}

  </style>
  
  <div class="landing-page">
    <div class="container">
      <img src="/logologo.png" alt="Logo" class="logo">
    </div>
    <div class="button-container">
      <button on:click={goToInstagram}>مشاهده اینستاگرام</button>
      <button on:click={goToMenuPage}>صفحه منو</button>
    </div>
  </div>
  
