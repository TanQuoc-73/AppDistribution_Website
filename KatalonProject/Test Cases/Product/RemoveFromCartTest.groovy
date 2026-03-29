// TC_Cart_RemoveItem
// Test Steps:
// 1. Open browser
// 2. Login as user
// 3. Add product to cart
// 4. Go to cart
// 5. Remove product from cart
// 6. Verify product is removed
// Expected Result: Product is removed from cart

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
WebUI.click(findTestObject('CartPage/RemoveItemButton'))
WebUI.verifyElementNotPresent(findTestObject('CartPage/CartItem'), 10)
WebUI.closeBrowser()