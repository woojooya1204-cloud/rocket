package com.example.rocketgame;

import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class GameController {

    // =========================================================================
    // ★★★ [학생 미션 구역] 자바 서버의 숫자를 고쳐서 웹 게임을 해킹해보세요! ★★★
    // =========================================================================
    @GetMapping("/config")
    public Map<String, Object> getGameConfig() {
        Map<String, Object> config = new HashMap<>();

        config.put("gameTitle", "라이벌"); // 1. 게임 제목
        config.put("gameOverMsg", "L을 가져가");   // 2. 게임 오버 대사
        config.put("life", 1972);                               // 3. 내 목숨 (치트키: 100!)
        config.put("playerSpeed", 1);                        // 4. 로켓 이동 속도
        config.put("enemySpeed", 10);                         // 5. 별 떨어지는 속도
        config.put("enemyCount", 15);                        // 6. 별 개수
        config.put("minStarSize", 5);                        // 7. 최소 별 크기
        config.put("maxStarSize", 18);                       // 8. 최대 별 크기

        // ★ 보너스 미션: 피버 타임(점수 2배) 설정 ★
        config.put("baseScore", 10);                         // 9. 기본 점수
        config.put("feverTriggerScore", 100);                // 10. 피버 타임 발동 점수
        config.put("feverMultiplier", 2);                    // 11. 피버 타임 점수 배율

        return config;
    }
    // =========================================================================

    private static final List<Map<String, Object>> rankings = new ArrayList<>();

    @GetMapping("/ranking")
    public List<Map<String, Object>> getRanking() {
        rankings.sort((a, b) -> (int) b.get("score") - (int) a.get("score"));
        return rankings.subList(0, Math.min(5, rankings.size()));
    }

    @PostMapping("/ranking")
    public List<Map<String, Object>> saveScore(@RequestBody Map<String, Object> payload) {
        String playerName = (String) payload.getOrDefault("name", "이름없음");
        int score = ((Number) payload.get("score")).intValue();

        Map<String, Object> record = new HashMap<>();
        record.put("name", playerName);
        record.put("score", score);
        rankings.add(record);

        return getRanking();
    }
}
