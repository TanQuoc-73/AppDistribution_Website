import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import internal.GlobalVariable as GlobalVariable

String baseUrl = GlobalVariable.BASE_URL ?: 'http://localhost:3000'
String query = GlobalVariable.SEARCH_QUERY ?: 'test'

WebUI.openBrowser('')
try {
    WebUI.navigateToUrl(baseUrl + '/store')
    WebUI.waitForElementVisible(findTestObject('Page/Catalog/input_search'), 10)
    WebUI.setText(findTestObject('Page/Catalog/input_search'), query)
    WebUI.click(findTestObject('Page/Catalog/btn_search'))
    WebUI.waitForElementVisible(findTestObject('Page/Catalog/software_list'), 10)
    WebUI.verifyElementPresent(findTestObject('Page/Catalog/software_list'), 10)
} finally {
    WebUI.closeBrowser()
}
