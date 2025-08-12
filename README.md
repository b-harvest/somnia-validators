# Somnia Validators

A community-driven registry of Somnia Network validators. This repository allows validators to submit their profile information, making it easy for delegators to discover and learn about validators on the network.

## How to Add Your Validator

### Step 1: Fork this repository

Click the "Fork" button at the top right of this repository to create your own copy.

### Step 2: Add your images

#### Profile Image
1. Navigate to the `testnet/images/` directory
2. Upload your validator's profile image with the filename: `[your-validator-address].png` (or `.jpg`, `.svg`)
3. Recommended image size: 200x200px or larger, square format

#### Background Image (Optional)
1. Navigate to the `testnet/background/` directory
2. Upload your validator's background image with the filename: `[your-validator-address].png` (or `.jpg`, `.svg`)
3. Recommended image size: 1920x1080px or similar wide format

### Step 3: Create your validator profile

1. Navigate to the `testnet/` directory
2. Create a new JSON file named after your validator address: `[your-validator-address].json`
3. Use the following template for your validator profile:

```json
{
    "moniker": "Your Validator Name",
    "details": "Brief description of your validator",
    "profile": "./images/[your-validator-address].png",
    "background": "./background/[your-validator-address].png",
    "contact": {
        "email": "your-email@example.com",
        "website": "https://your-website.com"
    }
}
```

### Step 4: Fill out your information

- **moniker**: Your validator's display name
- **details**: A brief description of your validator and services
- **profile**: Relative path to your validator's profile image (should match your uploaded image)
- **background**: Relative path to your validator's background image (optional)
- **contact.email**: Your contact email
- **contact.website**: Your validator's website

### Step 5: Submit a Pull Request

1. Commit your changes with a clear message: `Add [YourValidatorName] validator profile`
2. Push the changes to your forked repository
3. Create a Pull Request to this repository with the title: `Add [YourValidatorName] validator profile`
4. In the PR description, briefly introduce your validator and any additional information

### Guidelines

- Ensure all URLs are accessible and working
- Profile and background images should be in PNG, JPG, or SVG format (max 1MB file size for profile, max 2MB for background)
- Use the same filename for both your JSON profile and image (with appropriate extensions)
- Keep descriptions concise and professional
- Make sure your JSON file is valid and properly formatted
- Use your actual validator address as the filename

### Example

See `testnet/validator-template.json` for a complete example, or check existing validator profiles in the `testnet/` directory.

## Validation

All submissions will be reviewed for:
- Correct JSON formatting
- Working URLs for images and websites
- Appropriate content (no spam, offensive material, etc.)
- Accurate validator address

## Validation

To validate your profile before submitting, you can run:

```bash
npm install
npm run validate
```

This will check all validator profiles for proper formatting and required fields.

## Support

If you need help with your submission, please open an issue or contact us through our community channels.
