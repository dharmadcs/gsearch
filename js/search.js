/**
 * GSearch - GatotKaca Cyber Modern Search Functionality
 * Google Search Integration with CORS Proxy
 */

class GSearchEngine {
    constructor() {
        // Google Custom Search API Configuration
        this.apiKey = 'AIzaSyCnYqcK7FbVs-pNJDE4_XKkoQETnfjPQ-I';
        this.searchEngineId = '34e5a5fce28bf4450';
        this.apiUrl = 'https://www.googleapis.com/customsearch/v1';
        
        // Rate limiting for free tier (100 queries/day)
        this.dailyLimit = 100;
        this.queryCount = this.getQueryCount();
        
        // DOM Elements
        this.searchResults = document.getElementById('searchResults');
        this.searchInput = document.getElementById('searchInput');
        this.searchButton = document.getElementById('searchButton');
        this.loadingElement = document.getElementById('gatotkaca-loading');
        this.voiceSearchButton = document.getElementById('voiceSearch');
        
        this.initializeEventListeners();
        this.initializeVoiceSearch();
    }

    initializeEventListeners() {
        // Search button click
        this.searchButton.addEventListener('click', () => {
            this.performSearch();
        });

        // Enter key press in search input
        this.searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.performSearch();
            }
        });

        // Category buttons
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const query = e.target.getAttribute('data-query');
                this.searchInput.value = query;
                this.performSearch();
            });
        });
    }

    initializeVoiceSearch() {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            const recognition = new SpeechRecognition();
            
            recognition.lang = 'id-ID';
            recognition.continuous = false;
            recognition.interimResults = false;

            recognition.onstart = () => {
                this.voiceSearchButton.classList.add('voice-search-active');
                this.voiceSearchButton.innerHTML = '<i class="fas fa-microphone-slash"></i>';
            };

            recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                this.searchInput.value = transcript;
                this.performSearch();
            };

            recognition.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
                this.voiceSearchButton.classList.remove('voice-search-active');
                this.voiceSearchButton.innerHTML = '<i class="fas fa-microphone"></i>';
                this.showError('Pencarian suara gagal. Silakan coba lagi.');
            };

            recognition.onend = () => {
                this.voiceSearchButton.classList.remove('voice-search-active');
                this.voiceSearchButton.innerHTML = '<i class="fas fa-microphone"></i>';
            };

            this.voiceSearchButton.addEventListener('click', () => {
                recognition.start();
            });
        } else {
            this.voiceSearchButton.style.display = 'none';
        }
    }

    async performSearch() {
        const query = this.searchInput.value.trim();
        
        if (!query) {
            this.showError('Silakan masukkan kata kunci pencarian');
            return;
        }

        // Check daily limit
        if (this.queryCount >= this.dailyLimit) {
            this.showWarning('Daily API limit reached. Using alternative search engine.');
            const altResults = await this.performAlternativeSearch(query);
            if (altResults.length > 0) {
                this.displayResults(altResults, query, true);
            } else {
                this.showGoogleIframe(query);
            }
            return;
        }

        this.showLoading();
        
        try {
            // Use Google Custom Search JSON API
            const searchResults = await this.performGoogleAPISearch(query);
            
            if (searchResults.length > 0) {
                this.displayResults(searchResults, query, false);
                this.incrementQueryCount();
            } else {
                // Fallback to alternative search
                console.warn('Google API returned no results, trying alternative');
                const altResults = await this.performAlternativeSearch(query);
                if (altResults.length > 0) {
                    this.displayResults(altResults, query, true);
                } else {
                    this.showGoogleIframe(query);
                }
            }
            
        } catch (error) {
            console.error('Google API search error:', error);
            
            // Fallback to alternative search on API error
            try {
                const altResults = await this.performAlternativeSearch(query);
                if (altResults.length > 0) {
                    this.displayResults(altResults, query, true);
                } else {
                    this.showGoogleIframe(query);
                }
            } catch (fallbackError) {
                console.error('All search methods failed:', fallbackError);
                this.showError('Gagal melakukan pencarian. Silakan coba lagi.');
            }
        } finally {
            this.hideLoading();
        }
    }

    async performGoogleAPISearch(query) {
        const params = new URLSearchParams({
            key: this.apiKey,
            cx: this.searchEngineId,
            q: query,
            lr: 'lang_id',
            gl: 'id',
            hl: 'id',
            num: 10
        });

        const response = await fetch(`${this.apiUrl}?${params}`);
        
        if (!response.ok) {
            throw new Error(`Google API error: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        
        if (data.error) {
            throw new Error(`Google API error: ${data.error.message}`);
        }
        
        if (!data.items || data.items.length === 0) {
            return [];
        }
        
        return data.items.map(item => ({
            title: item.title,
            link: item.link,
            snippet: item.snippet || ''
        }));
    }

    // Rate limiting methods
    getQueryCount() {
        const today = new Date().toDateString();
        const stored = localStorage.getItem('gsearch_query_count');
        const data = stored ? JSON.parse(stored) : { date: today, count: 0 };
        
        // Reset if it's a new day
        if (data.date !== today) {
            data.date = today;
            data.count = 0;
            localStorage.setItem('gsearch_query_count', JSON.stringify(data));
        }
        
        return data.count;
    }

    incrementQueryCount() {
        const today = new Date().toDateString();
        const stored = localStorage.getItem('gsearch_query_count');
        const data = stored ? JSON.parse(stored) : { date: today, count: 0 };
        
        data.date = today;
        data.count += 1;
        localStorage.setItem('gsearch_query_count', JSON.stringify(data));
        this.queryCount = data.count;
    }

    async performAlternativeSearch(query) {
        try {
            // Try to get results from DuckDuckGo API as fallback
            const ddgUrl = `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&pretty=1`;
            const response = await fetch(ddgUrl);
            const data = await response.json();
            
            if (data.RelatedTopics) {
                return data.RelatedTopics.slice(0, 10).map(topic => ({
                    title: topic.Text || topic.FirstURL,
                    link: topic.FirstURL,
                    snippet: topic.Text || ''
                })).filter(result => result.title && result.link);
            }
        } catch (error) {
            console.warn('Alternative search failed:', error);
        }
        
        return [];
    }

    showGoogleIframe(query) {
        const encodedQuery = encodeURIComponent(query);
        const googleUrl = `${this.searchUrl}?q=${encodedQuery}&gl=ID&hl=id`;
        
        this.searchResults.innerHTML = `
            <div class="search-header">
                <h3 class="text-xl font-bold mb-4 text-cyan-400">
                    Hasil Pencarian untuk "${this.escapeHtml(query)}"
                </h3>
                <p class="text-sm text-gray-400 mb-4">
                    Menampilkan hasil langsung dari Google
                </p>
            </div>
            <div class="iframe-container">
                <iframe 
                    src="${googleUrl}" 
                    style="width: 100%; height: 600px; border: 1px solid var(--cyber-blue); border-radius: 10px;"
                    frameborder="0"
                    allowfullscreen>
                </iframe>
                <div class="mt-4 text-sm text-gray-400">
                    <i class="fas fa-info-circle mr-2"></i>
                    Hasil pencarian ditampilkan langsung dari Google dalam iframe
                </div>
            </div>
        `;
        
        this.searchResults.style.display = 'block';
        this.searchResults.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    parseGoogleResults(htmlContent) {
        const results = [];
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlContent, 'text/html');
        
        // Try multiple selectors for Google search results
        const selectors = [
            'div.g',           // Standard Google result container
            'div[data-hveid]', // Alternative Google result container
            'div[data-sokoban-container]', // Another Google container
            'div[data-ved]',   // Google result with tracking data
            'div[data-q]',     // Google result with query data
            'div.yuRUbf',      // Google result with URL class
            'div.g > div',     // Child of standard container
            'div[data-snf]',   // Google result with snippet data
            'div[data-async-context]' // Google async results
        ];
        
        let searchResultElements = [];
        
        // Try each selector until we find results
        for (const selector of selectors) {
            const elements = doc.querySelectorAll(selector);
            if (elements.length > 0) {
                searchResultElements = elements;
                console.log(`Found ${elements.length} results using selector: ${selector}`);
                break;
            }
        }
        
        // If no results found with selectors, try to find any links with h3
        if (searchResultElements.length === 0) {
            console.log('No results found with selectors, trying fallback method');
            const links = doc.querySelectorAll('a[href]');
            links.forEach(link => {
                const h3 = link.querySelector('h3');
                if (h3 && link.href && this.isValidUrl(link.href)) {
                    const parent = link.closest('div');
                    const snippet = parent ? parent.textContent.replace(h3.textContent, '').trim() : '';
                    
                    if (this.isValidResult({title: h3.textContent.trim(), link: link.href, snippet: snippet})) {
                        results.push({
                            title: h3.textContent.trim(),
                            link: link.href,
                            snippet: snippet.substring(0, 200) + (snippet.length > 200 ? '...' : '')
                        });
                    }
                }
            });
        } else {
            // Parse found elements
            searchResultElements.forEach(element => {
                try {
                    const titleElement = element.querySelector('h3') || element.querySelector('h3 a');
                    const linkElement = element.querySelector('a') || titleElement;
                    const snippetElement = element.querySelector('.VwiC3b') || 
                                          element.querySelector('.lyLwlc') || 
                                          element.querySelector('[data-snf]') ||
                                          element.querySelector('.s3v9rd');
                    
                    if (titleElement && linkElement && linkElement.href) {
                        const result = {
                            title: titleElement.textContent.trim(),
                            link: linkElement.href,
                            snippet: snippetElement ? snippetElement.textContent.trim() : this.extractSnippet(element)
                        };
                        
                        // Filter out Google internal links and ads
                        if (this.isValidResult(result)) {
                            results.push(result);
                        }
                    }
                } catch (error) {
                    console.warn('Error parsing search result:', error);
                }
            });
        }

        // Remove duplicates
        const uniqueResults = this.removeDuplicates(results);
        
        return uniqueResults.slice(0, 10); // Limit to 10 results
    }

    extractSnippet(element) {
        // Try to extract snippet from various elements
        const snippetSelectors = [
            '.VwiC3b',
            '.lyLwlc', 
            '[data-snf]',
            '.s3v9rd',
            '.MUxGbd',
            '.yDYNvb',
            '.wDYxhc'
        ];
        
        for (const selector of snippetSelectors) {
            const snippetEl = element.querySelector(selector);
            if (snippetEl && snippetEl.textContent.trim()) {
                return snippetEl.textContent.trim();
            }
        }
        
        // Fallback: get text content and remove title
        const titleEl = element.querySelector('h3');
        const fullText = element.textContent || '';
        const titleText = titleEl ? titleEl.textContent : '';
        const snippet = fullText.replace(titleText, '').trim();
        
        return snippet.length > 200 ? snippet.substring(0, 200) + '...' : snippet;
    }

    removeDuplicates(results) {
        const seen = new Set();
        return results.filter(result => {
            const key = result.link + result.title;
            if (seen.has(key)) {
                return false;
            }
            seen.add(key);
            return true;
        });
    }

    isValidUrl(url) {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    }

    isValidResult(result) {
        // Filter out unwanted results
        const unwantedPatterns = [
            'google.com',
            'gstatic.com',
            'google.co.id',
            'translate.google',
            'maps.google',
            'webcache.google'
        ];

        return !unwantedPatterns.some(pattern => 
            result.link.toLowerCase().includes(pattern)
        ) && result.title && result.link;
    }

    displayResults(results, query, isAlternative = false) {
        if (results.length === 0) {
            this.searchResults.innerHTML = `
                <div class="error-message">
                    <i class="fas fa-exclamation-triangle mr-2"></i>
                    Tidak ada hasil ditemukan untuk "${query}"
                </div>
            `;
        } else {
            const resultsHTML = results.map((result, index) => `
                <div class="result-item result-item-enter" style="animation-delay: ${index * 0.1}s">
                    <div class="result-title">
                        <a href="${result.link}" target="_blank" rel="noopener noreferrer">
                            ${this.escapeHtml(result.title)}
                        </a>
                    </div>
                    <div class="result-link">
                        ${this.escapeHtml(result.link)}
                    </div>
                    <div class="result-snippet">
                        ${this.escapeHtml(result.snippet)}
                    </div>
                </div>
            `).join('');

            let apiInfo = '';
            if (!isAlternative) {
                const remainingQueries = this.dailyLimit - this.queryCount;
                const usagePercentage = (this.queryCount / this.dailyLimit * 100).toFixed(1);
                
                apiInfo = `
                    <div class="api-usage-info mb-4 p-3 bg-gray-800 rounded-lg border border-cyan-500/30">
                        <div class="flex items-center justify-between text-sm">
                            <div class="flex items-center space-x-4">
                                <span class="text-cyan-400">
                                    <i class="fas fa-chart-line mr-1"></i>
                                    API Usage: ${this.queryCount}/${this.dailyLimit}
                                </span>
                                <span class="text-gray-400">
                                    (${usagePercentage}% used)
                                </span>
                            </div>
                            <div class="flex items-center">
                                <div class="w-32 bg-gray-700 rounded-full h-2 mr-2">
                                    <div class="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full transition-all duration-300" 
                                         style="width: ${usagePercentage}%"></div>
                                </div>
                                <span class="text-gray-400 text-xs">${remainingQueries} left</span>
                            </div>
                        </div>
                    </div>
                `;
            }

            const searchSource = isAlternative ? 
                '<span class="text-orange-400"><i class="fas fa-fire mr-1"></i>DuckDuckGo</span>' : 
                '<span class="text-green-400"><i class="fab fa-google mr-1"></i>Google API</span>';

            this.searchResults.innerHTML = `
                <div class="search-header">
                    <h3 class="text-xl font-bold mb-2 text-cyan-400">
                        Hasil Pencarian untuk "${this.escapeHtml(query)}"
                    </h3>
                    <div class="flex items-center justify-between mb-4">
                        <p class="text-sm text-gray-400">
                            Ditemukan ${results.length} hasil via ${searchSource}
                        </p>
                        ${isAlternative ? '<span class="text-xs text-orange-400"><i class="fas fa-info-circle mr-1"></i>Fallback search engine</span>' : ''}
                    </div>
                    ${apiInfo}
                </div>
                ${resultsHTML}
            `;
        }

        this.searchResults.style.display = 'block';
        this.searchResults.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    showLoading() {
        this.loadingElement.style.display = 'block';
        this.searchButton.disabled = true;
        this.searchButton.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>MENCARI...';
    }

    hideLoading() {
        this.loadingElement.style.display = 'none';
        this.searchButton.disabled = false;
        this.searchButton.innerHTML = '<i class="fas fa-search mr-2"></i>CARI';
    }

    showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message error-shake';
        errorDiv.innerHTML = `
            <i class="fas fa-exclamation-triangle mr-2"></i>
            ${message}
        `;
        
        this.searchResults.innerHTML = '';
        this.searchResults.appendChild(errorDiv);
        this.searchResults.style.display = 'block';
        
        // Auto hide after 5 seconds
        setTimeout(() => {
            errorDiv.style.opacity = '0';
            setTimeout(() => {
                if (errorDiv.parentNode) {
                    errorDiv.parentNode.removeChild(errorDiv);
                }
            }, 300);
        }, 5000);
    }

    showSuccess(message) {
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message success-bounce';
        successDiv.innerHTML = `
            <i class="fas fa-check-circle mr-2"></i>
            ${message}
        `;
        
        this.searchResults.innerHTML = '';
        this.searchResults.appendChild(successDiv);
        this.searchResults.style.display = 'block';
        
        // Auto hide after 3 seconds
        setTimeout(() => {
            successDiv.style.opacity = '0';
            setTimeout(() => {
                if (successDiv.parentNode) {
                    successDiv.parentNode.removeChild(successDiv);
                }
            }, 300);
        }, 3000);
    }

    showWarning(message) {
        const warningDiv = document.createElement('div');
        warningDiv.className = 'warning-message warning-pulse';
        warningDiv.innerHTML = `
            <i class="fas fa-exclamation-triangle mr-2"></i>
            ${message}
        `;
        
        this.searchResults.innerHTML = '';
        this.searchResults.appendChild(warningDiv);
        this.searchResults.style.display = 'block';
        
        // Auto hide after 4 seconds
        setTimeout(() => {
            warningDiv.style.opacity = '0';
            setTimeout(() => {
                if (warningDiv.parentNode) {
                    warningDiv.parentNode.removeChild(warningDiv);
                }
            }, 300);
        }, 4000);
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Additional utility methods
    clearResults() {
        this.searchResults.innerHTML = '';
        this.searchResults.style.display = 'none';
    }

    getSearchSuggestions(query) {
        // This could be implemented to show search suggestions
        // For now, it's a placeholder
        return [];
    }
}

// Initialize the search engine when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.gSearchEngine = new GSearchEngine();
    
    // Add some keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // Ctrl/Cmd + K to focus search
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            document.getElementById('searchInput').focus();
        }
        
        // Escape to clear results
        if (e.key === 'Escape') {
            window.gSearchEngine.clearResults();
        }
    });
    
    // Add page load animation
    document.body.classList.add('page-load-animation');
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GSearchEngine;
}
