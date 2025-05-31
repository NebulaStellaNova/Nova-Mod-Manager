#pragma header

uniform float iTime;

// variables which are empty, they need just to avoid crashing shader
uniform vec4 iMouse;

// end of ShadertoyToFlixel header

// from https://iquilezles.org/articles/distfunctions
float roundedBoxSDF(vec2 CenterPosition, vec2 Size, float Radius) {
    return length(max(abs(CenterPosition)-Size+Radius,0.0))-Radius;
}

void mainImage( out vec4 fragColor, in vec2 fragCoord ) {
    // The pixel space scale of the rectangle.
    vec2 size = vec2(300.0, 300.0);
    
    // the pixel space location of the rectangle.
    vec2 location = iMouse.xy;

    // How soft the edges should be (in pixels). Higher values could be used to simulate a drop shadow.
    float edgeSoftness  = 1.0;
    
    // The radius of the corners (in pixels).
    float radius = (sin(iTime) + 1.0) * 30.0;
    
    // Calculate distance to edge.   
    float distance 		= roundedBoxSDF(fragCoord.xy - location - (size/2.0), size / 2.0, radius);
    
    // Smooth the result (free antialiasing).
    float smoothedAlpha =  1.0-smoothstep(0.0, edgeSoftness * 2.0,distance);
    
    // Return the resultant shape.
    vec4 quadColor		= mix(vec4(1.0, 1.0, 1.0, 1.0), vec4(0.0, 0.2, 1.0, smoothedAlpha), smoothedAlpha);
    
    // Apply a drop shadow effect.
    float shadowSoftness = 30.0;
    vec2 shadowOffset 	 = vec2(0.0, 10.0);
    float shadowDistance = roundedBoxSDF(fragCoord.xy - location + shadowOffset - (size/2.0), size / 2.0, radius);
    float shadowAlpha 	 = 1.0-smoothstep(-shadowSoftness, shadowSoftness, shadowDistance);
    vec4 shadowColor 	 = vec4(0.4, 0.4, 0.4, 1.0);
    fragColor 			 = mix(quadColor, shadowColor, shadowAlpha - smoothedAlpha);
}

void main() {
	mainImage(gl_FragColor, openfl_TextureCoordv*openfl_TextureSize);
}