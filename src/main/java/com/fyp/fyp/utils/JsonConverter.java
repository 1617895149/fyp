package com.fyp.fyp.utils;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fyp.fyp.exception.BusinessException;
import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.HashMap;

@Component
public class JsonConverter {
    private final ObjectMapper objectMapper;

    public JsonConverter() {
        this.objectMapper = new ObjectMapper();
    }

    /**
     * 将对象转换为JSON字符串
     */
    public String toJson(Object object) {
        if (object == null) {
            return null;
        }
        try {
            // 如果已经是字符串，检查是否是有效的JSON
            if (object instanceof String) {
                String str = (String) object;
                try {
                    // 尝试解析，如果是有效的JSON字符串则直接返回
                    objectMapper.readTree(str);
                    System.out.println("dddd" + str);
                    return str.replace("\\", "");
                } catch (JsonProcessingException e) {
                    // 如果不是有效的JSON，将其作为普通字符串处理
                    return objectMapper.writeValueAsString(str);
                }
            }
            return objectMapper.writeValueAsString(object);
        } catch (JsonProcessingException e) {
            throw new BusinessException(500, "JSON转换失败: " + e.getMessage());
        }
    }

    /**
     * 将JSON字符串转换为Map
     */
    public Map<String, Object> toMap(String json) {
        if (json == null || json.trim().isEmpty()) {
            return null;
        }
        try {
            // 如果输入已经是一个JSON对象字符串，直接解析
            if (json.trim().startsWith("{")) {
                return objectMapper.readValue(json, new TypeReference<Map<String, Object>>() {});
            } else {
                // 如果是普通字符串，创建一个简单的map
                Map<String, Object> map = new HashMap<>();
                map.put("value", json);
                return map;
            }
        } catch (JsonProcessingException e) {
            // 如果解析失败，返回包含原始字符串的map
            Map<String, Object> map = new HashMap<>();
            map.put("value", json);
            return map;
        }
    }

    /**
     * 将Map转换为JSON字符串
     */
    public String mapToJson(Map<String, Object> map) {
        if (map == null) {
            return null;
        }
        try {
            return objectMapper.writeValueAsString(map);
        } catch (JsonProcessingException e) {
            throw new BusinessException(500, "Map转换JSON失败: " + e.getMessage());
        }
    }

    /**
     * 将JSON字符串转换为指定类型的对象
     */
    public <T> T fromJson(String json, Class<T> clazz) {
        if (json == null || json.trim().isEmpty()) {
            return null;
        }
        try {
            return objectMapper.readValue(json, clazz);
        } catch (JsonProcessingException e) {
            throw new BusinessException(500, "JSON解析失败: " + e.getMessage());
        }
    }
}
