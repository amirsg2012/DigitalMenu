<!-- LoginPage.svelte -->

<script>
    import { onMount } from 'svelte';
    import { writable } from 'svelte/store';
    import { MY_IP } from '../env.js' ;

    // Store for login form data
    const formData = writable({ username: '', password: '' });

    // Function to handle form submission
    async function handleSubmit(event) {
        event.preventDefault();

        try {
            const response = await fetch('http://'+ MY_IP +':5000/api/admin/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify($formData)
            });

            if (response.ok) {
                const { token } = await response.json();
                localStorage.setItem('token', token);
                window.location.href = '/admin'; // Redirect to admin page
            } else {
                // Handle invalid credentials
                console.error('Invalid username or password');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }
</script>

<h1>Login</h1>

<form on:submit={handleSubmit}>
    <label>
        Username:
        <input type="text" bind:value={$formData.username}>
    </label>
    <label>
        Password:
        <input type="password" bind:value={$formData.password}>
    </label>
    <button type="submit">Login</button>
</form>
