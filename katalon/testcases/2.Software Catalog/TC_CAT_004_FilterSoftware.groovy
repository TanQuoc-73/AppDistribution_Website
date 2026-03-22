import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import internal.GlobalVariable as GlobalVariable

String baseUrl = GlobalVariable.BASE_URL ?: 'http://localhost:3000'
String category = GlobalVariable.CATALOG_FILTER_CATEGORY ?: 'Utilities'

WebUI.openBrowser('')
try {
    WebUI.navigateToUrl(baseUrl + '/store')
    WebUI.waitForElementVisible(findTestObject('Page/Catalog/select_category'), 10)
    WebUI.selectOptionByLabel(findTestObject('Page/Catalog/select_category'), category, false)
    WebUI.click(findTestObject('Page/Catalog/btn_apply_filters'))
    WebUI.waitForElementVisible(findTestObject('Page/Catalog/software_list'), 10)
    WebUI.verifyElementPresent(findTestObject('Page/Catalog/software_list'), 10)
} finally {
    WebUI.closeBrowser()
}
