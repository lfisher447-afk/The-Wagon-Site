/**
 * Core System Loader (yee.js)
 * Architecture: Async Module Definition
 */

(function() {
    'use strict';

    const CONFIG = {
        basePath: '../js/',
        modules: [
            { name: 'CSSVars.js', critical: true }, // Styles first
            { name: 'diso.js', critical: false },
            { name: 'linkczech.js', critical: false },
            { name: 'panik.js', critical: false },
            { name: 'sanit.js', critical: false },
            { name: 'Song.js', critical: false, initFunc: 'songInit' }
        ]
    };

    // Helper: Async Script Loader
    const injectScript = (module) => {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = CONFIG.basePath + module.name;
            script.async = true;
            
            script.onload = () => {
                console.log(`[SYS] Module Loaded: ${module.name}`);
                resolve(module);
            };

            script.onerror = () => {
                console.error(`[ERR] Module Failed: ${module.name}`);
                if (module.critical) reject(module.name);
                else resolve(module); // Resolve anyway if not critical
            };

            document.head.appendChild(script);
        });
    };

    // Main Execution Flow
    const initSequence = async () => {
        console.log("%c SYSTEM INITIALIZING ", "background: #222; color: #bada55; font-size:14px; padding:4px;");

        try {
            // Load CSSVars first
            const cssModule = CONFIG.modules.find(m => m.name === 'CSSVars.js');
            await injectScript(cssModule);
            
            if (typeof window.initCSSVars === 'function') {
                window.initCSSVars();
            }

            // Load remaining modules in parallel
            const remainingModules = CONFIG.modules.filter(m => m.name !== 'CSSVars.js');
            const loadedModules = await Promise.all(remainingModules.map(injectScript));

            // Initialize specific subsystems if they exist
            loadedModules.forEach(mod => {
                if (mod.initFunc && typeof window[mod.initFunc] === 'function') {
                    window[mod.initFunc]();
                }
            });

            console.log("[SYS] All Systems Operational");

        } catch (error) {
            console.error("[CRITICAL] Initialization Halted:", error);
        }
    };

    // Boot
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initSequence);
    } else {
        initSequence();
    }

})();
