/**
 * Advanced CSS Variable Manager v2.0
 * Handles storage, validation, application, and live-sync of theme variables.
 */

(function (window, document) {
    'use strict';

    // 1. Configuration Schema
    // Centralized list of all dynamic CSS variables, their storage keys, and defaults.
    const THEME_SCHEMA = [
        { cssVar: '--Font',           key: 'PFont',          default: "'Yatra One', cursive", type: 'font' },
        { cssVar: '--Font2',          key: 'SFont',          default: "'Eagle Lake', serif",  type: 'font' },
        { cssVar: '--FontColor',      key: 'TColor',         default: 'white',                type: 'color' },
        { cssVar: '--TextSize',       key: 'TSize',          default: '15px',                 type: 'unit', suffix: 'px' },
        
        { cssVar: '--LinkColor',      key: 'LColor',         default: 'grey',                 type: 'color' },
        { cssVar: '--LinkColorHover', key: 'LHColor',        default: 'lightgrey',            type: 'color' },
        
        { cssVar: '--GraDir',         key: 'GDirection',     default: 'bottom right',         type: 'string' },
        { cssVar: '--GradStop1',      key: 'GradStop1Color', default: 'black',                type: 'color' },
        { cssVar: '--GradStop2',      key: 'GradStop2Color', default: 'black',                type: 'color' },
        { cssVar: '--GradStop3',      key: 'GradStop3Color', default: 'grey',                 type: 'color' },
        { cssVar: '--GradStop4',      key: 'GradStop4Color', default: 'black',                type: 'color' }
    ];

    // 2. The Theme Manager Logic
    const ThemeManager = {
        
        /**
         * Initialize the system
         */
        init: function() {
            console.log("[ThemeManager] Initializing...");
            this.applyAll();
            this.setupListeners();
            
            // Expose globally for other scripts to use
            window.ThemeManager = this;
        },

        /**
         * Reads all values from storage and applies them to the DOM
         */
        applyAll: function() {
            // Use requestAnimationFrame for performance (batches DOM writes)
            requestAnimationFrame(() => {
                THEME_SCHEMA.forEach(item => {
                    this.applyVariable(item);
                });
            });
        },

        /**
         * Applies a single variable based on the schema item
         */
        applyVariable: function(item) {
            try {
                let value = localStorage.getItem(item.key);

                // Validation: If null or empty, use default
                if (!value || value.trim() === '') {
                    value = item.default;
                }

                // Unit Handling: Add 'px' if missing for unit types
                if (item.type === 'unit' && item.suffix && !value.endsWith(item.suffix)) {
                    // Check if it's just a number
                    if (!isNaN(value)) {
                        value += item.suffix;
                    }
                }

                // Apply to Root
                document.documentElement.style.setProperty(item.cssVar, value);

            } catch (err) {
                console.warn(`[ThemeManager] Error applying ${item.cssVar}:`, err);
            }
        },

        /**
         * Public method to update a specific setting and save to storage
         * Example: ThemeManager.set('PFont', 'Arial');
         */
        set: function(storageKey, newValue) {
            const item = THEME_SCHEMA.find(i => i.key === storageKey);
            if (item) {
                localStorage.setItem(storageKey, newValue);
                this.applyVariable(item);
                console.log(`[ThemeManager] Updated ${item.key} to ${newValue}`);
            } else {
                console.error(`[ThemeManager] Unknown storage key: ${storageKey}`);
            }
        },

        /**
         * Resets all theme settings to hardcoded defaults
         */
        resetToDefaults: function() {
            THEME_SCHEMA.forEach(item => {
                localStorage.removeItem(item.key);
                this.applyVariable(item);
            });
            console.log("[ThemeManager] Reset to defaults.");
        },

        /**
         * Setup Event Listeners
         */
        setupListeners: function() {
            // Live Sync: Listen for changes in other tabs
            window.addEventListener('storage', (event) => {
                const schemaItem = THEME_SCHEMA.find(i => i.key === event.key);
                if (schemaItem) {
                    console.log(`[ThemeManager] Syncing change for ${event.key}`);
                    this.applyVariable(schemaItem);
                }
            });
        }
    };

    // 3. Bootstrapper
    // Ensures init runs whether script is loaded async, defer, or inline
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => ThemeManager.init());
    } else {
        ThemeManager.init();
    }

    // Export a global initCSSVars for backward compatibility with your yee.js
    window.initCSSVars = function() {
        ThemeManager.init();
    };

})(window, document);
