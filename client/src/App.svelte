<script>
	import { Router, Route } from 'svelte-routing';
	import LandingPage from './components/LandingPage.svelte';
	import MenuPage from './components/Menu.svelte';
	import AdminPage from './components/AdminPanel.svelte';
	import { Link } from 'svelte-routing';
    import AdminPanel from './components/AdminPanel.svelte';
    import LoginPage from './components/LoginPage.svelte';
</script>
<main>
	<Router>
		<Route path="/" component={LandingPage} />
		<Route path="/menu" component={MenuPage}/>
		<Route path="/admin" component={AdminPanel}/>
        <Route path="/login" component={LoginPage}/>
	  </Router>
</main>

  
<style>
    
    main {
        text-align: center;
        padding: 1em; 
        width: 100vw;
        min-height: 100vh;
        margin: 0; /* Remove margin */
        background-color: rgb(255, 255, 255);
        box-sizing: border-box;
    }

    @media (min-width: 640px) {
        main {
            max-width: none; /* If you want to override max-width, else you can remove this line */
        }
    }
</style>
