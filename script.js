// --- 1. CONFIGURATION ---
const CONFIG = {
    userID: "1045022710956298260",
    projectInvite: "bvV7Hz9W5P",
    refreshRate: 15000,
    loaderKillTime: 5000,
    // Using a new namespace for the reliable API
    counterNamespace: "kingducky_portfolio_v2026" 
};

// --- 2. ENHANCED TERMINAL LOADER LOGIC ---
function initLoader() {
    const loader = document.getElementById("loader");
    const bar = document.querySelector(".loader-bar-fill");
    const percentText = document.querySelector(".loader-percentage");
    
    if (!loader || !bar) return;

    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.floor(Math.random() * 12) + 5; 
        
        if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
            
            setTimeout(() => {
                loader.classList.add("loader-hidden");
                document.querySelector('header').style.animation = "fadeUp 1s ease forwards";
            }, 400);
        }
        
        bar.style.width = progress + "%";
        percentText.innerText = progress + "%";
    }, 80);

    setTimeout(() => {
        if (!loader.classList.contains("loader-hidden")) {
            loader.classList.add("loader-hidden");
        }
    }, CONFIG.loaderKillTime);
}

// --- 3. UI INITIALIZATION ---
function initUI() {
    const yearEl = document.getElementById('copyright-year');
    if (yearEl) yearEl.innerText = new Date().getFullYear();

    document.querySelectorAll("a, .skill-card, .project-card, .social-pill, .region-card, .experience-item, footer, .counter-card").forEach(el => {
        el.addEventListener("mouseenter", () => document.body.classList.add("cursor-hover"));
        el.addEventListener("mouseleave", () => document.body.classList.remove("cursor-hover"));
    });

    document.querySelectorAll('img').forEach(img => {
        img.addEventListener('contextmenu', e => e.preventDefault());
    });

    const originalTitle = document.title;
    window.addEventListener('blur', () => { 
        document.title = "K1NG_DUCKY • Portfolio (UNFOCUSED)"; 
    });
    window.addEventListener('focus', () => { 
        document.title = originalTitle; 
    });
}

// --- 4. RELIABLE VIEW COUNTER LOGIC ---
async function updateViewCounters() {
    const totalEl = document.getElementById('total-views');
    const uniqueEl = document.getElementById('unique-views');
    const ns = CONFIG.counterNamespace;

    // Using countapi.it (A reliable mirror/alternative)
    const apiBase = "https://api.countapi.it/hit";
    const getBase = "https://api.countapi.it/get";

    // Handle Total Views
    try {
        const res = await fetch(`${apiBase}/${ns}/total_visits`);
        const data = await res.json();
        if (totalEl) totalEl.innerText = (data.value || 0).toLocaleString();
    } catch (e) {
        if (totalEl) totalEl.innerText = "...";
    }

    // Handle Unique Views
    try {
        if (!localStorage.getItem('kingducky_visited_unique')) {
            const res = await fetch(`${apiBase}/${ns}/unique_visitors`);
            const data = await res.json();
            if (uniqueEl) uniqueEl.innerText = (data.value || 0).toLocaleString();
            localStorage.setItem('kingducky_visited_unique', 'true');
        } else {
            const res = await fetch(`${getBase}/${ns}/unique_visitors`);
            const data = await res.json();
            if (uniqueEl) uniqueEl.innerText = (data.value || 0).toLocaleString();
        }
    } catch (e) {
        if (uniqueEl) uniqueEl.innerText = "...";
    }
}

// --- 5. COPY IP LOGIC ---
function copyIP(text, element) {
    if (!navigator.clipboard) return;
    navigator.clipboard.writeText(text).then(() => {
        element.classList.add('copied');
        const codeEl = element.querySelector('code');
        if (codeEl) {
            const originalText = codeEl.innerText;
            codeEl.innerText = "COPIED!";
            setTimeout(() => {
                element.classList.remove('copied');
                codeEl.innerText = originalText;
            }, 2000);
        }
    });
}

// --- 6. CURSOR LOGIC ---
const cursorDot = document.getElementById("cursor-dot");
const cursorOutline = document.getElementById("cursor-outline");
let mouseX = 0, mouseY = 0, dotX = 0, dotY = 0, outlineX = 0, outlineY = 0;

window.addEventListener("mousemove", (e) => { mouseX = e.clientX; mouseY = e.clientY; });
window.addEventListener("mousedown", () => document.body.classList.add("cursor-clicking"));
window.addEventListener("mouseup", () => document.body.classList.remove("cursor-clicking"));

function animateCursor() {
    if (cursorDot) {
        dotX += (mouseX - dotX) * 0.2;
        dotY += (mouseY - dotY) * 0.2;
        cursorDot.style.transform = `translate(${dotX}px, ${dotY}px) translate(-50%, -50%)`;
    }
    if (cursorOutline) {
        outlineX += (mouseX - outlineX) * 0.1;
        outlineY += (mouseY - outlineY) * 0.1;
        cursorOutline.style.transform = `translate(${outlineX}px, ${outlineY}px) translate(-50%, -50%)`;
    }
    requestAnimationFrame(animateCursor);
}

// --- 7. TIMEZONE LOGIC ---
function updateTime() {
    const myOptions = {
        timeZone: 'Europe/London',
        hour12: false,
        hour: '2-digit', minute: '2-digit', second: '2-digit'
    };
    const myTimeStr = new Intl.DateTimeFormat('en-GB', myOptions).format(new Date());
    const myHour = parseInt(myTimeStr.split(':')[0]);
    const myTimeEl = document.getElementById('my-local-time');
    const myStatusEl = document.getElementById('my-time-status');

    if (myTimeEl) myTimeEl.innerText = myTimeStr;
    if (myStatusEl) {
        const isAwake = myHour >= 7 && myHour < 23;
        const icon = isAwake ? 'fa-sun' : 'fa-moon';
        const label = isAwake ? 'AWAKE' : 'SLEEPING';
        const color = isAwake ? '#22c55e' : '#64748b';
        myStatusEl.innerHTML = `<i class="fa-solid ${icon}" style="font-size: 0.75rem; margin-right: 5px;"></i> ${label}`;
        myStatusEl.style.color = color;
    }

    const userTimeEl = document.getElementById('user-local-time');
    const userZoneEl = document.getElementById('user-timezone-name');
    if (userTimeEl) {
        userTimeEl.innerText = new Date().toLocaleTimeString('en-GB', { 
            hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' 
        });
    }
    if (userZoneEl) {
        try {
            const zone = Intl.DateTimeFormat().resolvedOptions().timeZone.split('/').pop().replace('_', ' ');
            userZoneEl.innerText = zone || "Local Time";
        } catch (e) { userZoneEl.innerText = "Local Time"; }
    }
}

// --- 8. REFRESH DATA LOGIC (LANYARD & DISCORD) ---
async function refreshHologram() {
    try {
        const lanyardRes = await fetch(`https://api.lanyard.rest/v1/users/${CONFIG.userID}`);
        const res = await lanyardRes.json();
        
        if (res && res.success) {
            const data = res.data;
            const status = data.discord_status;
            const dot = document.getElementById('status-dot');
            const label = document.getElementById('status-text');
            const detail = document.getElementById('activity-detail');
            const timeEl = document.getElementById('activity-time');
            const icon = document.getElementById('activity-icon');
            const smallIcon = document.getElementById('activity-small-icon');
            const spotifyBar = document.getElementById('spotify-progress-bar');
            const spotifyCont = document.getElementById('spotify-progress-container');

            let favicon = document.querySelector("link[rel~='icon']");
            if (!favicon) {
                favicon = document.createElement('link');
                favicon.rel = 'icon';
                document.head.appendChild(favicon);
            }
            favicon.href = `https://lanyard.rest/api/${CONFIG.userID}.png`;

            if(icon) icon.style.display = "none";
            if(smallIcon) smallIcon.style.display = "none";
            if(spotifyCont) spotifyCont.style.display = "none";
            if(timeEl) timeEl.innerText = "";

            const colors = { online: '#22c55e', idle: '#eab308', dnd: '#ef4444', offline: '#64748b' };
            if(dot) {
                const statusColor = colors[status] || colors.offline;
                dot.style.background = statusColor;
                dot.style.boxShadow = `0 0 15px ${statusColor}aa`;
            }

            if (status === 'offline') {
                if(label) label.innerText = "Offline";
                if(detail) detail.innerText = "Currently away";
            } else {
                const game = data.activities ? data.activities.find(act => act.type === 0) : null;
                
                if (game) {
                    if(label) label.innerText = "Currently Playing";
                    if(detail) detail.innerHTML = `<strong>${game.name}</strong>`;
                    if(icon) {
                        icon.style.display = "block";
                        icon.src = game.assets?.large_image 
                            ? (game.assets.large_image.startsWith('mp:external') 
                                ? game.assets.large_image.replace(/mp:external\/.*\/https\//, 'https://') 
                                : `https://cdn.discordapp.com/app-assets/${game.application_id}/${game.assets.large_image}.png`)
                            : `https://lanyard.rest/api/assets/${game.application_id}`;
                    }
                    if(game.assets?.small_image && smallIcon) {
                        smallIcon.style.display = "block";
                        smallIcon.src = `https://cdn.discordapp.com/app-assets/${game.application_id}/${game.assets.small_image}.png`;
                    }
                    if(game.timestamps?.start && timeEl) {
                        const totalMinutes = Math.floor((Date.now() - game.timestamps.start) / 1000 / 60);
                        if (totalMinutes >= 60) {
                            const h = Math.floor(totalMinutes / 60);
                            const m = totalMinutes % 60;
                            timeEl.innerText = `${h}h${m > 0 ? ` ${m}m` : ""} elapsed`;
                        } else {
                            timeEl.innerText = `${totalMinutes}m elapsed`;
                        }
                    }
                } 
                else if (data.listening_to_spotify && data.spotify) {
                    if(label) label.innerText = "Listening to Spotify";
                    if(detail) detail.innerHTML = `<strong>${data.spotify.track}</strong> by ${data.spotify.artist}`;
                    if(icon) { icon.style.display = "block"; icon.src = data.spotify.album_art_url; }
                    if(spotifyCont) spotifyCont.style.display = "block";
                    if(spotifyBar) {
                        const progress = ((Date.now() - data.spotify.timestamps.start) / (data.spotify.timestamps.end - data.spotify.timestamps.start)) * 100;
                        spotifyBar.style.width = `${Math.min(100, Math.max(0, progress))}%`;
                    }
                } 
                else {
                    if(label) label.innerText = status.charAt(0).toUpperCase() + status.slice(1);
                    if(detail) detail.innerText = "No current activity";
                }
            }
        }
    } catch (e) { console.error("Lanyard check failed"); }

    try {
        const inviteRes = await fetch(`https://discord.com/api/v9/invites/${CONFIG.projectInvite}?with_counts=true`);
        const inviteData = await inviteRes.json();
        if(inviteData && !inviteData.message) {
            const online = inviteData.approximate_presence_count || 0;
            const total = inviteData.approximate_member_count || 0;
            if(document.getElementById('live-status-text')) document.getElementById('live-status-text').innerText = `${online} ONLINE`;
            if(document.getElementById('stat-online')) document.getElementById('stat-online').innerText = online.toLocaleString();
            if(document.getElementById('stat-total')) document.getElementById('stat-total').innerText = total.toLocaleString();
        }
    } catch (e) { console.error("Invite check failed"); }
}

// --- 9. CINEMATIC SCROLL REVEAL ---
function initScrollReveal() {
    const observerOptions = {
        threshold: 0.1, 
        rootMargin: "0px 0px -20px 0px" 
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            } else {
                entry.target.classList.remove('active');
            }
        });
    }, observerOptions);

    const itemsToReveal = document.querySelectorAll(
        '.skill-card, .project-card, .region-card, .experience-item, header h1, .social-pill, .model-card, .counter-card'
    );

    itemsToReveal.forEach(el => {
        el.classList.add('reveal'); 
        observer.observe(el);
    });
}

// --- 10. BOOT ---
window.addEventListener("DOMContentLoaded", () => {
    initUI();
    initLoader();
    animateCursor();
    updateTime();
    refreshHologram();
    updateViewCounters(); 
    initScrollReveal();
    
    setInterval(updateTime, 1000);
    setInterval(refreshHologram, CONFIG.refreshRate);
});