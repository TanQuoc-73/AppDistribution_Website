// TC_Category_BrowseByCategory
// Test Steps:
// 1. Open browser
// 2. Navigate to categories page
// 3. Click on a category
// 4. Verify category page is displayed
// 5. Verify products in category are listed
// Expected Result: Category page displays correct products

import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI

WebUI.openBrowser('')
WebUI.navigateToUrl('https://your-app-url.com/categories')
WebUI.click(findTestObject('CategoryPage/CategoryItem'))
WebUI.verifyElementPresent(findTestObject('CategoryPage/CategoryDetail'), 10)
WebUI.verifyElementPresent(findTestObject('CategoryPage/ProductList'), 10)
WebUI.closeBrowser()