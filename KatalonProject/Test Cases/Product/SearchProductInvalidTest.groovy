// TC_Product_SearchInvalid
// Test Steps:
// 1. Open browser
// 2. Navigate to product list page
// 3. Enter invalid search term
// 4. Click search
// 5. Verify no results message is displayed
// Expected Result: No products found message appears

import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI

WebUI.openBrowser('')
WebUI.navigateToUrl('https://your-app-url.com/products')
WebUI.setText(findTestObject('ProductPage/SearchBox'), 'invalidsearchterm')
WebUI.click(findTestObject('ProductPage/SearchButton'))
WebUI.verifyElementPresent(findTestObject('ProductPage/NoResultsMessage'), 10)
WebUI.closeBrowser()