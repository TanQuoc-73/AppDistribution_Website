// TC_Order_Checkout
// Test Steps:
// 1. Open browser
// 2. Login as user
// 3. Add product to cart
// 4. Go to cart
// 5. Click checkout
// 6. Fill payment info
// 7. Place order
// 8. Verify order confirmation
// Expected Result: Order is placed and confirmation is shown

import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI

WebUI.openBrowser('')
WebUI.navigateToUrl('https://your-app-url.com/login')
WebUI.setText(findTestObject('LoginPage/Username'), 'user')
WebUI.setEncryptedText(findTestObject('LoginPage/Password'), 'encrypted_user_password')
WebUI.click(findTestObject('LoginPage/LoginButton'))
WebUI.click(findTestObject('ProductPage/ProductItem'))
WebUI.click(findTestObject('ProductPage/AddToCartButton'))
WebUI.click(findTestObject('CartPage/ViewCartButton'))
WebUI.click(findTestObject('CartPage/CheckoutButton'))
WebUI.setText(findTestObject('CheckoutPage/PaymentField'), '4111111111111111')
WebUI.click(findTestObject('CheckoutPage/PlaceOrderButton'))
WebUI.verifyElementPresent(findTestObject('OrderPage/OrderConfirmation'), 10)
WebUI.closeBrowser()