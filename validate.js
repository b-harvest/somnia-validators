const fs = require('fs');
const path = require('path');

function validateFileName(fileName) {
    // Check if filename (without extension) is all lowercase
    const nameWithoutExt = path.basename(fileName, '.json');
    return nameWithoutExt === nameWithoutExt.toLowerCase();
}

function validateValidatorProfile(filePath) {
    try {
        const data = fs.readFileSync(filePath, 'utf8');
        const profile = JSON.parse(data);

        const errors = [];

        // Check filename format
        const fileName = path.basename(filePath);
        if (!validateFileName(fileName)) {
            errors.push(`Filename must be all lowercase: "${fileName}" should be "${fileName.toLowerCase()}"`);
        }

        // Required fields
        if (!profile.moniker || typeof profile.moniker !== 'string') {
            errors.push('Missing or invalid moniker');
        }

        if (!profile.details || typeof profile.details !== 'string') {
            errors.push('Missing or invalid details');
        }

        if (!profile.profile || typeof profile.profile !== 'string') {
            errors.push('Missing or invalid profile');
        }

        // Background is optional but validate if present
        if (profile.background && typeof profile.background !== 'string') {
            errors.push('Invalid background field (should be a string)');
        }

        if (!profile.contact || typeof profile.contact !== 'object') {
            errors.push('Missing or invalid contact object');
        } else {
            if (!profile.contact.email || typeof profile.contact.email !== 'string') {
                errors.push('Missing or invalid contact.email');
            }
            if (!profile.contact.website || typeof profile.contact.website !== 'string') {
                errors.push('Missing or invalid contact.website');
            }
        }

        // Validate image path format
        if (profile.profile && !profile.profile.startsWith('./images/')) {
            errors.push('profile should start with "./images/"');
        }

        if (profile.background && !profile.background.startsWith('./background/')) {
            errors.push('background should start with "./background/"');
        }

        // Check if image files exist
        if (profile.profile && profile.profile.startsWith('./images/')) {
            const imagePath = path.join(path.dirname(filePath), profile.profile);
            if (!fs.existsSync(imagePath)) {
                errors.push(`Referenced profile image does not exist: ${profile.profile}`);
            }
        }

        if (profile.background && profile.background.startsWith('./background/')) {
            const backgroundPath = path.join(path.dirname(filePath), profile.background);
            if (!fs.existsSync(backgroundPath)) {
                errors.push(`Referenced background image does not exist: ${profile.background}`);
            }
        }

        return {
            valid: errors.length === 0,
            errors: errors,
            profile: profile
        };

    } catch (error) {
        return {
            valid: false,
            errors: [`Invalid JSON format: ${error.message}`],
            profile: null
        };
    }
}

function validateDirectory(dirName) {
    const dirPath = path.join(__dirname, dirName);

    if (!fs.existsSync(dirPath)) {
        console.log(`Directory ${dirName} not found, skipping...`);
        return { valid: true, results: [] };
    }

    const files = fs.readdirSync(dirPath)
        .filter(file => file.endsWith('.json') && file !== 'validator-template.json');

    let dirValid = true;
    const results = [];

    files.forEach(file => {
        const filePath = path.join(dirPath, file);
        const result = validateValidatorProfile(filePath);

        results.push({
            file: file,
            valid: result.valid,
            errors: result.errors
        });

        if (!result.valid) {
            dirValid = false;
        }
    });

    return {
        valid: dirValid,
        results: results
    };
}

function validateAllProfiles() {
    const directories = ['testnet', 'mainnet'];
    let allValid = true;

    console.log('========================================');
    console.log('  Validator Profiles Validation Report');
    console.log('========================================\n');

    directories.forEach(dir => {
        console.log(`\n📁 Directory: ${dir}`);
        console.log('----------------------------------------');

        const dirValidation = validateDirectory(dir);

        if (dirValidation.results.length === 0) {
            console.log('   No JSON files found or directory does not exist.\n');
        } else {
            dirValidation.results.forEach(result => {
                if (result.valid) {
                    console.log(`   ✅ ${result.file}`);
                } else {
                    console.log(`   ❌ ${result.file}`);
                    result.errors.forEach(error => {
                        console.log(`      └─ ${error}`);
                    });
                }
            });

            if (!dirValidation.valid) {
                allValid = false;
            }

            // Summary for this directory
            const validCount = dirValidation.results.filter(r => r.valid).length;
            const totalCount = dirValidation.results.length;
            console.log(`\n   Summary: ${validCount}/${totalCount} files valid`);
        }
    });

    console.log('\n========================================');
    if (allValid) {
        console.log('🎉 SUCCESS: All validator profiles are valid!');
        console.log('========================================\n');
        process.exit(0);
    } else {
        console.log('❌ FAILED: Some validator profiles have errors.');
        console.log('Please fix the errors listed above.');
        console.log('========================================\n');
        process.exit(1);
    }
}

// CLI argument handling
if (require.main === module) {
    const args = process.argv.slice(2);

    if (args.length > 0 && (args[0] === '--help' || args[0] === '-h')) {
        console.log('Usage: node validate.js [options]');
        console.log('\nOptions:');
        console.log('  --help, -h    Show this help message');
        console.log('\nThis script validates all JSON files in testnet/ and mainnet/ directories.');
        console.log('It checks for:');
        console.log('  - Lowercase filenames');
        console.log('  - Required fields (moniker, details, profile, contact)');
        console.log('  - Proper image path formats');
        console.log('  - Existence of referenced image files');
        process.exit(0);
    }

    validateAllProfiles();
}

module.exports = { validateValidatorProfile, validateDirectory, validateAllProfiles };