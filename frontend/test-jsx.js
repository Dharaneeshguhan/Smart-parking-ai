const fs = require('fs');
const babel = require('@babel/core');

try {
    const code = fs.readFileSync('src/pages/ParkingSearchPage.jsx', 'utf-8');
    babel.transformSync(code, {
        presets: ['@babel/preset-react'],
        filename: 'src/pages/ParkingSearchPage.jsx'
    });
    console.log('SUCCESS: ParkingSearchPage.jsx parsed and compiled without syntax errors.');
} catch (error) {
    console.error('ERROR parsing JSX:', error.message);
}
