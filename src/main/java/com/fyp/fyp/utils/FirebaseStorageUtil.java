package com.fyp.fyp.utils;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.cloud.storage.*;
import com.fyp.fyp.exception.BusinessException;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;
import com.google.auth.Credentials;
import java.net.URLEncoder;
import java.nio.file.Files;

import javax.annotation.PostConstruct;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.UUID;

@Component
public class FirebaseStorageUtil {
    private Storage storage;
    private final String bucketName = "fileserver-f7098.appspot.com";
    private final String projectId = "fileserver-f7098";

    @PostConstruct
    private void initializeFirebase() throws IOException {
        GoogleCredentials credentials = GoogleCredentials.fromStream(
                new ClassPathResource("fileserver-f7098-firebase-adminsdk-ybi4n-db2cd4fccb.json").getInputStream());
                
        StorageOptions options = StorageOptions.newBuilder()
                .setProjectId(projectId)
                .setCredentials(credentials)
                .build();

        this.storage = options.getService();
    }

    /**
     * 上传图片到Firebase Storage
     * 
     * @param file      要上传的图片文件
     * @param directory 存储目录(例如: "products/", "users/")
     * @return 图片的访问URL
     */
    public String uploadImage(MultipartFile multipartFile, String directory) {
        try {
            // 生成唯一文件名
            String fileName = multipartFile.getOriginalFilename();
            // to get original file name
            fileName = UUID.randomUUID().toString().concat(this.getExtension(fileName)); // to generated random string
                                                                                         // values for file name.
            // System.out.println(fileName);
            File file = this.convertToFile(multipartFile, fileName);
            System.out.println(file.toPath()); // to convert multipartFile to File
            //Files.move(file.toPath(), Paths.get("C:\\Users\\User\\Desktop\\huuh.jpg"),StandardCopyOption.REPLACE_EXISTING);
            String URL = this.uploadFile(file, file.toPath().toString()); // to get uploaded file link
            file.delete();
            return URL;

        } catch (Exception e) {
            e.printStackTrace();
            return "Image couldn't upload, Something went wrong";
        }
    }

    /**
     * 生成带有时效的访问URL
     * 
     * @param fileName 文件名
     * @return 签名后的URL
     */
    // private String generateSignedUrl(String fileName) {
    //     BlobInfo blobInfo = BlobInfo.newBuilder(BlobId.of(bucketName, fileName)).build();

    //     return storage.signUrl(blobInfo, 7, TimeUnit.DAYS, Storage.SignUrlOption.withV4Signature())
    //             .toString();
    // }

    /**
     * 删除Firebase Storage中的图片
     * 
     * @param imageUrl 图片URL
     */
    public void deleteImage(String imageUrl) {
        try {
            // 从URL中提取文件路径
            String fileName = extractFileNameFromUrl(imageUrl);
            BlobId blobId = BlobId.of(bucketName, fileName);

            boolean deleted = storage.delete(blobId);
            if (!deleted) {
                throw new BusinessException(404, "图片不存在或已被删除");
            }
        } catch (Exception e) {
            throw new BusinessException(500, "删除图片失败: " + e.getMessage());
        }
    }

    /**
     * 从URL中提取文件名
     * 
     * @param url 完整的URL
     * @return 文件名
     */
    private String extractFileNameFromUrl(String url) {
        // 示例URL:
        // https://storage.googleapis.com/fileserver-f7098.appspot.com/products/xxx.jpg
        String[] parts = url.split(bucketName + "/");
        if (parts.length < 2) {
            throw new BusinessException(400, "无效的图片URL");
        }
        return parts[1].split("\\?")[0]; // 移除查询参数
    }

    /**
     * 更新Firebase Storage中的图片
     * 
     * @param oldImageUrl 旧图片URL
     * @param newFile     新图片文件
     * @param directory   存储目录
     * @return 新图片的访问URL
     */
    public String updateImage(String oldImageUrl, MultipartFile newFile, String directory) {
        // 先删除旧图片
        if (oldImageUrl != null && !oldImageUrl.isEmpty()) {
            deleteImage(oldImageUrl);
        }

        // 上传新图片
        return uploadImage(newFile, directory);
    }

    /**
     * 检查图片URL是否有效
     * 
     * @param imageUrl 图片URL
     * @return 是否有效
     */
    public boolean isImageUrlValid(String imageUrl) {
        try {
            String fileName = extractFileNameFromUrl(imageUrl);
            BlobId blobId = BlobId.of(bucketName, fileName);
            Blob blob = storage.get(blobId);
            return blob != null && blob.exists();
        } catch (Exception e) {
            return false;
        }
    }

    private String uploadFile(File file, String fileName) {
        try {
            BlobId blobId = BlobId.of("fileserver-f7098.appspot.com", fileName); // Replace with your bucker name
            BlobInfo blobInfo = BlobInfo.newBuilder(blobId).setContentType("media").build();
            System.out.println("aaaa" + blobInfo.getBucket());
            InputStream inputStream = FirebaseStorageUtil.class.getClassLoader()
                    .getResourceAsStream("fileserver-f7098-firebase-adminsdk-ybi4n-db2cd4fccb.json");
            System.out.println(inputStream == null);
            // change the file name with your one
            Credentials credentials = GoogleCredentials.fromStream(inputStream);
            Storage storage = StorageOptions.newBuilder().setCredentials(credentials).build().getService();
            storage.create(blobInfo, Files.readAllBytes(file.toPath()));
            String DOWNLOAD_URL = "https://firebasestorage.googleapis.com/v0/b/fileserver-f7098.appspot.com/o/%s?alt=media";
            String a = String.format(DOWNLOAD_URL, URLEncoder.encode(fileName, StandardCharsets.UTF_8));
            System.out.println(a);
            return a;
        } catch (Exception e) {
            System.out.println(e.toString());
            System.out.println("fuck");
            StackTraceElement[] stackTraceElements = e.getStackTrace();
            for (StackTraceElement element : stackTraceElements) {
                System.err.println("    at " + element);
            }
        }
        return null;
    }

    private String getExtension(String fileName) {
        return fileName.substring(fileName.lastIndexOf("."));
    }

    private File convertToFile(MultipartFile multipartFile, String fileName) throws IOException {
        File tempFile = new File(fileName);
        try (FileOutputStream fos = new FileOutputStream(tempFile)) {
            fos.write(multipartFile.getBytes());
            fos.close();
        }
        return tempFile;
    }
}