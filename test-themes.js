// Theme Test Script - Run this in browser console
console.log('=== THEME SYSTEM TEST ===');

// Test 1: Check if themes object is available
console.log('Available themes:', Object.keys(THEMES));

// Test 2: Check current theme
console.log('Current theme:', getCurrentTheme());

// Test 3: Check data-theme attribute
console.log('Current data-theme attribute:', document.documentElement.getAttribute('data-theme'));

// Test 4: Cycle through all themes
console.log('\n=== CYCLING THROUGH ALL THEMES ===');
let testIndex = 0;
const testThemes = Object.keys(THEMES);

function testNextTheme() {
    if (testIndex < testThemes.length) {
        const themeName = testThemes[testIndex];
        console.log(`\nTesting theme ${testIndex + 1}/${testThemes.length}: ${themeName}`);
        setTheme(themeName);
        
        setTimeout(() => {
            console.log('- Applied data-theme:', document.documentElement.getAttribute('data-theme'));
            console.log('- Stored in localStorage:', localStorage.getItem('theme'));
            console.log('- CSS variables loaded:', getComputedStyle(document.documentElement).getPropertyValue('--bg-color'));
            
            testIndex++;
            testNextTheme();
        }, 1000);
    } else {
        console.log('\n=== THEME TEST COMPLETE ===');
        console.log('Returning to midnight theme...');
        setTheme('midnight');
    }
}

// Start the test
testNextTheme();