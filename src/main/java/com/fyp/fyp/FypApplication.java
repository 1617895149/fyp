package com.fyp.fyp;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
<<<<<<< HEAD
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication(scanBasePackages = {
    "com.fyp.fyp",          // 主包
    "com.fyp.fyp.config",   // 配置类
    "com.fyp.fyp.security" ,
    "com.fyp.fyp.ws" 
})
@ComponentScan(basePackages = {"com.fyp.fyp", "com.fyp.fyp.ws"})
=======
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
>>>>>>> 9d013e9f83b7fbdc497e41665e5ee3cf6c57851b
@EnableJpaRepositories(basePackages = "com.fyp.fyp.Repository")
@EntityScan(basePackages = "com.fyp.fyp.model")
public class FypApplication {

	public static void main(String[] args) {
		SpringApplication.run(FypApplication.class, args);
	}

}
