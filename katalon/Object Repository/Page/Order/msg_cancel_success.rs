<?xml version="1.0" encoding="UTF-8"?>
<TestObjectEntity>
    <description>Success message after order cancel</description>
    <tag></tag>
    <elementGuidId>order-cancel-success</elementGuidId>
    <selectorCollection>
        <entry>
            <key>BASIC</key>
            <value>//div[contains(.,'cancel') and (contains(.,'success') or contains(.,'Cancelled'))]</value>
        </entry>
    </selectorCollection>
    <selectorMethod>BASIC</selectorMethod>
    <useRalativeImagePath>false</useRalativeImagePath>
    <webElementProperties>
        <isSelected>true</isSelected>
        <matchCondition>equals</matchCondition>
        <name>xpath</name>
        <type>Main</type>
        <value>//div[contains(.,'cancel') and (contains(.,'success') or contains(.,'Cancelled'))]</value>
    </webElementProperties>
</TestObjectEntity>
