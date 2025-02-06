package com.fyp.fyp.utils;

import com.fyp.fyp.exception.BusinessException;
import org.junit.jupiter.api.Test;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

class JsonConverterTest {
    private final JsonConverter jsonConverter = new JsonConverter();

    @Test
    void testToJson_ValidObject() {
        TestObject obj = new TestObject("test", 123);
        String json = jsonConverter.toJson(obj);
        assertTrue(json.contains("test"));
        assertTrue(json.contains("123"));
    }

    @Test
    void testToMap_ValidJson() {
        String json = "{\"name\":\"test\",\"value\":123}";
        Map<String, Object> map = jsonConverter.toMap(json);
        assertEquals("test", map.get("name"));
        assertEquals(123, ((Number)map.get("value")).intValue());
    }

    @Test
    void testFromJson_ValidJson() {
        String json = "{\"name\":\"test\",\"value\":123}";
        TestObject obj = jsonConverter.fromJson(json, TestObject.class);
        assertEquals("test", obj.getName());
        assertEquals(123, obj.getValue());
    }

    @Test
    void testToJson_NullInput() {
        assertNull(jsonConverter.toJson(null));
    }

    @Test
    void testToMap_InvalidJson() {
        assertThrows(BusinessException.class, () -> 
            jsonConverter.toMap("invalid json"));
    }

    @lombok.Data
    @lombok.AllArgsConstructor
    private static class TestObject {
        private String name;
        private int value;
    }
} 