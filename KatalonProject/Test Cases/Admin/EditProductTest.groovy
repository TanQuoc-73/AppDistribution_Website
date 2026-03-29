// TC_Admin_EditProduct
// Test Steps:
// 1. Open browser
// 2. Login as admin
// 3. Navigate to admin products page
// 4. Select a product
// 5. Click 'Edit Product'
// 6. Update product details
// 7. Submit
// 8. Verify product details updated
// Expected Result: Product details are updated

import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI

WebUI.openBrowser('')
WebUI.navigateToUrl('https://your-app-url.com/admin/products')
WebUI.setText(findTestObject('LoginPage/Username'), 'admin')
WebUI.setEncryptedText(findTestObject('LoginPage/Password'), 'encrypted_admin_password')
WebUI.click(findTestObject('LoginPage/LoginButton'))
WebUI.click(findTestObject('AdminProductsPage/SelectProduct'))
WebUI.click(findTestObject('AdminProductsPage/EditProductButton'))
WebUI.setText(findTestObject('AdminProductsPage/ProductNameField'), 'Updated Product Name')
WebUI.setText(findTestObject('AdminProductsPage/ProductPriceField'), '19.99')
WebUI.setText(findTestObject('AdminProductsPage/ProductDescriptionField'), 'Updated Description')
WebUI.click(findTestObject('AdminProductsPage/SubmitButton'))
WebUI.verifyElementText(findTestObject('AdminProductsPage/ProductNameField'), 'Updated Product Name')
WebUI.closeBrowser()