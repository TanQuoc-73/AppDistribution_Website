// TC_Cart_UpdateQuantity
// Test Steps:
// 1. Open browser
// 2. Login as user
// 3. Add product to cart
// 4. Go to cart
// 5. Update quantity
// 6. Verify quantity is updated
// Expected Result: Cart quantity is updated

import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI

WebUI.openBrowser('')
WebUI.navigateToUrl('https://your-app-url.com/login')
WebUI.setText(findTestObject('LoginPage/Username'), 'user')
WebUI.setEncryptedText(findTestObject('LoginPage/Password'), 'encrypted_user_password')
WebUI.click(findTestObject('LoginPage/LoginButton'))
WebUI.navigateToUrl('https://your-app-url.com/products/1')
WebUI.click(findTestObject('ProductPage/AddToCartButton'))
WebUI.click(findTestObject('CartPage/ViewCartButton'))
WebUI.setText(findTestObject('CartPage/QuantityField'), '2')
WebUI.click(findTestObject('CartPage/UpdateQuantityButton'))
WebUI.verifyElementText(findTestObject('CartPage/QuantityField'), '2')
WebUI.closeBrowser()