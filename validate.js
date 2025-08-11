const fs = require('fs');
const path = require('path');

function validateValidatorProfile(filePath) {
    try {
        const data = fs.readFileSync(filePath, 'utf8');
        const profile = JSON.parse(data);
        
        const errors = [];
        
        // Required fields
        if (!profile.moniker || typeof profile.moniker !== 'string') {
            errors.push('Missing or invalid moniker');
        }
        
        if (!profile.details || typeof profile.details !== 'string') {
            errors.push('Missing or invalid details');
        }
        
        if (!profile.profile_image_url || typeof profile.profile_image_url !== 'string') {
            errors.push('Missing or invalid profile_image_url');
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
        if (profile.profile_image_url && !profile.profile_image_url.startsWith('./images/')) {
            errors.push('profile_image_url should start with "./images/"');
        }
        
        // Check if image file exists
        if (profile.profile_image_url && profile.profile_image_url.startsWith('./images/')) {
            const imagePath = path.join(path.dirname(filePath), profile.profile_image_url);
            if (!fs.existsSync(imagePath)) {
                errors.push(`Referenced image file does not exist: ${profile.profile_image_url}`);
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

function validateAllProfiles() {
    const testnetDir = path.join(__dirname, 'testnet');
    const files = fs.readdirSync(testnetDir)
        .filter(file => file.endsWith('.json') && file !== 'validator-template.json');
    
    let allValid = true;
    
    console.log('Validating validator profiles...\n');
    
    files.forEach(file => {
        const filePath = path.join(testnetDir, file);
        const result = validateValidatorProfile(filePath);
        
        console.log(`📄 ${file}:`);
        
        if (result.valid) {
            console.log('   ✅ Valid');
        } else {
            console.log('   ❌ Invalid:');
            result.errors.forEach(error => {
                console.log(`      - ${error}`);
            });
            allValid = false;
        }
        console.log('');
    });
    
    if (allValid) {
        console.log('🎉 All validator profiles are valid!');
        process.exit(0);
    } else {
        console.log('❌ Some validator profiles have errors. Please fix them.');
        process.exit(1);
    }
}

if (require.main === module) {
    validateAllProfiles();
}

module.exports = { validateValidatorProfile, validateAllProfiles };