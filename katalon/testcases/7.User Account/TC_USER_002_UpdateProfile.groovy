import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import internal.GlobalVariable as GlobalVariable

String baseUrl = GlobalVariable.BASE_URL ?: 'http://localhost:3000'
String newUsername = GlobalVariable.NEW_USERNAME ?: 'Tester'

WebUI.openBrowser('')
try {
    WebUI.navigateToUrl(baseUrl + '/dashboard/profile')
    WebUI.waitForElementVisible(findTestObject('Page/User/input_username'), 10)
    WebUI.setText(findTestObject('Page/User/input_username'), newUsername)
    WebUI.click(findTestObject('Page/User/btn_save_profile'))
    WebUI.waitForElementVisible(findTestObject('Page/User/msg_profile_saved'), 10)
    WebUI.verifyElementPresent(findTestObject('Page/User/msg_profile_saved'), 10)
} finally {
    WebUI.closeBrowser()
}
