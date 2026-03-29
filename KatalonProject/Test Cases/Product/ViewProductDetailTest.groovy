// TC_Product_ViewDetail
// Test Steps:
// 1. Open browser
// 2. Navigate to product list page
// 3. Click on a product
// 4. Verify product detail page is displayed
// 5. Verify product name, price, and description are visible
// Expected Result: Product detail page displays correct information

import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI

WebUI.openBrowser('')
WebUI.navigateToUrl('https://your-app-url.com/products')
WebUI.click(findTestObject('ProductPage/ProductItem'))
WebUI.verifyElementPresent(findTestObject('ProductPage/ProductDetail'), 10)
WebUI.verifyElementText(findTestObject('ProductPage/ProductName'), 'Expected Product Name')
WebUI.verifyElementPresent(findTestObject('ProductPage/ProductPrice'), 10)
WebUI.verifyElementPresent(findTestObject('ProductPage/ProductDescription'), 10)
WebUI.closeBrowser()