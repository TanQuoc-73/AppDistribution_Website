// TC_Admin_AppLogic
// Test Steps:
// 1. Open browser
// 2. Login as admin
// 3. Navigate to admin logic app page
// 4. Create a new logic app (e.g., set up a workflow)
// 5. Configure logic app steps (e.g., add triggers, actions)
// 6. Save logic app
// 7. Verify logic app appears in list
// 8. Edit logic app and verify changes
// 9. Delete logic app and verify removal
// Expected Result: Logic app can be created, edited, and deleted successfully

import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI

WebUI.openBrowser('')
WebUI.navigateToUrl('https://your-app-url.com/admin/logic-apps')
WebUI.setText(findTestObject('LoginPage/Username'), 'admin')
WebUI.setEncryptedText(findTestObject('LoginPage/Password'), 'encrypted_admin_password')
WebUI.click(findTestObject('LoginPage/LoginButton'))
WebUI.click(findTestObject('LogicAppPage/AddLogicAppButton'))
WebUI.setText(findTestObject('LogicAppPage/LogicAppNameField'), 'Test Logic App')
WebUI.click(findTestObject('LogicAppPage/AddTriggerButton'))
WebUI.setText(findTestObject('LogicAppPage/TriggerField'), 'On Product Created')
WebUI.click(findTestObject('LogicAppPage/AddActionButton'))
WebUI.setText(findTestObject('LogicAppPage/ActionField'), 'Send Notification')
WebUI.click(findTestObject('LogicAppPage/SaveButton'))
WebUI.verifyElementPresent(findTestObject('LogicAppPage/LogicAppListItem'), 10)
// Edit logic app
WebUI.click(findTestObject('LogicAppPage/EditLogicAppButton'))
WebUI.setText(findTestObject('LogicAppPage/LogicAppNameField'), 'Updated Logic App')
WebUI.click(findTestObject('LogicAppPage/SaveButton'))
WebUI.verifyElementText(findTestObject('LogicAppPage/LogicAppNameField'), 'Updated Logic App')
// Delete logic app
WebUI.click(findTestObject('LogicAppPage/DeleteLogicAppButton'))
WebUI.click(findTestObject('LogicAppPage/ConfirmDeleteButton'))
WebUI.verifyElementNotPresent(findTestObject('LogicAppPage/LogicAppListItem'), 10)
WebUI.closeBrowser()