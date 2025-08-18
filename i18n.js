// Internationalization module to handle language switching.
const i18n = {
    // This object will hold the strings for the currently loaded language.
    strings: {},

    /**
     * Loads a language JSON file from the server.
     * @param {string} lang - The language code (e.g., 'it', 'en').
     */
    async loadLanguage(lang) {
        try {
            const response = await fetch(`locales/${lang}.json`);
            if (!response.ok) {
                throw new Error(`Could not load ${lang}.json file. Status: ${response.status}`);
            }
            this.strings = await response.json();
        } catch (error) {
            console.error("I18n Error:", error);
            // If the requested language fails, fall back to English.
            if (lang !== 'en') {
                console.log("Falling back to English.");
                await this.loadLanguage('en');
            }
        }
    },

    /**
     * Translates all elements on the page that have a 'data-i18n-key' attribute.
     */
    translatePage() {
        document.querySelectorAll('[data-i18n-key]').forEach(element => {
            const key = element.getAttribute('data-i18n-key');
            const translation = this.getString(key);
            if (translation) {
                // Use innerHTML to support simple tags if needed in the future,
                // but for now, textContent is safer.
                element.textContent = translation;
            }
        });
    },
    
    /**
     * Gets a specific string by its key.
     * Supports nested keys like "global.back_to_home".
     * @param {string} key - The key for the desired string.
     * @param {Object} replacements - An object with placeholder values (e.g., { current: 1, total: 10 }).
     * @returns {string|Object} - The translated string, or the object/array if the key points to one (e.g., questions).
     */
    getString(key, replacements = {}) {
        // Navigate through the nested object to find the string.
        let text = key.split('.').reduce((obj, k) => obj && obj[k], this.strings);

        // If the key points to an object or array (like the questions), return it directly.
        if (typeof text === 'object' && text !== null) {
            return text;
        }

        if (typeof text !== 'string') {
            console.warn(`Translation key not found: ${key}`);
            return key; // Return the key itself if translation is not found.
        }

        // Replace placeholders like {current} with actual values.
        for (const placeholder in replacements) {
            text = text.replace(new RegExp(`\\{${placeholder}\\}`, 'g'), replacements[placeholder]);
        }
        return text;
    },

    /**
     * Sets the application language.
     * @param {string} lang - The language code to set.
     */
    async setLanguage(lang) {
        localStorage.setItem('quizLang', lang); // Save the user's preference.
        document.documentElement.lang = lang; // Set the lang attribute on the <html> tag.
        await this.loadLanguage(lang);
        this.translatePage();
        
        // Dispatch a custom event to notify other parts of the app (like the quiz logic)
        // that the language has been loaded and the content should be re-rendered.
        document.dispatchEvent(new CustomEvent('languageChanged'));
    },

    /**
     * Initializes the i18n system on page load.
     */
    async init() {
        // Get the saved language or default to Italian ('it').
        const savedLang = localStorage.getItem('quizLang') || 'it'; 
        await this.setLanguage(savedLang);
    }
};

// Start the initialization as soon as the script is loaded.
i18n.init();