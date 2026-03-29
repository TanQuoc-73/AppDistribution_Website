// TC_Order_PreventDuplicateOrder
// Test Steps:
// 1. Open browser
// 2. Login as user
// 3. Add product to cart
// 4. Checkout and place order
// 5. Attempt to place the same order again
// 6. Verify duplicate order is prevented
// Expected Result: System prevents duplicate orders

import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI

WebUI.openBrowser('')
WebUI.navigateToUrl('https://your-app-url.com/login')
WebUI.setText(findTestObject('LoginPage/Username'), 'user')
WebUI.setEncryptedText(findTestObject('LoginPage/Password'), 'encrypted_user_password')
WebUI.click(findTestObject('LoginPage/LoginButton'))
WebUI.click(findTestObject('ProductPage/ProductItem'))
WebUI.click(findTestObject('ProductPage/AddToCartButton'))
WebUI.click(findTestObject('CartPage/CheckoutButton'))
WebUI.click(findTestObject('CheckoutPage/PlaceOrderButton'))
WebUI.click(findTestObject('ProductPage/ProductItem'))
WebUI.click(findTestObject('ProductPage/AddToCartButton'))
WebUI.click(findTestObject('CartPage/CheckoutButton'))
WebUI.click(findTestObject('CheckoutPage/PlaceOrderButton'))
WebUI.verifyElementPresent(findTestObject('OrderPage/DuplicateOrderError'), 10)
WebUI.closeBrowser()