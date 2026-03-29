// TC_Admin_CreateProduct
// Test Steps:
// 1. Open browser
// 2. Login as admin
// 3. Navigate to admin products page
// 4. Click 'Add Product'
// 5. Fill product form
// 6. Submit
// 7. Verify product appears in list
// Expected Result: New product is created and listed

import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI

WebUI.openBrowser('')
WebUI.navigateToUrl('https://your-app-url.com/admin/products')
WebUI.setText(findTestObject('LoginPage/Username'), 'admin')
WebUI.setEncryptedText(findTestObject('LoginPage/Password'), 'encrypted_admin_password')
WebUI.click(findTestObject('LoginPage/LoginButton'))
WebUI.click(findTestObject('AdminProductsPage/AddProductButton'))
WebUI.setText(findTestObject('AdminProductsPage/ProductNameField'), 'Test Product')
WebUI.setText(findTestObject('AdminProductsPage/ProductPriceField'), '9.99')
WebUI.setText(findTestObject('AdminProductsPage/ProductDescriptionField'), 'Test Description')
WebUI.click(findTestObject('AdminProductsPage/SubmitButton'))
WebUI.verifyElementPresent(findTestObject('AdminProductsPage/ProductListItem'), 10)
WebUI.closeBrowser()