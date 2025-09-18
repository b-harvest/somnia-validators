const fs = require('fs');
const path = require('path');

function renameToLowercase() {
    const directories = ['testnet', 'mainnet'];
    let renamedCount = 0;
    
    console.log('========================================');
    console.log('  Renaming Files to Lowercase');
    console.log('========================================\n');
    
    directories.forEach(dir => {
        const dirPath = path.join(__dirname, dir);
        
        if (!fs.existsSync(dirPath)) {
            console.log(`Directory ${dir} not found, skipping...\n`);
            return;
        }
        
        console.log(`📁 Processing directory: ${dir}`);
        console.log('----------------------------------------');
        
        // Process JSON files
        const jsonFiles = fs.readdirSync(dirPath)
            .filter(file => file.endsWith('.json') && file !== 'validator-template.json');
        
        jsonFiles.forEach(file => {
            const lowerCaseFile = file.toLowerCase();
            if (file !== lowerCaseFile) {
                const oldPath = path.join(dirPath, file);
                const newPath = path.join(dirPath, lowerCaseFile);
                
                try {
                    fs.renameSync(oldPath, newPath);
                    console.log(`   ✅ Renamed: ${file} → ${lowerCaseFile}`);
                    renamedCount++;
                } catch (error) {
                    console.log(`   ❌ Failed to rename ${file}: ${error.message}`);
                }
            } else {
                console.log(`   ⏭️  Already lowercase: ${file}`);
            }
        });
        
        // Process subdirectories (images, background)
        const subdirs = ['images', 'background'];
        subdirs.forEach(subdir => {
            const subdirPath = path.join(dirPath, subdir);
            if (fs.existsSync(subdirPath)) {
                console.log(`\n   📂 Processing ${subdir}/ subdirectory:`);
                
                const imageFiles = fs.readdirSync(subdirPath);
                imageFiles.forEach(file => {
                    const lowerCaseFile = file.toLowerCase();
                    if (file !== lowerCaseFile) {
                        const oldPath = path.join(subdirPath, file);
                        const newPath = path.join(subdirPath, lowerCaseFile);
                        
                        try {
                            fs.renameSync(oldPath, newPath);
                            console.log(`      ✅ Renamed: ${file} → ${lowerCaseFile}`);
                            renamedCount++;
                        } catch (error) {
                            console.log(`      ❌ Failed to rename ${file}: ${error.message}`);
                        }
                    } else {
                        console.log(`      ⏭️  Already lowercase: ${file}`);
                    }
                });
            }
        });
        
        console.log('');
    });
    
    console.log('========================================');
    console.log(`🎉 COMPLETE: Renamed ${renamedCount} files to lowercase`);
    console.log('========================================\n');
}

// CLI argument handling
if (require.main === module) {
    const args = process.argv.slice(2);
    
    if (args.length > 0 && (args[0] === '--help' || args[0] === '-h')) {
        console.log('Usage: node rename-to-lowercase.js [options]');
        console.log('\nOptions:');
        console.log('  --help, -h    Show this help message');
        console.log('\nThis script renames all files in testnet/ and mainnet/ directories to lowercase.');
        console.log('It processes:');
        console.log('  - JSON files in testnet/ and mainnet/');
        console.log('  - Image files in images/ and background/ subdirectories');
        console.log('  - Skips validator-template.json');
        process.exit(0);
    }
    
    renameToLowercase();
}

module.exports = { renameToLowercase };