<?xml version="1.0" encoding="UTF-8"?>
<TestSuiteEntity>
   <description>Regression Tests - Comprehensive test coverage for all features</description>
   <name>RegressionTests</name>
   <tag></tag>
   <isRerun>false</isRerun>
   <mailRecipient></mailRecipient>
   <numberOfRerun>0</numberOfRerun>
   <pageLoadTimeout>30</pageLoadTimeout>
   <pageLoadTimeoutDefault>true</pageLoadTimeoutDefault>
   <rerunFailedTestCasesOnly>false</rerunFailedTestCasesOnly>
   <testSuiteGuid>regression-tests-suite</testSuiteGuid>

   <!-- Authentication Tests -->
   <testCaseLink>
      <guid>reg-login-valid</guid>
      <isReuseDriver>false</isReuseDriver>
      <isRun>true</isRun>
      <testCaseId>Test Cases/Authentication/LoginTest</testCaseId>
   </testCaseLink>
   <testCaseLink>
      <guid>reg-login-invalid</guid>
      <isReuseDriver>false</isReuseDriver>
      <isRun>true</isRun>
      <testCaseId>Test Cases/Authentication/LoginInvalidTest</testCaseId>
   </testCaseLink>
   <testCaseLink>
      <guid>reg-register-valid</guid>
      <isReuseDriver>false</isReuseDriver>
      <isRun>true</isRun>
      <testCaseId>Test Cases/Authentication/RegisterTest</testCaseId>
   </testCaseLink>
   <testCaseLink>
      <guid>reg-register-invalid</guid>
      <isReuseDriver>false</isReuseDriver>
      <isRun>true</isRun>
      <testCaseId>Test Cases/Authentication/RegisterInvalidTest</testCaseId>
   </testCaseLink>
   <testCaseLink>
      <guid>reg-forgot-password</guid>
      <isReuseDriver>false</isReuseDriver>
      <isRun>true</isRun>
      <testCaseId>Test Cases/Authentication/ForgotPasswordTest</testCaseId>
   </testCaseLink>
   <testCaseLink>
      <guid>reg-logout</guid>
      <isReuseDriver>false</isReuseDriver>
      <isRun>true</isRun>
      <testCaseId>Test Cases/Authentication/LogoutTest</testCaseId>
   </testCaseLink>

   <!-- Navigation Tests -->
   <testCaseLink>
      <guid>reg-header-nav</guid>
      <isReuseDriver>false</isReuseDriver>
      <isRun>true</isRun>
      <testCaseId>Test Cases/Navigation/HeaderNavigationTest</testCaseId>
   </testCaseLink>
   <testCaseLink>
      <guid>reg-home-sections</guid>
      <isReuseDriver>false</isReuseDriver>
      <isRun>true</isRun>
      <testCaseId>Test Cases/Navigation/HomePageSectionsTest</testCaseId>
   </testCaseLink>
   <testCaseLink>
      <guid>reg-access-control</guid>
      <isReuseDriver>false</isReuseDriver>
      <isRun>true</isRun>
      <testCaseId>Test Cases/Navigation/AccessControlTest</testCaseId>
   </testCaseLink>
   <testCaseLink>
      <guid>reg-news-page</guid>
      <isReuseDriver>false</isReuseDriver>
      <isRun>true</isRun>
      <testCaseId>Test Cases/Navigation/NewsPageTest</testCaseId>
   </testCaseLink>

   <!-- Product Tests -->
   <testCaseLink>
      <guid>reg-view-product</guid>
      <isReuseDriver>false</isReuseDriver>
      <isRun>true</isRun>
      <testCaseId>Test Cases/Product/ViewProductTest</testCaseId>
   </testCaseLink>
   <testCaseLink>
      <guid>reg-search-product</guid>
      <isReuseDriver>false</isReuseDriver>
      <isRun>true</isRun>
      <testCaseId>Test Cases/Product/SearchProductTest</testCaseId>
   </testCaseLink>
   <testCaseLink>
      <guid>reg-browse-store</guid>
      <isReuseDriver>false</isReuseDriver>
      <isRun>true</isRun>
      <testCaseId>Test Cases/Product/BrowseStoreTest</testCaseId>
   </testCaseLink>
   <testCaseLink>
      <guid>reg-add-to-cart</guid>
      <isReuseDriver>false</isReuseDriver>
      <isRun>true</isRun>
      <testCaseId>Test Cases/Product/AddToCartTest</testCaseId>
   </testCaseLink>

   <!-- Purchase Tests -->
   <testCaseLink>
      <guid>reg-purchase-flow</guid>
      <isReuseDriver>false</isReuseDriver>
      <isRun>true</isRun>
      <testCaseId>Test Cases/Purchase/PurchaseFlowTest</testCaseId>
   </testCaseLink>
   <testCaseLink>
      <guid>reg-purchase-coupon</guid>
      <isReuseDriver>false</isReuseDriver>
      <isRun>true</isRun>
      <testCaseId>Test Cases/Purchase/PurchaseWithCouponTest</testCaseId>
   </testCaseLink>
   <testCaseLink>
      <guid>reg-cart-management</guid>
      <isReuseDriver>false</isReuseDriver>
      <isRun>true</isRun>
      <testCaseId>Test Cases/Purchase/CartManagementTest</testCaseId>
   </testCaseLink>
   <testCaseLink>
      <guid>reg-payment-methods</guid>
      <isReuseDriver>false</isReuseDriver>
      <isRun>true</isRun>
      <testCaseId>Test Cases/Purchase/PaymentMethodsTest</testCaseId>
   </testCaseLink>

   <!-- User Feature Tests -->
   <testCaseLink>
      <guid>reg-profile</guid>
      <isReuseDriver>false</isReuseDriver>
      <isRun>true</isRun>
      <testCaseId>Test Cases/UserFeatures/ProfileTest</testCaseId>
   </testCaseLink>
   <testCaseLink>
      <guid>reg-library</guid>
      <isReuseDriver>false</isReuseDriver>
      <isRun>true</isRun>
      <testCaseId>Test Cases/UserFeatures/LibraryTest</testCaseId>
   </testCaseLink>
   <testCaseLink>
      <guid>reg-wishlist</guid>
      <isReuseDriver>false</isReuseDriver>
      <isRun>true</isRun>
      <testCaseId>Test Cases/UserFeatures/WishlistTest</testCaseId>
   </testCaseLink>
   <testCaseLink>
      <guid>reg-order-history</guid>
      <isReuseDriver>false</isReuseDriver>
      <isRun>true</isRun>
      <testCaseId>Test Cases/UserFeatures/OrderHistoryTest</testCaseId>
   </testCaseLink>
   <testCaseLink>
      <guid>reg-notifications</guid>
      <isReuseDriver>false</isReuseDriver>
      <isRun>true</isRun>
      <testCaseId>Test Cases/UserFeatures/NotificationsTest</testCaseId>
   </testCaseLink>
</TestSuiteEntity>
