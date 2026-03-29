// TC_Download_PreventWithoutOwnership
// Test Steps:
// 1. Open browser
// 2. Login as user
// 3. Go to product page for unowned product
// 4. Attempt to download
// 5. Verify error or restriction message
// Expected Result: Download is not allowed for unowned product

import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI

WebUI.openBrowser('')
WebUI.navigateToUrl('https://your-app-url.com/login')
WebUI.setText(findTestObject('LoginPage/Username'), 'user')
WebUI.setEncryptedText(findTestObject('LoginPage/Password'), 'encrypted_user_password')
WebUI.click(findTestObject('LoginPage/LoginButton'))
WebUI.navigateToUrl('https://your-app-url.com/products/unowned-product')
WebUI.click(findTestObject('ProductPage/DownloadButton'))
WebUI.verifyElementPresent(findTestObject('ProductPage/DownloadErrorMessage'), 10)
WebUI.closeBrowser()