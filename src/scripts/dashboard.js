async function loadUser() {
    const r = await fetch("/api/user");
    if (r.status == 200) {
        const user = await r.json();
        const settingsLink = document.getElementById("settings");
        const logoutLink = document.getElementById("logout");
        settingsLink.style.display = "flex";
        logoutLink.style.display = "flex";
        if (user.admin) {
            const adminButton = document.getElementById("admin");
            if (adminButton) {
                adminButton.style.display = "inline";
            }
        }
        if (user.rating >= 100) {
            const hostButton = document.getElementById("host");
            if (hostButton) {
                hostButton.style.display = "inline";
            }
        }
    }
}

window.onload = async function () {
    loadUser();
};
