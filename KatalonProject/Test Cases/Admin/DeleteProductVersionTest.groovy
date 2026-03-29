// TC_Admin_DeleteVersion
// Test Steps:
// 1. Open browser
// 2. Login as admin
// 3. Navigate to admin products page
// 4. Select a product
// 5. Select a version
// 6. Click 'Delete Version'
// 7. Confirm deletion
// 8. Verify version is removed
// Expected Result: Product version is deleted

import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI

WebUI.openBrowser('')
WebUI.navigateToUrl('https://your-app-url.com/admin/products')
WebUI.setText(findTestObject('LoginPage/Username'), 'admin')
WebUI.setEncryptedText(findTestObject('LoginPage/Password'), 'encrypted_admin_password')
WebUI.click(findTestObject('LoginPage/LoginButton'))
WebUI.click(findTestObject('AdminProductsPage/SelectProduct'))
WebUI.click(findTestObject('AdminProductsPage/SelectVersion'))
WebUI.click(findTestObject('AdminProductsPage/DeleteVersionButton'))
WebUI.click(findTestObject('AdminProductsPage/ConfirmDeleteButton'))
WebUI.verifyElementNotPresent(findTestObject('AdminProductsPage/VersionListItem'), 10)
WebUI.closeBrowser()