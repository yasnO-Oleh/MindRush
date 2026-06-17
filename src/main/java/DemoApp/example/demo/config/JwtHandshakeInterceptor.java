package DemoApp.example.demo.config;

import com.auth0.jwt.interfaces.DecodedJWT;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.util.MultiValueMap;
import org.springframework.web.util.UriComponentsBuilder;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.HandshakeInterceptor;

import java.util.Map;

public class JwtHandshakeInterceptor implements HandshakeInterceptor {

    private final JwtUtil jwtUtil;

    public JwtHandshakeInterceptor(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @Override
    public boolean beforeHandshake(ServerHttpRequest request, ServerHttpResponse response, WebSocketHandler wsHandler, Map<String, Object> attributes) throws Exception {
        try {
            String token = extractToken(request);
            if (token != null && !token.isBlank()) {
                DecodedJWT decoded = jwtUtil.validateToken(token);
                String username = decoded.getSubject();
                if (username != null) {
                    attributes.put("username", username);
                }
            }
            if (!attributes.containsKey("username")) {
                String guestUsername = extractUsername(request);
                if (guestUsername != null && !guestUsername.isBlank()) {
                    attributes.put("username", guestUsername.trim());
                }
            }
        } catch (Exception ignored) {
            // ignore - no username set
        }
        return true;
    }

    @Override
    public void afterHandshake(ServerHttpRequest request, ServerHttpResponse response, WebSocketHandler wsHandler, Exception exception) {
        // no-op
    }

    private String extractToken(ServerHttpRequest request) {
        MultiValueMap<String, String> queryParams = UriComponentsBuilder.fromUri(request.getURI()).build().getQueryParams();

        String auth = request.getHeaders().getFirst("Authorization");
        if (auth != null && auth.startsWith("Bearer ")) {
            return auth.substring(7);
        }

        String token = queryParams.getFirst("token");
        if (token != null && !token.isBlank()) {
            return token;
        }

        return null;
    }

    private String extractUsername(ServerHttpRequest request) {
        MultiValueMap<String, String> queryParams = UriComponentsBuilder.fromUri(request.getURI()).build().getQueryParams();
        return queryParams.getFirst("username");
    }
}
