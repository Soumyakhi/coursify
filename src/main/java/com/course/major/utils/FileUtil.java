package com.course.major.utils;
import net.sourceforge.tess4j.Tesseract;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.rendering.PDFRenderer;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.web.multipart.MultipartFile;

import java.awt.image.BufferedImage;
import java.io.*;
import java.nio.file.Files;
import java.security.SecureRandom;
import java.util.UUID;

public class FileUtil {
    public static String extractText(File pdfFile) throws IOException {
        PDDocument document = PDDocument.load(pdfFile);

        PDFTextStripper stripper = new PDFTextStripper();
        String text = stripper.getText(document);

        document.close();
        return text;
    }
    public static String saveVideo(MultipartFile file, String fileName) throws IOException {

        String baseDir = System.getProperty("user.dir")
                + File.separator + "uploads"
                + File.separator + "videos";

        File dir = new File(baseDir);
        if (!dir.exists()) {
            dir.mkdirs();
        }

        File destination = new File(dir, fileName);
        file.transferTo(destination);

        return destination.getAbsolutePath();
    }

    public static boolean isMp4(MultipartFile file) {

        if (file == null || file.isEmpty()) {
            return false;
        }

        byte[] header = new byte[12];

        try (InputStream is = file.getInputStream()) {

            int bytesRead = is.read(header);
            if (bytesRead < 12) {
                return false;
            }

            // MP4 signature: bytes 4–7 must be "ftyp"
            String boxType = new String(header, 4, 4);

            return "ftyp".equals(boxType);

        } catch (IOException e) {
            return false;
        }
    }

    public static boolean isImagePdf(File pdfFile) throws IOException {
        String text = extractText(pdfFile);
        return text.trim().isEmpty();
    }
    public static String runOcr(File pdfFile) {
        StringBuilder result = new StringBuilder();
        try (PDDocument document = PDDocument.load(pdfFile)) {
            PDFRenderer renderer = new PDFRenderer(document);

            Tesseract tesseract = new Tesseract();
            //data path must be parent of "tessdata"
            tesseract.setDatapath(
                    "C:/Users/Soumya/Downloads/ocr/tessdata"
            );
            tesseract.setLanguage("eng");
            int pageCount = document.getNumberOfPages();

            for (int i = 0; i < pageCount; i++) {
                BufferedImage image = renderer.renderImageWithDPI(i, 300);
                String pageText = tesseract.doOCR(image);
                result.append(pageText).append("\n");
            }

        } catch (Exception e) {
            e.printStackTrace();
        }

        return result.toString();
    }
    public static boolean isPdf(File file) {

        if (file == null || !file.exists() || !file.isFile()) {
            return false;
        }

        byte[] header = new byte[5];

        try (FileInputStream fis = new FileInputStream(file)) {

            int bytesRead = fis.read(header);
            if (bytesRead < 5) {
                return false;
            }

            String signature = new String(header);

            return signature.equals("%PDF-");

        } catch (IOException e) {
            return false;
        }
    }
    public static File convertMultipartFileToFile(MultipartFile multipartFile) throws IOException {
        File destinationFile = new File(System.getProperty("java.io.tmpdir"), multipartFile.getOriginalFilename());
        multipartFile.transferTo(destinationFile);
        return destinationFile;
    }

    public static String convertToHLS(
            File inputVideo,
            String videoId,
            int width,
            int height,
            String videoBitrate
    ) {
        long start = System.currentTimeMillis();

        try {
            String hlsDirPath = System.getProperty("user.dir") + File.separator + "uploads" +
                    File.separator + "hls" + File.separator + videoId +
                    File.separator + height + "p";

            File hlsDir = new File(hlsDirPath);
            if (!hlsDir.exists()) hlsDir.mkdirs();

            File playlist = new File(hlsDir, "index.m3u8");

            // ---------- KEY ENCRYPTION SETUP ----------
            String keyDirPath = System.getProperty("user.dir") + File.separator + "uploads" + File.separator + "hls-keys";
            new File(keyDirPath).mkdirs();

            // FIX: Unique key name per resolution (videoId + height + ".key")
            File keyFile = new File(keyDirPath, videoId + height + ".key");

            byte[] key = new byte[16];
            SecureRandom.getInstanceStrong().nextBytes(key);
            Files.write(keyFile.toPath(), key);

            File keyInfo = new File(hlsDir, "key_info.txt");

            // Update the URL to match the new filename so the player requests the correct key
            String keyInfoContent = "http://localhost:8080/student/video/key/" + videoId + height + "\n" +
                    keyFile.getAbsolutePath() + "\n" +
                    bytesToHex(key);

            Files.write(keyInfo.toPath(), keyInfoContent.getBytes());

            // ---------- ROBUST GPU SCALING ----------
            String scaleFilter = String.format("scale_cuda=w='trunc(%d*a/2)*2':h=%d", height, height);

            // ---------- FFMPEG PROCESS ----------
            ProcessBuilder pb = new ProcessBuilder(
                    "ffmpeg", "-y",
                    "-hwaccel", "cuda",
                    "-hwaccel_output_format", "cuda",
                    "-i", inputVideo.getAbsolutePath(),
                    "-vf", scaleFilter,
                    "-c:v", "h264_nvenc",
                    "-preset", "p4",
                    "-rc", "cbr",
                    "-b:v", videoBitrate,
                    "-maxrate", videoBitrate,
                    "-bufsize", videoBitrate,
                    "-g", "48",
                    "-keyint_min", "48",
                    "-sc_threshold", "0",
                    "-c:a", "aac",
                    "-b:a", "128k",
                    "-f", "hls",
                    "-hls_time", "4",
                    "-hls_playlist_type", "vod",
                    "-hls_flags", "independent_segments",
                    "-hls_key_info_file", keyInfo.getAbsolutePath(),
                    "-hls_segment_filename", hlsDirPath + File.separator + "segment_%03d.ts",
                    playlist.getAbsolutePath()
            );

            pb.redirectErrorStream(true);
            Process process = pb.start();

            // ---------- LOGS REMOVED (Silent Drain) ----------
            // We still need to read the stream to prevent the process from hanging if the buffer fills up
            try (BufferedReader r = new BufferedReader(new InputStreamReader(process.getInputStream()))) {
                while (r.readLine() != null) {
                    // Do nothing, just drain the buffer
                }
            }

            int exit = process.waitFor();
            if (exit != 0) {
                throw new RuntimeException("FFmpeg failed with exit code " + exit);
            }

            System.out.println("HLS generated for " + height + "p in " + (System.currentTimeMillis() - start) + "ms");

            return playlist.getAbsolutePath();

        } catch (Exception e) {
            throw new RuntimeException("HLS error: " + e.getMessage(), e);
        }
    }



    private static String bytesToHex(byte[] bytes) {
            StringBuilder sb = new StringBuilder();
            for (byte b : bytes) {
                sb.append(String.format("%02x", b));
            }
            return sb.toString();
        }
    }






