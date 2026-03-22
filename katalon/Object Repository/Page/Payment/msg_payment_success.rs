<?xml version="1.0" encoding="UTF-8"?>
<TestObjectEntity>
    <description>Payment success message</description>
    <tag></tag>
    <elementGuidId>payment-msg-success</elementGuidId>
    <selectorCollection>
        <entry>
            <key>BASIC</key>
            <value>//div[contains(.,'Payment successful') or contains(.,'Thank you') or contains(@class,'success')]</value>
        </entry>
    </selectorCollection>
    <selectorMethod>BASIC</selectorMethod>
    <useRalativeImagePath>false</useRalativeImagePath>
    <webElementProperties>
        <isSelected>true</isSelected>
        <matchCondition>equals</matchCondition>
        <name>xpath</name>
        <type>Main</type>
        <value>//div[contains(.,'Payment successful') or contains(.,'Thank you') or contains(@class,'success')]</value>
    </webElementProperties>
</TestObjectEntity>
