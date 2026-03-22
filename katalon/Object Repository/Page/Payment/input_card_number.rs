<?xml version="1.0" encoding="UTF-8"?>
<TestObjectEntity>
    <description>Card number input on checkout</description>
    <tag></tag>
    <elementGuidId>payment-input-card-number</elementGuidId>
    <selectorCollection>
        <entry>
            <key>BASIC</key>
            <value>//input[@name='cardnumber' or contains(@placeholder,'Card') or contains(@id,'card')]</value>
        </entry>
    </selectorCollection>
    <selectorMethod>BASIC</selectorMethod>
    <useRalativeImagePath>false</useRalativeImagePath>
    <webElementProperties>
        <isSelected>true</isSelected>
        <matchCondition>equals</matchCondition>
        <name>xpath</name>
        <type>Main</type>
        <value>//input[@name='cardnumber' or contains(@placeholder,'Card') or contains(@id,'card')]</value>
    </webElementProperties>
</TestObjectEntity>
