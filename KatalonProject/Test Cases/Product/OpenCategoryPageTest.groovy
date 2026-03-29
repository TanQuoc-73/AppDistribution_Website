// TC_Category_OpenCategoryPage
// Test Steps:
// 1. Open browser
// 2. Navigate to categories page
// 3. Verify categories are listed
// Expected Result: Categories page displays all categories

import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI

WebUI.openBrowser('')
WebUI.navigateToUrl('https://your-app-url.com/categories')
WebUI.verifyElementPresent(findTestObject('CategoryPage/CategoryList'), 10)
WebUI.closeBrowser()