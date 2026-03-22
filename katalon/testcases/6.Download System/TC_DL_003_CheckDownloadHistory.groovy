import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import internal.GlobalVariable as GlobalVariable

String baseUrl = GlobalVariable.BASE_URL ?: 'http://localhost:3000'

WebUI.openBrowser('')
try {
    WebUI.navigateToUrl(baseUrl + '/dashboard/downloads')
    WebUI.waitForElementVisible(findTestObject('Page/Download/download_history_list'), 10)
    WebUI.verifyElementPresent(findTestObject('Page/Download/download_history_list'), 10)
} finally {
    WebUI.closeBrowser()
}
