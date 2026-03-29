// TC_Review_CreateReview
// Test Steps:
// 1. Open browser
// 2. Login as user
// 3. Go to purchased product page
// 4. Click 'Add Review'
// 5. Fill review form
// 6. Submit
// 7. Verify review appears
// Expected Result: Review is created and visible

import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI

WebUI.openBrowser('')
WebUI.navigateToUrl('https://your-app-url.com/login')
WebUI.setText(findTestObject('LoginPage/Username'), 'user')
WebUI.setEncryptedText(findTestObject('LoginPage/Password'), 'encrypted_user_password')
WebUI.click(findTestObject('LoginPage/LoginButton'))
WebUI.navigateToUrl('https://your-app-url.com/products/purchased-product')
WebUI.click(findTestObject('ProductPage/AddReviewButton'))
WebUI.setText(findTestObject('ProductPage/ReviewTextField'), 'Great product!')
WebUI.click(findTestObject('ProductPage/SubmitReviewButton'))
WebUI.verifyElementPresent(findTestObject('ProductPage/ReviewListItem'), 10)
WebUI.closeBrowser()