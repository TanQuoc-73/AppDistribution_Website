// TC_Review_PreventWithoutPurchase
// Test Steps:
// 1. Open browser
// 2. Login as user
// 3. Go to unpurchased product page
// 4. Attempt to add review
// 5. Verify error or restriction message
// Expected Result: Review is not allowed for unpurchased product

import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI

WebUI.openBrowser('')
WebUI.navigateToUrl('https://your-app-url.com/login')
WebUI.setText(findTestObject('LoginPage/Username'), 'user')
WebUI.setEncryptedText(findTestObject('LoginPage/Password'), 'encrypted_user_password')
WebUI.click(findTestObject('LoginPage/LoginButton'))
WebUI.navigateToUrl('https://your-app-url.com/products/unpurchased-product')
WebUI.click(findTestObject('ProductPage/AddReviewButton'))
WebUI.verifyElementPresent(findTestObject('ProductPage/ReviewErrorMessage'), 10)
WebUI.closeBrowser()