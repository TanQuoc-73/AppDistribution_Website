// TC_Admin_AddVersion
// Test Steps:
// 1. Open browser
// 2. Login as admin
// 3. Navigate to admin products page
// 4. Select a product
// 5. Click 'Add Version'
// 6. Fill version form
// 7. Submit
// 8. Verify version appears in list
// Expected Result: New product version is created and listed

import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI

WebUI.openBrowser('')
WebUI.navigateToUrl('https://your-app-url.com/admin/products')
WebUI.setText(findTestObject('LoginPage/Username'), 'admin')
WebUI.setEncryptedText(findTestObject('LoginPage/Password'), 'encrypted_admin_password')
WebUI.click(findTestObject('LoginPage/LoginButton'))
WebUI.click(findTestObject('AdminProductsPage/SelectProduct'))
WebUI.click(findTestObject('AdminProductsPage/AddVersionButton'))
WebUI.setText(findTestObject('AdminProductsPage/VersionField'), '1.0.1')
WebUI.click(findTestObject('AdminProductsPage/SubmitVersionButton'))
WebUI.verifyElementPresent(findTestObject('AdminProductsPage/VersionListItem'), 10)
WebUI.closeBrowser()