import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import internal.GlobalVariable as GlobalVariable

String baseUrl = GlobalVariable.BASE_URL ?: 'http://localhost:3000'

WebUI.openBrowser('')
try {
    WebUI.navigateToUrl(baseUrl + '/dashboard/license')
    WebUI.waitForElementVisible(findTestObject('Page/License/btn_generate_key'), 10)
    WebUI.click(findTestObject('Page/License/btn_generate_key'))
    WebUI.waitForElementVisible(findTestObject('Page/License/msg_key_generated'), 10)
    WebUI.verifyElementPresent(findTestObject('Page/License/msg_key_generated'), 10)
} finally {
    WebUI.closeBrowser()
}
