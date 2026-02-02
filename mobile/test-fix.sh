#!/bin/bash
# Test script to verify the axios crypto import fix
# Note: This script is designed for Unix-like systems (Linux, macOS)

echo "======================================"
echo "Testing Axios Crypto Import Fix"
echo "======================================"
echo ""

# Change to mobile directory
cd "$(dirname "$0")"

echo "1. Checking metro.config.js exists..."
if [ -f "metro.config.js" ]; then
    echo "   ✅ metro.config.js found"
else
    echo "   ❌ metro.config.js NOT found"
    exit 1
fi

echo ""
echo "2. Checking for key configuration..."
if grep -q "unstable_enablePackageExports" metro.config.js; then
    echo "   ✅ Package exports support enabled"
else
    echo "   ❌ Package exports support NOT enabled"
    exit 1
fi

echo ""
echo "3. Checking if node_modules exists..."
if [ -d "node_modules" ]; then
    echo "   ✅ node_modules found"
else
    echo "   ⚠️  node_modules NOT found. Run: npm install"
    exit 1
fi

echo ""
echo "4. Checking axios installation..."
if [ -d "node_modules/axios" ]; then
    AXIOS_VERSION=$(node -p "require('./node_modules/axios/package.json').version")
    echo "   ✅ axios installed (version $AXIOS_VERSION)"
else
    echo "   ❌ axios NOT installed"
    exit 1
fi

echo ""
echo "5. Testing Metro bundler (export test)..."
echo "   This may take a minute..."

# Create platform-agnostic temp directory
TEST_OUTPUT_DIR="$(pwd)/.test-export-output"
TEST_LOG="$(pwd)/.test-export.log"

npx expo export --output-dir "$TEST_OUTPUT_DIR" > "$TEST_LOG" 2>&1

# Check for success indicators (multiple patterns for robustness across expo versions)
if grep -qE "(App exported|Export complete|Exporting.*bundle)" "$TEST_LOG" && ! grep -q "crypto" "$TEST_LOG"; then
    echo "   ✅ Bundle test PASSED - No crypto errors!"
    echo ""
    echo "======================================"
    echo "SUCCESS! The fix is working properly."
    echo "======================================"
    echo ""
    echo "You can now run your app:"
    echo "  npm start"
    echo "  # Then press 'a' for Android or 'i' for iOS"
    echo ""
    # Cleanup
    rm -rf "$TEST_OUTPUT_DIR" "$TEST_LOG"
    exit 0
else
    if grep -q "crypto" "$TEST_LOG"; then
        echo "   ❌ Bundle test FAILED - Crypto error still present"
        echo ""
        echo "Please try:"
        echo "  1. rm -rf node_modules"
        echo "  2. npm install"
        echo "  3. npx expo start --clear"
        echo ""
        echo "See $TEST_LOG for details"
    else
        echo "   ❌ Bundle test had errors"
        echo "   Check $TEST_LOG for details"
    fi
    exit 1
fi
