document.addEventListener('DOMContentLoaded', async () => {
    try {
        const token = localStorage.getItem('token');
        console.log('Token:', token);

        const response = await fetch('/api/user', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });
        const data = await response.json();
        if (data.success) {
            const username = data.user.username;
            document.getElementById('accountDropdownMenu').innerHTML = `<li><a class="dropdown-item" href="profile/${username}">My Content</a></li>`;
        } else {
            console.error('Failed to fetch user information');
        }
    } catch (e) {
        console.error('Error:', e);
    }
});