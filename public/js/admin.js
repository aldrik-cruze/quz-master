async function verifyAdmin() {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '../index.html';
        return;
    }

    try {
        const response = await fetchWithAuth('/auth/verify');
        const data = await response.json();
        
        if (!data.valid || data.user.role !== 'admin') {
            alert('Admin access required');
            window.location.href = '../index.html';
            return;
        }

        // Update admin info in header
        const adminInfoElements = document.querySelectorAll('.admin-info');
        adminInfoElements.forEach(el => {
            el.textContent = `👤 ${data.user.username}`;
        });
    } catch (error) {
        console.error('Verification error:', error);
        window.location.href = '../index.html';
    }
}

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '../index.html';
    }
}
