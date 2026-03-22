<?xml version="1.0" encoding="UTF-8"?>
<TestObjectEntity>
    <description>Payment failure message</description>
    <tag></tag>
    <elementGuidId>payment-err-failed</elementGuidId>
    <selectorCollection>
        <entry>
            <key>BASIC</key>
            <value>//div[contains(.,'Payment failed') or contains(.,'error') or contains(@class,'error')]</value>
        </entry>
    </selectorCollection>
    <selectorMethod>BASIC</selectorMethod>
    <useRalativeImagePath>false</useRalativeImagePath>
    <webElementProperties>
        <isSelected>true</isSelected>
        <matchCondition>equals</matchCondition>
        <name>xpath</name>
        <type>Main</type>
        <value>//div[contains(.,'Payment failed') or contains(.,'error') or contains(@class,'error')]</value>
    </webElementProperties>
</TestObjectEntity>
