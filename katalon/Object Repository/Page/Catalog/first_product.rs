<?xml version="1.0" encoding="UTF-8"?>
<TestObjectEntity>
    <description>First product link in catalog</description>
    <tag></tag>
    <elementGuidId>catalog-first-product</elementGuidId>
    <selectorCollection>
        <entry>
            <key>BASIC</key>
            <value>(//a[contains(@href,'/store/product') or contains(@class,'product')])[1]</value>
        </entry>
    </selectorCollection>
    <selectorMethod>BASIC</selectorMethod>
    <useRalativeImagePath>false</useRalativeImagePath>
    <webElementProperties>
        <isSelected>true</isSelected>
        <matchCondition>equals</matchCondition>
        <name>xpath</name>
        <type>Main</type>
        <value>(//a[contains(@href,'/store/product') or contains(@class,'product')])[1]</value>
    </webElementProperties>
</TestObjectEntity>
