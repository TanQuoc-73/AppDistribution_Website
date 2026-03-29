// TC_Download_Product
// Test Steps:
// 1. Open browser
// 2. Login as user
// 3. Go to library
// 4. Click download on owned product
// 5. Verify download starts
// Expected Result: Product download is initiated

import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI

WebUI.openBrowser('')
WebUI.navigateToUrl('https://your-app-url.com/login')
WebUI.setText(findTestObject('LoginPage/Username'), 'user')
WebUI.setEncryptedText(findTestObject('LoginPage/Password'), 'encrypted_user_password')
WebUI.click(findTestObject('LoginPage/LoginButton'))
WebUI.click(findTestObject('LibraryPage/OwnedProductDownloadButton'))
WebUI.verifyElementPresent(findTestObject('LibraryPage/DownloadStartedIndicator'), 10)
WebUI.closeBrowser()