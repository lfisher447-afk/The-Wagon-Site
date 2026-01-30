/**
 * WagonOS Launcher System v2.0
 * Advanced Stealth Navigation & Cloaking Engine
 */

(function() {
    // --- Configuration ---
    const config = {
        targetURL: "https://lfisher447-afk.github.io/The-Wagon-Site/Pages/Home.html",
        repoURL: "https://github.com/lfisher447-afk/The-Wagon-Site",
        cloakTitle: "Google Drive",
        cloakIcon: "https://ssl.gstatic.com/images/branding/product/1x/drive_2020q4_32dp.png"
    };

    // --- Core Styles for the Menu ---
    const styles = `
        #wagon-launcher-overlay {
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0, 0, 0, 0.85); backdrop-filter: blur(8px);
            display: flex; justify-content: center; align-items: center; z-index: 99999;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        .launcher-box {
            background: #1a1a1a; border: 1px solid #333; border-radius: 12px;
            padding: 30px; width: 350px; text-align: center; color: white;
            box-shadow: 0 0 40px rgba(0, 242, 255, 0.15);
            animation: fadeIn 0.3s ease-out;
        }
        .launcher-box h2 { margin: 0 0 20px 0; color: #00f2ff; font-weight: 600; }
        .btn-group { display: flex; flex-direction: column; gap: 10px; }
        .launch-btn {
            background: #2a2a2a; color: #fff; border: 1px solid #444;
            padding: 12px; border-radius: 6px; cursor: pointer; transition: 0.2s;
            font-size: 14px; display: flex; align-items: center; justify-content: center; gap: 10px;
        }
        .launch-btn:hover { background: #00f2ff; color: #000; border-color: #00f2ff; transform: translateY(-2px); }
        .launch-btn.repo { border-color: #6e5494; }
        .launch-btn.repo:hover { background: #6e5494; color: white; }
        @keyframes fadeIn { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
    `;

    // --- Methods ---

    const Methods = {
        // 1. Blob Cloaking (Harder to track)
        blob: () => {
            const html = `
                <!DOCTYPE html>
                <html>
                <head>
                    <title>${config.cloakTitle}</title>
                    <link rel="icon" href="${config.cloakIcon}">
                    <style>body,iframe{margin:0;padding:0;width:100%;height:100vh;border:none;overflow:hidden;}</style>
                </head>
                <body>
                    <iframe src="${config.targetURL}" allowfullscreen></iframe>
                </body>
                </html>
            `;
            const blob = new Blob([html], { type: 'text/html' });
            const url = URL.createObjectURL(blob);
            window.open(url, '_blank');
        },

        // 2. About:Blank Cloaking (Classic)
        aboutBlank: () => {
            const win = window.open('about:blank', '_blank');
            if (!win) return alert("Popup Blocked! Allow popups for this site.");
            
            const content = `
                <style>body{margin:0;background:#000;}</style>
                <iframe src="${config.targetURL}" style="width:100%; height:100vh; border:none;"></iframe>
            `;
            
            win.document.open();
            win.document.write(content);
            win.document.title = config.cloakTitle;
            
            // Inject favicon dynamically
            const link = win.document.createElement('link');
            link.rel = 'icon';
            link.href = config.cloakIcon;
            win.document.head.appendChild(link);
            
            win.document.close();
        },

        // 3. Direct Navigation
        direct: () => {
            window.location.href = config.targetURL;
        },

        // 4. Github Repo
        repo: () => {
            window.open(config.repoURL, '_blank');
        }
    };

    // --- UI Generator ---
    function showMenu() {
        // Inject Styles
        const styleSheet = document.createElement("style");
        styleSheet.innerText = styles;
        document.head.appendChild(styleSheet);

        // Create Overlay
        const overlay = document.createElement('div');
        overlay.id = 'wagon-launcher-overlay';
        
        overlay.innerHTML = `
            <div class="launcher-box">
                <h2>🚀 Launch Protocol</h2>
                <div class="btn-group">
                    <button class="launch-btn" id="btn-blob">
                        <span>🛡️ Blob Cloak</span>
                    </button>
                    <button class="launch-btn" id="btn-blank">
                        <span>👻 About:Blank</span>
                    </button>
                    <button class="launch-btn" id="btn-direct">
                        <span>🔗 Direct Link</span>
                    </button>
                    <button class="launch-btn repo" id="btn-repo">
                        <span>📦 Repository</span>
                    </button>
                    <button class="launch-btn" id="btn-cancel" style="margin-top:10px; background:transparent; border:none; color:#666;">
                        Cancel
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(overlay);

        // Add Event Listeners
        document.getElementById('btn-blob').onclick = () => { Methods.blob(); closeMenu(); };
        document.getElementById('btn-blank').onclick = () => { Methods.aboutBlank(); closeMenu(); };
        document.getElementById('btn-direct').onclick = () => { Methods.direct(); };
        document.getElementById('btn-repo').onclick = () => { Methods.repo(); closeMenu(); };
        document.getElementById('btn-cancel').onclick = () => { closeMenu(); };
        
        // Close on outside click
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) closeMenu();
        });
    }

    function closeMenu() {
        const overlay = document.getElementById('wagon-launcher-overlay');
        if (overlay) overlay.remove();
    }

    // Initialize
    showMenu();

})();
